import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { z } from 'zod';
import { isRateLimited } from '@/lib/rateLimit';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const egoSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        age: { type: Type.NUMBER },
        origin: { type: Type.STRING },
        avatar_id: { type: Type.STRING },
        stats: {
            type: Type.OBJECT,
            properties: {
                pace: { type: Type.NUMBER },
                culture: { type: Type.NUMBER },
                social: { type: Type.NUMBER }
            },
            required: ["pace", "culture", "social"]
        },
        movement: { type: Type.STRING },
        notices: { type: Type.STRING },
        never: { type: Type.STRING },
        quote: { type: Type.STRING },
        missions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    text: { type: Type.STRING },
                    xp: { type: Type.NUMBER },
                    difficulty: { type: Type.STRING, enum: ["EASY", "MEDIUM", "HARD"] }
                },
                required: ["text", "xp", "difficulty"]
            }
        }
    },
    required: ["name", "age", "origin", "avatar_id", "stats", "movement", "notices", "never", "quote", "missions"]
};

import * as fs from 'fs';
import * as path from 'path';

const requestSchema = z.object({
    name: z.string().min(1).max(30).trim(),
    city: z.enum(['Tunis', 'Sidi Bou Said', 'Djerba', 'Sousse', 'Douz', 'Carthage']),
    style: z.string().min(1).max(50).trim()
});

export async function POST(req: Request) {
    try {
        // 1. Rate Limiting Check
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        if (isRateLimited(ip)) {
            return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
        }

        // 2. Strict Zod Input Validation
        const body = await req.json();
        const parsed = requestSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid payload', details: parsed.error.issues }, { status: 400 });
        }

        const { name, city, style } = parsed.data;

        let manifestString = "[]";
        try {
            const manifestPath = path.resolve(process.cwd(), 'public/avatars/manifest.json');
            if (fs.existsSync(manifestPath)) {
                manifestString = fs.readFileSync(manifestPath, 'utf-8');
            }
        } catch (e) {
            console.warn("Could not load avatars manifest", e);
        }

        const prompt = `You are the engine of a tourism game set in Tunisia. Player: ${name}, destination: ${city}, travel style: "${style}". Create their COMPLETE OPPOSITE — a vivid, real-feeling Tunisian person who experiences ${city} in the most radically different way. For stats (pace, culture, social), DO NOT USE PERCENTAGES. Use an exact integer between 1 and 10 (e.g. 7). 

You are an autonomous local-scout agent. Before generating the missions, use your Google Search tool to find REAL, highly specific, non-touristy locations in ${city} (Tunisia). DO NOT use generic landmarks (like 'The Carthage Ruins' or 'Sidi Bou Said main street'). Search for hidden gems, local cafes, specific narrow streets, or authentic local artisan shops. Ignore TripAdvisor or standard top-10 lists. Look for authentic local context. Integrate ONE verified real-world location seamlessly into the 'text' of the HARD difficulty mission. Ensure the place actually exists today.

Review the provided list of available avatars (archetypes) below:
${manifestString}

Choose the 'id' of the avatar that visually matches the persona you are generating best based on their gender, age, and vibe. Return this exact filename string in the JSON response under the key "avatar_id".

CRITICAL: You MUST return ONLY a raw, perfectly valid JSON object. Do not wrap it in markdown blockquotes. The JSON must exactly match this structure:
{
  "name": "string",
  "age": number,
  "origin": "string",
  "avatar_id": "string",
  "stats": {\n    "pace": number,\n    "culture": number,\n    "social": number\n  },
  "movement": "string",
  "notices": "string",
  "never": "string",
  "quote": "string",
  "missions": [\n    { "text": "string", "xp": number, "difficulty": "EASY" | "MEDIUM" | "HARD" }\n  ]
}
Return ONLY valid JSON.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        let rawText = response.text || '{}';
        rawText = rawText.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();

        const data = JSON.parse(rawText);

        // Clean up redundant prefixes if the LLM hallucinated them 
        if (Array.isArray(data.missions)) {
            data.missions.forEach((m: any) => {
                if (m.text) {
                    m.text = m.text.replace(/^(EASY|MEDIUM|HARD):\s*/i, '').trim();
                }
            });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error generating ego:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

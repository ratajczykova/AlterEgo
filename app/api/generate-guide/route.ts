import { NextResponse } from 'next/server';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import { z } from 'zod';
import { isRateLimited } from '@/lib/rateLimit';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const guideSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        avatar_id: { type: Type.STRING },
        age: { type: Type.NUMBER },
        origin: { type: Type.STRING },
        languages: { type: Type.NUMBER },
        years_in_city: { type: Type.NUMBER },
        territory: { type: Type.STRING },
        offer: { type: Type.STRING },
        specialties: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    },
    required: ["name", "avatar_id", "age", "origin", "languages", "years_in_city", "territory", "offer", "specialties"]
};

import * as fs from 'fs';
import * as path from 'path';

const requestSchema = z.object({
    city: z.enum(['Tunis', 'Sidi Bou Said', 'Djerba', 'Sousse', 'Douz', 'Carthage'])
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

        const { city } = parsed.data;

        let manifestString = "[]";
        try {
            const manifestPath = path.resolve(process.cwd(), 'public/avatars/manifest.json');
            if (fs.existsSync(manifestPath)) {
                manifestString = fs.readFileSync(manifestPath, 'utf-8');
            }
        } catch (e) {
            console.warn("Could not load avatars manifest", e);
        }

        const prompt = `You are generating a real local guide profile for a tourism game. The player unlocked Ghost Local status in ${city}. Generate a vivid, believable Tunisian local guide character for ${city}. 
        
Review the provided list of available avatars (archetypes) below:
${manifestString}

Choose the 'id' of the avatar that visually matches the persona you are generating best based on their gender, age, and vibe. Return this exact filename string in the JSON response under the key "avatar_id". Return ONLY valid JSON.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: guideSchema,
            }
        });

        const data = JSON.parse(response.text || '{}');
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error generating guide:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

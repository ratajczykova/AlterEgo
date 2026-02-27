import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No GEMINI_API_KEY found in .env.local");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const MASTER_STYLE = "A close-up cinematic portrait. Tech-noir, gritty but highly aesthetic, cyberpunk lighting influences (subtle neon, deep shadows) but strictly grounded in authentic modern-day North African reality. High detail, 8k resolution. They look directly at the camera.";

const ARCHETYPES = [
    { gender: "male", age: "young", vibe: "tunis, hacker, medina, streetwise" },
    { gender: "female", age: "young", vibe: "tunis, artist, bright neon, rebellious" },
    { gender: "male", age: "middle-aged", vibe: "tunis, underground broker, sharp suit, mysterious" },
    { gender: "female", age: "elder", vibe: "sidi bou said, wise, traditional garments with tech accents" },
    { gender: "male", age: "young", vibe: "sidi bou said, cafe owner, relaxed, coastal tech" },
    { gender: "female", age: "middle-aged", vibe: "carthage, historian, academic, ruins explorer" },
    { gender: "male", age: "elder", vibe: "carthage, old guard, weathered, distinguished" },
    { gender: "female", age: "young", vibe: "sousse, club promoter, vibrant, energetic" },
    { gender: "male", age: "middle-aged", vibe: "sousse, merchant, bustling market, observant" },
    { gender: "female", age: "middle-aged", vibe: "djerba, island trader, serene, sun-kissed" },
    { gender: "male", age: "young", vibe: "djerba, tech repair, resource scavenger, inventive" },
    { gender: "male", age: "elder", vibe: "djerba, traditional craftsman, experienced, calm" },
    { gender: "female", age: "young", vibe: "douz, desert guide, tactical gear, sahara" },
    { gender: "male", age: "elder", vibe: "douz, sahara nomad, weathered skin, traditional" },
    { gender: "female", age: "middle-aged", vibe: "douz, oasis botanist, rugged, pragmatic" },
    { gender: "male", age: "young", vibe: "tunis, delivery runner, agile, urban" },
    { gender: "female", age: "elder", vibe: "tunis, medina matriarch, imposing, respects tradition" },
    { gender: "male", age: "middle-aged", vibe: "sidi bou said, gallery curator, eccentric, colorful" },
    { gender: "female", age: "young", vibe: "carthage, student, curious, modern" },
    { gender: "male", age: "middle-aged", vibe: "sousse, harbor master, tough, maritime" }
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log(`Starting generation of ${ARCHETYPES.length} avatars...`);
    const manifest = [];
    const outputDir = path.resolve(process.cwd(), 'public/avatars');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (let i = 0; i < ARCHETYPES.length; i++) {
        const archetype = ARCHETYPES[i];
        const avatarId = `avatar_${String(i + 1).padStart(2, '0')}.png`;
        const promptInfo = `An ${archetype.age} ${archetype.gender}. Vibe: ${archetype.vibe}.`;
        const fullPrompt = `${promptInfo} ${MASTER_STYLE}`;

        console.log(`[${i + 1}/${ARCHETYPES.length}] Generating ${avatarId}... (${archetype.gender}, ${archetype.age})`);

        try {
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: fullPrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                    aspectRatio: '1:1',
                }
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64Image = response.generatedImages[0].image?.imageBytes;
                if (!base64Image) throw new Error("No image bytes returned");

                const outputPath = path.resolve(outputDir, avatarId);
                fs.writeFileSync(outputPath, Buffer.from(base64Image as string, 'base64'));

                manifest.push({
                    id: avatarId,
                    gender: archetype.gender,
                    age: archetype.age,
                    vibe: archetype.vibe
                });

                console.log(`✅ Saved ${avatarId}`);
            } else {
                console.error(`❌ No image returned for ${avatarId}`);
            }

            // WAIT TO AVOID QUOTA/RATE LIMITS
            if (i < ARCHETYPES.length - 1) {
                console.log(`Sleeping for 6 seconds to respect rate limits...`);
                await sleep(6000);
            }

        } catch (e) {
            console.error(`❌ Failed to generate ${avatarId}:`, e);
            // Wait extra time on crash before next attempt
            await sleep(10000);
        }
    }

    // Write Manifest
    const manifestPath = path.resolve(outputDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`💯 Done! Manifest written to ${manifestPath}`);
}

main();

import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No GEMINI_API_KEY found in .env.local");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const PROMPT = "A close-up cinematic portrait of a modern-day local Tunisian character. Tech-noir, gritty but highly aesthetic, cyberpunk lighting influences (subtle neon, deep shadows) but strictly grounded in authentic North African reality. High detail, 8k resolution, dramatic shadows. They look directly at the camera. No text in the image.";

async function main() {
    console.log("Generating avatar...");
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: PROMPT,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            }
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64Image = response.generatedImages[0].image?.imageBytes;
            if (!base64Image) throw new Error("No image bytes returned");

            const outputPath = path.resolve(process.cwd(), 'public/avatars/test-avatar-01.png');

            // Ensure directory exists
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(outputPath, Buffer.from(base64Image as string, 'base64'));
            console.log(`✅ Success! Avatar saved to: ${outputPath}`);
            console.log("\nPlease review the image in public/avatars/test-avatar-01.png and let me know if it meets the art direction!");
        } else {
            console.error("No image returned from the API.");
        }
    } catch (e) {
        console.error("Failed to generate image:", e);
    }
}

main();

<div align="center">

# ALTER EGO
*Tourist Edition · Tunisia 2026*

- Deployment Link: https://alter-ego-chi.vercel.app/
- Video Demo: https://youtu.be/7SEAzkglATc?si=sk1BvBDqpyLjZ1gP
- Presentation: https://www.canva.com/design/DAHCkPLoO40/otBDRfpcufSp14iIU-YxUg/edit?utm_content=DAHCkPLoO40&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

An experiential, ambient AI-driven tourism simulator that challenges you to see the world completely differently.

</div>

<br />

## 🎭 The Concept
**Alter Ego** flips the traditional concept of an AI travel guide on its head. Instead of asking what *you* want to see in Tunisia, the engine asks you who you are—and then artificially constructs your complete opposite.

Powered by **Gemini 2.5 Flash**, the game generates a local "Alter Ego" based on your travel style, dynamically assigning you an authentic Tunisian name, age, cultural background, and custom missions that force you to experience the destination through entirely foreign eyes.

Coupled with a custom **in-memory Zod Validation** pipeline and localized ambient audio streams that route dynamically based on the geographic region you choose (from Carthage to Douz), it's a completely immersive roleplay challenge.

## ✨ Features
- **Dynamic AI Generation:** Real-time character creation, localized missions, and dynamically evaluated "Soul Stamps" based on your post-trip debrief.
- **Tech-Noir AI Avatars:** A rich `manifest.json` asset library pre-generated using **Google Imagen 4**, mapped sequentially to character archetypes for 0ms load latency.
- **Aggressive Rate Limiting:** Built-in zero-dependency memory cache built to survive Vercel serverless cold-starts to prevent endpoint spam.
- **Mobile-First UX:** Fluid Tailwind 4 layouts paired with pure CSS glitch scanlines and CRT overlays for a premium, heavy aesthetic regardless of viewport size.
- **Zustand State Engine:** Headless reactivity for seamless audio mixing and persistent cross-session progress tracking.

## 🛠️ Stack Architecture
- **Framework:** Next.js 15 (App Router)
- **Engine:** Google Gemini API (`@google/genai`)
- **Validation:** Zod schemas
- **Styling:** Tailwind CSS + Framer Motion + Vanilla Keyframes
- **State:** Zustand

## 🚀 Quick Start
### 1. Clone the repository
```bash
git clone https://github.com/b5x0/AlterEgo.git
cd AlterEgo/alter-ego
```

### 2. Install dependencies
```bash
npm install
```

### 3. Add your Gemini API Key
Create a `.env.local` file in the root `alter-ego` directory:
```bash
GEMINI_API_KEY="your-google-api-key-here"
```

### 4. Run the Dev Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to boot the interface.

## 🔒 Security
- **Strict Payload Mapping:** All Next.js `/api` endpoints run through `.safeParse()` Zod boundaries enforcing maximum string lengths.
- **Prompt Isolation:** User-submitted textual input from the Debrief is cleansed of generic `system:` manipulation commands via regex before injection into the LLM sandbox.
- **Throttling:** Unauthenticated POST requests are forcefully severed after 5 attempts per minute per `x-forwarded-for` IP header.

## 🌍 Audio Geography Tracklist
*All audio property rights belong to their respective Tunisian artists/composers.*
- **System BIOS:** Marcel Khalife - The Astounding Eyes of Rita
- **Tunis:** EMEL - Holm (A Dream)
- **Sidi Bou Said:** ROMEO & LEILA
- **Djerba:** Houeida Hedfi - Appel du Danube
- **Sousse:** Farah Fersi - Tunisian Medley
- **Douz:** Tinariwen - Sastanàqqàm
- **Carthage:** Dhafer Youssef - Birds Requiem Suite

---
*Created during the AI Night Challenge 2026*

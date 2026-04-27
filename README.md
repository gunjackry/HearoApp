# HearoApp MVP

HearoApp is a Next.js MVP that lets users upload an MP3 or MP4 and receive a structured **music-to-text analysis**.

> Core promise: **Upload a track. Hearo listens and turns it into a producer-style breakdown.**

This product is intentionally framed as **analysis and creative inspiration**, not song cloning. The generated output focuses on style, instrumentation, structure, vocal qualities, and production characteristics.

## Features in this MVP

- Landing page with product positioning and CTA
- Upload page with drag-and-drop file input
- MP3/MP4 support with validation
- 25MB max file size validation
- Server API route to process uploads and call OpenAI audio model
- Structured JSON response validation with retry-on-parse failure (1 retry)
- Results page with clean card-based analysis sections
- AI music prompt draft that avoids naming uploaded artist/song and avoids copycat instructions

## Tech stack

- **Next.js 14** (App Router)
- **React + TypeScript**
- **OpenAI Node SDK** for audio/multimodal analysis
- **Zod** for strict JSON schema validation

## App flow

1. User opens landing page (`/`)
2. User uploads MP3/MP4 on `/upload`
3. App posts file to `/api/analyze`
4. API validates file and calls OpenAI model
5. JSON is parsed + validated
6. Results render on `/results`

## Environment variables

Create `.env.local`:

```bash
OPENAI_API_KEY=your_openai_api_key
# optional override
OPENAI_AUDIO_MODEL=gpt-4o-audio-preview
```

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build and run production locally

```bash
npm run build
npm run start
```

## Deploy (Vercel)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. Import project in Vercel.
3. Add env vars:
   - `OPENAI_API_KEY`
   - `OPENAI_AUDIO_MODEL` (optional)
4. Deploy.

## Known limitations (MVP)

- No user accounts
- No usage quotas enforced yet (CTA mentions “3 free analyses” as positioning only)
- No payment/subscription logic
- No persistent database/history
- No async job queue for very long analysis tasks
- No dedicated MP4-to-audio transcoding pipeline (the uploaded supported media is sent directly)
- Quality depends on model capability and input audio quality

## Recommended next phases

### Phase 2

- User accounts
- 3 free analyses per month enforcement
- Paid upgrade for advanced prompt generation
- Save analysis history

### Phase 3

- Stem separation
- More accurate instrument detection
- Tempo/key/BPM detection
- Shareable “Track DNA” report

### Phase 4

- API access
- B2B music intelligence endpoint

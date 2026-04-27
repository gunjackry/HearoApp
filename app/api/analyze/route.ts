import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AnalysisSchema } from '@/lib/analysis-schema';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const SUPPORTED_TYPES = new Set(['audio/mpeg', 'audio/mp3', 'video/mp4', 'audio/mp4']);

function safeJsonParse(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('Model did not return JSON.');
    return JSON.parse(match[0]);
  }
}

async function requestAnalysis(client: OpenAI, file: File) {
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString('base64');

  const response = await client.responses.create({
    model: process.env.OPENAI_AUDIO_MODEL ?? 'gpt-4o-audio-preview',
    input: [
      {
        role: 'system',
        content: [
          {
            type: 'input_text',
            text:
              'You analyze uploaded music and produce a structured, safety-conscious style analysis. Never encourage copying a copyrighted song. Return strict JSON only.'
          }
        ]
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text:
              'Analyze this song and return JSON for: track_summary, instruments_and_sounds, vocal_style, song_structure, production_notes, ai_music_prompt_draft. Make the ai_music_prompt_draft safe, original, and inspired by characteristics only. Do not mention artist/song names. Keep concise but useful.'
          },
          {
            type: 'input_audio',
            audio: base64,
            format: file.type.includes('mp4') ? 'mp4' : 'mp3'
          }
        ]
      }
    ],
    temperature: 0.3,
    max_output_tokens: 1800
  });

  return response.output_text;
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Server misconfigured: OPENAI_API_KEY is missing.' }, { status: 500 });
  }

  const formData = await req.formData();
  const file = formData.get('track');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
  }
  if (!SUPPORTED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type. Please upload MP3 or MP4.' }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File exceeds 25MB limit.' }, { status: 400 });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    let parsed: unknown;
    let latestError: Error | null = null;

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const output = await requestAnalysis(client, file);
        parsed = safeJsonParse(output);
        const validated = AnalysisSchema.parse(parsed);
        return NextResponse.json({ data: validated });
      } catch (error) {
        latestError = error instanceof Error ? error : new Error('Analysis parsing error');
      }
    }

    return NextResponse.json(
      { error: latestError?.message ?? 'Could not parse analysis response. Please try again.' },
      { status: 502 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Analysis failed unexpectedly.' },
      { status: 500 }
    );
  }
}

import { z } from 'zod';

export const AnalysisSchema = z.object({
  track_summary: z.object({
    overall_style: z.string(),
    mood: z.string(),
    energy: z.string(),
    genre_blend: z.array(z.string())
  }),
  instruments_and_sounds: z.object({
    drums_percussion: z.string(),
    bass: z.string(),
    guitars_synths_keys: z.string(),
    other_textures: z.string()
  }),
  vocal_style: z.object({
    tone: z.string(),
    delivery: z.string(),
    layers: z.string(),
    effects: z.string()
  }),
  song_structure: z.object({
    intro: z.string(),
    verse: z.string(),
    pre_chorus: z.string(),
    chorus_or_drop: z.string(),
    bridge_breakdown_outro: z.string()
  }),
  production_notes: z.object({
    mix_style: z.string(),
    space_reverb: z.string(),
    dynamics: z.string(),
    stereo_width: z.string(),
    notable_techniques: z.string()
  }),
  ai_music_prompt_draft: z.string()
});

export type AnalysisResult = z.infer<typeof AnalysisSchema>;

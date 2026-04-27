'use client';

import { useEffect, useState } from 'react';
import type { AnalysisResult } from '@/lib/analysis-schema';

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="card">
      <h2 className="section-title">{title}</h2>
      {children}
    </article>
  );
}

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('hearo:last-analysis');
    if (raw) {
      setAnalysis(JSON.parse(raw));
    }
  }, []);

  if (!analysis) {
    return (
      <section>
        <h1>No analysis yet</h1>
        <p className="muted">Upload a track first to view results.</p>
      </section>
    );
  }

  return (
    <section>
      <h1 style={{ marginTop: 0 }}>Your Hearo breakdown</h1>
      <div className="card-grid">
        <SectionCard title="Track Summary">
          <p><strong>Overall style:</strong> {analysis.track_summary.overall_style}</p>
          <p><strong>Mood:</strong> {analysis.track_summary.mood}</p>
          <p><strong>Energy:</strong> {analysis.track_summary.energy}</p>
          <p><strong>Likely genre blend:</strong> {analysis.track_summary.genre_blend.join(', ')}</p>
        </SectionCard>

        <SectionCard title="Instruments & Sounds">
          <p><strong>Drums/percussion:</strong> {analysis.instruments_and_sounds.drums_percussion}</p>
          <p><strong>Bass:</strong> {analysis.instruments_and_sounds.bass}</p>
          <p><strong>Guitars/synths/keys:</strong> {analysis.instruments_and_sounds.guitars_synths_keys}</p>
          <p><strong>Other textures:</strong> {analysis.instruments_and_sounds.other_textures}</p>
        </SectionCard>

        <SectionCard title="Vocal Style">
          <p><strong>Tone:</strong> {analysis.vocal_style.tone}</p>
          <p><strong>Delivery:</strong> {analysis.vocal_style.delivery}</p>
          <p><strong>Harmonies/layers:</strong> {analysis.vocal_style.layers}</p>
          <p><strong>Effects:</strong> {analysis.vocal_style.effects}</p>
        </SectionCard>

        <SectionCard title="Song Structure">
          <p><strong>Intro:</strong> {analysis.song_structure.intro}</p>
          <p><strong>Verse:</strong> {analysis.song_structure.verse}</p>
          <p><strong>Pre-chorus:</strong> {analysis.song_structure.pre_chorus}</p>
          <p><strong>Chorus/drop:</strong> {analysis.song_structure.chorus_or_drop}</p>
          <p><strong>Bridge/breakdown/outro:</strong> {analysis.song_structure.bridge_breakdown_outro}</p>
        </SectionCard>

        <SectionCard title="Production Notes">
          <p><strong>Mix style:</strong> {analysis.production_notes.mix_style}</p>
          <p><strong>Reverb/space:</strong> {analysis.production_notes.space_reverb}</p>
          <p><strong>Dynamics:</strong> {analysis.production_notes.dynamics}</p>
          <p><strong>Stereo width:</strong> {analysis.production_notes.stereo_width}</p>
          <p><strong>Notable production techniques:</strong> {analysis.production_notes.notable_techniques}</p>
        </SectionCard>

        <SectionCard title="AI Music Prompt Draft">
          <p>{analysis.ai_music_prompt_draft}</p>
        </SectionCard>
      </div>
    </section>
  );
}

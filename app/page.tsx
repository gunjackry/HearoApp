import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="hero">
      <div className="wave" aria-hidden />
      <h1>Turn any track into a producer-style breakdown.</h1>
      <p>
        Upload a song and Hearo identifies the instruments, vocal style, structure, mood, tempo feel,
        and production traits.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
        <Link href="/upload" className="button">Try 3 free analyses</Link>
      </div>
      <p className="muted" style={{ marginTop: '1rem' }}>
        Built for creators, producers, and AI music explorers.
      </p>
    </section>
  );
}

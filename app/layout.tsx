import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HearoApp',
  description: 'Upload a track and turn it into a producer-style breakdown.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <nav className="nav">
            <Link href="/" className="brand">HearoApp</Link>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <Link className="button secondary" href="/upload">Upload</Link>
              <Link className="button" href="/upload">Try 3 free analyses</Link>
            </div>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}

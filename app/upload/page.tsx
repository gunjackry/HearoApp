'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AnalysisResult } from '@/lib/analysis-schema';

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const SUPPORTED_TYPES = ['audio/mpeg', 'audio/mp3', 'video/mp4', 'audio/mp4'];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validateFile = (candidate: File) => {
    if (!SUPPORTED_TYPES.includes(candidate.type)) {
      throw new Error('Please upload an MP3 or MP4 file.');
    }
    if (candidate.size > MAX_FILE_SIZE) {
      throw new Error('File is too large. Max allowed size is 25MB.');
    }
  };

  const onPick = (candidate: File) => {
    setError(null);
    try {
      validateFile(candidate);
      setFile(candidate);
    } catch (err) {
      setFile(null);
      setError(err instanceof Error ? err.message : 'Invalid file.');
    }
  };

  const onAnalyse = async () => {
    if (!file) {
      setError('Choose a file to analyse first.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('track', file);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Analysis failed.');
      }

      const result = payload.data as AnalysisResult;
      sessionStorage.setItem('hearo:last-analysis', JSON.stringify(result));
      router.push('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1 style={{ marginTop: 0 }}>Upload & analyse</h1>
      <p className="muted">Upload an MP3 or MP4 and Hearo turns it into a producer-style breakdown.</p>

      <div
        className="upload-box"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) onPick(dropped);
        }}
        style={{ outline: dragging ? '2px solid var(--accent)' : 'none' }}
      >
        <p style={{ marginTop: 0 }}>Drag and drop your track here</p>
        <p className="muted">Supports MP3 and MP4 · up to 25MB</p>
        <button className="button secondary" onClick={() => inputRef.current?.click()}>
          Select File
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".mp3,.mp4,audio/mpeg,audio/mp3,video/mp4,audio/mp4"
          hidden
          onChange={(e) => {
            const selected = e.target.files?.[0];
            if (selected) onPick(selected);
          }}
        />
      </div>

      {file && <p>Selected file: <strong>{file.name}</strong></p>}
      {error && <p style={{ color: '#ff9ca2' }}>{error}</p>}

      <button className="button" onClick={onAnalyse} disabled={loading} style={{ marginTop: '0.5rem' }}>
        {loading ? 'Hearo is listening…' : 'Analyse Track'}
      </button>
    </section>
  );
}

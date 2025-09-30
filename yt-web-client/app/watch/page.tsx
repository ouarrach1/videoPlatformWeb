'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Watch() {
  const videoPrefix = 'https://storage.googleapis.com/ibo-yt-processed-videos/';

  function Inner() {
    const videoSrc = useSearchParams().get('v');
    return (
      <div>
        <h1>Watch Page</h1>
        {videoSrc && (
          <video controls src={videoPrefix + videoSrc} />
        )}
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading…</div>}>
      <Inner />
    </Suspense>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import type { Video } from '@/lib/videos';
import { getPublicUrl } from '@/lib/storage';

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const updateViews = async () => {
      try {
        await fetch(`/api/videos/${video.id}/view`, { method: 'POST' });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Failed to update views:', error.message);
        } else {
          console.error('Failed to update views:', error);
        }
      }
    };

    const handlePlay = () => {
      void updateViews();
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('play', handlePlay);
      return () => {
        videoElement.removeEventListener('play', handlePlay);
      };
    }
  }, [video.id]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full"
      controls
      preload="metadata"
      playsInline
    >
      <source src={getPublicUrl(video.url)} type={video.mimeType} />
      Your browser does not support the video tag.
    </video>
  );
} 
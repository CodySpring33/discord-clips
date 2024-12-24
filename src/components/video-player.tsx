'use client';

import { useEffect, useRef, useState } from 'react';
import type { Video } from '@/lib/videos';

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    const getVideoUrl = async () => {
      try {
        const response = await fetch(`/api/videos/${video.id}/url`);
        if (!response.ok) throw new Error('Failed to get video URL');
        const { url } = await response.json();
        setVideoUrl(url);
      } catch (error) {
        console.error('Failed to get video URL:', error);
      }
    };

    void getVideoUrl();
  }, [video.id]);

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

  if (!videoUrl) {
    return <div>Loading...</div>;
  }

  return (
    <video
      ref={videoRef}
      className="w-full h-full"
      controls
      preload="metadata"
      playsInline
    >
      <source src={videoUrl} type={video.mimeType} />
      Your browser does not support the video tag.
    </video>
  );
} 
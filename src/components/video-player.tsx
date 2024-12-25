'use client';

import { useEffect, useRef, useState } from 'react';
import type { Video } from '@/lib/videos';

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [hasViewBeenCounted, setHasViewBeenCounted] = useState(false);

  useEffect(() => {
    const getVideoUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/videos/${video.id}/url`);
        if (!response.ok) throw new Error('Failed to get video URL');
        const { url } = await response.json();
        setVideoUrl(url);
        
        // Try to get thumbnail
        try {
          const thumbnailResponse = await fetch(`/api/videos/${video.id}/thumbnail`);
          if (thumbnailResponse.ok) {
            const { url: thumbUrl } = await thumbnailResponse.json();
            setThumbnailUrl(thumbUrl);
          }
        } catch (e) {
          console.warn('Failed to load thumbnail:', e);
        }
      } catch (error) {
        console.error('Failed to get video URL:', error);
        setError('Failed to load video. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    void getVideoUrl();
  }, [video.id]);

  useEffect(() => {
    const updateViews = async () => {
      if (hasViewBeenCounted) return;
      
      try {
        await fetch(`/api/videos/${video.id}/view`, { method: 'POST' });
        setHasViewBeenCounted(true);
        
        // Store in sessionStorage to prevent counting views across page refreshes
        sessionStorage.setItem(`video-${video.id}-viewed`, 'true');
      } catch (error: unknown) {
        console.error('Failed to update views:', error);
      }
    };

    const handlePlay = () => {
      void updateViews();
    };

    const handleError = (e: Event) => {
      const videoElement = e.target as HTMLVideoElement;
      if (videoElement.error) {
        setError(`Failed to play video: ${videoElement.error.message}`);
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      // Check if this video has already been viewed in this session
      const hasBeenViewed = sessionStorage.getItem(`video-${video.id}-viewed`) === 'true';
      setHasViewBeenCounted(hasBeenViewed);

      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('error', handleError);
      return () => {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, [video.id, hasViewBeenCounted]);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white p-4 rounded">
        <p className="text-center">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-900 text-white p-4 rounded">
        <p className="text-center">Loading video...</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className="w-full h-full"
      controls
      preload="metadata"
      playsInline
      poster={thumbnailUrl}
      onError={(e) => {
        const target = e.currentTarget;
        if (target.error) {
          setError(`Failed to play video: ${target.error.message}`);
        }
      }}
    >
      <source src={videoUrl} type={video.mimeType} />
      {video.mimeType === 'video/mp4' && (
        <source
          src={videoUrl}
          type="video/webm"
        />
      )}
      {video.mimeType === 'video/webm' && (
        <source
          src={videoUrl}
          type="video/mp4"
        />
      )}
      Your browser does not support the video tag.
    </video>
  );
} 
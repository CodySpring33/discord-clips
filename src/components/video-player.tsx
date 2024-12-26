'use client';

import { useEffect, useRef, useState } from 'react';
import type { Video } from '@/lib/videos';
import { formatDistanceToNow } from 'date-fns';

interface VideoPlayerProps {
  video: Video;
}

export function VideoPlayer({ video }: VideoPlayerProps): React.ReactElement {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [localViews, setLocalViews] = useState(video.views);
  const [hasViewBeenCounted, setHasViewBeenCounted] = useState(false);
  const watchTimeRef = useRef(0);
  const lastUpdateRef = useRef(Date.now());

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
        const response = await fetch(`/api/videos/${video.id}/view`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to update view count');
        }
        
        setHasViewBeenCounted(true);
        setLocalViews(prev => prev + 1);
        
        // Store view timestamp in localStorage to prevent counting views too frequently
        localStorage.setItem(`video-${video.id}-last-view`, Date.now().toString());
      } catch (error: unknown) {
        console.error('Failed to update views:', error);
      }
    };

    const handleTimeUpdate = () => {
      const videoElement = videoRef.current;
      if (!videoElement || hasViewBeenCounted) return;

      // Check if this video has been viewed recently (within 1 hour)
      const lastViewStr = localStorage.getItem(`video-${video.id}-last-view`);
      if (lastViewStr) {
        const lastView = parseInt(lastViewStr, 10);
        const hoursSinceLastView = (Date.now() - lastView) / (1000 * 60 * 60);
        if (hoursSinceLastView < 1) {
          setHasViewBeenCounted(true);
          return;
        }
      }

      // Update watch time
      const now = Date.now();
      const timeDiff = now - lastUpdateRef.current;
      lastUpdateRef.current = now;
      
      if (videoElement.paused) return;
      
      watchTimeRef.current += timeDiff;

      // Count view after 5 seconds of watching
      if (watchTimeRef.current >= 5000) {
        void updateViews();
      }
    };

    const handleEnded = () => {
      // Count view if video is watched to the end, even if less than 5 seconds
      if (!hasViewBeenCounted) {
        void updateViews();
      }
    };

    const handleError = (e: Event) => {
      const videoElement = e.target as HTMLVideoElement;
      if (videoElement.error) {
        setError(`Failed to play video: ${videoElement.error.message}`);
      }
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('ended', handleEnded);
      videoElement.addEventListener('error', handleError);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('ended', handleEnded);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, [video.id, hasViewBeenCounted]);

  if (error) {
    return (
      <div className="flex items-center justify-center w-full aspect-video bg-[#F9F9F9] dark:bg-[#1A1B26] rounded-lg text-[#ED4245] p-4">
        <p className="text-center">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full aspect-video bg-[#F9F9F9] dark:bg-[#1A1B26] rounded-lg">
        <div className="animate-pulse flex flex-col items-center">
          <svg
            className="w-12 h-12 text-[#5D7290]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z" />
          </svg>
          <p className="mt-4 text-sm text-[#606060] dark:text-[#AAAAAA]">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="relative w-full aspect-video bg-[#F9F9F9] dark:bg-[#1A1B26] rounded-lg overflow-hidden">
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
      </div>

      {/* Video Info */}
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-[#0F0F0F] dark:text-white">
          {video.title}
        </h1>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {video.author && (
              <span className="text-sm text-[#606060] dark:text-[#AAAAAA]">
                {video.author}
              </span>
            )}
            <div className="flex items-center text-sm text-[#606060] dark:text-[#AAAAAA]">
              <span>{localViews.toLocaleString()} views</span>
              <span className="mx-2">•</span>
              <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        {video.description && (
          <p className="text-sm text-[#606060] dark:text-[#AAAAAA] whitespace-pre-wrap">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
} 
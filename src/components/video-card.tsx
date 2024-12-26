'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import type { Video } from '@/lib/videos';

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/videos/${video.id}`} className="group block">
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-[#F9F9F9] dark:bg-[#1A1B26] rounded-lg overflow-hidden">
        {video.thumbnailUrl ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(min-width: 1280px) 320px, (min-width: 780px) 280px, (min-width: 640px) 240px, 100vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-[#5D7290]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z" />
            </svg>
          </div>
        )}
        
        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-[#0F0F0F]/80 text-white text-xs font-medium">
            {video.duration}
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="mt-3 space-y-1">
        <h3 className="font-medium text-[#0F0F0F] dark:text-white group-hover:text-[#5865F2] line-clamp-2">
          {video.title}
        </h3>
        <div className="flex items-center text-[#606060] dark:text-[#AAAAAA] text-sm">
          <span>{video.views.toLocaleString()} views</span>
          <span className="mx-1.5">•</span>
          <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
        </div>
        {video.author && (
          <p className="text-[#606060] dark:text-[#AAAAAA] text-sm">
            {video.author}
          </p>
        )}
      </div>
    </Link>
  );
} 
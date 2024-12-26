import { kv } from '@vercel/kv';
import { deleteObject } from '@/lib/storage';

export interface Video {
  id: string;
  title: string;
  description: string | null;
  url: string;
  mimeType: string;
  size: number;
  views: number;
  createdAt: string;
  thumbnailUrl?: string;
  duration?: string;
  author?: string;
}

export async function getAllVideos(): Promise<Video[]> {
  try {
    // Get all video IDs
    const videoIds = await kv.smembers('video_ids');
    
    if (!Array.isArray(videoIds) || !videoIds.length) {
      return [];
    }

    // Get all videos in parallel
    const videos = await Promise.all(
      videoIds.map(async (id) => kv.get<Video>(`video:${id}`))
    );

    // Filter out any null values and sort by date
    return videos
      .filter((video: Video | null): video is Video => {
        if (!video || !video.title) {
          return false;
        }
        return true;
      })
      .sort((a: Video, b: Video) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Failed to get videos:', error);
    return [];
  }
}

export async function getVideo(id: string): Promise<Video | null> {
  try {
    return await kv.get<Video>(`video:${id}`);
  } catch (error) {
    console.error('Failed to get video:', error);
    return null;
  }
}

export async function createVideo(video: Omit<Video, 'views' | 'createdAt'>): Promise<Video> {
  const newVideo: Video = {
    ...video,
    views: 0,
    createdAt: new Date().toISOString(),
  };

  try {
    // Store the video
    await kv.set(`video:${video.id}`, newVideo);
    // Add the ID to the set of all video IDs
    await kv.sadd('video_ids', video.id);
    return newVideo;
  } catch (error) {
    console.error('Failed to create video:', error);
    throw error;
  }
}

export async function incrementViews(id: string): Promise<void> {
  try {
    // Get the current video first
    const video = await getVideo(id);
    if (!video) {
      throw new Error('Video not found');
    }

    // Increment the views directly on the video object
    video.views += 1;

    // Update the video in KV store
    await kv.set(`video:${id}`, video);
  } catch (error) {
    console.error('Failed to increment views:', error);
    throw error;
  }
}

export async function deleteVideo(id: string): Promise<void> {
  try {
    // Get the video first to get its URL
    const video = await getVideo(id);
    if (!video) {
      throw new Error('Video not found');
    }

    // Delete from S3
    await deleteObject(video.url);

    // Delete from KV
    await kv.del(`video:${id}`);
    await kv.srem('video_ids', id);
  } catch (error) {
    console.error('Failed to delete video:', error);
    throw error;
  }
} 
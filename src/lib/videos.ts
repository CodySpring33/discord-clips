import { kv } from '@vercel/kv';
import { checkVideoExists } from './storage';

export interface Video {
  id: string;
  title: string;
  description: string | null;
  url: string;
  mimeType: string;
  size: number;
  views: number;
  createdAt: string;
}

async function removeVideo(id: string) {
  try {
    await kv.del(`video:${id}`);
    await kv.srem('video_ids', id);
    await kv.del(`video:${id}:views`);
    console.log('Removed video from KV:', id);
  } catch (error) {
    console.error('Failed to remove video from KV:', error);
  }
}

export async function getAllVideos(): Promise<Video[]> {
  try {
    // Get all video IDs
    const videoIds = await kv.smembers('video_ids');
    if (!Array.isArray(videoIds) || !videoIds.length) return [];

    // Get all videos and check their existence in parallel
    const videosWithExistence = await Promise.all(
      videoIds.map(async (id) => {
        const video = await kv.get<Video>(`video:${id}`);
        if (!video) return null;

        // Check if video exists in S3
        const exists = await checkVideoExists(video.url);
        if (!exists) {
          await removeVideo(id);
          return null;
        }

        return video;
      })
    );

    // Filter out null values and sort by date
    return videosWithExistence
      .filter((video): video is Video => video !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Failed to get videos:', error);
    return [];
  }
}

export async function getVideo(id: string): Promise<Video | null> {
  try {
    const video = await kv.get<Video>(`video:${id}`);
    if (!video) return null;

    // Check if video exists in S3
    const exists = await checkVideoExists(video.url);
    if (!exists) {
      await removeVideo(id);
      return null;
    }

    return video;
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
    // First check if video exists
    const video = await getVideo(id);
    if (!video) {
      throw new Error('Video not found');
    }

    await kv.incr(`video:${id}:views`);
    
    // Update the views in the main video object
    video.views = (await kv.get<number>(`video:${id}:views`)) ?? 0;
    await kv.set(`video:${id}`, video);
  } catch (error) {
    console.error('Failed to increment views:', error);
    throw error;
  }
} 
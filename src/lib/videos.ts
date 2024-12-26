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

async function migrateHashToJson(id: string): Promise<Video | null> {
  try {
    // Try to get the video in hash format
    const videoHash = await kv.hgetall(`video:${id}`);
    if (!videoHash || !videoHash.title) {
      return null;
    }

    // Convert hash to Video object
    const video: Video = {
      id: String(id),
      title: String(videoHash.title),
      description: videoHash.description ? String(videoHash.description) : null,
      url: String(videoHash.url),
      mimeType: String(videoHash.mimeType),
      size: Number(videoHash.size),
      views: Number(videoHash.views || 0),
      createdAt: String(videoHash.createdAt),
      thumbnailUrl: videoHash.thumbnailUrl ? String(videoHash.thumbnailUrl) : undefined,
      duration: videoHash.duration ? String(videoHash.duration) : undefined,
      author: videoHash.author ? String(videoHash.author) : undefined,
    };

    // Store in new format
    await kv.del(`video:${id}`); // Delete hash
    await kv.set(`video:${id}`, video); // Store as JSON
    console.log(`Migrated video ${id} from hash to JSON format`);
    return video;
  } catch (error) {
    console.error(`Failed to migrate video ${id}:`, error);
    return null;
  }
}

export async function getAllVideos(limit?: number, page: number = 1): Promise<{ videos: Video[]; total: number }> {
  try {
    // Get all video IDs
    const videoIds = await kv.smembers('video_ids');
    
    if (!Array.isArray(videoIds) || !videoIds.length) {
      return { videos: [], total: 0 };
    }

    // Get all videos in parallel
    const videos = await Promise.all(
      videoIds.map(async (id) => {
        try {
          // Try to get video in JSON format
          let video = await kv.get<Video>(`video:${id}`);
          
          // If not found, try to migrate from hash format
          if (!video) {
            video = await migrateHashToJson(id);
          }
          
          return video;
        } catch (err) {
          console.error(`Failed to get video ${id}:`, err);
          return null;
        }
      })
    );

    // Filter out any null values and sort by date
    const sortedVideos = videos
      .filter((video): video is Video => video !== null)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate pagination
    const total = sortedVideos.length;
    if (limit) {
      const start = (page - 1) * limit;
      const end = start + limit;
      return {
        videos: sortedVideos.slice(start, end),
        total
      };
    }

    return {
      videos: sortedVideos,
      total
    };
  } catch (error) {
    console.error('Failed to get videos:', error);
    return { videos: [], total: 0 };
  }
}

export async function getVideo(id: string): Promise<Video | null> {
  try {
    // Try to get video in JSON format
    let video = await kv.get<Video>(`video:${id}`);
    
    // If not found, try to migrate from hash format
    if (!video) {
      video = await migrateHashToJson(id);
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
    console.log(`Incrementing views for video ${id}`);
    
    // Get current video
    const video = await kv.get<Video>(`video:${id}`);
    if (!video) {
      console.error(`Video ${id} not found when trying to increment views`);
      throw new Error('Video not found');
    }

    // Increment views and update
    const updatedVideo = {
      ...video,
      views: video.views + 1
    };

    await kv.set(`video:${id}`, updatedVideo);
    console.log(`Successfully incremented views for video ${id}. New view count:`, updatedVideo.views);
  } catch (error) {
    console.error(`Failed to increment views for video ${id}:`, error);
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
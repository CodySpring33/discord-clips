import { kv } from '@vercel/kv';

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

export async function getAllVideos(): Promise<Video[]> {
  try {
    // Get all video IDs
    const videoIds = await kv.smembers<string>('video_ids');
    if (!videoIds?.length) return [];

    // Get all videos in parallel
    const videos = await Promise.all(
      videoIds.map((id: string) => kv.get<Video>(`video:${id}`))
    );

    // Filter out any null values and sort by date
    return videos
      .filter((v): v is Video => v !== null)
      .sort((a: Video, b: Video) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
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
    await kv.incr(`video:${id}:views`);
    
    // Update the views in the main video object
    const video = await getVideo(id);
    if (video) {
      video.views = (await kv.get<number>(`video:${id}:views`)) ?? 0;
      await kv.set(`video:${id}`, video);
    }
  } catch (error) {
    console.error('Failed to increment views:', error);
    throw error;
  }
} 
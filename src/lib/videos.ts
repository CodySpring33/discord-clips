import fs from 'fs';
import path from 'path';

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

const DATA_DIR = '/app/data';
const VIDEOS_FILE = path.join(DATA_DIR, 'videos.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize videos file if it doesn't exist
if (!fs.existsSync(VIDEOS_FILE)) {
  fs.writeFileSync(VIDEOS_FILE, JSON.stringify([]));
}

export function getAllVideos(): Video[] {
  const data = fs.readFileSync(VIDEOS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function getVideo(id: string): Video | null {
  const videos = getAllVideos();
  return videos.find(v => v.id === id) ?? null;
}

export function createVideo(video: Omit<Video, 'views' | 'createdAt'>): Video {
  const videos = getAllVideos();
  const newVideo = {
    ...video,
    views: 0,
    createdAt: new Date().toISOString(),
  };
  
  videos.push(newVideo);
  fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2));
  return newVideo;
}

export function incrementViews(id: string): void {
  const videos = getAllVideos();
  const index = videos.findIndex(v => v.id === id);
  
  if (index !== -1) {
    videos[index].views += 1;
    fs.writeFileSync(VIDEOS_FILE, JSON.stringify(videos, null, 2));
  }
} 
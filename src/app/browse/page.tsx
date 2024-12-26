import { Metadata } from 'next';
import { getAllVideos } from '@/lib/videos';
import { VideoCard } from '@/components/video-card';
import { ReactElement } from 'react';

export const metadata: Metadata = {
  title: 'Browse Clips',
  description: 'Browse and discover gaming clips from the community.',
};

export default async function BrowsePage(): Promise<ReactElement> {
  const videos = await getAllVideos();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Clips</h1>
          <p className="text-muted-foreground">
            Discover gaming moments from the community
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            className="select-primary rounded-md border border-input bg-white dark:bg-[#1A1B26] px-3 h-10 text-sm"
            defaultValue="newest"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="mb-4">
            <svg 
              className="w-12 h-12 mx-auto text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No clips yet</h3>
          <p className="text-muted-foreground mb-6">
            Be the first to share a gaming moment!
          </p>
          <a
            href="/upload"
            className="btn-primary inline-flex items-center px-4 py-2 rounded-md"
          >
            <svg
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Upload a Clip
          </a>
        </div>
      )}
    </div>
  );
} 
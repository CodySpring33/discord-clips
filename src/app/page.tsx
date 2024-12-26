import { getAllVideos } from '@/lib/videos';
import { VideoCard } from '@/components/video-card';
import Link from 'next/link';
import { ReactElement } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home(): Promise<ReactElement> {
  const { videos } = await getAllVideos(10);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="border-b border-[#5D7290]/10 bg-[#F9F9F9] dark:bg-[#1A1B26] py-16">
        <div className="max-w-[1280px] mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-[#0F0F0F] dark:text-white mb-4">
            Share Your Gaming Moments
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-[#606060] dark:text-[#AAAAAA]">
            Upload and share your best gaming clips with your Discord community. Easy sharing, instant playback.
          </p>
          <Link href="/upload" className="btn-primary inline-flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Upload Your First Clip
          </Link>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="flex-1 py-12">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#0F0F0F] dark:text-white">Latest Clips</h2>
            {videos.length >= 10 && (
              <Link href="/browse" className="text-[#5865F2] hover:underline">
                View All Clips →
              </Link>
            )}
          </div>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <div className="mb-4">
                <svg 
                  className="w-12 h-12 mx-auto text-[#5D7290]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3.25 4A2.25 2.25 0 001 6.25v7.5A2.25 2.25 0 003.25 16h7.5A2.25 2.25 0 0013 13.75v-7.5A2.25 2.25 0 0010.75 4h-7.5zM19 4.75a.75.75 0 00-1.28-.53l-3 3a.75.75 0 00-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 001.28-.53V4.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#0F0F0F] dark:text-white mb-2">No clips yet</h3>
              <p className="mb-6 text-[#606060] dark:text-[#AAAAAA]">
                Be the first to share a gaming moment!
              </p>
              <Link href="/upload" className="btn-primary inline-flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Upload a Clip
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

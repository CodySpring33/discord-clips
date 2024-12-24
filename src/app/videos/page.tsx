import { Navbar } from '@/components/navbar';
import { getAllVideos } from '@/lib/videos';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function VideosPage() {
  const videos = await getAllVideos();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold gradient-text">Latest Clips</h1>
            <Link href="/upload" className="button-primary">
              Upload Video
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link 
                key={video.id} 
                href={`/videos/${video.id}`}
                className="group"
              >
                <article className="card h-full flex flex-col group-hover:border-primary/50">
                  <div className="aspect-video bg-card-hover rounded-lg overflow-hidden mb-4">
                    {/* Video thumbnail would go here */}
                    <div className="w-full h-full bg-card-hover flex items-center justify-center">
                      <svg className="h-12 w-12 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h2>
                    {video.description && (
                      <p className="text-muted line-clamp-2 mb-4">
                        {video.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted mt-4">
                    <span>{video.views.toLocaleString()} views</span>
                    <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {videos.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">No videos yet</h2>
              <p className="text-muted mb-8">Be the first to upload a video!</p>
              <Link href="/upload" className="button-primary">
                Upload Video
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
} 
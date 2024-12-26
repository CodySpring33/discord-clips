import { getAllVideos } from '@/lib/videos';
import { VideoCard } from '@/components/video-card';
import Link from 'next/link';
import { ReactElement } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const VIDEOS_PER_PAGE = 20;

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: { page?: string };
}): Promise<ReactElement> {
  const currentPage = Number(searchParams.page) || 1;
  const { videos, total } = await getAllVideos(VIDEOS_PER_PAGE, currentPage);
  const totalPages = Math.ceil(total / VIDEOS_PER_PAGE);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#0F0F0F] dark:text-white">Browse All Clips</h1>
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

        {videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/browse?page=${currentPage - 1}`}
                    className="px-4 py-2 text-sm font-medium text-[#5865F2] bg-white dark:bg-[#1A1B26] rounded-md hover:bg-gray-50 dark:hover:bg-[#24273A]"
                  >
                    Previous
                  </Link>
                )}

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      // If 5 or fewer pages, show all
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // If near start, show first 5
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // If near end, show last 5
                      pageNum = totalPages - 4 + i;
                    } else {
                      // Show 2 before and 2 after current page
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Link
                        key={pageNum}
                        href={`/browse?page=${pageNum}`}
                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNum
                            ? 'bg-[#5865F2] text-white'
                            : 'text-[#5865F2] bg-white dark:bg-[#1A1B26] hover:bg-gray-50 dark:hover:bg-[#24273A]'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>

                {currentPage < totalPages && (
                  <Link
                    href={`/browse?page=${currentPage + 1}`}
                    className="px-4 py-2 text-sm font-medium text-[#5865F2] bg-white dark:bg-[#1A1B26] rounded-md hover:bg-gray-50 dark:hover:bg-[#24273A]"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
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
            <h2 className="text-xl font-semibold text-[#0F0F0F] dark:text-white mb-2">No clips yet</h2>
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
    </div>
  );
} 
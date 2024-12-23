import { notFound } from 'next/navigation';
import { getVideo } from '@/lib/videos';
import { VideoPlayer } from '@/components/video-player';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: {
    id: string;
  };
}

export default async function VideoPage({ params }: Props): Promise<JSX.Element> {
  const video = getVideo(params.id);

  if (!video) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
          <VideoPlayer video={video} />
        </div>
        <p className="text-gray-600">{video.description}</p>
        <div className="mt-4 text-sm text-gray-500">
          {video.views.toLocaleString()} views
        </div>
      </div>
    </main>
  );
} 
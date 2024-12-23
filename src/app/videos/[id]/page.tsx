import { notFound } from 'next/navigation';
import { getVideo } from '@/lib/videos';
import { VideoPlayer } from '@/components/video-player';
import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: {
    id: string;
  };
}

function getBaseUrl(): string {
  // Check for Vercel environment variables first
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // For preview deployments
  if (process.env.VERCEL_ENV === 'preview') {
    const headersList = headers();
    const host = headersList.get('host');
    if (host) {
      return `https://${host}`;
    }
  }

  // Fallback for local development
  return 'http://localhost:3000';
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const video = getVideo(params.id);

  if (!video) {
    return {
      title: 'Video Not Found',
    };
  }

  const baseUrl = getBaseUrl();
  const videoPageUrl = `${baseUrl}/videos/${video.id}`;

  return {
    title: video.title,
    description: video.description || undefined,
    openGraph: {
      title: video.title,
      description: video.description || undefined,
      type: 'video.other',
      url: videoPageUrl,
      videos: [{
        url: video.url,
        type: video.mimeType,
        width: 1280,
        height: 720,
      }],
      images: [
        {
          // You might want to generate and store video thumbnails in the future
          url: '/og-image.png',
          width: 1280,
          height: 720,
        },
      ],
    },
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
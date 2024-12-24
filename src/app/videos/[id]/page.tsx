import { notFound } from 'next/navigation';
import { getVideo } from '@/lib/videos';
import { VideoPlayer } from '@/components/video-player';
import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import { getPublicUrl } from '@/lib/storage';
import { Navbar } from '@/components/navbar';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: {
    id: string;
  };
}

function getBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.VERCEL_ENV === 'preview') {
    const headersList = headers();
    const host = headersList.get('host');
    if (host) {
      return `https://${host}`;
    }
  }

  return 'http://localhost:3000';
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const video = await getVideo(params.id);

  if (!video) {
    return {
      title: 'Video Not Found',
    };
  }

  const baseUrl = getBaseUrl();
  const videoPageUrl = `${baseUrl}/videos/${video.id}`;
  const videoUrl = getPublicUrl(video.url);
  const thumbnailUrl = `${baseUrl}/api/videos/${video.id}/thumbnail`;

  return {
    title: video.title,
    description: video.description || undefined,
    openGraph: {
      title: video.title,
      description: video.description || undefined,
      type: 'video.other',
      url: videoPageUrl,
      siteName: 'Discord Clips',
      videos: [{
        url: videoUrl,
        type: video.mimeType,
        width: 1280,
        height: 720,
        secureUrl: videoUrl,
      }],
      images: [{
        url: thumbnailUrl,
        width: 1280,
        height: 720,
        alt: video.title,
      }],
    },
    twitter: {
      card: 'player',
      title: video.title,
      description: video.description || undefined,
      images: [thumbnailUrl],
    },
    other: {
      'theme-color': '#5865F2',
      'og:type': 'video',
      'og:video:type': video.mimeType,
      'og:video:width': '1280',
      'og:video:height': '720',
      'og:video': videoUrl,
      'og:video:secure_url': videoUrl,
      'og:image': thumbnailUrl,
      'discord:color': '#5865F2',
    },
  };
}

export default async function VideoPage({ params }: Props): Promise<JSX.Element> {
  const video = await getVideo(params.id);

  if (!video) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player Column */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl overflow-hidden">
                <div className="aspect-video">
                  <VideoPlayer video={video} />
                </div>
              </div>

              <div className="mt-6">
                <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                <div className="flex items-center text-sm text-muted mb-4">
                  <span>{video.views.toLocaleString()} views</span>
                  <span className="mx-2">•</span>
                  <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                </div>
                {video.description && (
                  <p className="text-muted whitespace-pre-wrap">{video.description}</p>
                )}
              </div>
            </div>

            {/* Info Column */}
            <div className="lg:col-span-1">
              <div className="card">
                <h2 className="text-lg font-semibold mb-4">Share</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">
                      Video URL
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={`${getBaseUrl()}/videos/${video.id}`}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">
                      Direct Link
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={getPublicUrl(video.url)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                  </div>
                </div>
              </div>

              <div className="card mt-6">
                <h2 className="text-lg font-semibold mb-4">Video Info</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-muted">Format</dt>
                    <dd className="mt-1">{video.mimeType.split('/')[1].toUpperCase()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted">Size</dt>
                    <dd className="mt-1">{(video.size / 1024 / 1024).toFixed(1)} MB</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted">Uploaded</dt>
                    <dd className="mt-1">{new Date(video.createdAt).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 
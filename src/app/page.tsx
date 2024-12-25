import { getAllVideos } from '@/lib/videos';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home(): Promise<JSX.Element> {
  const videos = await getAllVideos();

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between">
        <h1 className="text-4xl font-bold mb-8">Discord Clips</h1>
        <a 
          href="/upload"
          className="btn-primary"
        >
          Upload Video
        </a>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {videos.map((video) => (
            <div key={video.id} className="card p-4">
              <h2 className="text-xl font-bold">{video.title}</h2>
              <p className="text-muted">{video.description}</p>
              <div className="mt-2 text-sm text-muted">
                {video.views.toLocaleString()} views
              </div>
              <a 
                href={`/videos/${video.id}`}
                className="text-primary hover:text-primary/80 mt-2 inline-block"
              >
                View Video
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

import { prisma } from '@/lib/prisma'
import { Video } from '@prisma/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  let videos: Video[] = []
  
  try {
    videos = await prisma.video.findMany({
      where: {
        status: 'READY'
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  } catch (error) {
    console.error('Failed to fetch videos:', error)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Discord Clips</h1>
        <a 
          href="/upload"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload Video
        </a>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {videos.map((video: Video) => (
            <div key={video.id} className="border rounded p-4">
              <h2 className="text-xl font-bold">{video.title}</h2>
              <p className="text-gray-600">{video.description}</p>
              <a 
                href={`/videos/${video.id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                View Video
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

import { NextResponse } from 'next/server';
import { getVideo } from '@/lib/videos';
import { getPublicUrl } from '@/lib/storage';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const video = await getVideo(params.id);
    if (!video) {
      return new NextResponse(
        JSON.stringify({ message: 'Video not found' }),
        { status: 404 }
      );
    }

    // For now, we'll use the video URL itself as the thumbnail
    // In a production environment, you'd want to generate and store actual thumbnails
    const url = getPublicUrl(video.url);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Failed to get thumbnail URL:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to get thumbnail URL' }),
      { status: 500 }
    );
  }
} 
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

    const url = getPublicUrl(video.url);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Failed to get video URL:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to get video URL' }),
      { status: 500 }
    );
  }
} 
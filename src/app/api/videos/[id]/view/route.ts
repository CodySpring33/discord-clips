import { NextResponse } from 'next/server';
import { incrementViews } from '@/lib/videos';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    console.log('View increment request received for video:', params.id);
    const id = String(params.id);
    await incrementViews(id);
    console.log('Successfully incremented views for video:', id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to increment views in API route:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to update view count' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 
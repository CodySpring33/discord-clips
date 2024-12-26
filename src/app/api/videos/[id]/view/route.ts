import { NextResponse } from 'next/server';
import { incrementViews } from '@/lib/videos';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = String(await params.id);
    await incrementViews(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to increment views:', error);
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
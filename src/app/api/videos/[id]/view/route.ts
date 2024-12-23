import { NextResponse } from 'next/server';
import { incrementViews } from '@/lib/videos';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await incrementViews(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to increment views:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to update view count' }),
      { status: 500 }
    );
  }
} 
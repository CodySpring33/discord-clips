import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createVideo } from '@/lib/videos';

const createVideoSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).nullable(),
  url: z.string(),
  mimeType: z.enum(['video/mp4', 'video/webm']),
  size: z.number(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = createVideoSchema.parse(body);
    
    const video = await createVideo(validation);
    return NextResponse.json(video);
  } catch (error) {
    console.error('Failed to create video:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ message: error.errors[0].message }),
        { status: 400 }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: 'Failed to create video' }),
      { status: 500 }
    );
  }
} 
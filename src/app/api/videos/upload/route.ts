import { NextResponse } from 'next/server';
import { z } from 'zod';
import { headers } from 'next/headers';
import { createPresignedUploadUrl } from '@/lib/storage';
import { createVideo } from '@/lib/videos';
import { checkRateLimit } from '@/lib/rate-limit';
import { nanoid } from 'nanoid';

const uploadRequestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  contentType: z.enum(['video/mp4', 'video/webm'], {
    errorMap: () => ({ message: 'Only MP4 and WebM files are supported' }),
  }),
  size: z.number().max(
    Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 104857600,
    'File size must be less than 100MB'
  ),
});

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      return new NextResponse(
        JSON.stringify({ message: 'Upload limit exceeded. Please try again later.' }),
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = uploadRequestSchema.parse(body);
    
    const id = nanoid();
    const key = `videos/${id}${validation.contentType === 'video/mp4' ? '.mp4' : '.webm'}`;
    const { url, fields } = await createPresignedUploadUrl({ key, contentType: validation.contentType });

    await createVideo({
      id,
      title: validation.title,
      description: validation.description ?? null,
      url: key,
      mimeType: validation.contentType,
      size: validation.size,
    });

    return NextResponse.json({ url, fields, id });
  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ message: error.errors[0].message }),
        { status: 400 }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
} 
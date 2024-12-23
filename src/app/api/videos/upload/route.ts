import { NextResponse } from 'next/server';
import { z } from 'zod';
import { headers } from 'next/headers';
import { createPresignedUploadUrl } from '@/lib/storage';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

const UPLOAD_LIMIT = 10; // uploads per day
const UPLOAD_WINDOW = 24 * 60 * 60; // 24 hours in seconds

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

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `upload:${ip}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, UPLOAD_WINDOW);
  }
  
  return count <= UPLOAD_LIMIT;
}

export async function POST(request: Request) {
  try {
    const ip = headers().get('x-forwarded-for') || 'unknown';
    const allowed = await checkRateLimit(ip);
    
    if (!allowed) {
      return NextResponse.json(
        { message: 'Too many uploads. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }

    try {
      const validation = uploadRequestSchema.parse(body);
      const key = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      const { url, fields } = await createPresignedUploadUrl(key, validation.contentType);

      const video = await prisma.video.create({
        data: {
          title: validation.title,
          description: validation.description,
          mimeType: validation.contentType,
          size: validation.size,
          storageKey: key,
          url: `${url}/${key}`, // This will be updated once the upload is complete
          ipAddress: ip,
        },
      });

      return NextResponse.json({
        url,
        fields,
        id: video.id,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { message: error.errors[0].message },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

const VIEW_LIMIT = 100; // views per hour
const VIEW_WINDOW = 60 * 60; // 1 hour in seconds

async function checkRateLimit(ip: string, videoId: string): Promise<boolean> {
  const key = `view:${ip}:${videoId}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, VIEW_WINDOW);
  }
  
  return count <= VIEW_LIMIT;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ip = headers().get('x-forwarded-for') || 'unknown';
    const allowed = await checkRateLimit(ip, params.id);
    
    if (!allowed) {
      return new NextResponse('Too many requests', { status: 429 });
    }

    const video = await prisma.video.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ views: video.views });
  } catch (error) {
    console.error('View count error:', error);
    return new NextResponse(
      'Internal Server Error',
      { status: 500 }
    );
  }
} 
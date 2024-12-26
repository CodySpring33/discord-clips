import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { deleteVideo } from '@/lib/videos';

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = await headers();
    const authToken = headersList.get('x-admin-token');

    if (!ADMIN_TOKEN || authToken !== ADMIN_TOKEN) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    await deleteVideo(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Failed to delete video:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to delete video' }),
      { status: 500 }
    );
  }
} 
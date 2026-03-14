import { NextRequest, NextResponse } from 'next/server';
import { getGeneratedImage } from '@/lib/generated-image-store';

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  const entry = getGeneratedImage(id);
  if (!entry) {
    return NextResponse.json({ error: 'Image not found or expired' }, { status: 404 });
  }
  return new NextResponse(entry.buffer, {
    headers: {
      'Content-Type': entry.contentType,
      'Cache-Control': 'private, max-age=86400',
    },
  });
}

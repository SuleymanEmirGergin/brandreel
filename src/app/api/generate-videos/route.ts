import { NextResponse } from 'next/server';
import type { ImageResult, VideoResult } from '@/lib/types';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const images = (body?.images as ImageResult[]) ?? [];

  await new Promise((r) => setTimeout(r, 1500));

  // 5 video: her biri bir görsele karşılık (ilk 5 görsel veya scriptId 1–5). thumbnail = görsel URL (http veya /api/...).
  const videoCount = 5;
  const videos: VideoResult[] = Array.from({ length: videoCount }, (_, i) => {
    const scriptId = i + 1;
    const img = images.find((im) => im.scriptId === scriptId) ?? images[i];
    const thumbnailUrl =
      typeof img?.url === 'string' && (img.url.startsWith('http') || img.url.startsWith('/'))
        ? img.url
        : 'linear-gradient(135deg, #2C1810, #D4A574)';
    return {
      id: i + 1,
      url: '#',
      thumbnailUrl,
      duration: 15,
      scriptId,
    };
  });

  return NextResponse.json({ videos });
}

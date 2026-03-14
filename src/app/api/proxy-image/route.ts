import { NextRequest, NextResponse } from 'next/server';

const MAX_URL_LENGTH = 2048;

function isAllowedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    return url.length <= MAX_URL_LENGTH;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url || !isAllowedUrl(url)) {
    return NextResponse.json({ error: 'Invalid or missing url' }, { status: 400 });
  }
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'BrandReel/1.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 });
    }
    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const blob = await res.arrayBuffer();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (e) {
    console.error('[proxy-image] fetch failed:', e);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 502 });
  }
}

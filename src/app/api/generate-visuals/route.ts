import { NextResponse } from 'next/server';
import { runImageModel, hasWiroKey, getImageModelSlug } from '@/lib/wiro';
import { setGeneratedImage } from '@/lib/generated-image-store';
import type { BrandKit, Script, ImageResult } from '@/lib/types';

const WIRO_IMAGE_COUNT = 3; // Tasarruf için 3 görsel

/** Wiro URL'sinden görseli çekip sunucuda saklar. Dönen URL: /api/generated-image?id=... (küçük yanıt; frontend bu URL ile görseli isteyebilir). */
async function fetchAndStoreImage(
  imageUrl: string,
  storeId: string
): Promise<string | null> {
  const doFetch = async (): Promise<{ buffer: Buffer; contentType: string } | null> => {
    const res = await fetch(imageUrl, {
      headers: { 'User-Agent': 'BrandReel/1.0', Accept: 'image/*' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const ct = res.headers.get('content-type') || 'image/png';
    return { buffer: Buffer.from(buf), contentType: ct.includes('jpeg') || ct.includes('jpg') ? 'image/jpeg' : 'image/png' };
  };
  try {
    let result = await doFetch();
    if (!result) {
      await new Promise((r) => setTimeout(r, 2000));
      result = await doFetch();
    }
    if (!result) return null;
    setGeneratedImage(storeId, result.contentType, result.buffer);
    return `/api/generated-image?id=${encodeURIComponent(storeId)}`;
  } catch (e) {
    console.error('[generate-visuals] fetchAndStoreImage failed:', e);
    return null;
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const brandKit = body?.brandKit as BrandKit | undefined;
  const scripts = (body?.scripts as Script[]) ?? [];

  const colors = brandKit?.colors?.length
    ? brandKit.colors.map((c) => c.replace('#', ''))
    : ['2C1810', 'D4A574', 'F5E6D3', '8B4513', '1A0F0A'];
  const brandName = brandKit?.name ?? 'Brand';
  const slogan = brandKit?.slogan?.trim() ?? '';
  const industry = brandKit?.industry?.trim() ?? '';
  const colorDesc =
    brandKit?.colors?.length ?
      `Marka renkleri: ${brandKit.colors.slice(0, 4).join(', ')}.`
    : '';

  const total = 20;
  const images: ImageResult[] = [];

  const theme = industry || 'brand';

  function buildImagePrompt(scriptHook: string | undefined, index: number): string {
    const scene = scriptHook?.trim() || `${brandName} product or brand moment`;
    const subject = `Professional product photo: ${scene}. Brand: ${brandName}. Theme: ${theme}.`;
    const context = [slogan && `Slogan: "${slogan}".`, colorDesc].filter(Boolean).join(' ');
    const quality =
      'Sharp focus, professional lighting, clean composition, high detail, 8k. Use only the brand colors and mood. No text on packaging, no labels, no text overlay, no letters or words — focus only on product shape, form, and colors. No blur, no distortion.';
    return `${subject} ${context} ${quality}`;
  }

  const negativePrompt =
    'text, writing, letters, words, labels, typography, logo text, packaging text, garbled text, distorted text, unreadable, blurry text, mutated characters, messy type, deformed logo, illegible, watermark, caption, subtitle';

  if (hasWiroKey() && scripts.length >= WIRO_IMAGE_COUNT) {
    const requestId = crypto.randomUUID();
    console.log('[generate-visuals] Wiro', getImageModelSlug(), 'ile', WIRO_IMAGE_COUNT, 'görsel (marka:', brandName, ')…');
    const wiroPromises = Array.from({ length: WIRO_IMAGE_COUNT }, async (_, i) => {
      const script = scripts[i];
      const prompt = buildImagePrompt(script?.hook, i);
      const storeId = `${requestId}-${i}`;
      try {
        const urls = await runImageModel(getImageModelSlug(), {
          prompt,
          negativePrompt,
          width: 1024,
          height: 1024,
          steps: 32,
          scale: 3.5,
          samples: 1,
          seed: Date.now() % 1e9,
        });
        const rawUrl = urls[0] ?? null;
        const url = rawUrl ? await fetchAndStoreImage(rawUrl, storeId) : null;
        return { id: i + 1, url: url ?? null, prompt, scriptId: (i % 5) + 1 };
      } catch (e) {
        console.error('[generate-visuals] Wiro image', i + 1, e);
        return null;
      }
    });

    const wiroResults = await Promise.all(wiroPromises);
    for (let i = 0; i < WIRO_IMAGE_COUNT; i++) {
      const r = wiroResults[i];
      if (r?.url) {
        images.push({
          id: i + 1,
          url: r.url,
          prompt: r.prompt,
          scriptId: (i % 5) + 1,
        });
      } else {
        images.push({
          id: i + 1,
          url: `https://placehold.co/800x800/${colors[i % colors.length]}/ffffff?text=Visual+${i + 1}`,
          prompt: r?.prompt ?? `Brand visual #${i + 1}`,
          scriptId: (i % 5) + 1,
        });
      }
    }
  }

  for (let i = images.length; i < total; i++) {
    const scriptId = (i % 5) + 1;
    const script = scripts.find((s) => s.id === scriptId);
    const prompt = script?.hook
      ? `${brandName} — ${script.hook}`
      : `Brand visual #${i + 1}`;
    images.push({
      id: i + 1,
      url: `https://placehold.co/800x800/${colors[i % colors.length]}/ffffff?text=Visual+${i + 1}`,
      prompt,
      scriptId,
    });
  }

  return NextResponse.json({ images });
}

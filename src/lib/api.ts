import type { BrandKit, Script, ImageResult, VideoResult, GenerationBundle } from './types';

const BASE = '';

const DEFAULT_FETCH_TIMEOUT_MS = 120000; // 2 dk; sunucu 90s'te cevap vermeli

async function post<T>(path: string, body?: object, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      ...(body && { body: JSON.stringify(body) }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || `API error: ${res.status}`);
    }
    return res.json();
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('İstek zaman aşımına uğradı. Wiro yanıt vermiyor olabilir.');
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Brand-ingest yanıtı; Wiro hata verirse usedFallback + error döner */
export type BrandIngestResponse = BrandKit & {
  usedFallback?: boolean;
  error?: string;
};

/** Marka URL’sinden Brand Kit çıkarır */
export async function brandIngest(url: string): Promise<BrandIngestResponse> {
  return post<BrandIngestResponse>('/api/brand-ingest', { url });
}

/** Hook + CTA metinleri üretir; marka bilgisi gönderilir (site adına göre içerik). */
export async function generateScripts(brandKit: BrandKit): Promise<Script[]> {
  const data = await post<{ hooks?: string[]; ctas?: string[] }>('/api/generate-scripts', {
    brandKit,
  });
  const hooks = Array.isArray(data.hooks) ? data.hooks : [];
  const ctas = Array.isArray(data.ctas) ? data.ctas : [];
  return hooks.map((hook, i) => ({
    id: i + 1,
    hook,
    body: '',
    cta: ctas[i] ?? '',
  }));
}

/** Görselleri üretir; marka + script’lere göre. */
export async function generateVisuals(
  brandKit: BrandKit,
  scripts: Script[]
): Promise<ImageResult[]> {
  const data = await post<{ images?: ImageResult[] }>('/api/generate-visuals', {
    brandKit,
    scripts,
  });
  return Array.isArray(data.images) ? data.images : [];
}

/** Videoları üretir; görsel listesinden (image-to-video). */
export async function generateVideos(images: ImageResult[]): Promise<VideoResult[]> {
  const data = await post<{ videos?: VideoResult[] }>('/api/generate-videos', {
    images,
  });
  return Array.isArray(data.videos) ? data.videos : [];
}

import { NextResponse } from 'next/server';
import {
  runLLMPrompt,
  hasWiroKey,
  WiroAuthError,
  WiroUpstreamError,
  WiroInvalidResponseError,
} from '@/lib/wiro';
import type { BrandKit } from '@/lib/types';

type WiroErrorType = 'auth_error' | 'upstream_error' | 'timeout_error' | 'invalid_response' | 'task_failed';

function getWiroErrorType(err: unknown): WiroErrorType {
  if (err instanceof WiroAuthError) return 'auth_error';
  if (err instanceof WiroUpstreamError) return 'upstream_error';
  if (err instanceof WiroInvalidResponseError) return 'invalid_response';
  if (err instanceof Error && (err.message.includes('timeout') || err.message.includes('timed out')))
    return 'timeout_error';
  return 'upstream_error';
}

/** Wiro hata/fallback durumunda kullanılır; marka adı/domain ile doldurulur, sabit kahve metni yok. */
function buildFallbackHooksCtas(brandName: string, domain: string, industry: string): { hooks: string[]; ctas: string[] } {
  const product = industry || 'ürün';
  return {
    hooks: [
      `${brandName} ile ${product} deneyimini keşfet`,
      `${brandName} — kalite ve güven bir arada`,
      `Senin için özenle seçilmiş ${product} önerileri`,
      `${brandName} farkıyla tanış`,
      `Hemen incele, ${domain} üzerinden ulaş`,
    ],
    ctas: [
      `Şimdi keşfet → ${domain}`,
      `Detaylar için tıkla →`,
      `${brandName} sitesine git →`,
      `İncele → ${domain}`,
      `Hemen başla →`,
    ],
  };
}

function tryParseJSON<T = Record<string, unknown>>(raw: string): T {
  const str = raw.trim();
  try {
    return JSON.parse(str) as T;
  } catch {
    const fixed = str.replace(/([{,]\s*)'([^']*)'(\s*):/g, '$1"$2"$3:');
    return JSON.parse(fixed) as T;
  }
}

function parseHooksCtas(text: string, brandName: string): { hooks: string[]; ctas: string[] } {
  const hooks: string[] = [];
  const ctas: string[] = [];
  try {
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ?? [null, text];
    const raw = (jsonMatch[1] ?? text).trim();
    const parsed = tryParseJSON<{ hooks?: string[]; ctas?: string[] }>(raw);
    if (Array.isArray(parsed.hooks)) hooks.push(...parsed.hooks.slice(0, 5));
    if (Array.isArray(parsed.ctas)) ctas.push(...parsed.ctas.slice(0, 5));
  } catch {
    // ignore
  }
  while (hooks.length < 5) hooks.push(`${brandName} — sosyal medya hook ${hooks.length + 1}`);
  while (ctas.length < 5) ctas.push(`${brandName} →`);
  return { hooks: hooks.slice(0, 5), ctas: ctas.slice(0, 5) };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const brandKit = body?.brandKit as BrandKit | undefined;
  const brandName = brandKit?.name ?? 'Marka';
  const industry = brandKit?.industry ?? '';
  const slogan = brandKit?.slogan ?? '';
  const domain = brandKit?.domain ?? '';

  if (!hasWiroKey() || !brandKit) {
    await new Promise((r) => setTimeout(r, 800));
    const fallback = buildFallbackHooksCtas(brandName, domain || '', industry);
    return NextResponse.json({
      ...fallback,
      usedFallback: true,
      error: !hasWiroKey() ? 'WIRO_API_KEY is not set' : 'brandKit missing',
      errorType: !hasWiroKey() ? 'auth_error' : 'invalid_response',
    });
  }

  const prompt = `Aşağıdaki marka için ve sadece bu marka için sosyal medya reel'leri için 5 kısa hook ve 5 CTA metni üret.
Marka: ${brandName}
Domain: ${domain}
${industry ? `Sektör/kategori: ${industry}\n` : ''}${slogan ? `Slogan: ${slogan}\n` : ''}
Yanıt sadece aşağıdaki JSON formatında olsun, başka açıklama yazma. Tüm metinler Türkçe olsun; Türkçe karakterleri (ı, ş, ğ, ü, ö, ç, İ) doğru kullan.
Çıktı formatı:
{
  "hooks": ["hook 1", "hook 2", "hook 3", "hook 4", "hook 5"],
  "ctas": ["CTA 1", "CTA 2", "CTA 3", "CTA 4", "CTA 5"]
}`;

  const SCRIPT_TIMEOUT_MS = 95000; // runModel 90s; burada biraz fazla
  try {
    const responseText = await Promise.race([
      runLLMPrompt(prompt),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Wiro script üretimi zaman aşımına uğradı (90s)')), SCRIPT_TIMEOUT_MS)
      ),
    ]);
    const { hooks, ctas } = parseHooksCtas(responseText, brandName);
    return NextResponse.json({ hooks, ctas, usedFallback: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Wiro error';
    const errorType = getWiroErrorType(err);
    console.error('[generate-scripts] Wiro error:', errorType, message);
    const fallback = buildFallbackHooksCtas(brandName, domain, industry);
    return NextResponse.json({
      ...fallback,
      usedFallback: true,
      error: message,
      errorType,
      errorDetail:
        errorType === 'auth_error'
          ? 'Wiro API key invalid or rejected. Check WIRO_API_KEY in .env.local and restart the server.'
          : undefined,
    });
  }
}

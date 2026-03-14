import { NextResponse } from 'next/server';
import {
  runLLMPrompt,
  hasWiroKey,
  WiroAuthError,
  WiroUpstreamError,
  WiroInvalidResponseError,
} from '@/lib/wiro';
import type { BrandKit } from '@/lib/types';

export type WiroErrorType = 'auth_error' | 'upstream_error' | 'timeout_error' | 'invalid_response' | 'task_failed';

function getWiroErrorType(err: unknown): WiroErrorType {
  if (err instanceof WiroAuthError) return 'auth_error';
  if (err instanceof WiroUpstreamError) return 'upstream_error';
  if (err instanceof WiroInvalidResponseError) return 'invalid_response';
  if (err instanceof Error && (err.message.includes('timeout') || err.message.includes('timed out')))
    return 'timeout_error';
  return 'upstream_error';
}

export type PageMeta = {
  title?: string;
  description?: string;
  faviconUrl?: string;
  themeColor?: string;
  origin?: string;
};

/** URL'den sayfa meta bilgisi, favicon ve theme-color çeker */
async function fetchPageMeta(url: string): Promise<PageMeta> {
  try {
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    const parsed = new URL(normalized);
    const origin = parsed.origin;
    const res = await fetch(normalized, {
      headers: { 'User-Agent': 'BrandReel/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch =
      html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
    const themeMatch =
      html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']theme-color["']/i);
    let faviconUrl: string | undefined;
    const iconLink = html.match(
      /<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i
    ) || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:icon|shortcut icon)["']/i);
    const appleIcon = html.match(
      /<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i
    ) || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon["']/i);
    if (iconLink?.[1]) faviconUrl = new URL(iconLink[1], origin).href;
    else if (appleIcon?.[1]) faviconUrl = new URL(appleIcon[1], origin).href;
    else faviconUrl = `${origin}/favicon.ico`;
    return {
      title: titleMatch?.[1]?.trim(),
      description: descMatch?.[1]?.trim(),
      faviconUrl,
      themeColor: themeMatch?.[1]?.trim(),
      origin,
    };
  } catch {
    try {
      const normalized = url.startsWith('http') ? url : `https://${url}`;
      const parsed = new URL(normalized);
      return { origin: parsed.origin, faviconUrl: `${parsed.origin}/favicon.ico` };
    } catch {
      return {};
    }
  }
}

/** Domain'den okunabilir marka adı (sanalbaharat.com → Sanal Baharat) */
function domainToBrandName(domain: string): string {
  const host = domain.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
  const base = host.replace(/^www\./, '').split('.')[0] || 'Marka';
  return base
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** theme-color veya varsayılanlardan 6 renk üretir */
function buildColorPalette(themeColor?: string): string[] {
  if (themeColor?.trim()) {
    let hex = themeColor.trim().startsWith('#') ? themeColor.trim() : `#${themeColor.trim()}`;
    if (hex.length === 4) {
      hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const colors = [hex];
      for (let i = 1; i < 6; i++) {
        const f = Math.max(0.2, 0.85 - i * 0.12);
        colors.push(
          `#${Math.round(r * f).toString(16).padStart(2, '0')}${Math.round(g * f).toString(16).padStart(2, '0')}${Math.round(b * f).toString(16).padStart(2, '0')}`
        );
      }
      return colors;
    }
  }
  return ['#2C1810', '#D4A574', '#F5E6D3', '#8B4513', '#1A0F0A', '#E8D5C4'];
}

/** Wiro olmadan veya hata durumunda URL + meta ile marka kiti oluşturur */
function buildFallbackBrand(domain: string, meta: PageMeta): BrandKit {
  const name = meta.title?.trim() || domainToBrandName(domain);
  const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0];
  const slogan =
    meta.description?.trim() ||
    `${name} için hazırlanan içerik`;
  const logo =
    meta.faviconUrl && (meta.faviconUrl.startsWith('http') || meta.faviconUrl.startsWith('//'))
      ? meta.faviconUrl.startsWith('//')
        ? `https:${meta.faviconUrl}`
        : meta.faviconUrl
      : meta.origin
        ? `${meta.origin}/favicon.ico`
        : `https://${cleanDomain}/favicon.ico`;
  const colors = buildColorPalette(meta.themeColor);
  return {
    name,
    domain: cleanDomain,
    logo,
    colors,
    slogan,
    industry: meta.title ? 'Web' : 'Web',
  };
}

/** LLM bazen tek tırnaklı, virgüllü veya bozuk JSON döner; birkaç düzeltme dene. */
function tryParseJSON(raw: string): Record<string, unknown> {
  let str = raw.trim();
  // Sadece ilk { ... } bloğunu al (LLM bazen açıklama ekliyor)
  const braceStart = str.indexOf('{');
  if (braceStart >= 0) {
    let depth = 0;
    let end = -1;
    for (let i = braceStart; i < str.length; i++) {
      if (str[i] === '{') depth++;
      else if (str[i] === '}') {
        depth--;
        if (depth === 0) {
          end = i;
          break;
        }
      }
    }
    if (end > braceStart) str = str.slice(braceStart, end + 1);
  }
  const attempts = [
    str,
    str.replace(/([{,]\s*)'([^']*)'(\s*):/g, '$1"$2"$3:'),
    str.replace(/,(\s*[}\]])/g, '$1'),
    str.replace(/([{,]\s*)'([^']*)'(\s*):/g, '$1"$2"$3:').replace(/,(\s*[}\]])/g, '$1'),
  ];
  for (const s of attempts) {
    try {
      return JSON.parse(s) as Record<string, unknown>;
    } catch {
      continue;
    }
  }
  throw new SyntaxError('Marka verisi işlenemedi.');
}

function parseBrandKitFromLLM(text: string, fallbackDomain: string, metaTitle?: string): BrandKit {
  // Markdown code block varsa çıkar
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) ?? [null, text];
  const raw = (jsonMatch[1] ?? text).trim();
  const parsed = tryParseJSON(raw);

  const name = typeof parsed.name === 'string' ? parsed.name : fallbackDomain.split('.')[0] || 'Marka';
  const domain = typeof parsed.domain === 'string' ? parsed.domain : fallbackDomain;
  const slogan = typeof parsed.slogan === 'string' ? parsed.slogan : '';
  const industry =
    typeof parsed.industry === 'string' && parsed.industry.trim()
      ? parsed.industry.trim()
      : metaTitle?.trim()
        ? 'Web'
        : '';
  let logo = typeof parsed.logo === 'string' ? parsed.logo : '/mock-logo.svg';
  if (!logo.startsWith('http') && !logo.startsWith('/')) logo = '/mock-logo.svg';

  let colors: string[] = [];
  if (Array.isArray(parsed.colors)) {
    colors = parsed.colors.filter((c): c is string => typeof c === 'string').slice(0, 6);
  }
  if (colors.length === 0) {
    colors = ['#2C1810', '#D4A574', '#F5E6D3', '#8B4513', '#1A0F0A', '#E8D5C4'];
  }

  return { name, domain, logo, colors, slogan, industry };
}

function normalizeDomain(url: string): string {
  const u = url.startsWith('http') ? url : `https://${url}`;
  try {
    return new URL(u).hostname.toLowerCase();
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0] || url;
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const url = typeof body?.url === 'string' ? body.url.trim() : '';
  const normalizedUrl = url ? (url.startsWith('http') ? url : `https://${url}`) : '';
  const domain = normalizedUrl ? normalizeDomain(normalizedUrl) : '';

  const meta = await fetchPageMeta(normalizedUrl || url || 'https://example.com');

  if (!hasWiroKey()) {
    const fallback = buildFallbackBrand(normalizedUrl || url || 'https://example.com', meta);
    return NextResponse.json({ ...fallback, usedFallback: true, error: 'WIRO_API_KEY is not set' });
  }

  const context = [meta.title && `Başlık: ${meta.title}`, meta.description && `Açıklama: ${meta.description}`]
    .filter(Boolean)
    .join('\n');

  const prompt = `Aşağıdaki web sitesi bilgisine göre bir marka kiti JSON'u üret. Sadece geçerli JSON döndür, başka açıklama yazma.

Site: ${normalizedUrl || domain}
${context ? `\n${context}\n` : ''}

Kurallar:
- name: Sitenin gerçek marka/site adı (domain veya başlıktan). Türkçe karakterleri (ı, ş, ğ, ü, ö, ç, İ) doğru kullan.
- slogan: Sitenin başlık ve açıklamasına göre akılda kalıcı, kısa bir Türkçe slogan.
- logo: Site logosu için kullanılabilecek tam URL (https://...) veya favicon: ${meta.faviconUrl || ''}. Bilinmiyorsa "${meta.faviconUrl || '/mock-logo.svg'}" kullan.
- colors: Sitenin hissine uygun tam 6 adet hex renk (# ile).
- industry: Mutlaka doldur; sitenin sektörü/kategorisi (örn. Kahve, E-ticaret, Teknoloji, Web).

Çıktı formatı (tüm alanlar zorunlu, JSON'da industry mutlaka olsun):
{
  "name": "Marka adı",
  "domain": "${domain}",
  "logo": "${meta.faviconUrl || 'https://example.com/favicon.ico'}",
  "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5", "#hex6"],
  "slogan": "Kısa Türkçe slogan",
  "industry": "Sektör / kategori"
}`;

  try {
    const responseText = await runLLMPrompt(prompt);
    const brandKit = parseBrandKitFromLLM(responseText, domain, meta.title);
    return NextResponse.json({ ...brandKit, usedFallback: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Wiro error';
    const errorType = getWiroErrorType(err);
    console.error('[brand-ingest] Wiro error:', errorType, message);
    const fallback = buildFallbackBrand(normalizedUrl || url || domain, meta);
    return NextResponse.json(
      {
        ...fallback,
        usedFallback: true,
        error: message,
        errorType,
        errorDetail:
          errorType === 'auth_error'
            ? 'Wiro API key invalid or rejected. Check WIRO_API_KEY in .env.local and restart the server.'
            : undefined,
      },
      { status: 200 }
    );
  }
}

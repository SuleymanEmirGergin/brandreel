/**
 * Üretilen görselleri diske yazar; disk başarısız olursa aynı process içinde bellek yedeği kullanılır.
 */

import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.next', 'cache', 'generated-images');
const TTL_MS = 60 * 60 * 1000; // 1 saat

const memoryStore = new Map<string, { contentType: string; buffer: Buffer; at: number }>();

function safeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9-_]/g, '_');
}

function getExtension(contentType: string): string {
  if (contentType.includes('png')) return '.png';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) return '.jpg';
  return '.png';
}

function ensureDir(): void {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch (e) {
    console.error('[generated-image-store] mkdir failed:', e);
  }
}

export function setGeneratedImage(
  id: string,
  contentType: string,
  buffer: Buffer
): void {
  const sid = safeId(id);
  memoryStore.set(sid, { contentType, buffer, at: Date.now() });

  ensureDir();
  const ext = getExtension(contentType);
  const filePath = path.join(CACHE_DIR, sid + ext);
  try {
    fs.writeFileSync(filePath, buffer);
  } catch (e) {
    console.error('[generated-image-store] write failed:', e);
  }
}

export function getGeneratedImage(
  id: string
): { contentType: string; buffer: Buffer } | null {
  const sid = safeId(id);

  const mem = memoryStore.get(sid);
  if (mem) {
    if (Date.now() - mem.at > TTL_MS) {
      memoryStore.delete(sid);
      return null;
    }
    return { contentType: mem.contentType, buffer: mem.buffer };
  }

  const base = path.join(CACHE_DIR, sid);
  const candidates = [base + '.png', base + '.jpg'];
  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        if (Date.now() - stat.mtimeMs > TTL_MS) {
          fs.unlinkSync(filePath);
          return null;
        }
        const buffer = fs.readFileSync(filePath);
        const contentType = filePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
        return { contentType, buffer };
      }
    } catch (e) {
      console.error('[generated-image-store] read failed:', e);
    }
  }
  return null;
}

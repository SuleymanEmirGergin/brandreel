import type { GenerationBundle } from './types';

const STORAGE_KEY = 'brandreel_bundle';
const PENDING_KEY = '__BRANDREEL_PENDING_BUNDLE__';

let lastBundle: GenerationBundle | null = null;

function isClient(): boolean {
  return typeof window !== 'undefined';
}

declare global {
  interface Window {
    [PENDING_KEY]?: GenerationBundle | null;
  }
}

export function setBundle(bundle: GenerationBundle | null): void {
  lastBundle = bundle;
  if (isClient()) {
    if (bundle) {
      (window as Window)[PENDING_KEY] = bundle;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
      } catch (e) {
        console.warn('[bundle-store] localStorage set failed (quota?):', e);
      }
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
      } catch {
        // ignore
      }
    } else {
      delete (window as Window)[PENDING_KEY];
      try {
        window.localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }
}

export function getStoredBundle(): GenerationBundle | null {
  if (isClient()) {
    try {
      const pending = (window as Window)[PENDING_KEY];
      if (pending?.brandKit != null && Array.isArray(pending?.images)) {
        lastBundle = pending;
        return pending;
      }
      const fromSession = sessionStorage.getItem(STORAGE_KEY);
      if (fromSession) {
        const parsed = JSON.parse(fromSession) as GenerationBundle;
        if (parsed?.brandKit != null && Array.isArray(parsed?.images)) {
          lastBundle = parsed;
          return parsed;
        }
      }
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GenerationBundle;
        if (parsed?.brandKit != null && Array.isArray(parsed?.images)) {
          lastBundle = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[bundle-store] get failed:', e);
    }
  }
  return lastBundle;
}

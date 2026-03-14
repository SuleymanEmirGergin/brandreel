import type { BrandKit } from './types';

let currentBrand: BrandKit | null = null;

export function setCurrentBrand(brand: BrandKit | null): void {
  currentBrand = brand;
}

export function getCurrentBrand(): BrandKit | null {
  return currentBrand;
}

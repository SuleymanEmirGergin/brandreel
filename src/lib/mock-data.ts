import { BrandKit, Script, ImageResult, VideoResult, GenerationBundle } from './types';

// ========================================
// Mock Brand Kit
// ========================================
export const mockBrandKit: BrandKit = {
  name: 'Mandala Coffee',
  domain: 'mandalacoffee.com',
  logo: '/mock-logo.svg',
  colors: ['#2C1810', '#D4A574', '#F5E6D3', '#8B4513', '#1A0F0A', '#E8D5C4'],
  slogan: 'Her yudumda bir hikaye',
  industry: 'Kahve & İçecek',
};

// ========================================
// Mock Scripts (5 Hooks + CTAs)
// ========================================
export const mockScripts: Script[] = [
  {
    id: 1,
    hook: 'Sabahın ilk ışığında, bir fincan Mandala ☕',
    body: 'El yapımı çekirdeklerimiz, Etiyopya\'nın yüksek tepelerinden İstanbul\'a uzanan bir yolculuk.',
    cta: 'Şimdi Dene → mandalacoffee.com',
  },
  {
    id: 2,
    hook: 'Kahve sadece bir içecek değil, bir ritüel 🌿',
    body: 'Mandala Coffee ile her sabah, kendinize ayırdığınız özel bir an.',
    cta: 'Ritüelini Keşfet →',
  },
  {
    id: 3,
    hook: 'Bu kahvenin arkasında 127 yıllık bir gelenek var',
    body: 'Mandala\'nın özel kavurma tekniği, üç nesil boyunca aktarılan bir ustalık.',
    cta: 'Hikayemizi Oku →',
  },
  {
    id: 4,
    hook: '3 saniyede karar veriyorsun — doğru kahveyi seç ✨',
    body: 'Mandala Coffee: organik, sürdürülebilir, ve damak tadına özel.',
    cta: 'Favorini Bul →',
  },
  {
    id: 5,
    hook: 'Ajansın 3 günde yaptığını biz 90 saniyede yapıyoruz',
    body: 'BrandReel + Mandala Coffee = 20 içerik, sıfır bekleme.',
    cta: 'Hemen Başla →',
  },
];

// ========================================
// Mock Images (20 Visuals)
// ========================================
const gradients = [
  'linear-gradient(135deg, #2C1810 0%, #D4A574 100%)',
  'linear-gradient(135deg, #8B4513 0%, #F5E6D3 100%)',
  'linear-gradient(135deg, #1A0F0A 0%, #D4A574 100%)',
  'linear-gradient(135deg, #D4A574 0%, #E8D5C4 100%)',
  'linear-gradient(135deg, #2C1810 0%, #8B4513 100%)',
];

export const mockImages: ImageResult[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  url: gradients[i % gradients.length],
  prompt: `Brand visual #${i + 1} for Mandala Coffee — ${mockScripts[i % 5].hook}`,
  scriptId: (i % 5) + 1,
}));

// ========================================
// Mock Videos (5 Reels)
// ========================================
export const mockVideos: VideoResult[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  url: '#',
  thumbnailUrl: gradients[i],
  duration: 15,
  scriptId: i + 1,
}));

// ========================================
// Full Bundle
// ========================================
export const mockBundle: GenerationBundle = {
  brandKit: mockBrandKit,
  scripts: mockScripts,
  images: mockImages,
  videos: mockVideos,
  downloadUrl: '#',
  stats: {
    totalImages: 20,
    totalVideos: 5,
    totalTexts: 5,
    generationTime: 92,
    estimatedCost: 0.80,
  },
};

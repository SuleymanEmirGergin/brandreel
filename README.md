# BrandReel

**Markanıza 20 içerik, 90 saniyede.**  
URL'ni yapıştır, marka DNA'nı okusun, fabrika gibi reel üretsin. Wiro AI ile desteklenir.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwind-css)

---

## Özellikler

- **URL ile marka analizi** — Web sitesi URL'si girilir, logo, renkler, slogan ve marka DNA'sı çıkarılır.
- **Toplu içerik üretimi** — 20 görsel + 5 video + 5 kopya metni, tek akışta.
- **ZIP indirme** — Tüm görseller, videolar ve metinler tek ZIP dosyası olarak indirilebilir.
- **Wiro AI entegrasyonu** — Marka analizi ve içerik üretimi Wiro AI ile yapılır.

## Teknolojiler

| Alan        | Teknoloji   |
|------------|-------------|
| Framework  | Next.js 16  |
| UI         | React 19    |
| Stil       | Tailwind CSS v4 |
| Dil        | TypeScript 5 |
| Arşiv      | JSZip       |

## Kurulum

### Gereksinimler

- Node.js 20+
- pnpm (önerilir) veya npm / yarn

### Adımlar

```bash
# Repoyu klonla
git clone https://github.com/SuleymanEmirGergin/brandreel.git
cd brandreel

# Bağımlılıkları yükle
pnpm install
# veya: npm install

# Geliştirme sunucusunu başlat
pnpm dev
# veya: npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

### Ortam değişkenleri

Backend / Wiro AI entegrasyonu kullanıyorsanız `.env.local` dosyası oluşturup gerekli değişkenleri ekleyin. Örnek:

```env
# .env.local (örnek — gerçek anahtarları buraya yazmayın)
# NEXT_PUBLIC_API_URL=https://...
```

## Scripts

| Komut       | Açıklama              |
|------------|------------------------|
| `pnpm dev` | Geliştirme sunucusu    |
| `pnpm build` | Production build     |
| `pnpm start` | Production sunucusu  |
| `pnpm lint` | ESLint kontrolü      |

## Proje yapısı (özet)

```
src/
├── app/           # Next.js App Router (sayfalar, layout)
├── components/    # Navbar, URLInput, ImageGrid, VideoPlayerGrid, vb.
└── lib/           # types, bundle-store, mock-data
```

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

## English

**BrandReel** generates ~20 content assets (images, videos, copy) in ~90 seconds from a brand website URL, powered by Wiro AI. Built with Next.js 16, React 19, Tailwind CSS v4, and TypeScript. Clone, `pnpm install`, `pnpm dev`, and open http://localhost:3000.

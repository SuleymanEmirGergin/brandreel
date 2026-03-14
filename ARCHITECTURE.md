# BrandReel — Backend & Frontend Mimarisi

## Backend (API + servisler)

Tüm backend **Next.js API Routes** ve **server-side lib** içinde.

### API Routes (`src/app/api/`)

| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/brand-ingest` | POST | Site URL'sinden marka çıkarır (Wiro LLM + fallback). Body: `{ url }`. Döner: `BrandKit`. |
| `/api/generate-scripts` | POST | Markaya göre 5 hook + CTA üretir (Wiro LLM). Body: `{ brandKit }`. Döner: `{ hooks, ctas }`. |
| `/api/generate-visuals` | POST | 3 görsel Wiro FLUX ile üretir, diske/belleğe yazar. Body: `{ brandKit, scripts }`. Döner: `{ images }` (url: `/api/generated-image?id=...` veya placehold.co). |
| `/api/generated-image` | GET | Üretilen görseli döndürür. Query: `id`. Disk + bellek yedeği. |
| `/api/generate-videos` | POST | Görsellerden video placeholder üretir. Body: `{ images }`. Döner: `{ videos }`. |
| `/api/proxy-image` | GET | Harici görsel URL'sini proxy'ler. Query: `url`. |
| `/api/bundle` | GET/POST | (Opsiyonel) Bundle CRUD. |

### Lib (server veya paylaşılan)

| Dosya | Açıklama |
|-------|----------|
| `src/lib/wiro.ts` | Wiro API client: `runModel` (LLM), `runImageModel` (FLUX), `runVideoModel` (Seedance), `fetchTaskDetail`, `getImageModelSlug()`. Env: `WIRO_API_KEY`, `WIRO_IMAGE_MODEL`. |
| `src/lib/generated-image-store.ts` | Görsel depolama: disk (`.next/cache/generated-images`) + bellek; `setGeneratedImage`, `getGeneratedImage`. |
| `src/lib/types.ts` | `BrandKit`, `Script`, `ImageResult`, `VideoResult`, `GenerationBundle`, `PipelineStep`. |
| `src/lib/api.ts` | Client tarafı API çağrıları: `brandIngest`, `generateScripts`, `generateVisuals`, `generateVideos`. |
| `src/lib/bundle-store.ts` | Bundle’ı localStorage + `window` pending ile saklar; `setBundle`, `getStoredBundle`. |
| `src/lib/pipeline-store.ts` | Akış state: `setCurrentBrand`, `getCurrentBrand`. |

---

## Frontend (sayfalar + bileşenler)

### Sayfalar (`src/app/`)

| Rota | Dosya | Açıklama |
|------|--------|----------|
| `/` | `page.tsx` | Ana sayfa: URL girişi, “Başlat” ile `/brand-kit` veya pipeline başlatır. |
| `/brand-kit` | `brand-kit/page.tsx` | Marka kiti önizleme (logo, renkler, slogan); “Devam” ile `/generating`. |
| `/generating` | `generating/page.tsx` | Pipeline: analyze → script → visual → video → package. Scripts/images/videos API’den alınır, bundle oluşturulup `setBundle` + `/results`’a yönlendirilir. |
| `/results` | `results/page.tsx` | Sonuç: `getStoredBundle()` ile bundle; ImageGrid, VideoPlayerGrid, metinler, ZIP indir. |

### Bileşenler (`src/components/`)

| Bileşen | Açıklama |
|---------|----------|
| `Navbar` | Üst menü, logo, “Powered by Wiro AI”. |
| `URLInput` | Site URL girişi. |
| `StepProgressBar` | Generating sayfasında adım çubuğu. |
| `ColorSwatchRow` | Marka renk paleti. |
| `ImageGrid` | Görsel grid; `/api/generated-image`, data URL veya proxy; hata durumunda fallback. |
| `VideoPlayerGrid` | Video kartları. |
| `CopyTextButton` | Metin kopyalama. |

---

## Veri akışı (özet)

1. **Ana sayfa** → Kullanıcı URL girer → `brandIngest(url)` → marka kiti → `/brand-kit`.
2. **Brand-kit** → `getCurrentBrand()` ile marka gösterilir → “Devam” → `/generating`.
3. **Generating**  
   - Script: `generateScripts(brandKit)` → `apiScripts`.  
   - Visual: `generateVisuals(brandKit, apiScripts)` → `apiImages` (Wiro + store).  
   - Video: `generateVideos(apiImages)` → `apiVideos`.  
   - Package: `scriptsRef` + `imagesRef` + `videosRef` → bundle → `setBundle(bundle)` → `router.push('/results')`.
4. **Results** → `getStoredBundle()` (pending veya localStorage) → bundle → ImageGrid / VideoPlayerGrid / metinler / ZIP.

---

## Ortam değişkenleri

- `WIRO_API_KEY` — Wiro API anahtarı (zorunlu).
- `WIRO_IMAGE_MODEL` — (Opsiyonel) Görsel model slug; yoksa FLUX.
- `WIRO_USE_X_API_KEY` — (Opsiyonel) `true` = x-api-key header.

Backend görsel üretimi ve depolama; frontend sadece API’yi çağırıp bundle’ı saklayıp sonuç sayfasında gösterir.

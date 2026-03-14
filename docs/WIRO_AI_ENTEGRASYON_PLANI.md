# BrandReel — Wiro.ai API Entegrasyon Planı

Bu dokümanda Wiro.ai üzerinden gerçek API bağlantıları için adım adım plan ve **kullanılacak modeller** yer alıyor. Bu modellere uygun API key / erişimleri Wiro.ai panelinden sağlayabilirsiniz.

---

## 1. Genel Mimari

```
[Frontend] → [Next.js API Routes] → [Wiro.ai API]
                    ↓
            WIRO_API_KEY (env)
```

- Tüm Wiro çağrıları **sadece sunucu tarafında** (API route’larında) yapılacak; API key client’a gönderilmeyecek.
- Ortam değişkeni: `WIRO_API_KEY` (ve gerekirse `WIRO_BASE_URL`).

---

## 2. Kararlar (netleştirildi)

- **API key:** Sadece Wiro.ai key’leri; başka key yapısı yok. Tek `WIRO_API_KEY`.
- **Video akışı:** Önce görsel (text-to-image), sonra **görselden video** (image-to-video). Text-to-video kullanılmıyor.
- **LLM:** **Google Gemini 3 Pro** (marka analizi + script üretimi).

---

## 3. Pipeline Adımları ve Kullanılacak Modeller

| Adım | Mevcut route | Wiro kullanımı | Model (Wiro slug) |
|------|----------------|----------------|--------------------|
| **1. Marka analizi** | `POST /api/brand-ingest` | URL / site içeriğinden marka bilgisi çıkarma | **LLM:** `google/gemini-3-pro` |
| **2. Script üretimi** | `POST /api/generate-scripts` | Hook + CTA metinleri (Türkçe) | **LLM:** `google/gemini-3-pro` |
| **3. Görsel üretimi** | `POST /api/generate-visuals` | 20 adet marka görseli (text-to-image) | **Text-to-Image:** `bytedance/seedream-v5-lite` |
| **4. Video üretimi** | `POST /api/generate-videos` | 5 adet reel: **görsel → video** (image-to-video) | **Image-to-Video:** `lightricks/ltx-2-3` veya `klingai/kling-v3-motion-control` |
| **5. Bundle** | `POST /api/bundle` | Sadece toplama; Wiro yok | — |

---

## 4. Kullanılacak Modeller (tek API key)

### 4.1. LLM — Google Gemini 3 Pro

Marka analizi ve script (hook/CTA) üretimi. Wiro slug: `google/gemini-3-pro`.

### 4.2. Text-to-Image (Generate Visuals)

20 marka görseli. Wiro slug: `bytedance/seedream-v5-lite` (veya `bytedance/seedream-v5-lite-uncensored`).

### 4.3. Image-to-Video (Generate Videos)

**Kullanım:** Önce üretilen 20 görselden 5 tanesi seçilir; her biri **görselden video** (image-to-video) ile 5 reel’e dönüştürülür.

| Önerilen model | Wiro slug |
|----------------|-----------|
| **Lightricks LTX-2.3** | `lightricks/ltx-2-3` |
| **Kling V3 Motion Control** | `klingai/kling-v3-motion-control` |

Akış: **Görsel URL’leri** → Image-to-Video model → video URL’leri.

---

## 5. API Key ve Ortam Değişkenleri

Wiro genelde **tek API key** ile tüm modellere erişim verir. Key’i dashboard’dan alıp projede kullanacağız.

| Değişken | Zorunlu | Açıklama |
|----------|--------|----------|
| `WIRO_API_KEY` | Evet | Wiro.ai API key (panelden alınacak). |
| `WIRO_BASE_URL` | Hayır | Varsayılan: `https://api.wiro.ai` (değişmezse eklemenize gerek yok). |

**.env.local örneği:**

```env
WIRO_API_KEY=your_wiro_api_key_here
```

---

## 6. Uygulama Fazları

### Faz 1 — Altyapı (env + Wiro client)
- [ ] `.env.local` içinde `WIRO_API_KEY` tanımlanması.
- [ ] Sunucu tarafında Wiro API client’ı (tek bir `lib/wiro.ts` veya `lib/wiro-client.ts`):
  - Base URL: `https://api.wiro.ai/v1`
  - Header: `Authorization: Bearer <WIRO_API_KEY>` (veya Wiro dokümantasyonundaki tam format).
- [ ] `POST /api/wiro/run` veya doğrudan route’larda `Run` çağrısı için ortak bir `runModel(modelSlug, body)` helper’ı.

### Faz 2 — Brand Ingest (LLM)
- [ ] `POST /api/brand-ingest`: İsteğe bağlı: URL’den sayfa içeriği/meta çekme (fetch + basit parse veya 3. parti scraper).
- [ ] LLM’e prompt: “Şu marka/site bilgisine göre JSON döndür: name, domain, logo, colors (hex), slogan, industry.”
- [ ] Seçilen model: `google/gemini-3-pro` veya `qwen/qwen3-5-27b` (Wiro’daki güncel slug’a göre güncellenecek).

### Faz 3 — Generate Scripts (LLM)
- [ ] `POST /api/generate-scripts`: Body’de `brandKit` (ve isteğe bağlı `url`) alınacak.
- [ ] Aynı LLM ile Türkçe 5 hook + 5 CTA üretimi; cevap JSON’a parse edilip `{ hooks, ctas }` olarak döndürülecek.

### Faz 4 — Generate Visuals (Text-to-Image)
- [ ] `POST /api/generate-visuals`: Body’de `brandKit` + `scripts` (veya en azından hook metinleri) alınacak.
- [ ] Model: `bytedance/seedream-v5-lite` (veya `seedream-v5-lite-uncensored`).
- [ ] Her hook için bir görsel isteği (veya batch varsa batch); toplam 20 görsel.
- [ ] Çıktı: `{ images: [{ id, url, prompt, scriptId }] }` (mevcut type’larla uyumlu).

### Faz 5 — Generate Videos (Image-to-Video)
- [ ] `POST /api/generate-videos`: Body’de `images` (generate-visuals çıktısı) zorunlu; her görsel URL’i image-to-video’ya gidecek.
- [ ] Model: `lightricks/ltx-2-3` veya `klingai/kling-v3-motion-control`.
- [ ] 5 görsel → 5 video (scriptId eşlemesi korunacak).
- [ ] Çıktı: `{ videos: [{ id, url, thumbnailUrl, duration, scriptId }] }`.

### Faz 6 — Bundle ve son düzenlemeler
- [ ] `POST /api/bundle`: Brand ingest + scripts + visuals + videos çıktılarını toplayıp tek `GenerationBundle` döndürme (mevcut yapı korunacak).
- [ ] Hata yönetimi: Wiro hata kodları ve timeout’lar için kullanıcıya anlamlı mesajlar.
- [ ] İsteğe bağlı: Rate limit / kuyruk (çok sayıda görsel/video isteği için).

---

## 7. Özet — Tek Wiro API Key ile Kullanılacak Modeller

| # | Kategori | Model (slug) | Amaç |
|---|-----------|-------------|------|
| 1 | **LLM & Chat** | `google/gemini-3-pro` | Brand ingest + script (hook/CTA) |
| 2 | **Text-to-Image** | `bytedance/seedream-v5-lite` | 20 marka görseli |
| 3 | **Image-to-Video** | `lightricks/ltx-2-3` veya `klingai/kling-v3-motion-control` | 5 reel (görsel → video) |

Tek `WIRO_API_KEY` ile hepsi kullanılacak; başka key yapısı yok.

---

## 8. Sonraki Adım

1. Wiro.ai dashboard’dan API key alıp `.env.local`’a `WIRO_API_KEY` olarak ekleyin.  
2. Faz 1 (Wiro client) + Faz 2 (brand-ingest LLM) uygulandıktan sonra sırayla script, visual ve image-to-video entegrasyonları eklenebilir.

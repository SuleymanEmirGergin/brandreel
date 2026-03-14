'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import StepProgressBar from '@/components/StepProgressBar';
import { PipelineStep, ImageResult, Script, VideoResult } from '@/lib/types';
import type { BrandKit } from '@/lib/types';
import { generateScripts, generateVisuals, generateVideos } from '@/lib/api';
import { setBundle } from '@/lib/bundle-store';
import { getCurrentBrand } from '@/lib/pipeline-store';
import { mockBrandKit } from '@/lib/mock-data';
import { mockImages, mockScripts } from '@/lib/mock-data';

const STEP_ORDER: PipelineStep[] = ['analyze', 'script', 'visual', 'video', 'package'];
// Görsel ve video adımları sadece API cevabı gelince ilerliyor; fallback uzun (Wiro bitene kadar bekle)
const STEP_DURATIONS: Record<PipelineStep, number> = {
  analyze: 2000,
  script: 32000,
  visual: 300000, // 5 dk — görseller gelmeden ilerleme
  video: 300000,  // 5 dk — videolar gelmeden ilerleme (API bitince data-ready effect ilerletir)
  package: 2000,
};
const STEP_MESSAGES: Record<PipelineStep, string[]> = {
  analyze: ['Marka web sitesi analiz ediliyor...', 'Logo ve renkler çıkarılıyor...', 'Marka DNA\'sı oluşturuluyor...'],
  script: ['Hook metinleri üretiliyor...', '5 farklı CTA yazılıyor...', 'İçerik stratejisi oluşturuluyor...'],
  visual: ['Görsel promptları hazırlanıyor...', 'Wiro AI Image API çağrılıyor...', 'Batch görsel üretimi devam ediyor...'],
  video: ['Video kompozisyon başladı...', '15 saniyelik reeller oluşturuluyor...', 'Ses ve efektler ekleniyor...'],
  package: ['Tüm içerikler paketleniyor...', 'ZIP dosyası hazırlanıyor...', 'İndirme bağlantısı oluşturuluyor...'],
};

export default function GeneratingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<PipelineStep>('analyze');
  const [completedSteps, setCompletedSteps] = useState<PipelineStep[]>([]);
  const [previewImages, setPreviewImages] = useState<ImageResult[]>([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [apiScripts, setApiScripts] = useState<Script[] | null>(null);
  const [apiImages, setApiImages] = useState<ImageResult[] | null>(null);
  const [apiVideos, setApiVideos] = useState<VideoResult[] | null>(null);
  const bundleFetched = useRef(false);
  const scriptsRef = useRef<Script[] | null>(null);
  const imagesRef = useRef<ImageResult[] | null>(null);
  const videosRef = useRef<VideoResult[] | null>(null);
  scriptsRef.current = apiScripts;
  imagesRef.current = apiImages;
  videosRef.current = apiVideos;

  const brandKit: BrandKit = getCurrentBrand() ?? mockBrandKit;

  const advanceStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep(STEP_ORDER[currentIndex + 1]);
      setMessageIndex(0);
      setProgress(0);
    } else {
      setCompletedSteps((prev) => [...prev, currentStep]);
      if (!bundleFetched.current) {
        bundleFetched.current = true;
        const scripts = scriptsRef.current ?? [];
        const images = imagesRef.current ?? [];
        const videos = videosRef.current ?? [];
        const bundleBrand = getCurrentBrand() ?? brandKit;
        const bundle = {
          brandKit: bundleBrand,
          scripts,
          images,
          videos,
          downloadUrl: '#',
          stats: {
            totalImages: images.length,
            totalVideos: videos.length,
            totalTexts: scripts.length,
            generationTime: 92,
            estimatedCost: 0.8,
          },
        };
        setBundle(bundle);
        setTimeout(() => router.push('/results'), 1000);
      }
    }
  }, [currentStep, router]);

  // Fetch scripts when entering script step (markaya göre)
  useEffect(() => {
    if (currentStep === 'script' && !apiScripts) {
      generateScripts(brandKit).then(setApiScripts);
    }
  }, [currentStep, apiScripts]);

  // Fetch images when entering visual step (marka + script’lere göre)
  useEffect(() => {
    const scripts = apiScripts ?? [];
    if (currentStep === 'visual' && !apiImages && scripts.length >= 3) {
      generateVisuals(brandKit, scripts)
        .then((images) => {
          const list = Array.isArray(images) && images.length > 0 ? images : [];
          setApiImages(list);
          imagesRef.current = list;
        })
        .catch((err) => {
          console.error('[generating] generateVisuals failed:', err);
          const placeholders: ImageResult[] = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            url: `https://placehold.co/800x800/2C1810/ffffff?text=Visual+${i + 1}`,
            prompt: `Görsel ${i + 1}`,
            scriptId: (i % 5) + 1,
          }));
          setApiImages(placeholders);
          imagesRef.current = placeholders;
        });
    }
  }, [currentStep, apiImages, apiScripts, brandKit]);

  // Fetch videos when entering video step (görsellerden)
  useEffect(() => {
    if (currentStep === 'video' && !apiVideos && apiImages?.length) {
      generateVideos(apiImages)
        .then((list) => {
          setApiVideos(list);
          videosRef.current = list;
        })
        .catch((err) => {
          console.error('[generating] generateVideos failed:', err);
          const fallback: VideoResult[] = Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            url: '#',
            thumbnailUrl: 'linear-gradient(135deg, #2C1810, #D4A574)',
            duration: 15,
            scriptId: i + 1,
          }));
          setApiVideos(fallback);
          videosRef.current = fallback;
        });
    }
  }, [currentStep, apiVideos, apiImages]);

  // Veri hazır olunca bir sonraki adıma geç (script → script bitti; visual → görseller bitti; video → videolar bitti)
  useEffect(() => {
    if (currentStep === 'script' && apiScripts != null && apiScripts.length >= 3) {
      const t = setTimeout(advanceStep, 1500);
      return () => clearTimeout(t);
    }
    if (currentStep === 'visual' && apiImages != null && apiImages.length > 0) {
      const t = setTimeout(advanceStep, 1500);
      return () => clearTimeout(t);
    }
    if (currentStep === 'video' && apiVideos != null && apiVideos.length > 0) {
      const t = setTimeout(advanceStep, 1500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [currentStep, advanceStep, apiScripts, apiImages, apiVideos]);

  // Fallback: sabit süre sonra da ilerle (API takılırsa)
  useEffect(() => {
    const duration = STEP_DURATIONS[currentStep];
    const timer = setTimeout(advanceStep, duration);
    return () => clearTimeout(timer);
  }, [currentStep, advanceStep]);

  // Message rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        const messages = STEP_MESSAGES[currentStep];
        return (prev + 1) % messages.length;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [currentStep]);

  // Progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 15, 95));
    }, 300);
    return () => clearInterval(interval);
  }, [currentStep]);

  // Add preview images during visual step (from API or mock)
  useEffect(() => {
    if (currentStep === 'visual') {
      const interval = setInterval(() => {
        setPreviewImages((prev) => {
          const source = apiImages?.length ? apiImages : mockImages;
          if (prev.length >= Math.min(6, source.length)) return prev;
          return [...prev, source[prev.length]];
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [currentStep, apiImages]);

  const currentMessages = STEP_MESSAGES[currentStep];
  const stepsDone = completedSteps.length;
  const totalSteps = STEP_ORDER.length;
  const overallProgress = Math.round(
    ((stepsDone + progress / 100) / totalSteps) * 100
  );

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 100,
          padding: '100px var(--space-6) var(--space-10)',
        }}
      >
        {/* Overall progress */}
        <div
          className="animate-fade-in"
          style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            marginBottom: 'var(--space-3)',
          }}
        >
          Genel İlerleme: {overallProgress}%
        </div>

        {/* Overall progress bar */}
        <div
          style={{
            width: '100%',
            maxWidth: 400,
            height: 4,
            background: 'var(--border-default)',
            borderRadius: 2,
            marginBottom: 'var(--space-10)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${overallProgress}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
              borderRadius: 2,
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Step Progress Bar */}
        <StepProgressBar currentStep={currentStep} completedSteps={completedSteps} />

        {/* Current operation message */}
        <div
          style={{
            marginTop: 'var(--space-10)',
            textAlign: 'center',
          }}
        >
          <p
            key={`${currentStep}-${messageIndex}`}
            className="animate-fade-in"
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-2)',
            }}
          >
            {currentMessages[messageIndex]}
          </p>
          <p
            style={{
              fontSize: 14,
              color: 'var(--text-muted)',
            }}
          >
            {brandKit.name} için içerik üretiliyor
          </p>
        </div>

        {/* Live preview images */}
        {previewImages.length > 0 && (
          <div
            style={{
              marginTop: 'var(--space-10)',
              width: '100%',
              maxWidth: 700,
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                marginBottom: 'var(--space-4)',
                textAlign: 'center',
              }}
            >
              Canlı Önizleme
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--space-3)',
              }}
            >
              {previewImages.map((img, index) => (
                <div
                  key={img.id}
                  className="animate-scale-in"
                  style={{
                    aspectRatio: '1',
                    borderRadius: 'var(--radius-md)',
                    ...(img.url.startsWith('http')
                      ? { backgroundImage: `url(${img.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { background: img.url }),
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      left: 6,
                      fontSize: 10,
                      background: 'rgba(0,0,0,0.6)',
                      borderRadius: 4,
                      padding: '2px 6px',
                      color: 'white',
                    }}
                  >
                    #{img.id}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Script preview during script step */}
        {currentStep === 'script' && (
          <div
            className="glass animate-fade-in"
            style={{
              marginTop: 'var(--space-8)',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: 500,
              width: '100%',
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                marginBottom: 'var(--space-3)',
                fontWeight: 600,
                letterSpacing: '0.08em',
              }}
            >
              HOOK ÖNİZLEME
            </p>
            {(apiScripts ?? mockScripts).slice(0, 2).map((script) => (
              <div
                key={script.id}
                style={{
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-primary)',
                  marginBottom: 'var(--space-2)',
                  fontSize: 14,
                  color: 'var(--text-primary)',
                }}
              >
                {script.hook}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

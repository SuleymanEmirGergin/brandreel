'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ColorSwatchRow from '@/components/ColorSwatchRow';
import { brandIngest, type BrandIngestResponse } from '@/lib/api';
import { setCurrentBrand } from '@/lib/pipeline-store';
import type { BrandKit } from '@/lib/types';
import { mockBrandKit } from '@/lib/mock-data';

function BrandKitContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url') || '';

  const [isEditing, setIsEditing] = useState(false);
  const [brand, setBrand] = useState<BrandIngestResponse | null>(null);
  const [brandLoading, setBrandLoading] = useState(true);
  const [brandError, setBrandError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  useEffect(() => {
    if (!url.trim()) {
      setBrand({ ...mockBrandKit, usedFallback: true });
      setBrandLoading(false);
      return;
    }
    let cancelled = false;
    setBrandLoading(true);
    setBrandError(null);
    brandIngest(url.trim())
      .then((data) => {
        if (!cancelled) setBrand(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setBrandError(err instanceof Error ? err.message : 'Marka yüklenemedi');
          setBrand({ ...mockBrandKit, usedFallback: true, error: err instanceof Error ? err.message : undefined });
        }
      })
      .finally(() => {
        if (!cancelled) setBrandLoading(false);
      });
    return () => { cancelled = true; };
  }, [url]);

  const handleConfirm = () => {
    setIsLoading(true);
    const colorsToUse = selectedColors.length > 0 ? selectedColors : displayBrand.colors;
    setCurrentBrand({ ...displayBrand, colors: colorsToUse });
    setTimeout(() => {
      router.push('/generating');
    }, 800);
  };

  const displayBrand: BrandKit = brand
    ? {
        name: brand.name,
        domain: brand.domain,
        logo: brand.logo,
        colors: Array.isArray(brand.colors) && brand.colors.length > 0 ? brand.colors : mockBrandKit.colors,
        slogan: brand.slogan ?? '',
        industry: brand.industry ?? '',
      }
    : mockBrandKit;

  useEffect(() => {
    if (displayBrand.colors?.length) setSelectedColors(displayBrand.colors);
  }, [displayBrand.colors?.join(',')]);

  const usedFallback = brand?.usedFallback === true;
  const fallbackError = brand?.error;

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
        {/* Source URL badge */}
        <div
          className="glass animate-fade-in"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: 13,
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-8)',
          }}
        >
          🔗 {url || 'example.com'}
        </div>

        {(brandError || usedFallback) && (
          <p
            className="animate-fade-in"
            style={{
              fontSize: 13,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-4)',
              textAlign: 'center',
            }}
          >
            {brandError ?? (fallbackError && !/JSON|parse|Expected|timeout|time out/i.test(fallbackError) ? fallbackError : 'Marka verisi otomatik işlenemedi') ?? 'Wiro kullanılamadı'} — varsayılan marka gösteriliyor, düzenleyip devam edebilirsiniz.
          </p>
        )}

        {brandLoading ? (
          <div
            style={{
              width: '100%',
              maxWidth: 580,
              padding: 'var(--space-10)',
              textAlign: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <div className="skeleton" style={{ width: 200, height: 32, margin: '0 auto var(--space-4)' }} />
            <div className="skeleton" style={{ width: 320, height: 24, margin: '0 auto' }} />
          </div>
        ) : (
        <>
        <h1
          className="animate-fade-in-up"
          style={{
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: 'var(--space-2)',
            letterSpacing: '-0.02em',
          }}
        >
          Marka Kiti Hazır ✨
        </h1>
        <p
          className="animate-fade-in"
          style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginBottom: 'var(--space-10)',
            animationDelay: '0.1s',
            opacity: 0,
          }}
        >
          Otomatik çıkarılan marka bilgilerinizi kontrol edin
        </p>

        {/* Brand Kit Card */}
        <div
          className="glass-strong animate-fade-in-up"
          style={{
            width: '100%',
            maxWidth: 580,
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-8)',
            animationDelay: '0.2s',
            opacity: 0,
          }}
        >
          {/* Logo + Name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-6)',
            }}
          >
            {displayBrand.logo && (displayBrand.logo.startsWith('http://') || displayBrand.logo.startsWith('https://')) ? (
              <img
                src={displayBrand.logo}
                alt=""
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 'var(--radius-lg)',
                  objectFit: 'contain',
                  backgroundColor: displayBrand.colors[0] || 'var(--bg-surface)',
                  padding: 4,
                  boxShadow: `0 4px 16px ${(displayBrand.colors[0] || '#333')}40`,
                }}
              />
            ) : (
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 'var(--radius-lg)',
                  background: `linear-gradient(135deg, ${displayBrand.colors[0]}, ${displayBrand.colors[1]})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 800,
                  color: 'white',
                  boxShadow: `0 4px 16px ${displayBrand.colors[0]}40`,
                }}
              >
                {displayBrand.name.charAt(0)}
              </div>
            )}
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>{displayBrand.name}</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                {displayBrand.industry} · {displayBrand.domain}
              </p>
            </div>
          </div>

          {/* Slogan */}
          <div
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              borderLeft: '3px solid var(--accent)',
              marginBottom: 'var(--space-6)',
            }}
          >
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
              SLOGAN
            </p>
            <p style={{ fontSize: 16, fontStyle: 'italic', color: 'var(--text-primary)' }}>
              &ldquo;{displayBrand.slogan}&rdquo;
            </p>
          </div>

          {/* Color Palette */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <p
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                marginBottom: 'var(--space-4)',
                fontWeight: 600,
                letterSpacing: '0.08em',
              }}
            >
              RENK PALETİ
            </p>
            <p
              style={{
                fontSize: 12,
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Video ve görseller bu renklere göre üretilir. Kullanmak istediğin renkleri seç (hepsi varsayılan).
            </p>
            <ColorSwatchRow
              colors={displayBrand.colors}
              size={52}
              selectedColors={selectedColors}
              onSelectionChange={setSelectedColors}
            />
          </div>

          {/* Manual Edit Form (hidden by default) */}
          {isEditing && (
            <div
              className="animate-fade-in"
              style={{
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                marginBottom: 'var(--space-6)',
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Manuel düzenleme formu (yakında)
              </p>
              <div
                style={{
                  display: 'grid',
                  gap: 'var(--space-3)',
                }}
              >
                <input
                  placeholder="Marka adı"
                  defaultValue={displayBrand.name}
                  style={{
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontFamily: 'var(--font-sans)',
                  }}
                />
                <input
                  placeholder="Slogan"
                  defaultValue={displayBrand.slogan}
                  style={{
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontFamily: 'var(--font-sans)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-2)',
            }}
          >
            <button
              id="confirm-brand-kit"
              onClick={handleConfirm}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: 'none',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))',
                color: 'white',
                fontSize: 15,
                fontWeight: 700,
                cursor: isLoading ? 'wait' : 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'var(--transition-fast)',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Başlatılıyor...' : 'Bu doğru, üret! →'}
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{
                padding: 'var(--space-4) var(--space-5)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'var(--transition-fast)',
              }}
            >
              {isEditing ? 'Kapat' : 'Düzenle'}
            </button>
          </div>
        </div>
        </>
        )}
      </main>
    </>
  );
}

export default function BrandKitPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="skeleton" style={{ width: 300, height: 40 }} />
        </div>
      }
    >
      <BrandKitContent />
    </Suspense>
  );
}

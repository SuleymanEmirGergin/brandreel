'use client';

import { useState, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import Navbar from '@/components/Navbar';
import ImageGrid from '@/components/ImageGrid';
import VideoPlayerGrid from '@/components/VideoPlayerGrid';
import CopyTextButton from '@/components/CopyTextButton';
import { getStoredBundle } from '@/lib/bundle-store';
import { mockBundle } from '@/lib/mock-data';
import type { GenerationBundle } from '@/lib/types';

export default function ResultsPage() {
  const [bundle, setBundle] = useState(mockBundle);
  const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'texts'>('images');
  const [zipLoading, setZipLoading] = useState(false);

  useEffect(() => {
    const stored = getStoredBundle();
    if (stored?.brandKit != null) {
      setBundle(stored);
    }
  }, []);

  const downloadZip = useCallback(async () => {
    const b = bundle as GenerationBundle;
    setZipLoading(true);
    try {
      const zip = new JSZip();
      const imgFolder = zip.folder('gorseller');
      for (const img of b.images) {
        const ext = img.url.includes('png') ? 'png' : img.url.includes('jpeg') || img.url.includes('jpg') ? 'jpg' : 'png';
        const name = `gorsel-${img.id}.${ext}`;
        if (img.url.startsWith('data:')) {
          try {
            const base64 = img.url.split(',')[1];
            if (base64) imgFolder?.file(name, base64, { base64: true });
          } catch {
            imgFolder?.file(name + '.txt', 'Data URL could not be extracted');
          }
        } else if (img.url.startsWith('/')) {
          try {
            const res = await fetch(img.url);
            if (res.ok) {
              const blob = await res.blob();
              imgFolder?.file(name, blob);
            }
          } catch {
            imgFolder?.file(name + '.txt', 'Could not fetch image');
          }
        } else if (img.url.startsWith('http')) {
          try {
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(img.url)}`;
            const res = await fetch(proxyUrl);
            if (res.ok) {
              const blob = await res.blob();
              imgFolder?.file(name, blob);
            }
          } catch {
            imgFolder?.file(name + '.txt', `URL: ${img.url}\n(paste in browser to download)`);
          }
        }
      }
      const metinFolder = zip.folder('metinler');
      b.scripts.forEach((s, i) => {
        metinFolder?.file(`${i + 1}-hook-cta.txt`, `${s.hook}\n\n${s.body || ''}\n\n${s.cta}`);
      });
      zip.file('README.txt', `${b.brandKit.name} — ${b.stats.totalImages} görsel, ${b.stats.totalVideos} video, ${b.stats.totalTexts} metin.\n\nGörseller: gorseller/\nMetinler: metinler/`);
      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `brandreel-${b.brandKit.name.replace(/\s+/g, '-')}-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error('ZIP failed:', e);
    } finally {
      setZipLoading(false);
    }
  }, [bundle]);

  const { brandKit, scripts, images, videos, stats } = bundle;

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: '100vh',
          paddingTop: 80,
          padding: '80px var(--space-6) var(--space-10)',
        }}
      >
        {/* Success header */}
        <div
          className="animate-fade-in-up"
          style={{
            textAlign: 'center',
            marginBottom: 'var(--space-8)',
            paddingTop: 'var(--space-6)',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--success), #34D399)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              margin: '0 auto var(--space-4)',
              boxShadow: '0 0 30px rgba(74, 222, 128, 0.3)',
            }}
          >
            ✓
          </div>
          <h1
            style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: 'var(--space-2)',
            }}
          >
            İçerikleriniz Hazır! 🎉
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
            {brandKit.name} için {stats.totalImages + stats.totalVideos + stats.totalTexts} içerik üretildi
          </p>
        </div>

        {/* Stats bar */}
        <div
          className="glass-strong animate-fade-in"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-8)',
            padding: 'var(--space-5) var(--space-8)',
            borderRadius: 'var(--radius-xl)',
            maxWidth: 700,
            margin: '0 auto var(--space-8)',
            flexWrap: 'wrap',
            animationDelay: '0.2s',
            opacity: 0,
          }}
        >
          {[
            { value: stats.totalImages, label: 'Görsel', icon: '🎨' },
            { value: stats.totalVideos, label: 'Video', icon: '🎬' },
            { value: stats.totalTexts, label: 'Kopya Metni', icon: '✍️' },
            { value: `${stats.generationTime}s`, label: 'Süre', icon: '⚡' },
            { value: `$${stats.estimatedCost}`, label: 'Maliyet', icon: '💰' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center', minWidth: 80 }}>
              <div style={{ fontSize: 12, marginBottom: 2 }}>{stat.icon}</div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: 'var(--accent)',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Download CTA */}
        <div
          className="animate-fade-in"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'var(--space-10)',
            animationDelay: '0.3s',
            opacity: 0,
          }}
        >
          <button
            id="download-zip"
            type="button"
            disabled={zipLoading}
            onClick={downloadZip}
            style={{
              padding: 'var(--space-4) var(--space-10)',
              borderRadius: 'var(--radius-xl)',
              border: 'none',
              background: zipLoading
                ? 'var(--bg-surface)'
                : 'linear-gradient(135deg, var(--accent), var(--accent-hover), #FFB347)',
              color: 'white',
              fontSize: 18,
              fontWeight: 700,
              cursor: zipLoading ? 'wait' : 'pointer',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 4px 24px rgba(255, 107, 107, 0.4)',
              transition: 'var(--transition-default)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              opacity: zipLoading ? 0.8 : 1,
            }}
            onMouseEnter={(e) => {
              if (zipLoading) return;
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(255, 107, 107, 0.5)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(255, 107, 107, 0.4)';
            }}
          >
            {zipLoading ? '⏳ Hazırlanıyor...' : `📦 ZIP İndir (${stats.totalImages} görsel + ${stats.totalVideos} video)`}
          </button>
        </div>

        {/* Tab navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-6)',
            maxWidth: 1200,
            margin: '0 auto var(--space-6)',
          }}
        >
          {[
            { key: 'images' as const, label: `🎨 Görseller (${stats.totalImages})` },
            { key: 'videos' as const, label: `🎬 Videolar (${stats.totalVideos})` },
            { key: 'texts' as const, label: `✍️ Metinler (${stats.totalTexts})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: 'var(--space-3) var(--space-5)',
                borderRadius: 'var(--radius-full)',
                border: activeTab === tab.key
                  ? '1px solid var(--accent)'
                  : '1px solid var(--border-default)',
                background: activeTab === tab.key
                  ? 'var(--accent-glow)'
                  : 'transparent',
                color: activeTab === tab.key
                  ? 'var(--accent)'
                  : 'var(--text-secondary)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                transition: 'var(--transition-fast)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
          }}
        >
          {activeTab === 'images' && (
            <div className="animate-fade-in">
              <ImageGrid images={images} scripts={scripts} />
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="animate-fade-in">
              <VideoPlayerGrid videos={videos ?? []} />
            </div>
          )}

          {activeTab === 'texts' && (
            <div
              className="animate-fade-in stagger-children"
              style={{
                display: 'grid',
                gap: 'var(--space-4)',
                maxWidth: 600,
                margin: '0 auto',
              }}
            >
              {scripts.map((script) => (
                <div
                  key={script.id}
                  className="glass"
                  style={{
                    padding: 'var(--space-5)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: 'var(--accent)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      HOOK #{script.id}
                    </span>
                    <CopyTextButton
                      text={`${script.hook}\n\n${script.body}\n\n${script.cta}`}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      marginBottom: 'var(--space-2)',
                      lineHeight: 1.4,
                    }}
                  >
                    {script.hook}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--space-3)',
                      lineHeight: 1.5,
                    }}
                  >
                    {script.body}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--accent)',
                    }}
                  >
                    {script.cta}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Schedule Teaser */}
        <section
          className="glass-strong"
          style={{
            maxWidth: 600,
            margin: 'var(--space-16) auto 0',
            padding: 'var(--space-8)',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Coming soon badge */}
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'var(--accent-glow)',
              border: '1px solid var(--accent)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px',
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--accent)',
            }}
          >
            Yakında
          </div>

          <div style={{ fontSize: 40, marginBottom: 'var(--space-4)' }}>📅</div>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 'var(--space-2)',
            }}
          >
            Otomatik Üretim
          </h3>
          <p
            style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-6)',
              lineHeight: 1.5,
            }}
          >
            Her Pazartesi sabahı otomatik olarak yeni içerik paketi üretin.
            Cron zamanlaması ayarlayın, gerisini BrandReel halleder.
          </p>

          {/* Toggle mockup */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-3)',
              opacity: 0.5,
            }}
          >
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Her Pazartesi otomatik üret
            </span>
            <div
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                background: 'var(--border-default)',
                position: 'relative',
                cursor: 'not-allowed',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'var(--text-muted)',
                  position: 'absolute',
                  top: 2,
                  left: 2,
                }}
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            textAlign: 'center',
            marginTop: 'var(--space-16)',
            padding: 'var(--space-6)',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            BrandReel · Powered by Wiro AI · Hackathon 2026
          </p>
        </footer>
      </main>
    </>
  );
}

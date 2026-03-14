'use client';

import { ImageResult, Script } from '@/lib/types';
import CopyTextButton from './CopyTextButton';
import { useState } from 'react';

interface ImageGridProps {
  images: ImageResult[];
  scripts: Script[];
}

const FALLBACK_GRADIENT = 'linear-gradient(135deg, #2C1810 0%, #D4A574 50%, #8B4513 100%)';

export default function ImageGrid({ images, scripts }: ImageGridProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [failedIds, setFailedIds] = useState<Set<number>>(new Set());

  const markFailed = (id: number) => {
    setFailedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 'var(--space-4)',
        width: '100%',
      }}
    >
      {images.map((img, index) => {
        const script = scripts.find((s) => s.id === img.scriptId);
        const isHovered = hoveredId === img.id;
        const isDataUrl = img.url.startsWith('data:');
        const isHttp = img.url.startsWith('http://') || img.url.startsWith('https://');
        const isSameOrigin = img.url.startsWith('/');
        const canShowImg = (isDataUrl || isHttp || isSameOrigin) && !failedIds.has(img.id);
        const displaySrc = isDataUrl || isSameOrigin ? img.url : isHttp ? `/api/proxy-image?url=${encodeURIComponent(img.url)}` : img.url;

        return (
          <div
            key={img.id}
            className="animate-scale-in"
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              aspectRatio: '1',
              cursor: 'pointer',
              animationDelay: `${index * 0.04}s`,
              opacity: 0,
            }}
            onMouseEnter={() => setHoveredId(img.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {canShowImg ? (
              <img
                src={displaySrc}
                alt=""
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'var(--transition-default)',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
                onError={() => markFailed(img.id)}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: (isHttp || isDataUrl || isSameOrigin) ? FALLBACK_GRADIENT : img.url,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition-default)',
                  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {failedIds.has(img.id) && (
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>Görsel yüklenemedi</span>
                )}
              </div>
            )}

            {/* Image number badge */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-sm)',
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: 600,
                color: 'white',
              }}
            >
              #{img.id}
            </div>

            {/* Hover overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(15, 15, 26, 0.85)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 'var(--space-4)',
                opacity: isHovered ? 1 : 0,
                transition: 'var(--transition-default)',
              }}
            >
              {script && (
                <>
                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      marginBottom: 4,
                      lineHeight: 1.4,
                    }}
                  >
                    {script.hook}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--space-3)',
                      lineHeight: 1.3,
                    }}
                  >
                    {script.cta}
                  </p>
                  <CopyTextButton
                    text={`${script.hook}\n\n${script.body}\n\n${script.cta}`}
                    label="Metni Kopyala"
                  />
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

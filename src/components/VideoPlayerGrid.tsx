'use client';

import { VideoResult } from '@/lib/types';
import { useState } from 'react';

interface VideoPlayerGridProps {
  videos: VideoResult[];
}

export default function VideoPlayerGrid({ videos }: VideoPlayerGridProps) {
  const [playingId, setPlayingId] = useState<number | null>(null);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 'var(--space-4)',
        width: '100%',
      }}
    >
      {videos.map((video) => {
        const isPlaying = playingId === video.id;

        return (
          <div
            key={video.id}
            className="glass"
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '9/16',
              maxHeight: 360,
              cursor: 'pointer',
            }}
            onClick={() => setPlayingId(isPlaying ? null : video.id)}
          >
            {/* Thumbnail: http veya / ile başlıyorsa img, değilse gradient */}
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                ...(video.thumbnailUrl.startsWith('http') || video.thumbnailUrl.startsWith('/')
                  ? { backgroundImage: `url(${video.thumbnailUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                  : { background: video.thumbnailUrl }),
              }}
            >
              {/* Play/Pause overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isPlaying
                    ? 'rgba(0,0,0,0.2)'
                    : 'rgba(0,0,0,0.4)',
                  transition: 'var(--transition-default)',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 107, 107, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    boxShadow: '0 4px 20px rgba(255, 107, 107, 0.4)',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  {isPlaying ? '⏸' : '▶'}
                </div>
              </div>

              {/* Duration badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  background: 'rgba(0,0,0,0.7)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2px 8px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'white',
                }}
              >
                0:{video.duration.toString().padStart(2, '0')}
              </div>

              {/* Video number */}
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  background: 'rgba(255, 107, 107, 0.9)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                Reel #{video.id}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

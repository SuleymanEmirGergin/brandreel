'use client';

import Navbar from '@/components/Navbar';
import URLInput from '@/components/URLInput';

export default function LandingPage() {
  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-6)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow effects */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 600,
            background:
              'radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-5%',
            width: 400,
            height: 400,
            background:
              'radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Hero Content */}
        <div
          className="animate-fade-in-up"
          style={{
            textAlign: 'center',
            maxWidth: 720,
            zIndex: 1,
          }}
        >
          {/* Badge */}
          <div
            className="glass"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: 13,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-6)',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--success)',
                display: 'inline-block',
              }}
            />
            Wiro AI ile destekleniyor
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: 'var(--space-5)',
              color: 'var(--text-primary)',
            }}
          >
            Markanıza{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--accent), #FF8585, #FFB347)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              20 içerik
            </span>
            ,
            <br />
            90 saniyede.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 'var(--space-10)',
              maxWidth: 520,
              margin: '0 auto',
              marginTop: 0,
              paddingBottom: 'var(--space-10)',
            }}
          >
            URL&apos;ni yapıştır, marka DNA&apos;nı okusun,{' '}
            fabrika gibi reel üretsin. Ajansın 3 günlük işi, tek tıkla.
          </p>

          {/* URL Input */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 'var(--space-12)',
            }}
          >
            <URLInput />
          </div>

          {/* Stats Row */}
          <div
            className="animate-fade-in"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-8)',
              flexWrap: 'wrap',
              animationDelay: '0.4s',
              opacity: 0,
            }}
          >
            {[
              { value: '20', label: 'İçerik' },
              { value: '90s', label: 'Süre' },
              { value: '$0.80', label: 'Maliyet' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: 'var(--accent)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-muted)',
                    marginTop: 2,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it works section */}
        <section
          style={{
            marginTop: 'var(--space-20)',
            width: '100%',
            maxWidth: 900,
            zIndex: 1,
          }}
        >
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: 'var(--space-10)',
              color: 'var(--text-primary)',
            }}
          >
            Nasıl Çalışır?
          </h2>
          <div
            className="stagger-children"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {[
              {
                step: '01',
                icon: '🔗',
                title: 'URL Yapıştır',
                desc: 'Marka web sitesinin URL\'ini gir, gerisini biz halledelim.',
              },
              {
                step: '02',
                icon: '🧠',
                title: 'AI Analiz',
                desc: 'Wiro AI logo, renk, slogan ve marka DNA\'sını çıkarır.',
              },
              {
                step: '03',
                icon: '🎬',
                title: 'İçerik Üret',
                desc: '20 görsel + 5 video + 5 kopya metni, 90 saniyede hazır.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="glass"
                style={{
                  padding: 'var(--space-6)',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center',
                  transition: 'var(--transition-default)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-glow)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 'var(--space-3)' }}>
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'var(--accent)',
                    letterSpacing: '0.1em',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  ADIM {item.step}
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

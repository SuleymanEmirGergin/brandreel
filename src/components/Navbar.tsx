'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav
      className="glass-strong"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: 'var(--space-4) var(--space-6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          textDecoration: 'none',
          color: 'var(--text-primary)',
        }}
      >
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent), #FF8585)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          B
        </span>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Brand<span style={{ color: 'var(--accent)' }}>Reel</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <span
          style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-default)',
          }}
        >
          Powered by Wiro AI
        </span>
      </div>
    </nav>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function URLInput() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateUrl = (value: string): boolean => {
    if (!value.trim()) {
      setError('Lütfen bir URL girin');
      return false;
    }
    // Simple validation - accept domain-like strings
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;
    if (!urlPattern.test(value.trim())) {
      setError('Geçerli bir URL girin (örn: mandalacoffee.com)');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validateUrl(url)) return;
    setIsLoading(true);
    setTimeout(() => {
      router.push(`/brand-kit?url=${encodeURIComponent(url.trim())}`);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={{ width: '100%', maxWidth: 600 }}>
      <div
        className="glass animate-pulse-glow"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2)',
          borderRadius: 'var(--radius-xl)',
          transition: 'var(--transition-default)',
          border: error
            ? '1px solid var(--error)'
            : '1px solid var(--border-default)',
        }}
      >
        {/* Globe icon */}
        <div
          style={{
            padding: 'var(--space-3)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>

        <input
          id="brand-url-input"
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="mandalacoffee.com"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: 16,
            fontFamily: 'var(--font-sans)',
            padding: 'var(--space-3) 0',
          }}
        />

        <button
          id="generate-button"
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            background: 'linear-gradient(135deg, var(--accent), #FF8585)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-3) var(--space-6)',
            fontSize: 15,
            fontWeight: 600,
            cursor: isLoading ? 'wait' : 'pointer',
            fontFamily: 'var(--font-sans)',
            transition: 'var(--transition-fast)',
            opacity: isLoading ? 0.7 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {isLoading ? 'Yükleniyor...' : 'Üret →'}
        </button>
      </div>

      {error && (
        <p
          style={{
            color: 'var(--error)',
            fontSize: 13,
            marginTop: 'var(--space-2)',
            paddingLeft: 'var(--space-4)',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

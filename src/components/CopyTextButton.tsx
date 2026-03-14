'use client';

import { useState } from 'react';

interface CopyTextButtonProps {
  text: string;
  label?: string;
}

export default function CopyTextButton({ text, label = 'Kopyala' }: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 14px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-default)',
        background: copied ? 'var(--success)' : 'var(--bg-surface)',
        color: copied ? 'white' : 'var(--text-secondary)',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        transition: 'var(--transition-fast)',
      }}
    >
      {copied ? '✓ Kopyalandı!' : `📋 ${label}`}
    </button>
  );
}

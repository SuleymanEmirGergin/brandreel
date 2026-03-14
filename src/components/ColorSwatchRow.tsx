'use client';

interface ColorSwatchRowProps {
  colors: string[];
  size?: number;
  /** Seçili renkler (hex). Verilirse palet tıklanarak seçim yapılır. */
  selectedColors?: string[];
  /** Seçim değiştiğinde (tıklanınca) çağrılır. Verilmezse sadece gösterim. */
  onSelectionChange?: (selected: string[]) => void;
}

export default function ColorSwatchRow({
  colors,
  size = 48,
  selectedColors = [],
  onSelectionChange,
}: ColorSwatchRowProps) {
  const isSelectable = typeof onSelectionChange === 'function' && selectedColors.length >= 0;

  const toggle = (color: string) => {
    if (!onSelectionChange) return;
    const next = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    onSelectionChange(next);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-2)',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {colors.map((color, i) => {
        const selected = selectedColors.includes(color);
        return (
          <button
            key={i}
            type="button"
            style={{
              width: size,
              height: size,
              borderRadius: 'var(--radius-md)',
              background: color,
              border:
                selected
                  ? `3px solid var(--accent)`
                  : '2px solid var(--border-default)',
              cursor: isSelectable ? 'pointer' : 'default',
              transition: 'var(--transition-fast)',
              position: 'relative',
              boxShadow: selected ? `0 0 0 2px var(--bg-primary), 0 0 12px ${color}60` : undefined,
              padding: 0,
            }}
            title={isSelectable ? (selected ? `${color} — seçimi kaldır` : `${color} — seç`) : color}
            aria-pressed={isSelectable ? selected : undefined}
            aria-label={`Renk ${color}${selected ? ', seçili' : ''}`}
            onMouseEnter={(e) => {
              if (!isSelectable) return;
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = `0 0 16px ${color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              if (!selected) e.currentTarget.style.boxShadow = 'none';
              else e.currentTarget.style.boxShadow = `0 0 0 2px var(--bg-primary), 0 0 12px ${color}60`;
            }}
            onClick={() => toggle(color)}
          >
            <span
              style={{
                position: 'absolute',
                bottom: -22,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 10,
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                fontFamily: 'monospace',
                pointerEvents: 'none',
              }}
            >
              {color}
            </span>
            {selected && (
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: size * 0.4,
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                  pointerEvents: 'none',
                }}
                aria-hidden
              >
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

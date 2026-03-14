'use client';

import { PipelineStep } from '@/lib/types';

interface StepProgressBarProps {
  currentStep: PipelineStep;
  completedSteps: PipelineStep[];
}

const steps: { key: PipelineStep; label: string; icon: string }[] = [
  { key: 'analyze', label: 'Analiz', icon: '🔍' },
  { key: 'script', label: 'Script', icon: '✍️' },
  { key: 'visual', label: 'Görsel', icon: '🎨' },
  { key: 'video', label: 'Video', icon: '🎬' },
  { key: 'package', label: 'Paket', icon: '📦' },
];

export default function StepProgressBar({ currentStep, completedSteps }: StepProgressBarProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div style={{ width: '100%', maxWidth: 700, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Progress line background */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 40,
            right: 40,
            height: 3,
            background: 'var(--border-default)',
            borderRadius: 2,
          }}
        />
        {/* Progress line fill */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 40,
            width: `${Math.max(0, (currentIndex / (steps.length - 1)) * (100 - 12))}%`,
            height: 3,
            background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
            borderRadius: 2,
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        {steps.map((step, i) => {
          const isCompleted = completedSteps.includes(step.key);
          const isCurrent = step.key === currentStep;
          const isPending = !isCompleted && !isCurrent;

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-2)',
                zIndex: 1,
                flex: 1,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  background: isCompleted
                    ? 'linear-gradient(135deg, var(--success), #34D399)'
                    : isCurrent
                    ? 'linear-gradient(135deg, var(--accent), var(--accent-hover))'
                    : 'var(--bg-surface)',
                  border: isPending ? '2px solid var(--border-default)' : 'none',
                  boxShadow: isCurrent
                    ? '0 0 20px rgba(255, 107, 107, 0.4)'
                    : 'none',
                  transition: 'var(--transition-default)',
                  animation: isCurrent ? 'progressPulse 1.5s infinite' : 'none',
                }}
              >
                {isCompleted ? '✓' : step.icon}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: isCurrent ? 600 : 400,
                  color: isPending
                    ? 'var(--text-muted)'
                    : isCurrent
                    ? 'var(--accent)'
                    : 'var(--success)',
                  transition: 'var(--transition-default)',
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

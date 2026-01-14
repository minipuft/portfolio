'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FramePanelProps {
  children: ReactNode;
  header?: ReactNode;
  className?: string;
  tone?: 'default' | 'glow' | 'quiet';
  animate?: boolean;
}

const toneStyles: Record<NonNullable<FramePanelProps['tone']>, string> = {
  default: 'shadow-[0_32px_80px_-56px_rgba(8,10,18,0.8)]',
  glow: 'shadow-[0_0_0_1px_rgba(125,207,255,0.2),0_38px_90px_-60px_rgba(125,207,255,0.45)]',
  quiet: 'shadow-[0_24px_70px_-60px_rgba(0,0,0,0.8)]',
};

export default function FramePanel({
  children,
  header,
  className,
  tone = 'default',
  animate = true,
}: FramePanelProps) {
  return (
    <article
      data-animate={animate ? '' : undefined}
      className={cn(
        'group relative overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(140deg,rgba(13,16,26,0.95)_0%,rgba(20,26,38,0.82)_48%,rgba(11,14,22,0.98)_100%)] p-6 backdrop-blur',
        'before:pointer-events-none before:absolute before:inset-0 before:content-[\"\"] before:bg-[radial-gradient(circle_at_top,rgba(125,207,255,0.16),transparent_58%)] before:opacity-70',
        'after:pointer-events-none after:absolute after:inset-0 after:content-[\"\"] after:bg-[linear-gradient(120deg,rgba(255,255,255,0.06),transparent_55%)] after:opacity-40',
        toneStyles[tone],
        className
      )}
    >
      <div className="relative z-10 flex flex-col gap-5">
        {header}
        {children}
      </div>
    </article>
  );
}

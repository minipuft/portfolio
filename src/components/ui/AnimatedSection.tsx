'use client';

import { ReactNode } from 'react';
import { useStaggerAnimation } from '@/lib/animations';
import { PresetKey } from '@/lib/animations/presets';

interface AnimatedSectionProps {
  children: ReactNode;
  preset?: PresetKey;
  stagger?: 'stagger' | 'staggerFast' | 'staggerSlow';
  className?: string;
  once?: boolean;
  toggleActions?: string;
}

export default function AnimatedSection({
  children,
  preset = 'fadeInUp',
  stagger = 'stagger',
  className = '',
  once,
  toggleActions,
}: AnimatedSectionProps) {
  const ref = useStaggerAnimation<HTMLElement>({
    preset,
    staggerPreset: stagger,
    once,
    toggleActions,
  });

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}

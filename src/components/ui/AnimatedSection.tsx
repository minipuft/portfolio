'use client';

import { ReactNode } from 'react';
import { useStaggerAnimation } from '@/lib/animations';
import { PresetKey } from '@/lib/animations/presets';

interface AnimatedSectionProps {
  children: ReactNode;
  preset?: PresetKey;
  stagger?: 'stagger' | 'staggerFast' | 'staggerSlow';
  className?: string;
}

export default function AnimatedSection({
  children,
  preset = 'fadeInUp',
  stagger = 'stagger',
  className = '',
}: AnimatedSectionProps) {
  const ref = useStaggerAnimation<HTMLElement>({
    preset,
    staggerPreset: stagger,
  });

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}

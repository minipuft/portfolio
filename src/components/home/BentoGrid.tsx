'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useScrollVelocity } from '@/lib/hooks/useScrollVelocity';
import { useFocusField } from '@/lib/hooks/useFocusField';

gsap.registerPlugin(ScrollTrigger);

interface BentoGridProps {
  children: ReactNode;
  className?: string;
  staggerChildren?: boolean;
  mode?: 'default' | 'cinematic';
}

export default function BentoGrid({
  children,
  className,
  staggerChildren = true,
  mode = 'default',
}: BentoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { velocity } = useScrollVelocity();
  const velocityRef = useRef(velocity);

  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  useFocusField(gridRef, {
    active: mode === 'cinematic',
    maxBlur: 6,
  });

  useGSAP(() => {
    if (!staggerChildren || !gridRef.current) return;

    const cells = gridRef.current.querySelectorAll('[data-bento-cell]');

    if (reducedMotion) {
      gsap.set(cells, { autoAlpha: 1, y: 0, clearProps: 'transform' });
      return;
    }

    gsap.fromTo(
      cells,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
    ScrollTrigger.refresh();
  }, { scope: gridRef, dependencies: [reducedMotion, staggerChildren] });

  useEffect(() => {
    if (reducedMotion || mode !== 'cinematic' || !gridRef.current) return;

    const grid = gridRef.current;
    const clampSkew = gsap.utils.clamp(-3.5, 3.5);
    const setSkew = gsap.quickTo(grid, 'skewY', { duration: 0.4, ease: 'power2.out' });
    let rafId: number | null = null;

    const update = () => {
      const skew = clampSkew(-velocityRef.current * 18);
      setSkew(skew);
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      setSkew(0);
    };
  }, [mode, reducedMotion]);

  return (
    <div
      ref={gridRef}
      className={cn(
        'grid grid-cols-12 gap-4 md:gap-6',
        className
      )}
      data-bento-grid
      data-bento-mode={mode}
    >
      {children}
    </div>
  );
}

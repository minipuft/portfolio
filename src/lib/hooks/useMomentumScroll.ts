'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface MomentumScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  infinite?: boolean;
}

const defaultEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function useMomentumScroll(options: MomentumScrollOptions = {}): {
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void;
} {
  const {
    duration = 1.2,
    easing = defaultEasing,
    smoothWheel = true,
    wheelMultiplier = 1,
    touchMultiplier = 2,
    infinite = false,
  } = options;

  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration,
      easing,
      smoothWheel,
      wheelMultiplier,
      touchMultiplier,
      infinite,
    });

    lenisRef.current = lenis;

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis to GSAP ticker for perfect sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable GSAP lag smoothing to prevent stutter
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [duration, easing, smoothWheel, wheelMultiplier, touchMultiplier, infinite, reducedMotion]);

  const scrollTo = useCallback((
    target: string | number | HTMLElement,
    scrollOptions?: { offset?: number; duration?: number }
  ) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, scrollOptions);
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: reducedMotion ? 'auto' : 'smooth' });
      } else if (typeof target === 'string') {
        const element = document.querySelector(target);
        element?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    }
  }, [reducedMotion]);

  return { scrollTo };
}

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}

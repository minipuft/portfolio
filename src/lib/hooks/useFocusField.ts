'use client';

import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface FocusFieldOptions {
  selector?: string;
  maxBlur?: number;
  minBlur?: number;
  active?: boolean;
}

export function useFocusField(
  containerRef: RefObject<HTMLElement>,
  options: FocusFieldOptions = {}
) {
  const {
    selector = '[data-bento-cell]',
    maxBlur = 6,
    minBlur = 0,
    active = true,
  } = options;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (!active || reducedMotion || elements.length === 0) {
      elements.forEach((el) => el.style.setProperty('--focus-blur', '0px'));
      return;
    }

    let rafId: number | null = null;

    const update = () => {
      const centerY = window.innerHeight * 0.5;
      const maxDistance = centerY * 1.1;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;
        const distance = Math.min(Math.abs(elCenter - centerY), maxDistance);
        const t = distance / maxDistance;
        const blur = minBlur + (maxBlur - minBlur) * t;
        el.style.setProperty('--focus-blur', `${blur.toFixed(2)}px`);
      });

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      elements.forEach((el) => el.style.setProperty('--focus-blur', '0px'));
    };
  }, [active, containerRef, maxBlur, minBlur, reducedMotion, selector]);
}

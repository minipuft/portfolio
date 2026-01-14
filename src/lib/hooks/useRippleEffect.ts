'use client';

import { useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from './useReducedMotion';

interface RippleOptions {
  color?: string;
  duration?: number;
  size?: number;
  opacity?: number;
}

interface RippleResult {
  setContainerRef: (node: HTMLElement | null) => void;
  triggerRipple: (x: number, y: number) => void;
  triggerCenterRipple: () => void;
}

/**
 * Hook for creating click ripple effects
 * Provides a container ref and trigger functions
 */
export function useRippleEffect(options: RippleOptions = {}): RippleResult {
  const {
    color = 'var(--tn-primary)',
    duration = 0.6,
    size = 200,
    opacity = 0.3,
  } = options;

  const containerRef = useRef<HTMLElement | null>(null);
  const setContainerRef = useCallback((node: HTMLElement | null) => {
    containerRef.current = node;
  }, []);
  const reducedMotion = useReducedMotion();

  const triggerRipple = useCallback((x: number, y: number) => {
    if (reducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Create ripple element
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      left: ${x - rect.left - size / 2}px;
      top: ${y - rect.top - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      pointer-events: none;
      transform: scale(0);
      opacity: ${opacity};
    `;

    container.appendChild(ripple);

    // Animate ripple
    gsap.to(ripple, {
      scale: 2,
      opacity: 0,
      duration,
      ease: 'power2.out',
      onComplete: () => {
        ripple.remove();
      },
    });
  }, [reducedMotion, color, duration, size, opacity]);

  const triggerCenterRipple = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    triggerRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }, [triggerRipple]);

  return {
    setContainerRef,
    triggerRipple,
    triggerCenterRipple,
  };
}

interface CascadeOptions {
  delay?: number; // Delay between each element
  stagger?: number;
  fromCenter?: boolean;
}

/**
 * Hook for cascading hover effects through adjacent elements
 * When one element is interacted with, nearby elements respond in sequence
 */
export function useCascadeEffect(options: CascadeOptions = {}) {
  const {
    delay = 0.05,
    stagger = 0.03,
  } = options;

  const containerRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  const triggerCascade = useCallback((
    sourceElement: HTMLElement,
    targetSelector: string,
    animation: gsap.TweenVars
  ) => {
    if (reducedMotion || !containerRef.current) return;

    const allElements = containerRef.current.querySelectorAll(targetSelector);
    const sourceRect = sourceElement.getBoundingClientRect();
    const sourceCenter = {
      x: sourceRect.left + sourceRect.width / 2,
      y: sourceRect.top + sourceRect.height / 2,
    };

    // Sort elements by distance from source
    const elementsWithDistance = Array.from(allElements).map((el) => {
      const rect = el.getBoundingClientRect();
      const center = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      const distance = Math.sqrt(
        Math.pow(center.x - sourceCenter.x, 2) +
        Math.pow(center.y - sourceCenter.y, 2)
      );
      return { el, distance };
    });

    elementsWithDistance.sort((a, b) => a.distance - b.distance);

    // Animate in order of distance
    elementsWithDistance.forEach(({ el, distance }, index) => {
      if (el === sourceElement) return;

      const elementDelay = delay + index * stagger;
      const intensity = Math.max(0, 1 - distance / 500); // Falloff

      gsap.to(el, {
        ...animation,
        delay: elementDelay,
        duration: animation.duration || 0.3,
        ease: animation.ease || 'power2.out',
        // Scale animation values by intensity
        ...(animation.scale && {
          scale: 1 + (Number(animation.scale) - 1) * intensity,
        }),
      });
    });
  }, [reducedMotion, delay, stagger]);

  return {
    containerRef,
    triggerCascade,
  };
}

/**
 * Hook for wave propagation effect on scroll
 * Elements ripple as they enter the viewport
 */
export function useScrollWave(options: {
  selector?: string;
  waveSpeed?: number;
  amplitude?: number;
} = {}) {
  const {
    selector = '[data-wave-item]',
    waveSpeed = 0.1,
    amplitude = 10,
  } = options;

  const containerRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  const triggerWave = useCallback((direction: 'up' | 'down' = 'down') => {
    if (reducedMotion || !containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(selector);
    const multiplier = direction === 'down' ? 1 : -1;

    elements.forEach((el, index) => {
      gsap.fromTo(el,
        { y: amplitude * multiplier },
        {
          y: 0,
          duration: 0.4,
          delay: index * waveSpeed,
          ease: 'power2.out',
        }
      );
    });
  }, [reducedMotion, selector, waveSpeed, amplitude]);

  return {
    containerRef,
    triggerWave,
  };
}

'use client';

import { useRef, RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { presets, PresetKey } from './presets';

gsap.registerPlugin(ScrollTrigger);

interface UseScrollAnimationOptions {
  preset?: PresetKey;
  triggerStart?: string;
  triggerEnd?: string;
  toggleActions?: string;
  markers?: boolean;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: UseScrollAnimationOptions = {}
): RefObject<T | null> {
  const {
    preset = 'fadeInUp',
    triggerStart = 'top 80%',
    triggerEnd = 'bottom 20%',
    toggleActions = 'play none none reverse',
    markers = false,
  } = options;

  const ref = useRef<T>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const animation = presets[preset];
    if (!('from' in animation)) return;

    gsap.fromTo(
      ref.current,
      animation.from,
      {
        ...animation.to,
        scrollTrigger: {
          trigger: ref.current,
          start: triggerStart,
          end: triggerEnd,
          toggleActions,
          markers,
        },
      }
    );
  }, { scope: ref, dependencies: [preset, triggerStart, triggerEnd, toggleActions] });

  return ref;
}

interface UseStaggerAnimationOptions {
  preset?: PresetKey;
  staggerPreset?: 'stagger' | 'staggerFast' | 'staggerSlow';
  selector?: string;
  triggerStart?: string;
  toggleActions?: string;
  once?: boolean;
}

export function useStaggerAnimation<T extends HTMLElement>(
  options: UseStaggerAnimationOptions = {}
): RefObject<T | null> {
  const {
    preset = 'fadeInUp',
    staggerPreset = 'stagger',
    selector = '[data-animate]',
    triggerStart = 'top 80%',
    toggleActions = 'play none none none',
    once = true,
  } = options;

  const ref = useRef<T>(null);

  useGSAP(() => {
    if (!ref.current) return;

    const animation = presets[preset];
    const stagger = presets[staggerPreset];

    if (!('from' in animation) || !('each' in stagger)) return;

    const elements = ref.current.querySelectorAll(selector);
    if (elements.length === 0) return;

    // Set initial state immediately to prevent FOUC (double protection)
    gsap.set(elements, animation.from);

    gsap.fromTo(
      elements,
      animation.from,
      {
        ...animation.to,
        stagger: stagger.each,
        scrollTrigger: {
          trigger: ref.current,
          start: triggerStart,
          toggleActions,
          once,
        },
      }
    );

    // Force refresh to ensure accurate start positions
    ScrollTrigger.refresh();
  }, { scope: ref, dependencies: [preset, staggerPreset, selector, triggerStart, toggleActions, once] });

  return ref;
}

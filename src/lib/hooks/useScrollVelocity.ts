'use client';

import { useState, useEffect, useRef } from 'react';

interface ScrollVelocityOptions {
  damping?: number;
  threshold?: number;
}

interface ScrollVelocityState {
  velocity: number;
  direction: 'up' | 'down' | 'idle';
  progress: number;
}

export function useScrollVelocity(options: ScrollVelocityOptions = {}): ScrollVelocityState {
  const { damping = 0.1, threshold = 0.01 } = options;

  const [state, setState] = useState<ScrollVelocityState>({
    velocity: 0,
    direction: 'idle',
    progress: 0,
  });

  const lastScrollY = useRef(0);
  const lastTime = useRef(0);
  const velocityRef = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    lastTime.current = Date.now();

    const updateVelocity = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;
      const deltaTime = currentTime - lastTime.current;

      if (deltaTime > 0) {
        const deltaScroll = currentScrollY - lastScrollY.current;
        const instantVelocity = deltaScroll / deltaTime;

        velocityRef.current += (instantVelocity - velocityRef.current) * damping;

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

        let direction: 'up' | 'down' | 'idle' = 'idle';
        if (Math.abs(velocityRef.current) > threshold) {
          direction = velocityRef.current > 0 ? 'down' : 'up';
        }

        setState({
          velocity: velocityRef.current,
          direction,
          progress,
        });
      }

      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
      rafId.current = requestAnimationFrame(updateVelocity);
    };

    rafId.current = requestAnimationFrame(updateVelocity);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [damping, threshold]);

  return state;
}

export function useNormalizedScrollVelocity(maxVelocity = 2): number {
  const { velocity } = useScrollVelocity();
  return Math.max(-1, Math.min(1, velocity / maxVelocity));
}

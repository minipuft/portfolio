'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface BlurTransitionProps {
  children: ReactNode;
  show: boolean;
  onEnterComplete?: () => void;
  onExitComplete?: () => void;
}

export default function BlurTransition({
  children,
  show,
  onEnterComplete,
  onExitComplete,
}: BlurTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useGSAP(() => {
    if (!containerRef.current) return;

    if (show && !hasAnimated.current) {
      hasAnimated.current = true;
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          filter: 'blur(4px)',
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.45,
          ease: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
          onComplete: onEnterComplete,
        }
      );
    }
  }, { scope: containerRef, dependencies: [show] });

  useEffect(() => {
    if (!show && hasAnimated.current && containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        filter: 'blur(4px)',
        duration: 0.35,
        ease: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
        onComplete: () => {
          hasAnimated.current = false;
          onExitComplete?.();
        },
      });
    }
  }, [show, onExitComplete]);

  return (
    <div
      ref={containerRef}
      className="opacity-0"
      style={{ filter: 'blur(4px)' }}
    >
      {children}
    </div>
  );
}

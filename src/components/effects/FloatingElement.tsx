'use client';

import { useRef, ReactNode, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useMagneticEffect } from '@/lib/hooks/useCursorPosition';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

type FloatingShape = 'circle' | 'square' | 'blob' | 'ring';

interface FloatingElementProps {
  children?: ReactNode;
  shape?: FloatingShape;
  size?: number;
  color?: string;
  parallaxSpeed?: number;
  floatAmplitude?: number;
  floatDuration?: number;
  magneticStrength?: number;
  magneticRadius?: number;
  magneticMode?: 'attract' | 'repel';
  className?: string;
  style?: React.CSSProperties;
}

const shapeStyles: Record<FloatingShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-lg',
  blob: 'rounded-[30%_70%_70%_30%/30%_30%_70%_70%]',
  ring: 'rounded-full border-2 bg-transparent',
};

export default function FloatingElement({
  children,
  shape = 'circle',
  size = 100,
  color = 'var(--tn-primary)',
  parallaxSpeed = 0.5,
  floatAmplitude = 20,
  floatDuration = 4,
  magneticStrength = 0.2,
  magneticRadius = 300,
  magneticMode = 'repel',
  className = '',
  style = {},
}: FloatingElementProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

  // Track mount state to avoid SSR issues with magnetic effect
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setIsMounted(true);
  }, []);

  // Magnetic cursor interaction
  const magnetic = useMagneticEffect(elementRef, {
    strength: magneticStrength,
    radius: magneticRadius,
    mode: magneticMode,
  });

  useGSAP(() => {
    if (!elementRef.current || reducedMotion) return;

    // Floating animation
    gsap.to(elementRef.current, {
      y: floatAmplitude,
      duration: floatDuration,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    // Parallax on scroll
    gsap.to(elementRef.current, {
      y: `${parallaxSpeed * 100}%`,
      ease: 'none',
      scrollTrigger: {
        trigger: elementRef.current.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }, { scope: elementRef, dependencies: [reducedMotion, parallaxSpeed, floatAmplitude, floatDuration] });

  // Apply magnetic effect via inline transform
  const magneticTransform = isMounted && !reducedMotion && magnetic.isActive
    ? `translate(${magnetic.x}px, ${magnetic.y}px) scale(${magnetic.scale})`
    : '';

  const baseStyle: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor: shape === 'ring' ? 'transparent' : color,
    borderColor: shape === 'ring' ? color : undefined,
    opacity: 0.3,
    transform: magneticTransform || undefined,
    transition: magnetic.isActive ? 'transform 0.15s ease-out' : 'transform 0.4s ease-out',
    ...style,
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        'pointer-events-none absolute',
        shapeStyles[shape],
        className
      )}
      style={baseStyle}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

// Preset configurations for common decorative elements
interface FloatingDecorationProps {
  variant?: 'hero' | 'minimal' | 'scattered';
  className?: string;
}

export function FloatingDecoration({ variant = 'hero', className = '' }: FloatingDecorationProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return null;
  }

  if (variant === 'hero') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
        <FloatingElement
          shape="circle"
          size={300}
          color="var(--tn-primary)"
          parallaxSpeed={0.3}
          className="left-[-100px] top-[10%]"
          style={{ opacity: 0.1 }}
        />
        <FloatingElement
          shape="blob"
          size={200}
          color="var(--tn-secondary)"
          parallaxSpeed={0.5}
          floatDuration={5}
          className="right-[-50px] top-[30%]"
          style={{ opacity: 0.15 }}
        />
        <FloatingElement
          shape="ring"
          size={150}
          color="var(--tn-accent-cyan)"
          parallaxSpeed={0.4}
          floatAmplitude={30}
          className="left-[20%] bottom-[20%]"
          style={{ opacity: 0.2 }}
        />
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
        <FloatingElement
          shape="circle"
          size={150}
          color="var(--tn-primary)"
          parallaxSpeed={0.2}
          className="right-[10%] top-[20%]"
          style={{ opacity: 0.08 }}
        />
      </div>
    );
  }

  // scattered
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <FloatingElement
        shape="circle"
        size={80}
        color="var(--tn-primary)"
        parallaxSpeed={0.2}
        className="left-[5%] top-[15%]"
        style={{ opacity: 0.1 }}
      />
      <FloatingElement
        shape="square"
        size={60}
        color="var(--tn-secondary)"
        parallaxSpeed={0.4}
        className="right-[15%] top-[25%]"
        style={{ opacity: 0.08 }}
      />
      <FloatingElement
        shape="blob"
        size={100}
        color="var(--tn-accent-green)"
        parallaxSpeed={0.3}
        className="left-[25%] bottom-[30%]"
        style={{ opacity: 0.1 }}
      />
      <FloatingElement
        shape="ring"
        size={70}
        color="var(--tn-accent-cyan)"
        parallaxSpeed={0.5}
        className="right-[8%] bottom-[15%]"
        style={{ opacity: 0.12 }}
      />
    </div>
  );
}

'use client';

import { useRef, ReactNode, useCallback, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useRippleEffect } from '@/lib/hooks/useRippleEffect';

export type CellSpan =
  | 'hero'      // col 1-7, row 1-3 (large feature)
  | 'featured'  // col 7-13, row 1-2
  | 'standard'  // col span 4, row span 1
  | 'wide'      // col span 6, row span 1
  | 'tall'      // col span 4, row span 2
  | 'compact';  // col span 3, row span 1

interface BentoCellProps {
  children: ReactNode;
  span?: CellSpan;
  href?: string;
  className?: string;
  accentColor?: string;
  hoverScale?: boolean;
  cursorGlow?: boolean;
  clickRipple?: boolean;
  anamorphic?: boolean;
}

const spanClasses: Record<CellSpan, string> = {
  hero: 'col-span-12 md:col-span-6 row-span-2 md:row-span-3',
  featured: 'col-span-12 md:col-span-6 row-span-1 md:row-span-2',
  standard: 'col-span-12 sm:col-span-6 md:col-span-4',
  wide: 'col-span-12 md:col-span-6',
  tall: 'col-span-12 sm:col-span-6 md:col-span-4 row-span-2',
  compact: 'col-span-6 sm:col-span-4 md:col-span-3',
};

export default function BentoCell({
  children,
  span = 'standard',
  href,
  className,
  accentColor,
  hoverScale = true,
  cursorGlow = true,
  clickRipple = true,
  anamorphic = false,
}: BentoCellProps) {
  const cellRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Ripple effect for resonant feedback
  const ripple = useRippleEffect({
    color: accentColor || 'var(--tn-primary)',
    duration: 0.5,
    size: 150,
    opacity: 0.2,
  });

  // Handle cursor tracking for glow effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cursorGlow || reducedMotion || !cellRef.current) return;

    const rect = cellRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCursorPos({ x, y });
  }, [cursorGlow, reducedMotion]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setCursorPos({ x: 50, y: 50 }); // Reset to center
  }, []);

  // Animate glow opacity on hover
  useEffect(() => {
    if (!glowRef.current || reducedMotion) return;

    gsap.to(glowRef.current, {
      opacity: isHovered ? 1 : 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, [isHovered, reducedMotion]);

  useGSAP(() => {
    if (!cellRef.current) return;
    
    // Apply dynamic colors via GSAP to prevent hydration mismatches (Dark Reader rule)
    if (accentColor) {
      cellRef.current.style.setProperty('--cell-accent', accentColor);
    }

    if (!hoverScale || reducedMotion) return;

    const cell = cellRef.current;
    const handleEnter = () => {
      gsap.to(cell, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleLeave = () => {
      gsap.to(cell, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    cell.addEventListener('mouseenter', handleEnter);
    cell.addEventListener('mouseleave', handleLeave);

    return () => {
      cell.removeEventListener('mouseenter', handleEnter);
      cell.removeEventListener('mouseleave', handleLeave);
    };
  }, { scope: cellRef, dependencies: [reducedMotion, accentColor, hoverScale] });

  const glowColor = accentColor || 'var(--tn-primary)';

  // Handle click for ripple effect
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (clickRipple && !reducedMotion) {
      ripple.triggerRipple(e.clientX, e.clientY);
    }
  }, [clickRipple, reducedMotion, ripple]);

  // Combine refs for ripple and cell
  const setRefs = useCallback((node: HTMLDivElement | null) => {
    cellRef.current = node;
    ripple.setContainerRef(node);
  }, [ripple]);

  const cellContent = (
    <div
      ref={setRefs}
      data-bento-cell
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[var(--tn-bg-lighter)] bg-[var(--tn-bg-dark)] p-6 transition-colors',
        'hover:border-[var(--cell-accent,var(--tn-primary))]',
        anamorphic && 'aspect-[2.39/1] min-h-[220px]',
        spanClasses[span],
        className
      )}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cursor-following glow effect */}
      {cursorGlow && !reducedMotion && (
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity"
          style={{
            background: `radial-gradient(circle at ${cursorPos.x}% ${cursorPos.y}%, ${glowColor}15 0%, transparent 50%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cellContent}
      </Link>
    );
  }

  return cellContent;
}

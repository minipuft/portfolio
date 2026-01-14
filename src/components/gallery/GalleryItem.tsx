'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useNeighborResponse } from '@/lib/hooks/useNeighborResponse';
import { useIdleBreathing } from '@/lib/hooks/useColorBreathing';

export interface GalleryItemData {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  description?: string;
  category?: string;
}

interface GalleryItemProps {
  item: GalleryItemData;
  onClick?: (item: GalleryItemData) => void;
  priority?: boolean;
  className?: string;
  enableNeighborResponse?: boolean;
}

export default function GalleryItem({
  item,
  onClick,
  priority = false,
  className,
  enableNeighborResponse = true,
}: GalleryItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const reducedMotion = useReducedMotion();

  // Year 3000: Idle breathing (subtle aliveness)
  const breathingOpacity = useIdleBreathing({ minOpacity: 0.95, maxOpacity: 1, duration: 6 });

  // Neighbor response for emergent hierarchy
  const neighbor = useNeighborResponse({
    id: item.id,
    inactiveScale: 0.96,
    inactiveOpacity: 0.5,
  });

  const { isActive, isNeighborActive } = neighbor;

  // Unified Animation Controller
  useGSAP(() => {
    if (reducedMotion || !imageRef.current || !overlayRef.current) return;

    const image = imageRef.current;
    const overlay = overlayRef.current;

    // State 1: Active/Hovered (Dominant)
    if (isActive) {
      gsap.to(image, {
        scale: 1.05,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: true,
      });
      gsap.to(overlay, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
      // Stagger text reveal
      gsap.fromTo(overlay.querySelectorAll('[data-reveal]'), 
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.05, ease: 'power2.out', overwrite: true }
      );
    } 
    // State 2: Neighbor Active (Recessive)
    else if (isNeighborActive) {
      gsap.to(image, {
        scale: 0.96,
        opacity: 0.5,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: true,
      });
      gsap.to(overlay, { opacity: 0, duration: 0.3 });
    } 
    // State 3: Idle (Breathing/Neutral)
    else {
      gsap.to(image, {
        scale: 1,
        opacity: breathingOpacity, // Use the breathing hook value
        duration: 0.8,
        ease: 'power2.out',
        overwrite: true,
      });
      gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  }, [isActive, isNeighborActive, reducedMotion, breathingOpacity]);

  const handleMouseEnter = useCallback(() => {
    if (enableNeighborResponse) neighbor.onMouseEnter();
  }, [enableNeighborResponse, neighbor]);

  const handleMouseLeave = useCallback(() => {
    if (enableNeighborResponse) neighbor.onMouseLeave();
  }, [enableNeighborResponse, neighbor]);

  const handleClick = useCallback(() => {
    onClick?.(item);
  }, [onClick, item]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(item);
    }
  }, [onClick, item]);

  return (
    <div
      ref={containerRef}
      data-gallery-item
      className={cn(
        'group relative mb-5 cursor-pointer overflow-hidden rounded-xl bg-[var(--tn-bg-dark)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tn-primary)]',
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={enableNeighborResponse ? neighbor.onFocus : undefined}
      onBlur={enableNeighborResponse ? neighbor.onBlur : undefined}
      tabIndex={0}
      role="button"
      aria-label={`View ${item.title || item.alt}`}
    >
      {/* Image container */}
      <div ref={imageRef} className="relative will-change-transform">
        <Image
          src={item.src}
          alt={item.alt}
          width={item.width}
          height={item.height}
          priority={priority}
          className={cn(
            'w-full transition-opacity duration-700',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setIsLoaded(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Loading skeleton */}
        {!isLoaded && (
          <div
            className="absolute inset-0 animate-pulse bg-[var(--tn-bg-lighter)]"
            style={{ aspectRatio: `${item.width}/${item.height}` }}
          />
        )}
      </div>

      {/* Hover overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 opacity-0"
      >
        {item.category && (
          <span data-reveal className="mb-2 inline-block w-fit rounded-full border border-[var(--tn-primary)]/30 bg-[var(--tn-primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--tn-primary)] backdrop-blur-sm">
            {item.category}
          </span>
        )}
        {item.title && (
          <h3 data-reveal className="text-xl font-bold text-white tracking-tight">
            {item.title}
          </h3>
        )}
        {item.description && (
          <p data-reveal className="mt-1 line-clamp-2 text-sm text-[var(--tn-fg-muted)]">
            {item.description}
          </p>
        )}
      </div>

      {/* Focus/hover border effect */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 transition-colors duration-300 group-hover:ring-white/20" />
    </div>
  );
}
'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { MediaItem } from '@/components/project/ProjectShowcase';

interface ScreenshotGalleryProps {
  items: MediaItem[];
  layout?: 'carousel' | 'grid' | 'stack';
  showCaptions?: boolean;
  enableLightbox?: boolean;
  className?: string;
}

export default function ScreenshotGallery({
  items,
  layout = 'carousel',
  showCaptions = true,
  enableLightbox = true,
  className,
}: ScreenshotGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const reducedMotion = useReducedMotion();

  const hasMultiple = items.length > 1;

  // Carousel animation
  useGSAP(() => {
    if (layout !== 'carousel' || !trackRef.current || reducedMotion) return;

    gsap.to(trackRef.current, {
      x: `${-activeIndex * 100}%`,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, { scope: containerRef, dependencies: [activeIndex, layout, reducedMotion] });

  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  }, [items.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  }, [items.length]);

  const handleDotClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleImageClick = useCallback((item: MediaItem) => {
    if (enableLightbox) {
      setLightboxItem(item);
    }
  }, [enableLightbox]);

  const closeLightbox = useCallback(() => {
    setLightboxItem(null);
  }, []);

  // Touch/mouse drag for carousel
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (layout !== 'carousel' || !hasMultiple) return;
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0]!.pageX : e.pageX;
    setStartX(pageX);
    setScrollLeft(activeIndex);
  }, [layout, hasMultiple, activeIndex]);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || layout !== 'carousel') return;
    e.preventDefault();
    const pageX = 'touches' in e ? e.touches[0]!.pageX : e.pageX;
    const diff = startX - pageX;

    if (trackRef.current && !reducedMotion) {
      const dragAmount = (diff / containerRef.current!.offsetWidth) * 100;
      gsap.set(trackRef.current, {
        x: `${-scrollLeft * 100 - dragAmount}%`,
      });
    }
  }, [isDragging, layout, startX, scrollLeft, reducedMotion]);

  const handleDragEnd = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || layout !== 'carousel') return;
    setIsDragging(false);

    const pageX = 'changedTouches' in e ? e.changedTouches[0]!.pageX : e.pageX;
    const diff = startX - pageX;
    const threshold = containerRef.current!.offsetWidth / 4;

    if (diff > threshold && activeIndex < items.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (diff < -threshold && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    } else {
      // Snap back
      if (trackRef.current && !reducedMotion) {
        gsap.to(trackRef.current, {
          x: `${-activeIndex * 100}%`,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    }
  }, [isDragging, layout, startX, activeIndex, items.length, reducedMotion]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxItem) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrevious();
      }
    };

    if (lightboxItem) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxItem, closeLightbox, handleNext, handlePrevious]);

  const activeItem = items[activeIndex];

  // Carousel layout
  if (layout === 'carousel') {
    return (
      <div ref={containerRef} className={cn('relative', className)}>
        {/* Carousel track */}
        <div
          className="overflow-hidden rounded-lg"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div
            ref={trackRef}
            className={cn(
              'flex',
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            )}
            style={{
              width: `${items.length * 100}%`,
              transform: reducedMotion ? `translateX(${-activeIndex * 100}%)` : undefined,
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="relative flex-shrink-0"
                style={{ width: `${100 / items.length}%` }}
              >
                <button
                  onClick={() => handleImageClick(item)}
                  className="relative block w-full overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
                  aria-label={`View ${item.alt || item.title || 'image'}`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt || item.title || 'Screenshot'}
                    width={item.width || 1200}
                    height={item.height || 675}
                    className="h-auto w-full object-cover"
                    priority={items.indexOf(item) === 0}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white/80 backdrop-blur-sm transition-all hover:bg-black/80 hover:text-white"
              aria-label="Previous image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white/80 backdrop-blur-sm transition-all hover:bg-black/80 hover:text-white"
              aria-label="Next image"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators */}
        {hasMultiple && (
          <div className="mt-4 flex justify-center gap-2">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleDotClick(index)}
                className={cn(
                  'h-2 w-2 rounded-full transition-all',
                  index === activeIndex
                    ? 'w-6 bg-[var(--accent-color)]'
                    : 'bg-[var(--tn-fg-muted)] hover:bg-[var(--tn-fg)]'
                )}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}

        {/* Caption */}
        {showCaptions && activeItem && (activeItem.title || activeItem.alt) && (
          <div className="mt-3 text-center">
            <p className="text-sm text-[var(--tn-fg-muted)]">
              {activeItem.title || activeItem.alt}
            </p>
          </div>
        )}

        {/* Lightbox */}
        {lightboxItem && (
          <Lightbox
            item={lightboxItem}
            items={items}
            onClose={closeLightbox}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    );
  }

  // Grid layout
  if (layout === 'grid') {
    return (
      <div ref={containerRef} className={cn('grid gap-4', className)}>
        <div className={cn(
          'grid gap-4',
          items.length === 1 && 'grid-cols-1',
          items.length === 2 && 'grid-cols-2',
          items.length >= 3 && 'grid-cols-2 md:grid-cols-3'
        )}>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleImageClick(item)}
              className="group relative overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
              aria-label={`View ${item.alt || item.title || 'image'}`}
            >
              <Image
                src={item.src}
                alt={item.alt || item.title || 'Screenshot'}
                width={item.width || 600}
                height={item.height || 400}
                className="h-auto w-full object-cover transition-transform group-hover:scale-105"
              />
              {showCaptions && item.title && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-sm text-white">{item.title}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        {lightboxItem && (
          <Lightbox
            item={lightboxItem}
            items={items}
            onClose={closeLightbox}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    );
  }

  // Stack layout (simple vertical stack)
  return (
    <div ref={containerRef} className={cn('space-y-4', className)}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleImageClick(item)}
          className="group relative block w-full overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)]"
          aria-label={`View ${item.alt || item.title || 'image'}`}
        >
          <Image
            src={item.src}
            alt={item.alt || item.title || 'Screenshot'}
            width={item.width || 1200}
            height={item.height || 675}
            className="h-auto w-full object-cover"
          />
          {showCaptions && item.title && (
            <div className="mt-2 text-center">
              <p className="text-sm text-[var(--tn-fg-muted)]">{item.title}</p>
            </div>
          )}
        </button>
      ))}

      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          items={items}
          onClose={closeLightbox}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
}

// Inline Lightbox component for screenshots
interface LightboxProps {
  item: MediaItem;
  items: MediaItem[];
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

function Lightbox({ item, items, onClose, onNext, onPrevious }: LightboxProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const currentIndex = items.findIndex((i) => i.id === item.id);
  const hasMultiple = items.length > 1;
  const canGoNext = hasMultiple && currentIndex < items.length - 1;
  const canGoPrevious = hasMultiple && currentIndex > 0;

  useGSAP(() => {
    if (!backdropRef.current || !contentRef.current || reducedMotion) return;

    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
    );
  }, { scope: backdropRef });

  const handleClose = useCallback(() => {
    if (reducedMotion) {
      onClose();
      return;
    }

    gsap.to(contentRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.2,
      ease: 'power2.in',
    });

    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.2,
      delay: 0.1,
      ease: 'power2.in',
      onComplete: onClose,
    });
  }, [onClose, reducedMotion]);

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/95"
        onClick={handleClose}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <div
          ref={contentRef}
          className="relative max-h-full max-w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute -right-2 -top-12 z-10 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white md:-right-12 md:top-0"
            aria-label="Close lightbox"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image */}
          <Image
            src={item.src}
            alt={item.alt || item.title || 'Screenshot'}
            width={item.width || 1920}
            height={item.height || 1080}
            className="max-h-[80vh] w-auto rounded-lg object-contain"
            priority
          />

          {/* Caption */}
          {item.title && (
            <div className="mt-4 text-center">
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            </div>
          )}

          {/* Navigation arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className={cn(
                  'absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 rounded-full p-3 text-white transition-all md:-left-16',
                  canGoPrevious ? 'hover:bg-white/10' : 'cursor-not-allowed opacity-30'
                )}
                aria-label="Previous image"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={onNext}
                disabled={!canGoNext}
                className={cn(
                  'absolute right-0 top-1/2 -translate-y-1/2 translate-x-full rounded-full p-3 text-white transition-all md:-right-16',
                  canGoNext ? 'hover:bg-white/10' : 'cursor-not-allowed opacity-30'
                )}
                aria-label="Next image"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Counter */}
          {hasMultiple && (
            <div className="mt-4 text-center text-sm text-white/50">
              {currentIndex + 1} / {items.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

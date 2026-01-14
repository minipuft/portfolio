'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { GalleryItemData } from './GalleryItem';
import IconButton from '@/components/ui/IconButton';

interface LightboxProps {
  item: GalleryItemData | null;
  items?: GalleryItemData[];
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function Lightbox({
  item,
  items = [],
  onClose,
  onNext,
  onPrevious,
}: LightboxProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentIndex = items.findIndex((i) => i.id === item?.id);
  const hasMultiple = items.length > 1;
  const canGoNext = hasMultiple && currentIndex < items.length - 1;
  const canGoPrevious = hasMultiple && currentIndex > 0;

  useGSAP(() => {
    if (!item || !backdropRef.current || !contentRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    )
    .fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' },
      '-=0.15'
    );
  }, { scope: backdropRef, dependencies: [item?.id] });

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setIsClosing(false);
        onClose();
      },
    });

    tl.to(contentRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.25,
      ease: 'power2.in',
    })
    .to(backdropRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
    }, '-=0.1');
  }, [isClosing, onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        handleClose();
        break;
      case 'ArrowRight':
        if (canGoNext) onNext?.();
        break;
      case 'ArrowLeft':
        if (canGoPrevious) onPrevious?.();
        break;
    }
  }, [handleClose, canGoNext, canGoPrevious, onNext, onPrevious]);

  useEffect(() => {
    if (!item) return;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, handleKeyDown]);

  // Track item ID changes for loading state
  const previousItemId = useRef(item?.id);
  if (previousItemId.current !== item?.id) {
    previousItemId.current = item?.id;
    if (isLoaded) {
      setIsLoaded(false);
    }
  }

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Image lightbox">
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
          className="relative flex max-h-full max-w-full flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <IconButton
            onClick={handleClose}
            className="absolute -right-2 -top-12 z-10 text-white/70 hover:bg-white/10 hover:text-white md:-right-12 md:top-0"
            aria-label="Close lightbox"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </IconButton>

          {/* Image container */}
          <div ref={imageRef} className="relative overflow-hidden rounded-lg">
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              priority
              className={cn(
                'max-h-[80vh] w-auto object-contain transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setIsLoaded(true)}
              sizes="100vw"
            />

            {/* Loading spinner */}
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--tn-bg-dark)]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </div>

          {/* Caption */}
          {(item.title || item.description) && (
            <div className="mt-4 text-center">
              {item.title && (
                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              )}
              {item.description && (
                <p className="mt-1 text-sm text-white/70">{item.description}</p>
              )}
            </div>
          )}

          {/* Navigation arrows */}
          {hasMultiple && (
            <>
              <IconButton
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className={cn(
                  'absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 rounded-full p-3 text-white transition-all md:-left-16',
                  canGoPrevious
                    ? 'hover:bg-white/10'
                    : 'cursor-not-allowed opacity-30'
                )}
                aria-label="Previous image"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </IconButton>
              <IconButton
                onClick={onNext}
                disabled={!canGoNext}
                className={cn(
                  'absolute right-0 top-1/2 -translate-y-1/2 translate-x-full rounded-full p-3 text-white transition-all md:-right-16',
                  canGoNext
                    ? 'hover:bg-white/10'
                    : 'cursor-not-allowed opacity-30'
                )}
                aria-label="Next image"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </IconButton>
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

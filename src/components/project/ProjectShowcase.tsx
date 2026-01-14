'use client';

import { useRef, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import VideoPlayer from '@/components/media/VideoPlayer';
import EmbedFrame from '@/components/media/EmbedFrame';
import ScreenshotGallery from '@/components/media/ScreenshotGallery';

export type MediaType = 'video' | 'screenshot' | 'embed' | 'image';

export interface MediaItem {
  id: string;
  type: MediaType;
  src: string;
  alt?: string;
  title?: string;
  poster?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
}

interface ProjectShowcaseProps {
  media: MediaItem[];
  className?: string;
  layout?: 'grid' | 'carousel' | 'stacked';
  autoplayVideos?: boolean;
  showThumbnails?: boolean;
}

export default function ProjectShowcase({
  media,
  className,
  layout = 'stacked',
  autoplayVideos = true,
  showThumbnails = true,
}: ProjectShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const reducedMotion = useReducedMotion();

  const activeItem = media[activeIndex];
  const hasMultiple = media.length > 1;

  // Group media by type for optimized rendering
  const screenshots = media.filter((m) => m.type === 'screenshot' || m.type === 'image');
  const hasScreenshotGallery = screenshots.length > 1;

  // Animate on active item change
  useGSAP(() => {
    if (!containerRef.current || reducedMotion) return;

    const content = containerRef.current.querySelector('[data-showcase-content]');
    if (content) {
      gsap.fromTo(
        content,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, { scope: containerRef, dependencies: [activeIndex] });

  const handleNavigate = useCallback((index: number) => {
    if (isTransitioning || index === activeIndex) return;

    setIsTransitioning(true);

    if (reducedMotion) {
      setActiveIndex(index);
      setIsTransitioning(false);
      return;
    }

    const content = containerRef.current?.querySelector('[data-showcase-content]');
    if (content) {
      gsap.to(content, {
        opacity: 0,
        y: -20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setActiveIndex(index);
          setIsTransitioning(false);
        },
      });
    } else {
      setActiveIndex(index);
      setIsTransitioning(false);
    }
  }, [activeIndex, isTransitioning, reducedMotion]);

  const handlePrevious = useCallback(() => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : media.length - 1;
    handleNavigate(newIndex);
  }, [activeIndex, media.length, handleNavigate]);

  const handleNext = useCallback(() => {
    const newIndex = activeIndex < media.length - 1 ? activeIndex + 1 : 0;
    handleNavigate(newIndex);
  }, [activeIndex, media.length, handleNavigate]);

  const renderMediaItem = (item: MediaItem, isActive: boolean) => {
    const commonProps = {
      className: cn(
        'w-full rounded-lg overflow-hidden',
        !isActive && 'hidden'
      ),
    };

    switch (item.type) {
      case 'video':
        return (
          <VideoPlayer
            key={item.id}
            src={item.src}
            poster={item.poster}
            title={item.title || 'Project video'}
            autoplayOnScroll={autoplayVideos && isActive}
            aspectRatio={item.aspectRatio || '16/9'}
            {...commonProps}
          />
        );

      case 'embed':
        return (
          <EmbedFrame
            key={item.id}
            src={item.src}
            title={item.title || 'Embedded content'}
            aspectRatio={item.aspectRatio || '16/9'}
            {...commonProps}
          />
        );

      case 'screenshot':
      case 'image':
        if (hasScreenshotGallery && screenshots[0]?.id === item.id) {
          return (
            <ScreenshotGallery
              key="screenshot-gallery"
              items={screenshots}
              {...commonProps}
            />
          );
        }
        if (hasScreenshotGallery) return null;
        return (
          <ScreenshotGallery
            key={item.id}
            items={[item]}
            {...commonProps}
          />
        );

      default:
        return null;
    }
  };

  // For stacked layout, render all media types in sequence
  if (layout === 'stacked') {
    const uniqueTypes = Array.from(new Set(media.map((m) => m.type)));
    const groupedMedia: MediaItem[][] = uniqueTypes.map((type) =>
      media.filter((m) => m.type === type)
    );

    return (
      <div ref={containerRef} className={cn('space-y-8', className)}>
        {groupedMedia.map((group, groupIndex) => {
          const firstItem = group[0];
          if (!firstItem) return null;

          return (
            <div
              key={`${firstItem.type}-${groupIndex}`}
              data-showcase-content
              className="relative"
            >
              {firstItem.type === 'video' && (
                <VideoPlayer
                  src={firstItem.src}
                  poster={firstItem.poster}
                  title={firstItem.title || 'Project video'}
                  autoplayOnScroll={autoplayVideos}
                  aspectRatio={firstItem.aspectRatio || '16/9'}
                  className="w-full rounded-lg overflow-hidden"
                />
              )}

              {firstItem.type === 'embed' && (
                <EmbedFrame
                  src={firstItem.src}
                  title={firstItem.title || 'Embedded content'}
                  aspectRatio={firstItem.aspectRatio || '16/9'}
                  className="w-full rounded-lg overflow-hidden"
                />
              )}

              {(firstItem.type === 'screenshot' || firstItem.type === 'image') && (
                <ScreenshotGallery
                  items={group}
                  className="w-full"
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Grid or carousel layout with navigation
  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Main content area */}
      <div data-showcase-content className="relative">
        {media.map((item, index) => renderMediaItem(item, index === activeIndex))}
      </div>

      {/* Navigation controls */}
      {hasMultiple && (
        <>
          {/* Arrow navigation */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={handlePrevious}
              disabled={isTransitioning}
              className="group -ml-4 rounded-full bg-[var(--tn-bg-dark)]/80 p-3 text-white/70 backdrop-blur-sm transition-all hover:bg-[var(--tn-bg-dark)] hover:text-white disabled:opacity-50"
              aria-label="Previous"
            >
              <svg className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={handleNext}
              disabled={isTransitioning}
              className="group -mr-4 rounded-full bg-[var(--tn-bg-dark)]/80 p-3 text-white/70 backdrop-blur-sm transition-all hover:bg-[var(--tn-bg-dark)] hover:text-white disabled:opacity-50"
              aria-label="Next"
            >
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Thumbnail navigation */}
      {hasMultiple && showThumbnails && (
        <div className="mt-4 flex justify-center gap-2">
          {media.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(index)}
              disabled={isTransitioning}
              className={cn(
                'h-2 w-2 rounded-full transition-all',
                index === activeIndex
                  ? 'w-6 bg-[var(--accent-color)]'
                  : 'bg-[var(--tn-fg-muted)] hover:bg-[var(--tn-fg)]'
              )}
              aria-label={`Go to ${item.title || `item ${index + 1}`}`}
              aria-current={index === activeIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {/* Type indicators */}
      {hasMultiple && (
        <div className="absolute right-2 top-2 flex gap-1">
          {activeItem.type === 'video' && (
            <span className="rounded bg-[var(--tn-accent-red)]/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              Video
            </span>
          )}
          {activeItem.type === 'embed' && (
            <span className="rounded bg-[var(--tn-accent-cyan)]/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              Interactive
            </span>
          )}
        </div>
      )}
    </div>
  );
}

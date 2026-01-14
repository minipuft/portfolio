'use client';

import { useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { BlogPost, formatDate } from './types';

interface NarrativeCardProps {
  post: BlogPost;
  variant?: 'default' | 'featured';
  className?: string;
}

export default function NarrativeCard({
  post,
  variant = 'default',
  className,
}: NarrativeCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseEnter = useCallback(() => {
    if (reducedMotion) return;

    const image = imageRef.current;
    if (image) {
      gsap.to(image, {
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (reducedMotion) return;

    const image = imageRef.current;
    if (image) {
      gsap.to(image, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [reducedMotion]);

  const isFeatured = variant === 'featured';

  return (
    <Link
      ref={cardRef}
      href={`/blog/${post.slug}`}
      className={cn(
        'group block overflow-hidden rounded-lg border border-[var(--tn-bg-lighter)] bg-[var(--tn-bg-dark)] transition-all hover:border-[var(--accent-color)]/50',
        isFeatured && 'md:flex md:gap-6',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Hero image */}
      {post.heroImage && (
        <div
          className={cn(
            'relative overflow-hidden',
            isFeatured ? 'md:w-2/5 md:flex-shrink-0' : 'aspect-[16/9]'
          )}
        >
          <div ref={imageRef} className="h-full w-full">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes={isFeatured ? '(max-width: 768px) 100vw, 40vw' : '100vw'}
            />
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--tn-bg-dark)]/60 to-transparent md:bg-gradient-to-r" />
        </div>
      )}

      {/* Content */}
      <div className={cn('p-5', isFeatured && 'md:flex md:flex-col md:justify-center md:py-8')}>
        {/* Tags */}
        <div className="mb-2 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-[var(--accent-color)]/10 px-2 py-0.5 text-xs text-[var(--accent-color)]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          className={cn(
            'font-semibold text-[var(--tn-fg-bright)] transition-colors group-hover:text-[var(--accent-color)]',
            isFeatured ? 'text-xl md:text-2xl' : 'text-lg'
          )}
        >
          {post.title}
        </h3>

        {/* Description */}
        <p
          className={cn(
            'mt-2 text-[var(--tn-fg-muted)]',
            isFeatured ? 'line-clamp-3' : 'line-clamp-2 text-sm'
          )}
        >
          {post.description}
        </p>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-xs text-[var(--tn-fg-muted)]">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {post.readingTime} min read
          </span>
          {post.featured && (
            <span className="flex items-center gap-1 text-[var(--tn-accent-peach)]">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Featured
            </span>
          )}
        </div>

        {/* Read more indicator */}
        <div className="mt-4 flex items-center text-sm text-[var(--accent-color)] opacity-0 transition-opacity group-hover:opacity-100">
          Read more
          <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

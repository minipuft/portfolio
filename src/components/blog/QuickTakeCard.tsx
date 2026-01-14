'use client';

import { useRef, useCallback } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { BlogPost, formatDate } from './types';

interface QuickTakeCardProps {
  post: BlogPost;
  className?: string;
}

export default function QuickTakeCard({ post, className }: QuickTakeCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseEnter = useCallback(() => {
    if (reducedMotion) return;

    const card = cardRef.current;
    const icon = iconRef.current;

    if (card) {
      gsap.to(card, {
        y: -4,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    if (icon) {
      gsap.to(icon, {
        rotate: 12,
        scale: 1.1,
        duration: 0.3,
        ease: 'back.out(2)',
      });
    }
  }, [reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    if (reducedMotion) return;

    const card = cardRef.current;
    const icon = iconRef.current;

    if (card) {
      gsap.to(card, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    if (icon) {
      gsap.to(icon, {
        rotate: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [reducedMotion]);

  return (
    <Link
      ref={cardRef}
      href={`/blog/${post.slug}`}
      className={cn(
        'group block rounded-lg border border-[var(--tn-bg-lighter)] bg-[var(--tn-bg-dark)] p-4 transition-colors hover:border-[var(--tn-secondary)]/50 hover:bg-[var(--tn-bg-light)]',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header with icon */}
      <div className="mb-3 flex items-start justify-between">
        <div
          ref={iconRef}
          className="rounded-lg bg-[var(--tn-secondary)]/10 p-2 text-[var(--tn-secondary)]"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <span className="text-xs text-[var(--tn-fg-muted)]">{post.readingTime} min</span>
      </div>

      {/* Title */}
      <h3 className="font-medium text-[var(--tn-fg-bright)] transition-colors group-hover:text-[var(--tn-secondary)]">
        {post.title}
      </h3>

      {/* Description */}
      <p className="mt-1.5 line-clamp-2 text-sm text-[var(--tn-fg-muted)]">
        {post.description}
      </p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded bg-[var(--tn-bg-lighter)] px-1.5 py-0.5 text-[10px] text-[var(--tn-fg-muted)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between border-t border-[var(--tn-bg-lighter)] pt-3">
        <time className="text-xs text-[var(--tn-fg-muted)]" dateTime={post.publishedAt}>
          {formatDate(post.publishedAt)}
        </time>
        <span className="flex items-center text-xs text-[var(--tn-secondary)] opacity-0 transition-opacity group-hover:opacity-100">
          Read
          <svg className="ml-0.5 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

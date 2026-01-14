'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { RelatedContent } from './types';

interface RelatedPostsProps {
  items: RelatedContent[];
  title?: string;
  className?: string;
}

export default function RelatedPosts({
  items,
  title = 'Related',
  className,
}: RelatedPostsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Stagger animation on scroll
  useGSAP(() => {
    if (!containerRef.current || reducedMotion) return;

    const cards = containerRef.current.querySelectorAll('[data-related-item]');
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 90%',
        },
      }
    );
  }, { scope: containerRef });

  if (items.length === 0) return null;

  return (
    <section ref={containerRef} className={cn('', className)}>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--tn-fg-muted)]">
        {title}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <RelatedItem key={`${item.type}-${item.slug}`} item={item} />
        ))}
      </div>
    </section>
  );
}

interface RelatedItemProps {
  item: RelatedContent;
}

function RelatedItem({ item }: RelatedItemProps) {
  const isProject = item.type === 'project';
  const href = isProject ? `/projects/${item.slug}` : `/blog/${item.slug}`;

  return (
    <Link
      href={href}
      data-related-item
      className="group flex items-start gap-3 rounded-lg border border-[var(--tn-bg-lighter)] bg-[var(--tn-bg-dark)] p-4 transition-all hover:border-[var(--accent-color)]/50 hover:bg-[var(--tn-bg-light)]"
    >
      {/* Type icon */}
      <div
        className={cn(
          'flex-shrink-0 rounded-lg p-2',
          isProject
            ? 'bg-[var(--tn-accent-cyan)]/10 text-[var(--tn-accent-cyan)]'
            : 'bg-[var(--accent-color)]/10 text-[var(--accent-color)]'
        )}
      >
        {isProject ? (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-[var(--tn-fg-muted)]">
            {isProject ? 'Project' : 'Post'}
          </span>
        </div>
        <h4 className="truncate font-medium text-[var(--tn-fg-bright)] transition-colors group-hover:text-[var(--accent-color)]">
          {item.title}
        </h4>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-[var(--tn-fg-muted)]">
            {item.description}
          </p>
        )}
      </div>

      {/* Arrow */}
      <svg
        className="h-4 w-4 flex-shrink-0 text-[var(--tn-fg-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent-color)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}


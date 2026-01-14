'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { BlogPost, formatDate, RelatedContent } from './types';
import RelatedPosts from './RelatedPosts';

interface NarrativePostProps {
  post: BlogPost;
  content: React.ReactNode;
  relatedContent?: RelatedContent[];
  className?: string;
}

export default function NarrativePost({
  post,
  content,
  relatedContent = [],
  className,
}: NarrativePostProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Entrance animation
  useGSAP(() => {
    if (!containerRef.current || reducedMotion) return;

    const tl = gsap.timeline();

    // Hero image reveal
    if (heroRef.current) {
      tl.fromTo(
        heroRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
      );
    }

    // Content fade in
    if (contentRef.current) {
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );
    }
  }, { scope: containerRef });

  return (
    <article ref={containerRef} className={cn('relative', className)}>
      {/* Hero section */}
      {post.heroImage && (
        <div ref={heroRef} className="relative mb-12 overflow-hidden rounded-xl">
          <div className="aspect-[21/9]">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--tn-bg-dark)] via-transparent to-transparent" />
        </div>
      )}

      {/* Header */}
      <header ref={contentRef} className="mb-12">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center text-sm text-[var(--tn-fg-muted)] transition-colors hover:text-[var(--accent-color)]"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to blog
        </Link>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className="rounded-full bg-[var(--accent-color)]/10 px-3 py-1 text-sm text-[var(--accent-color)] transition-colors hover:bg-[var(--accent-color)]/20"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-[var(--tn-fg-bright)] md:text-5xl">
          {post.title}
        </h1>

        {/* Description */}
        <p className="mt-4 text-xl text-[var(--tn-fg)]">
          {post.description}
        </p>

        {/* Meta */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--tn-fg-muted)]">
          <time dateTime={post.publishedAt} className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(post.publishedAt)}
          </time>
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Updated {formatDate(post.updatedAt)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <span className="flex items-center gap-1.5 text-[var(--tn-accent-peach)]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Featured
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[var(--tn-bg-lighter)] to-transparent" />
      </header>

      {/* Content */}
      <AnimatedSection 
        className="prose prose-invert mx-auto max-w-none prose-headings:text-[var(--tn-fg-bright)] prose-p:text-[var(--tn-fg)] prose-a:text-[var(--accent-color)] prose-a:no-underline hover:prose-a:underline prose-strong:text-[var(--tn-fg-bright)] prose-code:text-[var(--tn-secondary)] prose-pre:bg-[var(--tn-bg-dark)] prose-pre:border prose-pre:border-[var(--tn-bg-lighter)]"
        stagger="stagger"
        preset="fadeInUp"
      >
        {content}
      </AnimatedSection>

      {/* Footer */}
      <footer className="mt-16 border-t border-[var(--tn-bg-lighter)] pt-8">
        {/* Share buttons */}
        <div className="mb-8 flex items-center gap-4">
          <span className="text-sm text-[var(--tn-fg-muted)]">Share:</span>
          <div className="flex gap-2">
            <ShareButton
              platform="twitter"
              url={`https://example.com/blog/${post.slug}`}
              title={post.title}
            />
            <ShareButton
              platform="linkedin"
              url={`https://example.com/blog/${post.slug}`}
              title={post.title}
            />
            <CopyLinkButton url={`https://example.com/blog/${post.slug}`} />
          </div>
        </div>

        {/* Tags again for navigation */}
        <div className="mb-8">
          <span className="mb-2 block text-sm text-[var(--tn-fg-muted)]">Topics covered:</span>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="rounded-full border border-[var(--tn-bg-lighter)] px-3 py-1 text-sm text-[var(--tn-fg)] transition-colors hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Related content */}
        {relatedContent.length > 0 && (
          <RelatedPosts items={relatedContent} />
        )}
      </footer>
    </article>
  );
}

// Share button component
interface ShareButtonProps {
  platform: 'twitter' | 'linkedin';
  url: string;
  title: string;
}

function ShareButton({ platform, url, title }: ShareButtonProps) {
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  const icons = {
    twitter: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    linkedin: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  };

  return (
    <a
      href={shareUrls[platform]}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg bg-[var(--tn-bg-lighter)] p-2 text-[var(--tn-fg-muted)] transition-colors hover:bg-[var(--tn-bg-light)] hover:text-[var(--tn-fg)]"
      aria-label={`Share on ${platform}`}
    >
      {icons[platform]}
    </a>
  );
}

// Copy link button
function CopyLinkButton({ url }: { url: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // Could add toast notification here
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg bg-[var(--tn-bg-lighter)] p-2 text-[var(--tn-fg-muted)] transition-colors hover:bg-[var(--tn-bg-light)] hover:text-[var(--tn-fg)]"
      aria-label="Copy link"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
        />
      </svg>
    </button>
  );
}

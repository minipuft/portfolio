'use client';

import { useRef, useState, useMemo, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { BlogPost, getPublishedPosts, getAllTags, PostFormat } from './types';
import NarrativeCard from './NarrativeCard';
import QuickTakeCard from './QuickTakeCard';

gsap.registerPlugin(ScrollTrigger);

interface BlogFeedProps {
  posts: BlogPost[];
  showFilters?: boolean;
  showFeatured?: boolean;
  className?: string;
}

type FilterMode = 'all' | PostFormat;

export default function BlogFeed({
  posts,
  showFilters = true,
  showFeatured = true,
  className,
}: BlogFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterMode>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const publishedPosts = useMemo(() => getPublishedPosts(posts), [posts]);
  const allTags = useMemo(() => getAllTags(posts), [posts]);

  const filteredPosts = useMemo(() => {
    let result = publishedPosts;

    if (activeFilter !== 'all') {
      result = result.filter((post) => post.format === activeFilter);
    }

    if (activeTag) {
      result = result.filter((post) => post.tags.includes(activeTag));
    }

    return result;
  }, [publishedPosts, activeFilter, activeTag]);

  const featuredPosts = useMemo(
    () => (showFeatured ? publishedPosts.filter((p) => p.featured).slice(0, 2) : []),
    [publishedPosts, showFeatured]
  );

  const regularPosts = useMemo(() => {
    if (!showFeatured) return filteredPosts;
    const featuredSlugs = new Set(featuredPosts.map((p) => p.slug));
    return filteredPosts.filter((p) => !featuredSlugs.has(p.slug));
  }, [filteredPosts, featuredPosts, showFeatured]);

  // Entrance animation
  useGSAP(() => {
    if (!feedRef.current || reducedMotion) return;

    const items = feedRef.current.querySelectorAll('[data-feed-item]');
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: feedRef.current,
          start: 'top 85%',
        },
      }
    );
  }, { scope: containerRef, dependencies: [filteredPosts, reducedMotion] });

  const handleFilterChange = useCallback((filter: FilterMode) => {
    setActiveFilter(filter);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  }, []);

  return (
    <div ref={containerRef} className={cn('space-y-12', className)}>
      {/* Filters */}
      {showFilters && (
        <div className="space-y-4">
          {/* Format filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-[var(--tn-fg-muted)]">Filter:</span>
            {(['all', 'narrative', 'quicktake'] as FilterMode[]).map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={cn(
                  'rounded-full px-3 py-1 text-sm transition-all',
                  activeFilter === filter
                    ? 'bg-[var(--accent-color)] text-white'
                    : 'bg-[var(--tn-bg-lighter)] text-[var(--tn-fg-muted)] hover:bg-[var(--tn-bg-light)] hover:text-[var(--tn-fg)]'
                )}
              >
                {filter === 'all' && 'All Posts'}
                {filter === 'narrative' && 'Narratives'}
                {filter === 'quicktake' && 'Quick Takes'}
              </button>
            ))}
          </div>

          {/* Tag filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-[var(--tn-fg-muted)]">Tags:</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs transition-all',
                  activeTag === tag
                    ? 'bg-[var(--tn-secondary)] text-white'
                    : 'bg-[var(--tn-bg-lighter)] text-[var(--tn-fg-muted)] hover:bg-[var(--tn-bg-light)]'
                )}
              >
                {tag}
              </button>
            ))}
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="text-xs text-[var(--tn-fg-muted)] hover:text-[var(--tn-fg)]"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Featured posts */}
      {showFeatured && featuredPosts.length > 0 && activeFilter === 'all' && !activeTag && (
        <section>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--tn-fg-muted)]">
            Featured
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.map((post) => (
              <div key={post.slug} data-feed-item>
                <NarrativeCard post={post} variant="featured" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main feed */}
      <section ref={feedRef}>
        {(showFeatured && featuredPosts.length > 0 && activeFilter === 'all' && !activeTag) && (
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[var(--tn-fg-muted)]">
            Latest
          </h2>
        )}

        {filteredPosts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[var(--tn-fg-muted)]">No posts match your filters.</p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setActiveTag(null);
              }}
              className="mt-2 text-sm text-[var(--accent-color)] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Narrative posts */}
            {regularPosts.filter((p) => p.format === 'narrative').length > 0 && (
              <div className="space-y-4">
                {regularPosts
                  .filter((p) => p.format === 'narrative')
                  .map((post) => (
                    <div key={post.slug} data-feed-item>
                      <NarrativeCard post={post} />
                    </div>
                  ))}
              </div>
            )}

            {/* Quick takes section */}
            {regularPosts.filter((p) => p.format === 'quicktake').length > 0 && (
              <div className="mt-8">
                {activeFilter === 'all' && (
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--tn-fg-muted)]">
                    Quick Takes
                  </h3>
                )}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {regularPosts
                    .filter((p) => p.format === 'quicktake')
                    .map((post) => (
                      <div key={post.slug} data-feed-item>
                        <QuickTakeCard post={post} />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Post count */}
      <div className="text-center text-sm text-[var(--tn-fg-muted)]">
        {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
        {activeFilter !== 'all' && ` · ${activeFilter === 'narrative' ? 'Narratives' : 'Quick Takes'}`}
        {activeTag && ` · Tagged "${activeTag}"`}
      </div>
    </div>
  );
}

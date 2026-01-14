'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EmbedFrameProps {
  src: string;
  title: string;
  type?: 'video' | 'embed';
  aspectRatio?: string;
  allowFullscreen?: boolean;
  loading?: 'lazy' | 'eager';
  sandbox?: string;
  className?: string;
}

type KnownEmbed = 'codesandbox' | 'codepen' | 'stackblitz' | 'github' | 'figma' | 'youtube' | 'unknown';

const embedPatterns: Record<KnownEmbed, RegExp | null> = {
  codesandbox: /codesandbox\.io/,
  codepen: /codepen\.io/,
  stackblitz: /stackblitz\.com/,
  github: /github\.com.*\/blob\//,
  figma: /figma\.com/,
  youtube: /youtube\.com|youtu\.be/,
  unknown: null,
};

const embedColors: Record<KnownEmbed, string> = {
  codesandbox: '#1a1a1a',
  codepen: '#1e1f26',
  stackblitz: '#1269D3',
  github: '#0d1117',
  figma: '#1e1e1e',
  youtube: '#0f0f0f',
  unknown: 'var(--tn-bg-dark)',
};

const embedLabels: Record<KnownEmbed, string> = {
  codesandbox: 'CodeSandbox',
  codepen: 'CodePen',
  stackblitz: 'StackBlitz',
  github: 'GitHub',
  figma: 'Figma',
  youtube: 'YouTube',
  unknown: 'Embed',
};

function detectEmbedType(src: string): KnownEmbed {
  for (const [type, pattern] of Object.entries(embedPatterns)) {
    if (pattern && pattern.test(src)) {
      return type as KnownEmbed;
    }
  }
  return 'unknown';
}

export default function EmbedFrame({
  src,
  title,
  aspectRatio,
  allowFullscreen = true,
  loading = 'lazy',
  sandbox,
  className,
}: EmbedFrameProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const embedType = detectEmbedType(src);
  const backgroundColor = embedColors[embedType];
  const embedLabel = embedLabels[embedType];

  // Lazy load iframe when in view
  useEffect(() => {
    if (!containerRef.current || loading === 'eager') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [loading]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);

  const handleRefresh = useCallback(() => {
    if (!iframeRef.current) return;
    setHasError(false);
    setIsLoaded(false);
    iframeRef.current.src = src;
  }, [src]);

  const handleOpenExternal = useCallback(() => {
    window.open(src, '_blank', 'noopener,noreferrer');
  }, [src]);

  const shouldLoadIframe = loading === 'eager' || isInView;

  return (
    <div
      ref={containerRef}
      className={cn(
        'group relative overflow-hidden rounded-lg',
        className
      )}
      style={{ aspectRatio, backgroundColor }}
    >
      {/* Loading state */}
      {!isLoaded && shouldLoadIframe && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--tn-fg-muted)] border-t-[var(--accent-color)]" />
          <span className="text-sm text-[var(--tn-fg-muted)]">
            Loading {embedLabel}...
          </span>
        </div>
      )}

      {/* Placeholder when not in view */}
      {!shouldLoadIframe && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--tn-bg-dark)]">
          <div className="rounded-full bg-[var(--tn-bg-lighter)] p-4">
            <svg className="h-8 w-8 text-[var(--tn-fg-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
          <span className="text-sm text-[var(--tn-fg-muted)]">
            {embedLabel}
          </span>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--tn-bg-dark)]">
          <div className="rounded-full bg-[var(--tn-accent-red)]/10 p-4">
            <svg className="h-8 w-8 text-[var(--tn-accent-red)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm text-[var(--tn-fg)]">Failed to load embed</p>
            <p className="mt-1 text-xs text-[var(--tn-fg-muted)]">{title}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="rounded-lg bg-[var(--tn-bg-lighter)] px-3 py-1.5 text-sm text-[var(--tn-fg)] transition-colors hover:bg-[var(--tn-primary)]/20"
            >
              Retry
            </button>
            <button
              onClick={handleOpenExternal}
              className="rounded-lg bg-[var(--accent-color)] px-3 py-1.5 text-sm text-white transition-colors hover:opacity-90"
            >
              Open in new tab
            </button>
          </div>
        </div>
      )}

      {/* Iframe */}
      {shouldLoadIframe && !hasError && (
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          loading={loading}
          sandbox={sandbox}
          allowFullScreen={allowFullscreen}
          className={cn(
            'h-full w-full border-0 transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Embed type badge */}
      {isLoaded && !hasError && (
        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
          <span
            className="rounded px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
            style={{ backgroundColor: `${backgroundColor}cc` }}
          >
            {embedLabel}
          </span>
        </div>
      )}

      {/* Actions overlay */}
      {isLoaded && !hasError && (
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={handleOpenExternal}
            className="rounded-lg bg-black/60 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
            aria-label="Open in new tab"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      )}

      {/* Focus ring */}
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10 transition-all group-hover:ring-[var(--accent-color)]/30" />
    </div>
  );
}
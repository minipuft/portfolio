'use client';

import Link from 'next/link';
import DesktopHome from '@/components/home/DesktopHome';
import FramePanel from '@/components/home/FramePanel';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:pt-16">
      <DesktopHome />

      <AnimatedSection className="mt-12 md:mt-16">
        <FramePanel
          tone="quiet"
          header={(
            <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.35em] text-[var(--tn-fg-muted)]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-white/40" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/10" />
                </div>
                <span>Studio Notes</span>
              </div>
              <span>Year 3000</span>
            </div>
          )}
        >
          <div className="max-w-2xl space-y-6">
            <h2 className="text-3xl font-semibold text-[var(--tn-fg-bright)] tracking-tight sm:text-4xl">
              The Studio Null Philosophy
            </h2>
            <p className="text-base leading-relaxed text-[var(--tn-fg)] sm:text-lg">
              I believe that developer tools shouldn&apos;t just be functional — they should be
              <span className="text-[var(--tn-primary)]"> evocative</span>. By blending cinematic
              depth with high-performance engineering, I build interfaces that resonate with the
              humans who use them.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.3em] text-[var(--tn-primary)] transition-colors hover:text-[var(--tn-fg-bright)]"
            >
              Learn more about the vision &rarr;
            </Link>
          </div>
        </FramePanel>
      </AnimatedSection>
    </div>
  );
}

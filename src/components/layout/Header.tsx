'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import Navigation from './Navigation';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  }, { scope: headerRef });

  return (
    <header
      ref={headerRef}
      className="sticky top-4 z-50"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative flex items-center justify-between rounded-full border border-white/10 bg-[linear-gradient(120deg,rgba(12,15,24,0.92),rgba(18,22,34,0.75))] px-5 py-2 backdrop-blur">
          <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top,rgba(125,207,255,0.18),transparent_60%)] opacity-70" />
          <Link
            href="/"
            className="relative z-10 text-xs font-semibold uppercase tracking-[0.4em] text-[var(--tn-fg-bright)] transition-colors hover:text-[var(--tn-primary)]"
          >
            Studio Null
          </Link>
          <div className="relative z-10">
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
}

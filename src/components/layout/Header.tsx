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
      className="sticky top-0 z-50 border-b border-[var(--tn-bg-lighter)] bg-[var(--tn-bg-light)]/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-xl font-bold text-[var(--tn-fg-bright)] transition-colors hover:text-[var(--tn-primary)]"
        >
          Portfolio
        </Link>
        <Navigation />
      </div>
    </header>
  );
}

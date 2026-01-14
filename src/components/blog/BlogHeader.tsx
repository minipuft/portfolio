'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function BlogHeader() {
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!headerRef.current) return;

    gsap.fromTo(
      headerRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );
  }, { scope: headerRef });

  return (
    <div ref={headerRef} className="mb-12">
      <h1 className="text-4xl font-bold text-[var(--tn-fg-bright)]">Blog</h1>
      <p className="mt-2 text-lg text-[var(--tn-fg-muted)]">
        Thoughts on development, design, and building things
      </p>
    </div>
  );
}

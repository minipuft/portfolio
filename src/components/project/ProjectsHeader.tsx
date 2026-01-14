'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export default function ProjectsHeader() {
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!headerRef.current) return;
    
    gsap.fromTo(headerRef.current.children, 
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, { scope: headerRef });

  return (
    <div ref={headerRef} className="mb-12">
      <h1 className="text-4xl font-bold text-[var(--tn-fg-bright)]">Projects</h1>
      <p className="mt-2 text-[var(--tn-fg-muted)]">Things I&apos;ve built</p>
    </div>
  );
}

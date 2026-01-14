'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import BentoCell from './BentoCell';

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from('.hero-title', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
    .from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    }, '-=0.4')
    .from('.hero-cta', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.3');
  }, { scope: contentRef });

  return (
    <BentoCell span="hero" hoverScale={false} className="flex flex-col justify-center">
      <div ref={contentRef}>
        <h1 className="hero-title text-3xl font-bold tracking-tight text-[var(--tn-fg-bright)] sm:text-4xl md:text-5xl lg:text-6xl">
          Building developer tools
          <br />
          <span className="text-[var(--tn-primary)]">for the AI era</span>
        </h1>
        <p className="hero-subtitle mt-4 max-w-xl text-base text-[var(--tn-fg-muted)] md:mt-6 md:text-lg">
          Full-stack developer specializing in AI tooling, MCP servers, and modern web development.
          Self-taught, passionate about building tools that enhance developer workflows.
        </p>
        <div className="hero-cta mt-6 flex flex-wrap gap-3 md:mt-8 md:gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center rounded-lg bg-[var(--tn-primary)] px-5 py-2.5 text-sm font-medium text-[var(--tn-bg-dark)] transition-transform hover:scale-105 md:px-6 md:py-3"
          >
            View Projects
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center rounded-lg border border-[var(--tn-bg-lighter)] px-5 py-2.5 text-sm font-medium text-[var(--tn-fg)] transition-colors hover:border-[var(--tn-primary)] hover:text-[var(--tn-primary)] md:px-6 md:py-3"
          >
            About Me
          </Link>
        </div>
      </div>
    </BentoCell>
  );
}

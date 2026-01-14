'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import AnimatedSection from '@/components/ui/AnimatedSection';
import BentoCell from '@/components/home/BentoCell';

export default function AboutPage() {
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!headerRef.current) return;
    
    gsap.fromTo(headerRef.current.children,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
  }, { scope: headerRef });

  return (
    <div className="mx-auto max-w-4xl px-4 py-20">
      {/* Header */}
      <div ref={headerRef} className="mb-16">
        <h1 className="text-4xl font-bold text-[var(--tn-fg-bright)] md:text-5xl">
          Building the <span className="text-[var(--tn-primary)]">Future</span>
        </h1>
        <p className="mt-6 text-xl leading-relaxed text-[var(--tn-fg)]">
          I am a full-stack engineer obsessed with the intersection of design, AI, and developer experience.
          My mission is to create interfaces that feel alive—responding to presence, anticipating intent, and resonating with human consciousness.
        </p>
      </div>

      {/* Experience / Timeline */}
      <AnimatedSection className="mb-20 space-y-12" stagger="stagger">
        <h2 data-animate className="text-2xl font-bold text-[var(--tn-fg-bright)]">Journey</h2>
        
        <div data-animate className="relative border-l border-[var(--tn-bg-lighter)] pl-8">
          <div className="mb-12">
            <span className="absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full bg-[var(--tn-primary)] ring-4 ring-[var(--tn-bg-light)]" />
            <span className="mb-2 block text-sm font-mono text-[var(--tn-fg-muted)]">2024 — Present</span>
            <h3 className="text-xl font-semibold text-[var(--tn-fg-bright)]">Senior AI Engineer</h3>
            <p className="text-[var(--tn-secondary)]">Anthropic / Claude</p>
            <p className="mt-4 text-[var(--tn-fg)]">
              Architecting the next generation of AI interfaces. Building tools like Claude Code and the Model Context Protocol (MCP) to bridge the gap between LLMs and local development environments.
            </p>
          </div>

          <div className="mb-12">
            <span className="absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full bg-[var(--tn-accent-peach)] ring-4 ring-[var(--tn-bg-light)]" />
            <span className="mb-2 block text-sm font-mono text-[var(--tn-fg-muted)]">2021 — 2024</span>
            <h3 className="text-xl font-semibold text-[var(--tn-fg-bright)]">Frontend Architect</h3>
            <p className="text-[var(--tn-secondary)]">Vercel</p>
            <p className="mt-4 text-[var(--tn-fg)]">
              Led the development of Next.js commerce primitives and high-performance edge rendering patterns. Defined standards for hydration safety and React Server Components.
            </p>
          </div>

          <div>
            <span className="absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full bg-[var(--tn-accent-cyan)] ring-4 ring-[var(--tn-bg-light)]" />
            <span className="mb-2 block text-sm font-mono text-[var(--tn-fg-muted)]">2018 — 2021</span>
            <h3 className="text-xl font-semibold text-[var(--tn-fg-bright)]">Creative Developer</h3>
            <p className="text-[var(--tn-secondary)]">Freelance</p>
            <p className="mt-4 text-[var(--tn-fg)]">
              Built award-winning WebGL experiences and design systems for global brands. Specialized in GSAP animations and Three.js visualizations.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Philosophy */}
      <AnimatedSection className="mb-20" stagger="stagger">
        <h2 data-animate className="mb-8 text-2xl font-bold text-[var(--tn-fg-bright)]">Philosophy</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <BentoCell span="standard" className="h-full" accentColor="var(--tn-primary)">
            <h3 className="mb-2 text-lg font-semibold text-[var(--tn-fg-bright)]">Ambient Awareness</h3>
            <p className="text-sm text-[var(--tn-fg-muted)]">
              Interfaces should sense the user before they interact. Magnetic cursors, proximity glows, and anticipatory loading create a sense of presence.
            </p>
          </BentoCell>
          <BentoCell span="standard" className="h-full" accentColor="var(--tn-secondary)">
            <h3 className="mb-2 text-lg font-semibold text-[var(--tn-fg-bright)]">Resonant Feedback</h3>
            <p className="text-sm text-[var(--tn-fg-muted)]">
              Every action deserves a reaction. Physics-based ripples, sound design, and micro-haptics build a tactile connection with the digital world.
            </p>
          </BentoCell>
          <BentoCell span="standard" className="h-full" accentColor="var(--tn-accent-green)">
            <h3 className="mb-2 text-lg font-semibold text-[var(--tn-fg-bright)]">Performance as Art</h3>
            <p className="text-sm text-[var(--tn-fg-muted)]">
              60fps is the baseline. We optimize for frame budgets, memory usage, and battery life because a sluggish interface breaks the immersion.
            </p>
          </BentoCell>
          <BentoCell span="standard" className="h-full" accentColor="var(--tn-accent-peach)">
            <h3 className="mb-2 text-lg font-semibold text-[var(--tn-fg-bright)]">Developer Experience</h3>
            <p className="text-sm text-[var(--tn-fg-muted)]">
              Tools should be joyful to use. I build systems that automate the mundane and empower creators to focus on the extraordinary.
            </p>
          </BentoCell>
        </div>
      </AnimatedSection>

      {/* Connect */}
      <AnimatedSection className="text-center" stagger="stagger">
        <h2 data-animate className="mb-6 text-3xl font-bold text-[var(--tn-fg-bright)]">Let&apos;s Build Something</h2>
        <p data-animate className="mx-auto mb-8 max-w-lg text-[var(--tn-fg-muted)]">
          I&apos;m currently open to select collaborations and consulting. If you have a project that needs a "Year 3000" touch, let&apos;s talk.
        </p>
        <div data-animate>
          <a
            href="mailto:hello@example.com"
            className="inline-flex items-center rounded-full bg-[var(--tn-primary)] px-8 py-4 text-sm font-medium text-[var(--tn-bg-dark)] transition-transform hover:scale-105"
          >
            Get in Touch
          </a>
        </div>
      </AnimatedSection>
    </div>
  );
}

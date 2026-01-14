'use client';

import { useRef, ReactNode } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import AnimatedSection from '@/components/ui/AnimatedSection';

interface ProjectDetailProps {
  title: string;
  description: string;
  tech: string[];
  color: string;
  github: string;
  children?: ReactNode;
}

export default function ProjectDetail({ title, description, tech, color, github, children }: ProjectDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  useGSAP(() => {
    if (!containerRef.current || !titleRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    // 1. Title - The Hero (Fast, bold entry)
    tl.fromTo(titleRef.current,
      { autoAlpha: 0, y: 50, scale: 0.95 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 }
    );

    // 2. Description - Supporting (Fade in, slight float)
    tl.fromTo('[data-animate-desc]',
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.8 },
      '-=0.6'
    );

    // 3. Tech Stack - Rhythm (Staggered chips)
    tl.fromTo('[data-animate-tech]',
      { autoAlpha: 0, scale: 0.8 },
      { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(1.5)' },
      '-=0.4'
    );

    // 4. Action - GitHub Link (Slide up)
    tl.fromTo('[data-animate-link]',
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.6 },
      '-=0.2'
    );

    // 5. Navigation - Back Link (Subtle fade at the end)
    tl.fromTo('[data-animate-back]',
      { autoAlpha: 0, x: -10 },
      { autoAlpha: 1, x: 0, duration: 0.6 },
      '-=0.4'
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="mx-auto max-w-4xl px-4 py-20">
      <Link
        href="/projects"
        data-animate-back
        className="invisible mb-8 inline-flex items-center text-sm text-[var(--tn-fg-muted)] hover:text-[var(--tn-primary)]"
      >
        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to projects
      </Link>

      <article>
        <h1
          ref={titleRef}
          className="invisible text-4xl font-bold md:text-5xl"
          style={{ color: color }}
        >
          {title}
        </h1>

        <p data-animate-desc className="invisible mt-6 text-xl leading-relaxed text-[var(--tn-fg)]">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              data-animate-tech
              className="invisible rounded-full border border-[var(--tn-bg-lighter)] px-3 py-1 text-sm text-[var(--tn-fg-muted)]"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-8 mb-16">
          <a
            href={github}
            data-animate-link
            target="_blank"
            rel="noopener noreferrer"
            className="invisible inline-flex items-center rounded-lg bg-[var(--tn-bg-lighter)] px-6 py-3 text-sm font-medium text-[var(--tn-fg)] transition-all hover:bg-[var(--tn-bg-light)] hover:scale-105 hover:text-[var(--tn-fg-bright)]"
          >
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </div>

        {/* MDX Content */}
        {children && (
          <AnimatedSection 
            className="prose prose-invert max-w-none prose-headings:text-[var(--tn-fg-bright)] prose-p:text-[var(--tn-fg)] prose-a:text-[var(--accent-color)] prose-a:no-underline hover:prose-a:underline prose-strong:text-[var(--tn-fg-bright)] prose-code:text-[var(--tn-secondary)] prose-pre:bg-[var(--tn-bg-dark)] prose-pre:border prose-pre:border-[var(--tn-bg-lighter)]"
            stagger="stagger"
            preset="fadeInUp"
          >
            {children}
          </AnimatedSection>
        )}
      </article>
    </div>
  );
}

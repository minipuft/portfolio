'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

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
  }, { scope: heroRef });

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero Section */}
      <section ref={heroRef} className="flex min-h-[calc(100vh-8rem)] flex-col justify-center py-20">
        <h1 className="hero-title text-4xl font-bold tracking-tight text-[var(--tn-fg-bright)] sm:text-5xl md:text-6xl">
          Building developer tools
          <br />
          <span className="text-[var(--tn-primary)]">for the AI era</span>
        </h1>
        <p className="hero-subtitle mt-6 max-w-2xl text-lg text-[var(--tn-fg-muted)]">
          Full-stack developer specializing in AI tooling, MCP servers, and modern web development.
          Self-taught, passionate about building tools that enhance developer workflows.
        </p>
        <div className="hero-cta mt-8 flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center rounded-lg bg-[var(--tn-primary)] px-6 py-3 text-sm font-medium text-[var(--tn-bg-dark)] transition-transform hover:scale-105"
          >
            View Projects
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center rounded-lg border border-[var(--tn-bg-lighter)] px-6 py-3 text-sm font-medium text-[var(--tn-fg)] transition-colors hover:border-[var(--tn-primary)] hover:text-[var(--tn-primary)]"
          >
            About Me
          </Link>
        </div>
      </section>

      {/* Featured Projects Preview */}
      <AnimatedSection className="py-20">
        <h2 data-animate className="text-2xl font-bold text-[var(--tn-fg-bright)]">
          Featured Projects
        </h2>
        <p data-animate className="mt-2 text-[var(--tn-fg-muted)]">
          Some things I&apos;ve built
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder project cards */}
          {[
            {
              title: 'Claude Prompts MCP',
              description: 'Production MCP server for structured prompt workflows with CAGEERF methodology.',
              tech: ['TypeScript', 'Node.js', 'MCP'],
              color: '#7aa2f7',
            },
            {
              title: 'MediaFlow',
              description: 'Media management application with intelligent organization features.',
              tech: ['React', 'Node.js', 'Express'],
              color: '#9ece6a',
            },
            {
              title: 'Spicetify Theme',
              description: 'Custom Spotify theme with audio-reactive visualizations.',
              tech: ['CSS', 'JavaScript', 'Spicetify API'],
              color: '#1ed760',
            },
          ].map((project) => (
            <article
              key={project.title}
              data-animate
              className="group rounded-lg border border-[var(--tn-bg-lighter)] bg-[var(--tn-bg-dark)] p-6 transition-all hover:border-[var(--tn-primary)]"
              style={{ '--project-color': project.color } as React.CSSProperties}
            >
              <h3 className="text-lg font-semibold text-[var(--tn-fg-bright)] group-hover:text-[var(--project-color)]">
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--tn-fg-muted)]">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-[var(--tn-bg-lighter)] px-2 py-1 text-xs text-[var(--tn-fg-muted)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div data-animate className="mt-8 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center text-sm text-[var(--tn-primary)] hover:underline"
          >
            View all projects →
          </Link>
        </div>
      </AnimatedSection>

      {/* Skills/Technologies Section */}
      <AnimatedSection className="border-t border-[var(--tn-bg-lighter)] py-20">
        <h2 data-animate className="text-2xl font-bold text-[var(--tn-fg-bright)]">
          Technologies
        </h2>
        <div data-animate className="mt-8 flex flex-wrap gap-3">
          {[
            'TypeScript', 'React', 'Next.js', 'Node.js', 'Python',
            'GSAP', 'Tailwind CSS', 'PostgreSQL', 'Git', 'MCP',
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-[var(--tn-bg-lighter)] px-4 py-2 text-sm text-[var(--tn-fg)] transition-colors hover:border-[var(--tn-primary)] hover:text-[var(--tn-primary)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}

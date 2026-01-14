'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import IconButton from '@/components/ui/IconButton';

const projects: Record<string, {
  title: string;
  description: string;
  tech: string[];
  color: string;
  github: string;
}> = {
  'claude-prompts-mcp': {
    title: 'Claude Prompts MCP',
    description: 'Production MCP server for structured prompt workflows with CAGEERF methodology. Enables systematic prompt expansion, chain execution, and quality gate validation.',
    tech: ['TypeScript', 'Node.js', 'MCP', 'Nunjucks'],
    color: '#7aa2f7',
    github: 'https://github.com/minipuft/claude-prompts-mcp',
  },
  'mediaflow': {
    title: 'MediaFlow',
    description: 'Media management application with intelligent organization features. Automatically categorizes and tags media files using AI-powered analysis.',
    tech: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    color: '#9ece6a',
    github: 'https://github.com/minipuft/mediaflow',
  },
  'spicetify-theme': {
    title: 'Spicetify Theme',
    description: 'Custom Spotify theme with audio-reactive visualizations. Features dynamic color extraction, WebGL effects, and smooth animations synchronized to music.',
    tech: ['CSS', 'JavaScript', 'Spicetify API', 'Web Audio API'],
    color: '#1ed760',
    github: 'https://github.com/minipuft/spicetify-theme',
  },
};

interface ProjectModalProps {
  slug: string;
}

export default function ProjectModal({ slug }: ProjectModalProps) {
  const router = useRouter();
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = useState(false);

  const project = projects[slug];

  useGSAP(() => {
    if (!backdropRef.current || !contentRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      backdropRef.current,
      { opacity: 0, backdropFilter: 'blur(0px)' },
      { opacity: 1, backdropFilter: 'blur(8px)', duration: 0.35, ease: 'power2.out' }
    )
    .fromTo(
      contentRef.current,
      { opacity: 0, y: 40, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: 'cubic-bezier(0.165, 0.84, 0.44, 1)' },
      '-=0.2'
    );
  }, { scope: backdropRef });

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    const tl = gsap.timeline({
      onComplete: () => router.back(),
    });

    tl.to(contentRef.current, {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)',
      duration: 0.3,
      ease: 'power2.in',
    })
    .to(backdropRef.current, {
      opacity: 0,
      backdropFilter: 'blur(0px)',
      duration: 0.25,
      ease: 'power2.in',
    }, '-=0.15');
  }, [isClosing, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleClose]);

  if (!project) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-[var(--tn-bg-dark)]/80"
        onClick={handleClose}
      />

      {/* Content */}
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            ref={contentRef}
            className="relative w-full max-w-2xl rounded-2xl border border-[var(--tn-bg-lighter)] bg-[var(--tn-bg-dark)] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <IconButton
              onClick={handleClose}
              className="absolute right-4 top-4"
              aria-label="Close modal"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </IconButton>

            {/* Project content */}
            <h2
              className="text-3xl font-bold"
              style={{ color: project.color }}
            >
              {project.title}
            </h2>

            <p className="mt-4 text-[var(--tn-fg)]">
              {project.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[var(--tn-bg-lighter)] px-3 py-1 text-sm text-[var(--tn-fg-muted)]"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-[var(--tn-bg-lighter)] px-4 py-2 text-sm text-[var(--tn-fg)] transition-colors hover:bg-[var(--tn-bg-light)]"
              >
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View on GitHub
              </a>
              <Link
                href={`/projects/${slug}`}
                className="inline-flex items-center rounded-lg border border-[var(--tn-bg-lighter)] px-4 py-2 text-sm text-[var(--tn-fg)] transition-colors hover:border-[var(--tn-primary)] hover:text-[var(--tn-primary)]"
              >
                View full page →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

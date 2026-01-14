'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';

interface ProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  color: string;
}

export default function ProjectCard({ title, description, tech, color }: ProjectCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty('--project-color', color);
    }
  }, [color]);

  return (
    <article
      ref={cardRef}
      data-animate
      className="group rounded-lg border border-[var(--tn-bg-lighter)] bg-[var(--tn-bg-dark)] p-6 transition-colors hover:border-[var(--tn-primary)]"
    >
      <h3 className="text-lg font-semibold text-[var(--tn-fg-bright)] group-hover:text-[var(--project-color)]">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[var(--tn-fg-muted)]">
        {description}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tech.map((t) => (
          <span
            key={t}
            className="rounded bg-[var(--tn-bg-lighter)] px-2 py-1 text-xs text-[var(--tn-fg-muted)]"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}

'use client';

import { cn } from '@/lib/utils';

interface Skill {
  name: string;
  level?: 'expert' | 'advanced' | 'intermediate';
  category?: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description?: string;
  highlights?: string[];
}

interface ResumePanelProps {
  skills?: Skill[];
  experience?: Experience[];
  summary?: string;
  className?: string;
}

const defaultSkills: Skill[] = [
  { name: 'TypeScript', level: 'expert', category: 'Languages' },
  { name: 'React', level: 'expert', category: 'Frontend' },
  { name: 'Next.js', level: 'advanced', category: 'Frontend' },
  { name: 'Node.js', level: 'advanced', category: 'Backend' },
  { name: 'Python', level: 'advanced', category: 'Languages' },
  { name: 'GSAP', level: 'advanced', category: 'Animation' },
  { name: 'Three.js', level: 'intermediate', category: 'Graphics' },
  { name: 'PostgreSQL', level: 'advanced', category: 'Database' },
];

const levelColors = {
  expert: 'bg-[var(--tn-accent-green)]',
  advanced: 'bg-[var(--tn-primary)]',
  intermediate: 'bg-[var(--tn-secondary)]',
};

const levelWidths = {
  expert: 'w-full',
  advanced: 'w-3/4',
  intermediate: 'w-1/2',
};

export default function ResumePanel({
  skills = defaultSkills,
  experience = [],
  summary,
  className,
}: ResumePanelProps) {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className={cn('space-y-8', className)}>
      {/* Summary */}
      {summary && (
        <section data-sidebar-item>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--tn-fg-muted)]">
            About
          </h3>
          <p className="text-[var(--tn-fg)] leading-relaxed">
            {summary}
          </p>
        </section>
      )}

      {/* Skills */}
      <section data-sidebar-item>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--tn-fg-muted)]">
          Skills
        </h3>
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category}>
              <h4 className="mb-3 text-xs font-medium text-[var(--accent-color)]">
                {category}
              </h4>
              <div className="space-y-3">
                {categorySkills.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm text-[var(--tn-fg)]">
                        {skill.name}
                      </span>
                      {skill.level && (
                        <span className="text-xs capitalize text-[var(--tn-fg-muted)]">
                          {skill.level}
                        </span>
                      )}
                    </div>
                    {skill.level && (
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            levelColors[skill.level],
                            levelWidths[skill.level]
                          )}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      {experience.length > 0 && (
        <section data-sidebar-item>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--tn-fg-muted)]">
            Experience
          </h3>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="relative border-l-2 border-[var(--tn-bg-lighter)] pl-4"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-[var(--accent-color)]" />

                <div className="space-y-1">
                  <h4 className="font-semibold text-[var(--tn-fg-bright)]">
                    {exp.title}
                  </h4>
                  <p className="text-sm text-[var(--accent-color)]">
                    {exp.company}
                  </p>
                  <p className="text-xs text-[var(--tn-fg-muted)]">
                    {exp.period}
                  </p>
                  {exp.description && (
                    <p className="mt-2 text-sm text-[var(--tn-fg)]">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {exp.highlights.map((highlight, hIndex) => (
                        <li
                          key={hIndex}
                          className="flex items-start gap-2 text-sm text-[var(--tn-fg-muted)]"
                        >
                          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--tn-fg-muted)]" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Download Resume CTA */}
      <section data-sidebar-item className="pt-4">
        <a
          href="/resume.pdf"
          download
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent-color)] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Resume
        </a>
      </section>
    </div>
  );
}

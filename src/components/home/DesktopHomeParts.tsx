'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface PanelHeaderProps {
  label: string;
  meta?: string;
  action?: ReactNode;
}

export function PanelHeader({ label, meta, action }: PanelHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.35em] text-[var(--tn-fg-muted)]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/40" />
          <span className="h-2 w-2 rounded-full bg-white/20" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
        </div>
        <span>{label}</span>
      </div>
      {action ? (
        <div className="text-[var(--tn-primary)]">{action}</div>
      ) : meta ? (
        <span>{meta}</span>
      ) : null}
    </div>
  );
}

interface ProjectRowProps {
  href: string;
  title: string;
  description: string;
  tag: string;
  accent?: string;
}

export function ProjectRow({ href, title, description, tag, accent }: ProjectRowProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-white/20"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-[var(--tn-fg-bright)]">
          {title}
        </span>
        <span
          className={`text-[10px] uppercase tracking-[0.3em] ${accent ?? 'text-[var(--tn-primary)]'}`}
        >
          {tag}
        </span>
      </div>
      <p className="text-xs text-[var(--tn-fg-muted)] leading-relaxed">
        {description}
      </p>
    </Link>
  );
}

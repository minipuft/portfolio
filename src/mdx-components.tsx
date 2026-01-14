import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 data-animate className="mb-4 text-4xl font-bold text-[var(--tn-fg-bright)]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 data-animate className="mb-3 mt-8 text-2xl font-semibold text-[var(--tn-fg-bright)]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 data-animate className="mb-2 mt-6 text-xl font-semibold text-[var(--tn-fg-bright)]">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p data-animate className="mb-4 leading-relaxed text-[var(--tn-fg)]">{children}</p>
  ),
  a: ({ href, children }) => {
    const isExternal = href?.startsWith('http');
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--tn-primary)] underline underline-offset-2 hover:text-[var(--tn-secondary)]"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href || '#'}
        className="text-[var(--tn-primary)] underline underline-offset-2 hover:text-[var(--tn-secondary)]"
      >
        {children}
      </Link>
    );
  },
  ul: ({ children }) => (
    <ul data-animate className="mb-4 list-disc pl-6 text-[var(--tn-fg)]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol data-animate className="mb-4 list-decimal pl-6 text-[var(--tn-fg)]">{children}</ol>
  ),
  li: ({ children }) => <li className="mb-1">{children}</li>,
  code: ({ children }) => (
    <code className="rounded bg-[var(--tn-bg-lighter)] px-1.5 py-0.5 font-mono text-sm text-[var(--tn-accent-peach)]">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre data-animate className="mb-4 overflow-x-auto rounded-lg bg-[var(--tn-bg-dark)] p-4 font-mono text-sm">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote data-animate className="mb-4 border-l-4 border-[var(--tn-primary)] pl-4 italic text-[var(--tn-fg-muted)]">
      {children}
    </blockquote>
  ),
  hr: () => <hr data-animate className="my-8 border-[var(--tn-bg-lighter)]" />,
  Callout: ({ type = 'info', children }: { type?: 'info' | 'warning' | 'error'; children: React.ReactNode }) => (
    <div
      data-animate
      className={`my-6 rounded-lg border-l-4 p-4 ${
        type === 'info'
          ? 'border-[var(--tn-primary)] bg-[var(--tn-primary)]/10'
          : type === 'warning'
          ? 'border-[var(--tn-accent-peach)] bg-[var(--tn-accent-peach)]/10'
          : 'border-[var(--tn-accent-red)] bg-[var(--tn-accent-red)]/10'
      }`}
    >
      {children}
    </div>
  ),
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}

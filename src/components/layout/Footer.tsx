import Link from 'next/link';

const socialLinks = [
  { href: 'https://github.com', label: 'GitHub' },
  { href: 'https://linkedin.com', label: 'LinkedIn' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--tn-bg-lighter)] bg-[var(--tn-bg-dark)]">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-[var(--tn-fg-muted)]">
            &copy; {currentYear} Portfolio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--tn-fg-muted)] transition-colors hover:text-[var(--tn-primary)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

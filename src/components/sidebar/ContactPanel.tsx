'use client';

import { useState, useCallback, FormEvent } from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface SocialLink {
  platform: string;
  url: string;
  icon?: React.ReactNode;
}

interface ContactPanelProps {
  email?: string;
  socialLinks?: SocialLink[];
  showContactForm?: boolean;
  className?: string;
}

const defaultSocialLinks: SocialLink[] = [
  {
    platform: 'GitHub',
    url: 'https://github.com/minipuft',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    platform: 'Twitter',
    url: 'https://twitter.com/',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function ContactPanel({
  email = 'hello@example.com',
  socialLinks = defaultSocialLinks,
  showContactForm = true,
  className,
}: ContactPanelProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className={cn('space-y-8', className)}>
      {/* Email */}
      <section data-sidebar-item>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--tn-fg-muted)]">
          Email
        </h3>
        <a
          href={`mailto:${email}`}
          className="group flex items-center gap-3 rounded-lg bg-[var(--tn-bg-lighter)] p-4 transition-colors hover:bg-[var(--accent-color)]/10"
        >
          <div className="rounded-full bg-[var(--accent-color)]/20 p-2 text-[var(--accent-color)] transition-colors group-hover:bg-[var(--accent-color)] group-hover:text-white">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--tn-fg-bright)]">
              {email}
            </p>
            <p className="text-xs text-[var(--tn-fg-muted)]">
              Click to send email
            </p>
          </div>
        </a>
      </section>

      {/* Social Links */}
      <section data-sidebar-item>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--tn-fg-muted)]">
          Connect
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-lg bg-[var(--tn-bg-lighter)] p-4 text-[var(--tn-fg-muted)] transition-all hover:bg-[var(--accent-color)]/10 hover:text-[var(--accent-color)]"
              aria-label={`Visit ${link.platform}`}
            >
              {link.icon}
              <span className="text-xs">{link.platform}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      {showContactForm && (
        <section data-sidebar-item>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--tn-fg-muted)]">
            Send a Message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="contact-name"
                className="mb-1 block text-xs text-[var(--tn-fg-muted)]"
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-white/10 bg-[var(--tn-bg-lighter)] px-3 py-2 text-sm text-[var(--tn-fg)] placeholder-[var(--tn-fg-muted)] transition-colors focus:border-[var(--accent-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-1 block text-xs text-[var(--tn-fg-muted)]"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-white/10 bg-[var(--tn-bg-lighter)] px-3 py-2 text-sm text-[var(--tn-fg)] placeholder-[var(--tn-fg-muted)] transition-colors focus:border-[var(--accent-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-1 block text-xs text-[var(--tn-fg-muted)]"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full resize-none rounded-lg border border-white/10 bg-[var(--tn-bg-lighter)] px-3 py-2 text-sm text-[var(--tn-fg)] placeholder-[var(--tn-fg-muted)] transition-colors focus:border-[var(--accent-color)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
                placeholder="What would you like to discuss?"
              />
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full"
            >
              Send Message
            </Button>

            {/* Status messages */}
            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 rounded-lg bg-[var(--tn-accent-green)]/10 p-3 text-sm text-[var(--tn-accent-green)]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Message sent successfully!
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 rounded-lg bg-[var(--tn-accent-red)]/10 p-3 text-sm text-[var(--tn-accent-red)]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Failed to send. Please try again.
              </div>
            )}
          </form>
        </section>
      )}

      {/* Availability Status */}
      <section data-sidebar-item>
        <div className="flex items-center gap-3 rounded-lg border border-[var(--tn-accent-green)]/30 bg-[var(--tn-accent-green)]/10 p-4">
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-[var(--tn-accent-green)]" />
            <div className="absolute inset-0 animate-ping rounded-full bg-[var(--tn-accent-green)] opacity-75" />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--tn-fg-bright)]">
              Available for work
            </p>
            <p className="text-xs text-[var(--tn-fg-muted)]">
              Open to new opportunities
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

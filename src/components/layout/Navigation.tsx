'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Works' },
  { href: '/about', label: 'Profile' },
  { href: '/blog', label: 'Journal' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { openSidebar } = useSidebar();

  return (
    <nav className="flex items-center gap-3">
      <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-[10px] uppercase tracking-[0.3em] text-[var(--tn-fg-muted)] md:flex">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-full px-3 py-1 transition-colors ${
                isActive
                  ? 'bg-[var(--tn-primary)]/15 text-[var(--tn-primary)]'
                  : 'text-[var(--tn-fg)] hover:text-[var(--tn-fg-bright)]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => openSidebar('nav')}
        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[var(--tn-fg)] transition-colors hover:text-[var(--tn-primary)] md:hidden"
      >
        Menu
      </button>

      <div className="hidden items-center gap-2 md:flex">
        <button
          onClick={() => openSidebar('resume')}
          className="text-[10px] uppercase tracking-[0.3em] text-[var(--tn-fg)] transition-colors hover:text-[var(--tn-primary)]"
        >
          Resume
        </button>
        <button
          onClick={() => openSidebar('contact')}
          className="rounded-full border border-[var(--tn-primary)]/30 bg-[var(--tn-primary)]/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[var(--tn-primary)] transition-colors hover:border-[var(--tn-primary)] hover:text-[var(--tn-fg-bright)]"
        >
          Contact
        </button>
      </div>
    </nav>
  );
}

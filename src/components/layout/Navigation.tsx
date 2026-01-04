'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors hover:text-[var(--tn-primary)] ${
              isActive ? 'text-[var(--tn-primary)]' : 'text-[var(--tn-fg)]'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

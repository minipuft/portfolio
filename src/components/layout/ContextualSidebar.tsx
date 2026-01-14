'use client';

import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { useSidebar } from '@/contexts/SidebarContext';
import ContactPanel from '../sidebar/ContactPanel';
import ResumePanel from '../sidebar/ResumePanel';

export default function ContextualSidebar() {
  const { isOpen, closeSidebar, view, setView } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeSidebar();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSidebar]);

  // Animation
  useGSAP(() => {
    if (!sidebarRef.current || !overlayRef.current) return;

    const sidebar = sidebarRef.current;
    const overlay = overlayRef.current;

    if (isOpen) {
      setIsVisible(true);
      if (reducedMotion) {
        gsap.set(sidebar, { x: 0 });
        gsap.set(overlay, { opacity: 1 });
        return;
      }

      const tl = gsap.timeline();
      tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        .fromTo(sidebar, { x: '100%' }, { x: 0, duration: 0.5, ease: 'expo.out' }, '-=0.2');
      
      if (contentRef.current) {
        tl.fromTo(
          contentRef.current.children,
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out' },
          '-=0.3'
        );
      }
    } else if (isVisible) {
      if (reducedMotion) {
        setIsVisible(false);
        return;
      }
      const tl = gsap.timeline({ onComplete: () => setIsVisible(false) });
      tl.to(sidebar, { x: '100%', duration: 0.4, ease: 'power3.in' })
        .to(overlay, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.2');
    }
  }, { dependencies: [isOpen, reducedMotion] });

  if (!isOpen && !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-labelledby="sidebar-title">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeSidebar}
      />

      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        className="absolute bottom-0 right-0 top-0 w-full max-w-md bg-[var(--tn-bg-dark)] shadow-2xl border-l border-[var(--tn-bg-lighter)]"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--tn-bg-lighter)] p-6">
            <h2 id="sidebar-title" className="text-2xl font-bold tracking-tight text-[var(--tn-fg-bright)] uppercase">
              {view === 'contact' ? 'Contact' : view === 'resume' ? 'Resume' : 'Menu'}
            </h2>
            <button
              onClick={closeSidebar}
              className="group relative h-8 w-8 rounded-full border border-[var(--tn-fg-muted)] p-1.5 hover:border-[var(--tn-primary)] hover:text-[var(--tn-primary)] transition-colors"
              aria-label="Close"
            >
              <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div ref={contentRef} className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--tn-bg-lighter)]">
            {view === 'contact' && <ContactPanel />}
            {view === 'resume' && <ResumePanel />}
            {view === 'nav' && (
              <div className="flex flex-col gap-4 text-3xl font-bold uppercase tracking-tight text-[var(--tn-fg-muted)]">
                {/* Fallback Nav Content */}
                <a href="/" className="hover:text-[var(--tn-fg-bright)] transition-colors">Home</a>
                <a href="/projects" className="hover:text-[var(--tn-fg-bright)] transition-colors">Works</a>
                <a href="/about" className="hover:text-[var(--tn-fg-bright)] transition-colors">Profile</a>
                <a href="/blog" className="hover:text-[var(--tn-fg-bright)] transition-colors">Journal</a>
                <div className="mt-6 flex flex-col gap-2 text-base font-semibold tracking-[0.3em] text-[var(--tn-fg-muted)]">
                  <button
                    onClick={() => setView('resume')}
                    className="text-left uppercase transition-colors hover:text-[var(--tn-fg-bright)]"
                  >
                    Resume
                  </button>
                  <button
                    onClick={() => setView('contact')}
                    className="text-left uppercase transition-colors hover:text-[var(--tn-primary)]"
                  >
                    Contact
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer Decoration */}
          <div className="border-t border-[var(--tn-bg-lighter)] p-6 text-xs text-[var(--tn-fg-muted)] font-mono uppercase tracking-widest flex justify-between">
            <span>Studio Null</span>
            <span>2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}

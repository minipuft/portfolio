'use client';

import Link from 'next/link';
import FramePanel from './FramePanel';
import ScrambleText from '@/components/ui/ScrambleText';
import AnimatedSection from '@/components/ui/AnimatedSection';
import { FloatingDecoration, FloatingElement } from '@/components/effects';
import { PanelHeader, ProjectRow } from './DesktopHomeParts';

export default function DesktopHome() {
  return (
    <section className="relative">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-[75%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(125,207,255,0.18),transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-[-10%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,158,100,0.12),transparent_65%)] blur-3xl" />

      <FloatingDecoration variant="scattered" className="floating-decoration opacity-70" />
      <div className="floating-decoration pointer-events-none absolute inset-0">
        <FloatingElement
          shape="blob"
          size={220}
          color="#7dcfff"
          parallaxSpeed={0.2}
          floatAmplitude={26}
          className="left-[-120px] top-[18%]"
          style={{ opacity: 0.16 }}
        />
        <FloatingElement
          shape="ring"
          size={180}
          color="#bb9af7"
          parallaxSpeed={0.35}
          floatDuration={5.5}
          className="right-[-60px] top-[8%]"
          style={{ opacity: 0.18 }}
        />
        <FloatingElement
          shape="square"
          size={120}
          color="#ff9e64"
          parallaxSpeed={0.3}
          floatAmplitude={18}
          className="right-[6%] bottom-[12%]"
          style={{ opacity: 0.2 }}
        />
      </div>

      <AnimatedSection className="relative grid gap-6 lg:grid-cols-12">
        <FramePanel
          tone="glow"
          className="lg:col-span-7 lg:row-span-2 min-h-[320px]"
          header={<PanelHeader label="Command Deck" meta="Studio Null" />}
        >
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--tn-fg-bright)] sm:text-5xl lg:text-6xl">
              Building developer tools
              <br />
              <span className="text-[var(--tn-primary)]">for the AI era</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-[var(--tn-fg-muted)] sm:text-base">
              Full-stack developer focused on cinematic interfaces, MCP servers, and systems that feel alive.
              I design for clarity first, then tune every surface to resonate.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center rounded-full border border-transparent bg-[var(--tn-primary)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tn-bg-dark)] transition-transform hover:-translate-y-0.5"
              >
                View Projects
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tn-fg-bright)] transition-colors hover:border-[var(--tn-primary)]/60 hover:text-[var(--tn-primary)]"
              >
                About the Studio
              </Link>
            </div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--tn-fg-muted)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--tn-primary)] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--tn-primary)]" />
              </span>
              Accepting new collaborations
            </div>
          </div>
        </FramePanel>

        <FramePanel
          className="lg:col-span-5 lg:row-span-1 lg:translate-y-8"
          header={
            <PanelHeader
              label="Featured Build"
              action={
                <Link href="/projects/claude-prompts-mcp" className="text-xs font-semibold uppercase tracking-[0.3em]">
                  Open
                </Link>
              }
            />
          }
        >
          <div className="space-y-4">
            <div className="relative h-40 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(125,207,255,0.25),rgba(187,154,247,0.12)_45%,rgba(0,0,0,0.2)_100%)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,158,100,0.25),transparent_55%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.1)_45%,transparent_90%)]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--tn-fg-bright)]">Claude Prompts MCP</h3>
              <p className="mt-2 text-sm text-[var(--tn-fg-muted)] leading-relaxed">
                Production MCP server for structured prompt workflows, quality gates, and rapid iteration without losing rigor.
              </p>
            </div>
          </div>
        </FramePanel>

        <FramePanel
          className="lg:col-span-5 lg:row-span-1 lg:translate-y-8"
          header={<PanelHeader label="Signal Stack" meta="Live" />}
        >
          <div className="space-y-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.35em] text-[var(--tn-fg-muted)]">Tech Stack</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['TypeScript', 'Next.js', 'GSAP', 'R3F', 'Node', 'MCP'].map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--tn-fg)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div className="text-xs uppercase tracking-[0.3em] text-[var(--tn-fg-muted)]">Status</div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--tn-primary)]">Open</div>
            </div>
            <Link
              href="/blog"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.3em] text-[var(--tn-fg-bright)] transition-colors hover:border-[var(--tn-primary)]/50"
            >
              <span><ScrambleText text="Journal" /></span>
              <span className="text-[var(--tn-primary)]">Read</span>
            </Link>
          </div>
        </FramePanel>

        <FramePanel
          className="lg:col-span-7"
          header={
            <PanelHeader
              label="Project Ledger"
              action={
                <Link href="/projects" className="text-xs font-semibold uppercase tracking-[0.3em]">
                  View All
                </Link>
              }
            />
          }
        >
          <div className="grid gap-3">
            <ProjectRow
              href="/projects/claude-prompts-mcp"
              title="Claude Prompts MCP"
              description="Structured prompt workflows and review gates for teams shipping AI tools."
              tag="Core"
              accent="text-[var(--tn-primary)]"
            />
            <ProjectRow
              href="/projects/mediaflow"
              title="MediaFlow"
              description="Intelligent media organization for creators with cinematic previews."
              tag="Vision"
              accent="text-[var(--tn-secondary)]"
            />
            <ProjectRow
              href="/projects/spicetify-theme"
              title="Spicetify Theme"
              description="Audio-reactive interface skinning with a neon signal chain."
              tag="Pulse"
              accent="text-[var(--tn-fg)]"
            />
          </div>
        </FramePanel>
      </AnimatedSection>
    </section>
  );
}

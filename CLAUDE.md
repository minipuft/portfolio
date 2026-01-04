# Portfolio - Development Standards

Next.js 15 portfolio site with GSAP animations and dynamic color theming.

**Extends**: `~/Applications/CLAUDE.md` (Applications Hub)

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server (localhost:3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint validation |
| `npm run typecheck` | TypeScript checking |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
├─────────────────────────────────────────────────────────────┤
│  Layout (ColorProvider, fonts)                              │
│  ├── Pages (Home, Projects, Blog, About)                    │
│  └── Components (UI, Sections, MDX)                         │
├─────────────────────────────────────────────────────────────┤
│  Core Systems                                               │
│  ├── Animation System (GSAP + @gsap/react)                  │
│  └── Color System (ColorContext + CSS Variables)            │
├─────────────────────────────────────────────────────────────┤
│  Content Layer (MDX + Contentlayer)                         │
│  ├── Projects (frontmatter + content)                       │
│  └── Blog posts (frontmatter + content)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Patterns

### Server vs Client Components

- **Server Components** (default): No directive, async data fetching
- **Client Components**: Add `'use client'` only for:
  - React hooks (useState, useEffect, useContext)
  - Browser APIs (window, document)
  - Event handlers (onClick, onChange)
  - GSAP animations

### Animation Usage

```tsx
// Option 1: AnimatedSection wrapper
<AnimatedSection preset="stagger">
  <div data-animate>Item 1</div>
  <div data-animate>Item 2</div>
</AnimatedSection>

// Option 2: useScrollAnimation hook
const ref = useScrollAnimation<HTMLDivElement>({ preset: 'fadeInUp' });
<div ref={ref}>Content</div>

// Option 3: Direct GSAP with useGSAP
useGSAP(() => {
  gsap.from('.element', { opacity: 0, y: 30 });
}, { scope: containerRef });
```

### Color Theming

```tsx
// Access colors
const { accentColor, setAccentColor } = useColor();

// Set per-project theme
useEffect(() => {
  setAccentColor(project.accentColor);
  return () => setAccentColor('#7aa2f7'); // Reset
}, [project.accentColor]);

// CSS usage
.accent-bg { background: rgba(var(--accent-rgb), 0.1); }
.accent-text { color: var(--accent-color); }
```

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout + providers
│   ├── page.tsx             # Home
│   ├── projects/
│   │   ├── page.tsx         # Projects grid
│   │   └── [slug]/page.tsx  # Dynamic project pages
│   ├── blog/
│   │   ├── page.tsx         # Blog list
│   │   └── [slug]/page.tsx  # Dynamic blog posts
│   └── about/page.tsx
├── components/
│   ├── layout/              # Header, Footer, Navigation
│   ├── ui/                  # Button, Card, ProjectCard
│   ├── sections/            # Hero, ProjectShowcase
│   └── mdx/                 # MDX components
├── lib/
│   ├── animations/          # gsap-setup, presets, hooks
│   └── colors/              # context, utils
└── content/
    ├── projects/            # MDX project files
    └── blog/                # MDX blog posts
```

---

## Animation Presets

| Preset | Description | Duration |
|--------|-------------|----------|
| `fadeIn` | Opacity 0→1 | 0.5s |
| `fadeInUp` | Opacity + Y translate | 0.6s |
| `fadeInDown` | Opacity + Y translate (from top) | 0.5s |
| `hoverPop` | Scale to 1.05 | 0.2s |
| `stagger` | Children animate sequentially | 0.4s + 80ms stagger |
| `revealLeft` | Opacity + X translate | 0.6s |

---

## Tokyo Night Theme

| Color | Hex | Usage |
|-------|-----|-------|
| `primary` | #7aa2f7 | Links, accents, focus states |
| `secondary` | #bb9af7 | Secondary accents |
| `background` | #1a1b26 | Main background |
| `background-dark` | #16161e | Darker sections |
| `accent-peach` | #ff9e64 | Warnings, highlights |
| `accent-green` | #9ece6a | Success states |
| `accent-cyan` | #7dcfff | Info, links |
| `accent-red` | #f7768e | Errors, destructive |

---

## Content Schema

### Projects (content/projects/*.mdx)

```yaml
---
title: "Project Name"
description: "Brief description"
heroImage: "/projects/hero.png"
accentColor: "#7aa2f7"
technologies: ["TypeScript", "React"]
github: "https://github.com/..."
demo: "https://..."
featured: true
order: 1
---
```

### Blog Posts (content/blog/*.mdx)

```yaml
---
title: "Post Title"
description: "Brief description"
publishedAt: 2025-01-15
tags: ["MCP", "AI Tooling"]
draft: false
---
```

---

## File Size Limits

| Layer | Target | Max |
|-------|--------|-----|
| Components | 150 | 200 |
| Hooks | 75 | 100 |
| Utils | 75 | 100 |
| Pages | 100 | 150 |

---

## Validation Commands

```bash
# Quick check
npm run lint && npm run typecheck

# Full validation
npm run build

# Development
npm run dev
```

---

## Skill Invocation

| Context | Skill |
|---------|-------|
| Next.js patterns | `/nextjs` |
| This project specifics | `/nextjs-portfolio` |
| TypeScript | `/typescript` |
| React patterns | `/react` |

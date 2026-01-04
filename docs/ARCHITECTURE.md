# Portfolio Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Next.js 15 App                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │     Layout      │  │      Pages      │  │       Components        │  │
│  │                 │  │                 │  │                         │  │
│  │ • ColorProvider │  │ • Home          │  │ • Layout                │  │
│  │ • Fonts         │  │ • Projects      │  │   - Header              │  │
│  │ • Metadata      │  │ • Blog          │  │   - Footer              │  │
│  │                 │  │ • About         │  │   - Navigation          │  │
│  └─────────────────┘  └─────────────────┘  │                         │  │
│                                            │ • UI                    │  │
│                                            │   - Button              │  │
│                                            │   - Card                │  │
│                                            │   - ProjectCard         │  │
│                                            │                         │  │
│                                            │ • Sections              │  │
│                                            │   - Hero                │  │
│                                            │   - ProjectShowcase     │  │
│                                            │   - AboutPreview        │  │
│                                            │                         │  │
│                                            │ • MDX                   │  │
│                                            │   - MDXComponents       │  │
│                                            │   - CodeBlock           │  │
│                                            └─────────────────────────┘  │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                           Core Systems                                  │
│                                                                         │
│  ┌───────────────────────────┐  ┌───────────────────────────────────┐  │
│  │     Animation System      │  │         Color System              │  │
│  │                           │  │                                   │  │
│  │ • GSAP + @gsap/react      │  │ • ColorContext (React Context)   │  │
│  │ • ScrollTrigger           │  │ • CSS Custom Properties          │  │
│  │ • CustomEase              │  │ • Per-project theming            │  │
│  │ • Animation Presets       │  │ • hexToRgbString utility         │  │
│  │ • useScrollAnimation      │  │                                   │  │
│  │ • AnimatedSection         │  │ Variables:                        │  │
│  │                           │  │ • --accent-color                  │  │
│  │ Presets:                  │  │ • --accent-rgb                    │  │
│  │ • fadeIn                  │  │                                   │  │
│  │ • fadeInUp                │  └───────────────────────────────────┘  │
│  │ • hoverPop                │                                         │
│  │ • stagger                 │                                         │
│  │ • revealLeft              │                                         │
│  └───────────────────────────┘                                         │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                          Content Layer                                  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     MDX + Contentlayer                          │   │
│  │                                                                 │   │
│  │  content/                                                       │   │
│  │  ├── projects/                                                  │   │
│  │  │   ├── claude-prompts-mcp.mdx                                │   │
│  │  │   ├── mediaflow.mdx                                         │   │
│  │  │   └── spicetify.mdx                                         │   │
│  │  └── blog/                                                      │   │
│  │      ├── claude-prompts-reasoning.mdx                          │   │
│  │      └── claude-code-setup.mdx                                 │   │
│  │                                                                 │   │
│  │  Schema: title, description, heroImage, accentColor,           │   │
│  │          technologies, github, demo, featured, publishedAt     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  MDX Files   │────▶│ Contentlayer │────▶│  TypeScript  │
│  (content/)  │     │  (Build)     │     │    Types     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    React     │◀────│   useMDX     │◀────│   allDocs    │
│  Components  │     │  Component   │     │  (Generated) │
└──────────────┘     └──────────────┘     └──────────────┘
```

## Color Theming Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Project    │────▶│ setAccent    │────▶│ ColorContext │
│  accentColor │     │   Color()    │     │    State     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Components  │◀────│    CSS       │◀────│ --accent-rgb │
│    Styled    │     │  Variables   │     │ --accent-clr │
└──────────────┘     └──────────────┘     └──────────────┘
```

## Animation Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Page Load   │────▶│   useGSAP    │────▶│ ScrollTrigger│
│              │     │    Hook      │     │   Register   │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Element    │◀────│    GSAP      │◀────│   Trigger    │
│   Animates   │     │   Tweens     │     │    Fires     │
└──────────────┘     └──────────────┘     └──────────────┘
```

## Directory Structure

```
~/Applications/portfolio/
├── .claude/
│   └── rules/
│       └── components.md        # Project-specific patterns
├── CLAUDE.md                    # Project instructions
├── docs/
│   ├── ARCHITECTURE.md          # This file
│   ├── ANIMATION-SYSTEM.md
│   └── COLOR-SYSTEM.md
├── content/
│   ├── projects/                # MDX project files
│   └── blog/                    # MDX blog posts
├── public/
│   └── projects/                # Hero images
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── projects/
│   │   ├── blog/
│   │   └── about/
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── sections/
│   │   └── mdx/
│   ├── lib/
│   │   ├── animations/
│   │   └── colors/
│   ├── styles/
│   └── types/
├── next.config.mjs
├── tailwind.config.ts
├── contentlayer.config.ts
└── tsconfig.json
```

## Key Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | Framework | 15.x |
| React | UI Library | 19.x |
| TypeScript | Type Safety | 5.x |
| Tailwind CSS | Styling | 3.x |
| GSAP | Animations | 3.12.x |
| @gsap/react | React Integration | 2.x |
| Contentlayer | MDX Processing | 0.3.x |
| Vercel | Deployment | - |

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Score | >95 |
| First Contentful Paint | <1.5s |
| Largest Contentful Paint | <2.5s |
| Total Blocking Time | <200ms |
| Cumulative Layout Shift | <0.1 |

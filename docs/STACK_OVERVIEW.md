# Year 3000 Architecture & Stack Overview

## Core Philosophy
This portfolio is built on the "Living Interface" design philosophy. The UI is never truly static; it breathes, reacts to environmental input (mouse, scroll, time), and maintains a constant state of flux using high-performance animation pipelines.

## 1. Technology Stack

### Foundation
- **Next.js 16.1 (App Router)**: Server Components for content, Client Components for interaction.
- **React 19**: Leveraging concurrent features and updated hooks.
- **TypeScript 5**: Strict typing for all interactions and data schemas.
- **Tailwind CSS 4**: Utility-first styling engine.

### Animation & Physics
- **GSAP 3.14**: The single source of truth for all timeline-based animations.
- **@gsap/react**: React-optimized GSAP hooks (`useGSAP`).
- **React Three Fiber (R3F)**: WebGL layer for distortion and mesh effects.
- **Lenis**: Smooth scrolling normalization.

### Content
- **MDX**: Content authored in Markdown with React component interpolation.
- **Zod**: Schema validation for MDX frontmatter and external data.

---

## 2. Key Systems

### A. The "Breathing" System (`src/lib/hooks/`)
The interface mimics organic life through a set of custom hooks that drive ambient motion.

| Hook | Purpose |
|------|---------|
| `useColorBreathing` | Oscillates CSS variables (`--tn-accent`) over time to create a "pulse". |
| `useEnvironmentalPhysics` | Calculates virtual resistance and drag for UI elements based on cursor speed. |
| `useNeighborResponse` | Allows grid items (`BentoCell`) to react when their neighbors are hovered. |
| `useMouseVelocity` | Tracks delta/speed of mouse to drive distortion intensity. |

### B. Visual Effects Pipeline (`src/components/effects/`)
Visuals are layered to create depth and texture.

1.  **Base Layer**: `NoiseShader` (Film grain/static)
2.  **Content Layer**: Standard DOM elements
3.  **Interaction Layer**: `DistortionImage` & `ShimmerShader`
4.  **Overlay Layer**: `TextureOverlay` (Scanlines/Vignette)

### C. The Animation Contract
To prevent layout thrashing and "fighting" between CSS and JS:

1.  **Entry/Exit**: Handled exclusively by `AnimatedSection` via GSAP.
2.  **Layout**: Handled by CSS Grid/Flexbox.
3.  **The "Anti-Fight" Rule**: Never use CSS Transitions on properties controlled by GSAP (transform, opacity).

---

## 3. Directory Structure

```
src/
├── components/
│   ├── effects/       # Shaders, R3F meshes, Distortion
│   ├── ui/           # Atomic "Year 3000" primitives (ScrambleText)
│   ├── home/         # Bento Grid complex layouts
│   └── project/      # Project showcase logic
├── lib/
│   ├── animations/   # GSAP presets and shared timelines
│   ├── hooks/        # Physics and interaction logic
│   └── shaders/      # Raw GLSL code
└── content/          # MDX source files
```

## 4. Developing New Components

### Creating a "Living" Component
1.  **Structure**: Wrap in `AnimatedSection` for entry.
2.  **Interaction**: Use `useGSAP` for hover states.
3.  **Texture**: Apply `ShimmerShader` or `ScrambleText` for details.

### Adding a Project
1.  Create MDX file in `content/projects/`.
2.  Add frontmatter (title, tech, dates).
3.  Place images in `public/projects/{slug}/`.

---

## 5. Performance Standards
- **FPS**: Must maintain 60fps during scroll.
- **Will-Change**: Only apply `will-change: transform` during active animation states.
- **Cleanup**: All GSAP instances must be reverted in the cleanup phase of `useGSAP`.

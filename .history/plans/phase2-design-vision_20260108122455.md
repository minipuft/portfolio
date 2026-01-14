# Portfolio Design Plan — Year 3000 Vision

**Philosophy**: Consciousness-responsive interfaces that anticipate, breathe, and resonate.

---

## Design Decisions Summary

| Decision       | Choice                                        | Rationale                                                 |
| -------------- | --------------------------------------------- | --------------------------------------------------------- |
| Content Format | Mixed (flexible system)                       | Projects vary: screenshots, video, embeds, demos          |
| Sidebar UX     | Contextual (About/Contact only)               | Clean portfolio pages, quick-access where needed          |
| Performance    | Maximum WebGL shaders                         | Full GPU effects, modern browsers prioritized             |
| Content Modal  | Parallel routes (Next.js intercepting)        | Shareable URLs, back button works, cinematic transitions  |
| Layout         | Full homepage bento experience                | Entire homepage uses broken grid/asymmetrical composition |
| Gallery        | Masonry + hover preview + lightbox + momentum | Rich interaction layer                                    |
| Blog           | Project narratives + quick takes              | Storytelling with supporting visuals, plus micro-posts    |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PORTFOLIO SITE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │   BENTO HERO    │  │  PROJECT GRID   │  │  SHADER LAYER   │     │
│  │  Asymmetrical   │  │   Masonry +     │  │  WebGL Effects  │     │
│  │  broken grid    │  │   Hover/Light   │  │  Scroll-linked  │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│           │                    │                    │               │
│           └────────────────────┼────────────────────┘               │
│                                │                                     │
│  ┌─────────────────────────────┴─────────────────────────────┐     │
│  │              PARALLEL ROUTE MODAL SYSTEM                   │     │
│  │   /projects/[slug] opens as overlay with blur transition   │     │
│  │   URL updates, shareable, back button closes               │     │
│  └───────────────────────────────────────────────────────────┘     │
│                                                                      │
│  ┌─────────────────┐                    ┌─────────────────┐        │
│  │ CONTEXTUAL      │                    │  BLOG SYSTEM    │        │
│  │ SIDEBAR         │                    │  Narratives +   │        │
│  │ (About/Contact) │                    │  Quick takes    │        │
│  └─────────────────┘                    └─────────────────┘        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 2A: Foundation ✓ COMPLETE

- [x] Install Three.js dependencies (three, @react-three/fiber, @react-three/drei, lenis)
- [x] Create BentoGrid layout system (BentoGrid, BentoCell, HeroSection)
- [x] Implement parallel route modal structure (@modal slot, intercepting routes)
- [x] Basic blur transitions (BlurTransition, ProjectModal with GSAP animations)

### Phase 2B: Effects Layer ✓ COMPLETE

- [x] WebGL scroll distortion shader (DistortionImage + useScrollVelocity)
- [x] Floating elements with parallax (FloatingElement + FloatingDecoration)
- [x] Warped mesh background (WarpedMesh)
- [x] Reduced motion fallbacks (useReducedMotion + CSS media queries)

### Phase 3A: Gallery ✓ COMPLETE

- [x] Masonry grid with lazy loading (MasonryGrid + CSS columns)
- [x] Hover preview animations (GalleryItem with GSAP)
- [x] Lightbox modal (full-screen viewer with navigation)
- [x] Lenis smooth scroll integration (useMomentumScroll hook)

### Phase 3B: Content ✓ COMPLETE

- [x] Flexible project showcase component
- [x] Video player with scroll-triggered autoplay
- [x] Embed frame wrapper
- [x] Contextual sidebar

### Phase 4: Blog ✓ COMPLETE

- [x] Blog feed with mixed formats
- [x] Narrative post layout
- [x] Quick take cards
- [x] Related content linking

---

## Phase 2A Components

### 2.1 Bento Grid Homepage Layout

**Concept**: Full-page asymmetrical composition with floating elements, warped grid backgrounds, and organic visual hierarchy.

| Component         | File                                    | Description                              |
| ----------------- | --------------------------------------- | ---------------------------------------- |
| `BentoGrid`       | `src/components/home/BentoGrid.tsx`     | CSS Grid with asymmetric cell spans      |
| `BentoCell`       | `src/components/home/BentoCell.tsx`     | Individual cell with hover animations    |
| `FloatingElement` | `src/components/ui/FloatingElement.tsx` | Decorative floating shapes with parallax |
| `WarpedMesh`      | `src/components/effects/WarpedMesh.tsx` | Three.js warped grid background          |

**Technical Approach**:

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto;
  gap: 1rem;
}

.cell-hero {
  grid-column: 1 / 7;
  grid-row: 1 / 3;
}
.cell-featured {
  grid-column: 7 / 13;
  grid-row: 1 / 2;
}
```

---

### 2.2 Parallel Route Modal System

**File Structure**:

```
src/app/
├── @modal/
│   └── (.)projects/
│       └── [slug]/
│           └── page.tsx      # Intercepted route (modal)
├── projects/
│   ├── page.tsx              # Projects grid
│   └── [slug]/
│       └── page.tsx          # Full page fallback (direct link)
└── layout.tsx                # Contains {modal} slot
```

| Component        | File                                            | Description                      |
| ---------------- | ----------------------------------------------- | -------------------------------- |
| `ProjectModal`   | `src/components/modal/ProjectModal.tsx`         | Blur backdrop + slide-in content |
| `ModalProvider`  | `src/contexts/ModalContext.tsx`                 | Animation state, close handlers  |
| `BlurTransition` | `src/components/transitions/BlurTransition.tsx` | leoleo-style blur enter/exit     |

**Animation Spec** (from leoleo.studio):

```css
.blur-enter-active {
  transition: all 0.45s cubic-bezier(0.165, 0.84, 0.44, 1);
  filter: blur(0.25rem);
  opacity: 0;
}
.blur-enter-to {
  filter: blur(0);
  opacity: 1;
}
```

---

### 2.3 WebGL Scroll Distortion Effects

| Component           | File                                         | Description                        |
| ------------------- | -------------------------------------------- | ---------------------------------- |
| `DistortionImage`   | `src/components/effects/DistortionImage.tsx` | R3F mesh with scroll-linked shader |
| `useScrollVelocity` | `src/lib/hooks/useScrollVelocity.ts`         | Lenis/native scroll velocity hook  |
| `distortionShader`  | `src/lib/shaders/distortion.glsl`            | GLSL vertex/fragment shaders       |

**Shader Approach**:

```glsl
uniform float uScrollVelocity;
uniform float uTime;

void main() {
  vec3 pos = position;
  float wave = sin(pos.y * 3.0 + uTime) * uScrollVelocity * 0.1;
  pos.x += wave;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

---

## Phase 3 Components

### 3.1 Masonry Gallery

| Component           | File                                     | Description                     |
| ------------------- | ---------------------------------------- | ------------------------------- |
| `MasonryGrid`       | `src/components/gallery/MasonryGrid.tsx` | CSS columns or Masonry layout   |
| `GalleryItem`       | `src/components/gallery/GalleryItem.tsx` | Lazy image + hover info overlay |
| `Lightbox`          | `src/components/gallery/Lightbox.tsx`    | Full-screen image viewer        |
| `useMomentumScroll` | `src/lib/hooks/useMomentumScroll.ts`     | Lenis-powered smooth scroll     |

### 3.2 Flexible Project Showcase

**Content Schema**:

```yaml
---
title: "Claude Prompts MCP"
showcaseType: "mixed"
media:
  - type: "video"
    src: "/projects/claude-prompts/demo.mp4"
  - type: "screenshot"
    src: "/projects/claude-prompts/ui.png"
  - type: "embed"
    src: "https://codesandbox.io/embed/xxx"
---
```

| Component           | File                                         | Description         |
| ------------------- | -------------------------------------------- | ------------------- |
| `ProjectShowcase`   | `src/components/project/ProjectShowcase.tsx` | Renders media array |
| `VideoPlayer`       | `src/components/media/VideoPlayer.tsx`       | Custom controls     |
| `EmbedFrame`        | `src/components/media/EmbedFrame.tsx`        | Responsive iframe   |
| `ScreenshotGallery` | `src/components/media/ScreenshotGallery.tsx` | Swipeable carousel  |

### 3.3 Contextual Sidebar

| Component           | File                                          | Description         |
| ------------------- | --------------------------------------------- | ------------------- |
| `ContextualSidebar` | `src/components/layout/ContextualSidebar.tsx` | Slide-in panel      |
| `ResumePanel`       | `src/components/sidebar/ResumePanel.tsx`      | Skills, experience  |
| `ContactPanel`      | `src/components/sidebar/ContactPanel.tsx`     | Email, social links |

---

## Phase 4 Components

### 4.1 Dual Format Blog

| Type       | Format                 | Display                       |
| ---------- | ---------------------- | ----------------------------- |
| Narrative  | Full MDX               | Hero image, scrolling article |
| Quick Take | Short MDX (<500 words) | Card format, stack in feed    |

| Component       | File                                    | Description  |
| --------------- | --------------------------------------- | ------------ |
| `BlogFeed`      | `src/components/blog/BlogFeed.tsx`      | Mixed feed   |
| `NarrativePost` | `src/components/blog/NarrativePost.tsx` | Full article |
| `QuickTakeCard` | `src/components/blog/QuickTakeCard.tsx` | Compact card |

---

## File Structure (All New Components)

```
src/
├── components/
│   ├── home/
│   │   ├── BentoGrid.tsx
│   │   ├── BentoCell.tsx
│   │   └── HeroSection.tsx
│   ├── effects/
│   │   ├── DistortionImage.tsx
│   │   ├── WarpedMesh.tsx
│   │   └── FloatingElement.tsx
│   ├── gallery/
│   │   ├── MasonryGrid.tsx
│   │   ├── GalleryItem.tsx
│   │   └── Lightbox.tsx
│   ├── modal/
│   │   ├── ProjectModal.tsx
│   │   └── ModalBackdrop.tsx
│   ├── transitions/
│   │   └── BlurTransition.tsx
│   ├── project/
│   │   └── ProjectShowcase.tsx
│   ├── media/
│   │   ├── VideoPlayer.tsx
│   │   ├── EmbedFrame.tsx
│   │   └── ScreenshotGallery.tsx
│   ├── sidebar/
│   │   ├── ContextualSidebar.tsx
│   │   ├── ResumePanel.tsx
│   │   └── ContactPanel.tsx
│   └── blog/
│       ├── BlogFeed.tsx
│       ├── NarrativePost.tsx
│       └── QuickTakeCard.tsx
├── lib/
│   ├── hooks/
│   │   ├── useScrollVelocity.ts
│   │   └── useMomentumScroll.ts
│   └── shaders/
│       └── distortion.glsl
├── contexts/
│   └── ModalContext.tsx
└── app/
    ├── @modal/
    │   └── (.)projects/[slug]/page.tsx
    ├── projects/
    │   ├── page.tsx
    │   └── [slug]/page.tsx
    └── blog/
        ├── page.tsx
        └── [slug]/page.tsx
```

---

## Dependencies

```bash
npm install three @react-three/fiber @react-three/drei lenis
```

| Package              | Purpose                     |
| -------------------- | --------------------------- |
| `three`              | 3D rendering engine         |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei`  | Useful R3F helpers          |
| `lenis`              | Smooth scroll with momentum |

---

## Success Criteria

- [ ] Homepage renders full bento grid layout
- [ ] Project click opens modal with URL change
- [ ] Back button closes modal correctly
- [ ] Scroll distortion effect visible on images
- [ ] 60fps maintained during scroll
- [ ] Reduced motion respected
- [ ] Gallery infinite scroll works
- [ ] Lightbox opens from gallery items
- [ ] Sidebar appears on About/Contact only
- [ ] Blog supports both narrative and quick take formats

---

## References

- [leoleo.studio](https://www.leoleo.studio/en-gb) - Blur transitions
- [Next.js Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
- [Lenis Smooth Scroll](https://github.com/darkroomengineering/lenis)
- [Codrops WebGL Portfolio](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/)

---

## Implementation Log

### Phase 2A Complete (2026-01-04)

**Dependencies Added**:

- three, @react-three/fiber, @react-three/drei (WebGL/3D)
- lenis (smooth scroll)

**Components Created**:
| Component | Location | Purpose |
|-----------|----------|---------|
| BentoGrid | `src/components/home/BentoGrid.tsx` | 12-column grid with GSAP stagger |
| BentoCell | `src/components/home/BentoCell.tsx` | Responsive cells with hover animations |
| HeroSection | `src/components/home/HeroSection.tsx` | Animated hero for bento layout |
| ProjectModal | `src/components/modal/ProjectModal.tsx` | Blur backdrop modal with GSAP |
| BlurTransition | `src/components/transitions/BlurTransition.tsx` | leoleo-style blur enter/exit |
| ModalContext | `src/contexts/ModalContext.tsx` | Modal state management |

**Routes Created**:

```
src/app/
├── @modal/
│   ├── default.tsx           # Null slot default
│   └── (.)projects/[slug]/   # Intercepted modal route
├── projects/
│   ├── page.tsx              # Projects grid
│   └── [slug]/page.tsx       # Full project page
└── layout.tsx                # Updated with modal slot
```

**Key Patterns**:

- GSAP useGSAP hook for all animations
- useCallback for event handlers in effects
- Parallel routes with @modal slot for intercepting navigation
- Blur + slide animations matching leoleo.studio aesthetic

---

### Phase 2B Complete (2026-01-04)

**Hooks Created**:
| Hook | Location | Purpose |
|------|----------|---------|
| useScrollVelocity | `src/lib/hooks/useScrollVelocity.ts` | Scroll velocity tracking with damping |
| useNormalizedScrollVelocity | `src/lib/hooks/useScrollVelocity.ts` | Clamped -1 to 1 for shader uniforms |
| useReducedMotion | `src/lib/hooks/useReducedMotion.ts` | useSyncExternalStore for media query |

**Effects Components Created**:
| Component | Location | Purpose |
|-----------|----------|---------|
| DistortionImage | `src/components/effects/DistortionImage.tsx` | R3F mesh with scroll-linked shader |
| WarpedMesh | `src/components/effects/WarpedMesh.tsx` | Point cloud background with wave animation |
| FloatingElement | `src/components/effects/FloatingElement.tsx` | Parallax floating shapes |
| FloatingDecoration | `src/components/effects/FloatingElement.tsx` | Preset decoration layouts |

**Shaders**:

- Vertex shader: Wave distortion based on scroll velocity
- Fragment shader: RGB shift chromatic aberration
- WarpedMesh: Dual sine wave with scroll modulation

**Accessibility**:

- useReducedMotion hook for programmatic checks
- CSS `prefers-reduced-motion` media queries
- Static fallbacks for all WebGL components
- Hidden decorative elements when motion reduced

**Key Patterns**:

- useSyncExternalStore for media query subscription
- useEffect for RAF loops (avoiding useCallback issues)
- Type assertions for Three.js texture images
- Graceful degradation with static fallbacks

---

### Phase 3A Complete (2026-01-04)

**Hooks Created**:
| Hook | Location | Purpose |
|------|----------|---------|
| useMomentumScroll | `src/lib/hooks/useMomentumScroll.ts` | Lenis smooth scroll integration |
| useScrollProgress | `src/lib/hooks/useMomentumScroll.ts` | Scroll progress (0-1) tracking |

**Gallery Components Created**:
| Component | Location | Purpose |
|-----------|----------|---------|
| MasonryGrid | `src/components/gallery/MasonryGrid.tsx` | CSS columns masonry layout |
| GalleryItem | `src/components/gallery/GalleryItem.tsx` | Lazy image + GSAP hover effects |
| Lightbox | `src/components/gallery/Lightbox.tsx` | Full-screen viewer with navigation |

**Routes Created**:

- `/gallery` - Gallery page with masonry grid and lightbox

**Features**:

- CSS columns-based masonry (no JS layout calculation)
- Next.js Image with lazy loading and blur placeholder
- GSAP hover animations (scale, overlay reveal)
- Full-screen lightbox with keyboard navigation (Escape, Arrow keys)
- Previous/Next navigation with counter
- Reduced motion fallbacks for all animations

**Key Patterns**:

- useCallback for event handlers (avoiding ref access during render)
- Conditional ref tracking for state resets (avoiding useEffect setState)
- Lenis integration with reduced motion detection
- Accessibility: focus rings, ARIA labels, keyboard navigation

---

### Year 3000 Enhancements Complete (2026-01-04)

**Ambient Awareness Layer**:
| Hook | Location | Purpose |
|------|----------|---------|
| useCursorPosition | `src/lib/hooks/useCursorPosition.ts` | Global cursor tracking with velocity |
| useElementCursorPosition | `src/lib/hooks/useCursorPosition.ts` | Cursor relative to element |
| useMagneticEffect | `src/lib/hooks/useCursorPosition.ts` | Attract/repel cursor behavior |

**Color Breathing System**:
| Hook | Location | Purpose |
|------|----------|---------|
| useColorBreathing | `src/lib/hooks/useColorBreathing.ts` | Subtle hue/saturation shifts over time |
| useScrollColorTemperature | `src/lib/hooks/useColorBreathing.ts` | Warm-to-cool gradient on scroll |
| useIdleBreathing | `src/lib/hooks/useColorBreathing.ts` | Opacity pulsing for alive elements |

**Emergent Hierarchy**:
| Hook | Location | Purpose |
|------|----------|---------|
| NeighborProvider | `src/lib/hooks/useNeighborResponse.tsx` | Shared hover state context |
| useNeighborResponse | `src/lib/hooks/useNeighborResponse.tsx` | Neighbor scale/opacity response |
| useGridNeighborResponse | `src/lib/hooks/useNeighborResponse.tsx` | Distance-based grid falloff |

**Resonant Feedback**:
| Hook | Location | Purpose |
|------|----------|---------|
| useRippleEffect | `src/lib/hooks/useRippleEffect.ts` | Click ripple animations |
| useCascadeEffect | `src/lib/hooks/useRippleEffect.ts` | Distance-sorted cascade |
| useScrollWave | `src/lib/hooks/useRippleEffect.ts` | Wave propagation on scroll |

**Component Enhancements**:
| Component | New Props | Features |
|-----------|-----------|----------|
| FloatingElement | magneticStrength, magneticRadius, magneticMode | Cursor repulsion behavior |
| BentoCell | cursorGlow, clickRipple | Cursor-following glow, click ripples |
| WarpedMesh | enableBreathing | Living color shifts |
| MasonryGrid | enableNeighborResponse | Auto-wraps in NeighborProvider |
| GalleryItem | enableNeighborResponse | Neighbor scale/opacity response |

**Year 3000 Principle Alignment**:
| Principle | Implementation | Score |
|-----------|----------------|-------|
| Ambient Awareness | useCursorPosition, useMagneticEffect | 8/10 |
| Living Aesthetics | useColorBreathing, WarpedMesh breathing | 9/10 |
| Spatial Navigation | useMomentumScroll, parallax effects | 7/10 |
| Resonant Feedback | useRippleEffect, useCascadeEffect | 7/10 |
| Emergent Hierarchy | useNeighborResponse, gallery neighbor effect | 8/10 |

---

### Phase 3B Complete (2026-01-04)

**Project Showcase System**:
| Component | Location | Purpose |
|-----------|----------|---------|
| ProjectShowcase | `src/components/project/ProjectShowcase.tsx` | Flexible media rendering with type switching |
| VideoPlayer | `src/components/media/VideoPlayer.tsx` | Scroll-triggered autoplay, custom controls |
| EmbedFrame | `src/components/media/EmbedFrame.tsx` | Responsive iframe with platform detection |
| ScreenshotGallery | `src/components/media/ScreenshotGallery.tsx` | Carousel/grid layouts with lightbox |

**VideoPlayer Features**:

- Scroll-triggered autoplay using Intersection Observer
- Custom controls (play/pause, mute, progress, fullscreen)
- GSAP-animated control visibility
- Reduced motion fallbacks
- Poster image support

**EmbedFrame Features**:

- Platform auto-detection (CodeSandbox, CodePen, StackBlitz, Figma, YouTube, GitHub)
- Lazy loading with Intersection Observer
- Error handling with retry/external open
- Platform-specific styling and badges

**ScreenshotGallery Features**:

- Three layout modes: carousel, grid, stack
- Touch/mouse drag navigation for carousel
- Integrated lightbox with keyboard navigation
- GSAP-animated transitions

**Contextual Sidebar System**:
| Component | Location | Purpose |
|-----------|----------|---------|
| ContextualSidebar | `src/components/layout/ContextualSidebar.tsx` | Slide-in panel with animations |
| ResumePanel | `src/components/sidebar/ResumePanel.tsx` | Skills, experience timeline |
| ContactPanel | `src/components/sidebar/ContactPanel.tsx` | Email, social links, contact form |

**ContextualSidebar Features**:

- Left/right positioning with GSAP slide animation
- Overlay with blur backdrop
- Keyboard (Escape) and overlay click to close
- Body scroll lock when open
- Staggered content reveal animation
- `useSidebar` hook for state management

**ResumePanel Features**:

- Skills grouped by category with level indicators
- Experience timeline with highlights
- Download resume CTA

**ContactPanel Features**:

- Email quick action
- Social links grid (GitHub, LinkedIn, Twitter)
- Contact form with validation
- Availability status indicator

**Key Patterns**:

- Intersection Observer for lazy loading and scroll triggers
- GSAP useGSAP hook for all animations
- Reduced motion detection and fallbacks
- Platform detection via URL pattern matching
- Consistent Tokyo Night theming

---

### Phase 4 Complete (2026-01-05)

**Blog System Components**:
| Component | Location | Purpose |
|-----------|----------|---------|
| BlogFeed | `src/components/blog/BlogFeed.tsx` | Mixed feed with filters |
| NarrativeCard | `src/components/blog/NarrativeCard.tsx` | Full article card with hero |
| NarrativePost | `src/components/blog/NarrativePost.tsx` | Full article page layout |
| QuickTakeCard | `src/components/blog/QuickTakeCard.tsx` | Compact card for quick takes |
| RelatedPosts | `src/components/blog/RelatedPosts.tsx` | Related content grid |

**Routes Created**:

- `/blog` - Blog feed page with format/tag filtering
- `/blog/[slug]` - Individual post pages with static generation

**Dual Format System**:
| Format | Display | Use Case |
|--------|---------|----------|
| Narrative | Full hero, scrolling article | Deep-dive posts (>500 words) |
| Quick Take | Compact card | Tips, references (<500 words) |

**BlogFeed Features**:

- Format filter (All / Narratives / Quick Takes)
- Tag-based filtering
- Featured posts section
- GSAP stagger animations
- Post count indicator

**NarrativePost Features**:

- Hero image with gradient overlay
- Meta info (date, reading time, featured badge)
- Share buttons (Twitter, LinkedIn, copy link)
- Tag navigation links
- Related content section

**QuickTakeCard Features**:

- Lightning bolt icon
- Hover lift animation with icon rotation
- Compact tag display
- Reading time indicator

**Related Content Linking**:

- `findRelatedContent()` utility function
- Tag-based matching for posts
- Tech stack matching for projects
- Score-based ranking for relevance
- Supports both posts and projects

**Data Types**:

```typescript
type PostFormat = "narrative" | "quicktake";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  featured: boolean;
  draft: boolean;
  readingTime: number;
  format: PostFormat;
  heroImage?: string;
}

interface RelatedContent {
  type: "post" | "project";
  slug: string;
  title: string;
  description?: string;
}
```

**Key Patterns**:

- Server/client component separation for static generation
- GSAP useGSAP for entrance animations
- ScrollTrigger for stagger reveals
- Reduced motion fallbacks
- Consistent Tokyo Night theming

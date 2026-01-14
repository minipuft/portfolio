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
│  │  Asymmetrical   │  │   JS Masonry    │  │  WebGL Effects  │     │
│  │  broken grid    │  │   Unified Anim  │  │  Scroll-linked  │     │
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
│  │ CONTEXTUAL      │                    ┌─────────────────┐        │
│  │ SIDEBAR         │                    │  API LAYER      │        │
│  │ (About/Contact) │                    │  /api/contact   │        │
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

### Phase 5: Year 3000 Refinement ✓ COMPLETE
- [x] **Architecture**: JS-based Masonry (Fixed layout shifts)
- [x] **Architecture**: Sync Lenis + ScrollTrigger (Fixed parallax jitter)
- [x] **Aesthetics**: Global ThemeController (Scroll-based color temperature)
- [x] **Interaction**: Unified GalleryItem animations (Fixed hover conflict)
- [x] **Interaction**: Ripple Button component & Contact API
- [x] **Polish**: Addressed hydration mismatches and React patterns

---

## Phase 2A Components

### 2.1 Bento Grid Homepage Layout

**Concept**: Full-page asymmetrical composition with floating elements, warped grid backgrounds, and organic visual hierarchy.

| Component | File | Description |
|-----------|------|-------------|
| `BentoGrid` | `src/components/home/BentoGrid.tsx` | CSS Grid with asymmetric cell spans |
| `BentoCell` | `src/components/home/BentoCell.tsx` | Individual cell with hover animations |
| `FloatingElement` | `src/components/ui/FloatingElement.tsx` | Decorative floating shapes with parallax |
| `WarpedMesh` | `src/components/effects/WarpedMesh.tsx` | Three.js warped grid background |

**Technical Approach**:
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto;
  gap: 1rem;
}

.cell-hero { grid-column: 1 / 7; grid-row: 1 / 3; }
.cell-featured { grid-column: 7 / 13; grid-row: 1 / 2; }
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

| Component | File | Description |
|-----------|------|-------------|
| `ProjectModal` | `src/components/modal/ProjectModal.tsx` | Blur backdrop + slide-in content |
| `ModalProvider` | `src/contexts/ModalContext.tsx` | Animation state, close handlers |
| `BlurTransition` | `src/components/transitions/BlurTransition.tsx` | leoleo-style blur enter/exit |

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

| Component | File | Description |
|-----------|------|-------------|
| `DistortionImage` | `src/components/effects/DistortionImage.tsx` | R3F mesh with scroll-linked shader |
| `useScrollVelocity` | `src/lib/hooks/useScrollVelocity.ts` | Lenis/native scroll velocity hook |
| `distortionShader` | `src/lib/shaders/distortion.glsl` | GLSL vertex/fragment shaders |

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

| Component | File | Description |
|-----------|------|-------------|
| `MasonryGrid` | `src/components/gallery/MasonryGrid.tsx` | JS-based column distribution |
| `GalleryItem` | `src/components/gallery/GalleryItem.tsx` | Unified spring physics animation |
| `Lightbox` | `src/components/gallery/Lightbox.tsx` | Full-screen image viewer |
| `useMomentumScroll` | `src/lib/hooks/useMomentumScroll.ts` | Lenis + ScrollTrigger Sync |

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

| Component | File | Description |
|-----------|------|-------------|
| `ProjectShowcase` | `src/components/project/ProjectShowcase.tsx` | Renders media array |
| `VideoPlayer` | `src/components/media/VideoPlayer.tsx` | Custom controls |
| `EmbedFrame` | `src/components/media/EmbedFrame.tsx` | Responsive iframe |
| `ScreenshotGallery` | `src/components/media/ScreenshotGallery.tsx` | Swipeable carousel |

### 3.3 Contextual Sidebar

| Component | File | Description |
|-----------|------|-------------|
| `ContextualSidebar` | `src/components/layout/ContextualSidebar.tsx` | Slide-in panel |
| `ResumePanel` | `src/components/sidebar/ResumePanel.tsx` | Skills, experience |
| `ContactPanel` | `src/components/sidebar/ContactPanel.tsx` | Email, social links |

---

## Phase 4 Components

### 4.1 Dual Format Blog

| Type | Format | Display |
|------|--------|---------|
| Narrative | Full MDX | Hero image, scrolling article |
| Quick Take | Short MDX (<500 words) | Card format, stack in feed |

| Component | File | Description |
|-----------|------|-------------|
| `BlogFeed` | `src/components/blog/BlogFeed.tsx` | Mixed feed |
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
│   │   ├── ThemeController.tsx
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
    ├── api/
    │   └── contact/route.ts
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

| Package | Purpose |
|---------|---------|
| `three` | 3D rendering engine |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Useful R3F helpers |
| `lenis` | Smooth scroll with momentum |

---

## Success Criteria

- [x] Homepage renders full bento grid layout
- [x] Project click opens modal with URL change
- [x] Back button closes modal correctly
- [x] Scroll distortion effect visible on images
- [x] 60fps maintained during scroll
- [x] Reduced motion respected
- [x] Gallery infinite scroll works
- [x] Lightbox opens from gallery items
- [x] Sidebar appears on About/Contact only
- [x] Blog supports both narrative and quick take formats
- [x] **Year 3000**: Color breathing & temperature shift active
- [x] **Year 3000**: Ripple effects on interaction

---

## References

- [leoleo.studio](https://www.leoleo.studio/en-gb) - Blur transitions
- [Next.js Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
- [Lenis Smooth Scroll](https://github.com/darkroomengineering/lenis)
- [Codrops WebGL Portfolio](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/)

---

## Implementation Log

### Phase 2A Complete (2026-01-04)
... (Previous logs) ...

### Phase 5: Year 3000 Refinement (2026-01-09)

**Infrastructure Updates**:
- Replaced CSS Column Masonry with JS-based distribution to fix layout shifts.
- Synchronized `Lenis` ticker with `GSAP` ScrollTrigger to prevent parallax jitter.

**New Components**:
| Component | Location | Purpose |
|-----------|----------|---------|
| ThemeController | `src/components/effects/ThemeController.tsx` | Global scroll-based color temperature |
| Button | `src/components/ui/Button.tsx` | Reusable button with ripple physics |

**API Layer**:
- Created `src/app/api/contact/route.ts` for form handling.

**Testing**:
- Installed `vitest` suite.
- Validated `useColorBreathing` logic.

**Code Quality**:
- Fixed hydration mismatches in `page.tsx`.
- Resolved unsafe ref access patterns in `VideoPlayer.tsx` and hooks.
- Updated `CLAUDE.md` with strict hydration safety rules.

# Director's Treatment: The "Studio Null" Aesthetic & Year 3000 Interface

**Date:** January 10, 2026
**Role:** Creative Director / Lead Developer
**Status:** In Progress (Phase 3)
**Vision Update:** The "Living Mosaic" (v2.1)

---

## 1. The Logline
**"High-Performance Cinema."**
We are building a portfolio that feels less like a website and more like a film credit sequence for a sci-fi masterpiece. It is a **conscious, breathing digital ecosystem** that merges cinematic depth with the raw utility of high-performance developer tooling. It bridges the gap between the "Artist" (Mood, Vibe, Texture) and the "Engineer" (Speed, Type Safety, Architecture).

---

## 2. Visual Language (The Look)

### A. Texture & Grain (The "Film Stock")
We are moving away from flat "SaaS Clean" to organic "Digital Materiality."
- **The "Shimmer"**: A subtle, full-screen noise/iridescence overlay that sits atop the deep background. It gives the void texture, preventing the "dead pixel" feel of pure black screens.
  - *Reference*: `assets/Shimmer.png`
  - *Tech*: Fixed `div` with CSS grain or a low-cost WebGL fragment shader using `simplex noise`.
  - *Accessibility*: Disabled on `prefers-reduced-motion`.
- **The Lens**: Subtle chromatic aberration at the viewport edges (vignette), simulating high-end anamorphic glass.

### B. Lighting (The "Tokyo Neon")
- **Base**: `var(--tn-bg-dark)` (Deep Matte Black).
- **Key Light**: `var(--tn-primary)` (Blue) and `var(--tn-secondary)` (Purple) acting as rim lights on cards and interactive elements.
- **Atmosphere**: The "Breathing" system (`useColorBreathing`) is our ambient light, shifting temperature as the user scrolls, implying a living environment.

### C. Camera Movement (The "Flow")
- **Physics**: We use `Lenis` for momentum. The scroll isn't 1:1; it carries weight.
- **Parallax**: Elements do not move at the same speed. The background (WarpedMesh), the midground (Project Stream), and foreground (FloatingElements) separate during movement, creating 3D depth.

---

## 3. Scene Breakdown

### Scene 1: The Stage (Homepage)
**Current State**: Static Bento Grid (implemented in `BentoGrid.tsx`).
**Target Vision**: **"The Living Mosaic"** (formerly Dynamic Bento).
- **Concept**: A fluid stream of "memory shards" (projects) flowing through a focus tunnel.
- **Composition**:
  - **Cinematography**: Force **2.39:1 (Anamorphic)** aspect ratio for project preview cells.
  - **Depth**: Active focus system. The center screen element snaps to sharpness; peripheral elements blur slightly (`backdrop-filter: blur()`).
  - **The Grid**: Not a rigid table, but a **Flux Grid**. Rows offset based on scroll velocity (`useScrollVelocity`).
- **Action**:
  - The Hero is the "Opening Title". It dissolves into the stream.
  - **Micro-interaction**: Hovering a cell doesn't just scale it; it "awakens" the node. Video loops play, color bleeds out into the surrounding void (Ambient Light effect).
  - **Texture**: The grid lines (`bg-grid-white/[0.02]`) warp slightly with the scroll, like a digital fabric.

### Scene 2: The Off-Screen Space (Sidebar)
**Reference**: `assets/sidebar-contact.png`.
**Concept**: The navigation is not a "bar" but a "drawer" containing the artist's tools.
- **Trigger**: It's not always visible. It waits for intent (Hamburger menu or "Contact" action).
- **Content**: It holds the "Meta" info—Resume, Contact, Socials—keeping the main stage clear for the "Work."
- **Vibe**: Studio Null aesthetic. Large typography, raw lists, maybe a small looped video/GIF in the corner.

### Scene 3: The Work (Project Detail)
**Concept**: The "Infinite Portal".
- **Transition**: The selected project cell expands to fill the viewport (Shared Layout Transition), while the rest of the grid dissolves into "stars" or "data dust".
- **Layout**: Mixed media. Video loops on autoplay (muted), code snippets in high-contrast blocks, editorial typography for the narrative.
- **Background**: `WarpedMesh` becomes reactive to the project's primary color.

---

## 4. Technical Execution Plan (The Rig)

### Step 1: The Texture Layer (Completed)
**Goal**: Integrate `Shimmer.png` or a CSS equivalent as a global texture.
- **Action**: Create `<TextureOverlay />` component.
- **CSS**: `mix-blend-mode: overlay` or `soft-light`.
- **Location**: `src/components/layout/TextureOverlay.tsx` -> `src/app/layout.tsx`.
- **Status**: ✅ Implemented with noise SVG + shader shimmer; reduced motion uses static noise only.

### Step 2: The Living Mosaic Refactor (In Progress)
**Goal**: Upgrade `src/app/page.tsx` and `BentoGrid`.
- **Action**:
  - Implement **Scroll Velocity Skew**: Connect `useScrollVelocity` to the grid container `skewY`.
  - **Cinematic Cells**: Update `BentoCell` to support "Anamorphic Mode" (2.39:1 ratio).
  - **Focus System**: Add a viewport observer to `BentoCell` that adjusts opacity/blur based on distance from center.
- **Structure**:
  ```tsx
  <FluxGrid>
    <HeroCell />
    <AnamorphicCell project={mcp} />
    <TechTicker mode="cinematic" />
    <AnamorphicCell project={mediaflow} />
  </FluxGrid>
  ```

### Step 3: The Sidebar Integration (Completed)
**Goal**: Activate the "Studio Null" Sidebar.
- **Action**:
  - Ensure `ContextualSidebar` is wired to a global `UIContext` or `Layout` state.
  - Style it to match `sidebar-contact.png` (Dark panel, large type, "Studio Null" branding).
- **Status**: ✅ Implemented `ContextualSidebar.tsx` with GSAP animations and contact/resume panels.

---

## 5. Accessibility & Performance Guardrails
- **The "Anti-Seizure" Check**: The Shimmer and Skew effects must be subtle.
  - **Reduced Motion**: If detected, disable `skewY` on scroll and replace "Shimmer" with static noise.
- **Contrast**: Tokyo Night colors are accessible, but text on "Shimmer" backgrounds needs careful `z-index` and contrast verification.
- **Hydration**: Ensure `FluxGrid` logic uses `useGSAP` to prevent SSR mismatches.

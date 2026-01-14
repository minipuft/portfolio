# Comprehensive GEMINI.md - Portfolio

**Global Integration**: This configuration extends the global standards at `~/Applications/GEMINI.md`.
**Methodology**: Enhanced CAGEERF (Context, Analysis, Goals, Execution, Evaluation, Refinement, Finalization)

## Project Context
- **Name**: Portfolio (Year 3000 Vision)
- **Type**: Next.js 15 / React 19 / TypeScript / GSAP
- **Architecture Level**: 10/10 (High-Performance WebGL/DOM Hybrid)
- **Primary Philosophy**: "Consciousness-responsive interfaces that anticipate, breathe, and resonate."

---

## 1. Comprehensive Development Standards

### Performance Requirements
- **Bundle Size**: Strict monitoring. Core shared chunks < 200KB.
- **Animation Performance**: 
  - 60fps minimum on scroll-linked effects.
  - Usage of `will-change` restricted to active animations only.
  - `ScrollTrigger.refresh()` on layout shifts.
- **Hydration**: Zero hydration mismatches allowed (Strict enforcement).
- **Lighthouse**: Target >95 on Accessibility and Best Practices.

### Code Quality Standards
- **Strict Typing**: No `any`. Zod schemas for all external data (MDX).
- **Ref Purity**: **NEVER** read `ref.current` during render. Use `useState` or `useSyncExternalStore`.
- **Effect Purity**: No `setState` in `useEffect` without strict dependency guards.
- **Callback Refs**: Custom hooks must return `setRef` callbacks, not raw `RefObject`s.

### Naming Conventions
- **Components**: PascalCase (e.g., `ProjectCard.tsx`).
- **Hooks**: camelCase, prefixed with `use` (e.g., `useColorBreathing.ts`).
- **Utilities**: camelCase (e.g., `hexToRgb.ts`).
- **CSS Variables**: Kebab-case with prefix (e.g., `--tn-primary`, `--project-color`).

---

## 2. Technology Constraints & Rules

### Approved Technologies
- **Framework**: Next.js 15 (App Router).
- **Styling**: Tailwind CSS (Utility-first). CSS Modules only for complex WebGL overlays.
- **Animation**: GSAP + `@gsap/react` + `ScrollTrigger`. **NO** CSS transitions on GSAP-controlled properties (The "Anti-Fight" Rule).
- **Content**: MDX (via `next-mdx-remote`).

### CSS-First Philosophy (Tailwind)
- **Structure**: Utility classes for layout, spacing, typography.
- **Theming**: Dynamic values via CSS variables set by `useGSAP` (never inline styles).
- **FOUC Prevention**: `[data-animate] { opacity: 0; visibility: hidden; }` in global CSS.

### Animation Standards
- **Engine**: GSAP is the single source of truth for motion.
- **Presets**: Use `autoAlpha` for entry/exit to handle visibility automatically.
- **Easing**: `power3.out` or `expo.out` for organic "Year 3000" feel.

---

## 3. Validation Requirements (CAGEERF)

### Integration Commands
```bash
# Core Validation Chain
npm run lint && npm run typecheck && npm run test
```

### 4-Phase Validation Checkpoints

**CHECKPOINT 1: Context Validation**
- [ ] Confirm alignment with "Year 3000" design pillars (Ambient Awareness, Living Aesthetics).
- [ ] Verify no conflict with existing GSAP timelines.

**CHECKPOINT 2: Progressive Edit Validation**
- [ ] **Ref Safety Check**: Are refs accessed only in effects/handlers?
- [ ] **Hydration Check**: Are dynamic styles applied via `useGSAP`?
- [ ] **FOUC Check**: Do animating elements have initial CSS hiding?

**CHECKPOINT 3: Integration Validation**
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run lint`.
- [ ] Verify no console warnings (especially hydration mismatches).

**CHECKPOINT 4: Completion Validation**
- [ ] Verify 60fps performance.
- [ ] Confirm accessibility (reduced motion support).

---

## 4. Project-Specific Development Rules

### Build & Installation Cycle
- **Dev**: `npm run dev` (Turbopack).
- **Build**: `npm run build` (Next.js production build).
- **Validation**: `npm run lint` & `npm run typecheck` (tsc).

### API Integration
- **MDX Content**:
  - Located in `content/blog` or `content/projects`.
  - Processed via `src/lib/mdx.ts` and `next-mdx-remote`.
- **Browser APIs**: Accessed only inside `useEffect` or event handlers (SSR safety).

### Hydration Safety Protocols
- **The "Dark Reader" Rule**: NEVER use inline `style` for CSS variables that might be touched by extensions.
  - ❌ `style={{ '--color': '#fff' }}`
  - ✅ `useGSAP(() => ref.style.setProperty('--color', '#fff'), [])`
- **Root Suppression**: `<html>` tag must have `suppressHydrationWarning`.

---

## 5. Debug & Diagnostics Framework

### Test Harness
- **Unit**: `vitest` for hooks and utility logic (`npm run test`).
- **Integration**: Manual verification of animation flows.

### Debug Configuration
- **GSAP**: Use `markers: true` in `ScrollTrigger` for layout debugging.
- **React**: React DevTools for component hierarchy and prop drilling.

---

## 6. Advanced Development Guidelines

### Development Philosophy
- **Living Interfaces**: UI should never be truly static. Idle states must breathe.
- **Robust Entry**: Elements must be stable before they are visible.
- **Interaction Physics**: Feedback should ripple and resonate, not just toggle.
- **Design Flux**: All content (MDX, Lists, Grids) must ripple in via `AnimatedSection` or `useStaggerAnimation`. Static appearance is prohibited for main content.

### Emergency Protocols
- **Hydration Mismatch**: Immediate priority. Fix by moving logic to client-side effect.
- **Layout Thrashing**: Use `ScrollTrigger.refresh()` or debounce resize handlers.

---

## Enhanced CAGEERF Integration

### 1. Context Discovery Protocol
- **Phase 1A**: Read `GEMINI.md` and `docs/standards/ANIMATION_GSAP.md`.
- **Phase 1B**: Analyze component structure for "Anti-Fight" violations.
- **Phase 1C**: Check `tailwind.config.ts` for theme consistency.

### 2. Context Memory System
- **Pattern Registry**:
  - Animation Presets: `src/lib/animations/presets.ts`
  - Color System: `src/lib/hooks/useColorBreathing.ts`
  - MDX Components: `src/mdx-components.tsx`
  - **Year 3000 UI**:
    - `<ScrambleText>`: Cyber-text reveal (`src/components/ui/ScrambleText.tsx`)
    - `<IconButton>`: Physics-based actions (`src/components/ui/IconButton.tsx`)
    - `<AnimatedSection>`: Staggered entry wrapper (`src/components/ui/AnimatedSection.tsx`)
    - `<ProjectDetail>`: Hierarchical reveal (`src/components/project/ProjectDetail.tsx`)

---

## Reference: Technical Schemas

### Animation Usage
```tsx
// Option 1: AnimatedSection wrapper
<AnimatedSection preset="stagger">
  <div data-animate>Item 1</div>
</AnimatedSection>

// Option 2: useStaggerAnimation hook
const ref = useStaggerAnimation<HTMLDivElement>({ preset: 'fadeInUp' });
<div ref={ref}>Content</div>
```

### Tokyo Night Theme Map
| Variable | Hex/Value | Usage |
|----------|-----------|-------|
| `--tn-bg-light` | #1a1b26 | Main background |
| `--tn-bg-dark` | #16161e | Card/Section background |
| `--tn-bg-lighter` | #24283b | Borders, inputs, secondary bg |
| `--tn-fg` | #a9b1d6 | Primary text |
| `--tn-fg-muted` | #565f89 | Secondary text, placeholders |
| `--tn-fg-bright` | #c0caf5 | Headings, emphasized text |
| `--tn-primary` | #7aa2f7 | Primary action, links, focus |
| `--tn-secondary` | #bb9af7 | Secondary accent |
| `--tn-accent-peach` | #ff9e64 | Highlights, warnings |
| `--tn-accent-green` | #9ece6a | Success, nature |
| `--tn-accent-cyan` | #7dcfff | Info, tech |
| `--tn-accent-red` | #f7768e | Errors, destructive |
| `--accent-color` | Dynamic | Current project/theme accent |

### Skill Invocation Map
| Context | Skill |
|---------|-------|
| Next.js patterns | `/nextjs` |
| This project specifics | `/nextjs-portfolio` |
| TypeScript | `/typescript` |
| React patterns | `/react` |
| Animation Standards | `docs/standards/ANIMATION_GSAP.md` |
# Animation Rules

Standards for GSAP animations in this portfolio.

## GSAP Usage Requirements

### 1. Always Use 'use client' Directive

All components with GSAP animations MUST be client components:

```tsx
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
```

### 2. Always Use useGSAP Hook

Never use raw `useEffect` for GSAP. The `useGSAP` hook handles cleanup automatically:

```tsx
// CORRECT
useGSAP(() => {
  gsap.to('.element', { opacity: 1 });
}, { scope: containerRef });

// WRONG - memory leaks, no cleanup
useEffect(() => {
  gsap.to('.element', { opacity: 1 });
}, []);
```

### 3. Always Scope Animations

Pass a `scope` ref to prevent animations from affecting elements outside the component:

```tsx
const containerRef = useRef<HTMLDivElement>(null);

useGSAP(() => {
  // Only animates elements within containerRef
  gsap.from('[data-animate]', { opacity: 0 });
}, { scope: containerRef });

return <div ref={containerRef}>...</div>;
```

## Animation Presets

Use presets from `@/lib/animations/presets` instead of inline values:

```tsx
import { presets } from '@/lib/animations';

// CORRECT - uses preset
gsap.from(element, presets.fadeInUp.from);
gsap.to(element, presets.fadeInUp.to);

// WRONG - magic numbers
gsap.from(element, { opacity: 0, y: 30, duration: 0.6 });
```

## ScrollTrigger Pattern

For scroll-based animations:

```tsx
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once in layout or _app
gsap.registerPlugin(ScrollTrigger);

// In component
useGSAP(() => {
  gsap.from('[data-animate]', {
    ...presets.fadeInUp.from,
    scrollTrigger: {
      trigger: containerRef.current,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
}, { scope: containerRef });
```

## Hover Animations Pattern

For hover effects, use event handlers with GSAP:

```tsx
const handleMouseEnter = () => {
  gsap.to(elementRef.current, presets.hoverPop);
};

const handleMouseLeave = () => {
  gsap.to(elementRef.current, { scale: 1, duration: 0.2 });
};
```

## Performance Rules

| Rule | Requirement |
|------|-------------|
| Animate transforms only | Prefer `x`, `y`, `scale`, `rotation` over `left`, `top`, `width` |
| Use `will-change` sparingly | Only for elements that will animate |
| Limit simultaneous animations | Max 10-15 elements animating at once |
| Use `overwrite: 'auto'` | For hover animations to prevent conflicts |

## Stagger Pattern

For animating multiple elements:

```tsx
gsap.from('[data-animate]', {
  ...presets.fadeInUp.from,
  stagger: presets.stagger.each, // 0.08s between each
});
```

## Forbidden Patterns

| Pattern | Why | Alternative |
|---------|-----|-------------|
| `useEffect` with GSAP | No cleanup | `useGSAP` hook |
| Inline animation values | Inconsistent | Use presets |
| Animating without scope | Affects other components | Pass `scope` ref |
| Direct DOM queries | React conflicts | Use refs |

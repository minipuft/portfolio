# Animation System

GSAP-based animation system with React integration via `@gsap/react`.

## Overview

The animation system provides:
- Scroll-triggered animations via ScrollTrigger
- Reusable animation presets
- Custom easing curves
- React hooks for easy integration

## Setup

```tsx
// src/lib/animations/gsap-setup.ts
'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, CustomEase, useGSAP);

  // Custom eases ported from MediaFlow
  CustomEase.create(
    'smoothOut',
    'M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1 1,1'
  );
  CustomEase.create(
    'gentleIn',
    'M0,0 C0.39,0 0.575,0.565 0.669,0.782 0.762,1 0.846,1 1,1'
  );
}

export { gsap, ScrollTrigger, CustomEase, useGSAP };
```

## Animation Presets

### Available Presets

| Preset | Initial State | Final State | Duration | Ease |
|--------|---------------|-------------|----------|------|
| `fadeIn` | opacity: 0 | opacity: 1 | 0.5s | power2.out |
| `fadeInUp` | opacity: 0, y: 30 | opacity: 1, y: 0 | 0.6s | smoothOut |
| `fadeInDown` | opacity: 0, y: -20 | opacity: 1, y: 0 | 0.5s | power2.out |
| `hoverPop` | - | scale: 1.05 | 0.2s | back.out(1.7) |
| `hoverPopReset` | - | scale: 1 | 0.2s | power2.out |
| `stagger` | opacity: 0, y: 20 | opacity: 1, y: 0 | 0.4s | power2.out |
| `revealLeft` | opacity: 0, x: -30 | opacity: 1, x: 0 | 0.6s | smoothOut |

### Preset Definition

```tsx
// src/lib/animations/presets.ts
import type { TweenVars } from 'gsap';

export interface AnimationPreset {
  initialVars?: TweenVars;  // Set before animation
  vars: TweenVars;          // Animation target
  defaults?: TweenVars;     // Default options (e.g., stagger)
}

export const presets = {
  fadeIn: {
    initialVars: { opacity: 0 },
    vars: { opacity: 1, duration: 0.5, ease: 'power2.out' },
  },
  fadeInUp: {
    initialVars: { opacity: 0, y: 30 },
    vars: { opacity: 1, y: 0, duration: 0.6, ease: 'smoothOut' },
  },
  // ... more presets
} as const;
```

## Usage Patterns

### Pattern 1: AnimatedSection Component

Best for wrapping content that should animate on scroll.

```tsx
import { AnimatedSection } from '@/components/AnimatedSection';

// Single element
<AnimatedSection preset="fadeInUp">
  <h2>Section Title</h2>
</AnimatedSection>

// Staggered children
<AnimatedSection preset="stagger">
  <div data-animate>Card 1</div>
  <div data-animate>Card 2</div>
  <div data-animate>Card 3</div>
</AnimatedSection>
```

### Pattern 2: useScrollAnimation Hook

Best for custom components that need animation.

```tsx
'use client';
import { useScrollAnimation } from '@/lib/animations/hooks';

function ProjectCard({ project }) {
  const ref = useScrollAnimation<HTMLDivElement>({
    preset: 'fadeInUp',
    start: 'top 85%',  // When to trigger
    once: true,        // Only animate once
  });

  return (
    <div ref={ref}>
      {/* Card content */}
    </div>
  );
}
```

### Pattern 3: Direct useGSAP Hook

Best for complex, custom animations.

```tsx
'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/animations/gsap-setup';

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Timeline for sequenced animations
    const tl = gsap.timeline();

    tl.from('.hero-title', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'smoothOut',
    })
    .from('.hero-subtitle', {
      opacity: 0,
      y: 30,
      duration: 0.6,
    }, '-=0.4')  // Start 0.4s before previous ends
    .from('.hero-cta', {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
    }, '-=0.2');

  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <h1 className="hero-title">Hello</h1>
      <p className="hero-subtitle">I build things</p>
      <button className="hero-cta">View Projects</button>
    </div>
  );
}
```

### Pattern 4: Hover Animations

```tsx
'use client';
import { useRef } from 'react';
import { gsap } from '@/lib/animations/gsap-setup';
import { presets } from '@/lib/animations/presets';

function Card({ children }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, presets.hoverPop.vars);
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, presets.hoverPopReset.vars);
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
```

## ScrollTrigger Configuration

### Common Options

```tsx
ScrollTrigger.create({
  trigger: element,           // Element that triggers animation
  start: 'top 80%',          // When trigger top hits 80% of viewport
  end: 'bottom 20%',         // When trigger bottom hits 20% of viewport
  once: true,                // Only fire once
  markers: true,             // Debug markers (dev only)
  onEnter: () => {},         // Callback when entering
  onLeave: () => {},         // Callback when leaving
  onEnterBack: () => {},     // Callback when scrolling back up
  toggleActions: 'play none none reverse',  // enter, leave, enterBack, leaveBack
});
```

### Start/End Values

| Value | Meaning |
|-------|---------|
| `'top top'` | When element's top hits viewport's top |
| `'top 80%'` | When element's top hits 80% down from viewport top |
| `'center center'` | When element's center hits viewport's center |
| `'bottom bottom'` | When element's bottom hits viewport's bottom |
| `'+=100'` | 100px after the calculated position |

## Custom Eases

### smoothOut

Gentle deceleration with slight overshoot. Best for:
- Hero animations
- Page transitions
- Large element movements

### gentleIn

Smooth acceleration. Best for:
- Exit animations
- Fade outs
- Subtle movements

### Built-in GSAP Eases

| Ease | Character |
|------|-----------|
| `power1.out` | Subtle deceleration |
| `power2.out` | Medium deceleration |
| `power3.out` | Strong deceleration |
| `back.out(1.7)` | Overshoot and settle |
| `elastic.out(1, 0.3)` | Bouncy |
| `circ.out` | Circular motion |

## Performance Tips

1. **Use transforms** - `x`, `y`, `scale`, `rotation` are GPU-accelerated
2. **Avoid animating layout** - Don't animate `width`, `height`, `top`, `left`
3. **Use `will-change` sparingly** - Only on elements about to animate
4. **Kill animations** - Clean up in useEffect return

```tsx
useGSAP(() => {
  const animation = gsap.to(element, { ... });

  return () => {
    animation.kill();  // Clean up
  };
}, { scope: containerRef });
```

## Debugging

```tsx
// Enable ScrollTrigger markers
ScrollTrigger.create({
  trigger: element,
  markers: true,  // Shows green/red markers
  // ...
});

// Log animation progress
gsap.to(element, {
  x: 100,
  onUpdate: function() {
    console.log('Progress:', this.progress());
  },
});
```

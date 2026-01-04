# Component Patterns

Rules for consistent React component development in this portfolio.

## Server vs Client Components

**Default to Server Components** unless you need:
- `useState`, `useEffect`, or other hooks
- Browser APIs (`window`, `document`, `localStorage`)
- Event handlers (`onClick`, `onSubmit`)
- GSAP animations or Framer Motion

```tsx
// Server Component (default) - no directive needed
export default function ProjectCard({ project }: Props) {
  return <article>...</article>;
}

// Client Component - requires directive
'use client';
export default function AnimatedSection({ children }: Props) {
  // Uses useGSAP hook
}
```

## Component File Structure

Every component file should follow:

```tsx
// 1. 'use client' directive (only if needed)
'use client';

// 2. Imports - React/Next, then external, then internal
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

// 3. Types (inline for simple, separate file for complex)
interface ComponentProps {
  // ...
}

// 4. Component definition
export default function ComponentName({ prop }: ComponentProps) {
  // a. Refs first
  const containerRef = useRef<HTMLDivElement>(null);

  // b. State second

  // c. Effects/hooks third
  useGSAP(() => {}, { scope: containerRef });

  // d. Handlers fourth

  // e. Render
  return <div ref={containerRef}>...</div>;
}
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component files | PascalCase | `ProjectCard.tsx` |
| Hook files | camelCase with use | `useScrollAnimation.ts` |
| Utility files | camelCase | `colorUtils.ts` |
| Style modules | kebab-case | `project-card.module.css` |
| Directories | kebab-case | `animated-sections/` |

## Animation Components

Components with animations MUST:
1. Use `'use client'` directive
2. Accept `ref` forwarding or use internal ref
3. Clean up GSAP contexts properly via `useGSAP`
4. Use animation presets from `@/lib/animations`

```tsx
'use client';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { presets } from '@/lib/animations';

export default function AnimatedCard({ children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animation code using presets
  }, { scope: ref });

  return <div ref={ref}>{children}</div>;
}
```

## File Size Limits

| Type | Target | Max | Action |
|------|--------|-----|--------|
| Page components | <150 | 200 | Extract sections |
| UI components | <100 | 150 | Extract sub-components |
| Hooks | <80 | 100 | Split by concern |
| Utilities | <60 | 80 | Create focused modules |

Check with: `wc -l src/components/**/*.tsx | sort -n`

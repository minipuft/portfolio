# Portfolio Pre-Setup & Phase 1 Plan

## Current State
- ✅ Global Next.js skill created
- ✅ Project-specific portfolio skill created
- ✅ CLAUDE.md with project instructions
- ✅ Architecture, Animation, Color documentation
- ✅ Project rules created (component-patterns, animation-rules, content-rules)
- ⏳ Content/branding - user will prepare during Phase 2
- ✅ Next.js initialized (merged from temp directory)
- ❌ Tokyo Night Tailwind config
- ❌ GSAP + animation system
- ❌ ColorContext
- ❌ Header/Footer components
- ❌ Git repo

---

## Pre-Setup Tasks (Before Phase 1)

### Task 1: Create Project Rules

Create rules in `/home/minipuft/Applications/portfolio/.claude/rules/`:

**component-patterns.md** - Server vs Client components, file structure, naming conventions, file size limits

**animation-rules.md** - GSAP usage requirements, `useGSAP` patterns, preset usage, cleanup requirements

**content-rules.md** - MDX frontmatter schema, image requirements, content organization

### Task 2: Personal Branding Strategy

**Target Audience**: Hiring managers, tech leads at AI/tooling companies, support engineer roles

**Unique Value Proposition**:
- Built production MCP server (claude-prompts-mcp) - demonstrates AI tooling competency
- Self-taught developer transitioning careers - shows initiative, learning ability
- Multiple shipped projects - MediaFlow (React/Node), Spicetify (CSS/JS API)

**Narrative Arc**:
```
Dropped out of college → Worked at Starbucks →
Self-taught development → Built AI tools →
Seeking tech career in AI/tooling space
```

**Key Messages to Convey**:
1. "I build tools that enhance developer workflows" (claude-prompts-mcp)
2. "I understand modern React/TypeScript ecosystem" (MediaFlow)
3. "I can work with complex APIs and theming" (Spicetify)
4. "I'm self-motivated and learn quickly" (career transition story)

**Content to Prepare**:
- Hero tagline: "Building developer tools for the AI era" (or similar)
- Short bio (2-3 sentences): Focus on AI tooling, self-taught, career transition
- Project descriptions (1-2 paragraphs each)
- Blog post outlines

---

## Phase 1: Initialize Next.js Project

### Step 1: Create Next.js App
```bash
cd ~/Applications/portfolio
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### Step 2: Configure TypeScript (strict mode)
Edit `tsconfig.json`:
- Enable `strict: true`
- Add path aliases for `@/components`, `@/lib`, etc.

### Step 3: Set Up Tailwind with Tokyo Night
Edit `tailwind.config.ts`:
```typescript
colors: {
  'tn-bg': { light: '#1a1b26', dark: '#16161e', lighter: '#24283b' },
  'tn-fg': { DEFAULT: '#a9b1d6', muted: '#565f89', bright: '#c0caf5' },
  'tn-primary': '#7aa2f7',
  'tn-secondary': '#bb9af7',
  'tn-accent': {
    peach: '#ff9e64',
    green: '#9ece6a',
    cyan: '#7dcfff',
    red: '#f7768e',
  },
}
```

### Step 4: Install Dependencies
```bash
npm install gsap @gsap/react framer-motion
npm install contentlayer next-contentlayer date-fns
npm install -D @types/node
```

### Step 5: Configure Contentlayer (with fallback)
Create `contentlayer.config.ts` with Project and Post document types.

**Risk Mitigation**: If Contentlayer has compatibility issues with Next.js 15:
- Fallback Option A: Use `@next/mdx` (officially supported)
- Fallback Option B: Use `next-mdx-remote` + manual frontmatter parsing
- Decision point: If Contentlayer install fails or causes build errors, switch immediately

### Step 6: Create Foundation Structure
```
src/
├── app/
│   ├── layout.tsx        # Root layout with ColorProvider
│   ├── page.tsx          # Home page
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx  # Project detail
│   ├── blog/
│   │   └── [slug]/
│   │       └── page.tsx  # Blog post
│   └── about/
│       └── page.tsx      # About page
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   └── ui/
│       └── AnimatedSection.tsx
├── contexts/
│   └── ColorContext.tsx
├── lib/
│   ├── animations/
│   │   ├── presets.ts
│   │   └── index.ts
│   └── utils.ts
└── styles/
    └── globals.css
```

### Step 7: Create ColorContext
```tsx
'use client';
import { createContext, useContext, useState } from 'react';

const ColorContext = createContext({
  accentColor: '#7aa2f7',
  setAccentColor: (color: string) => {}
});

export function ColorProvider({ children }) {
  const [accentColor, setAccentColor] = useState('#7aa2f7');
  // Update CSS custom properties on change
  return <ColorContext.Provider value={{ accentColor, setAccentColor }}>
    {children}
  </ColorContext.Provider>;
}

export const useColor = () => useContext(ColorContext);
```

### Step 8: Create Animation Presets
```typescript
// src/lib/animations/presets.ts
export const presets = {
  fadeIn: { from: { opacity: 0 }, to: { opacity: 1, duration: 0.5 } },
  fadeInUp: { from: { opacity: 0, y: 30 }, to: { opacity: 1, y: 0, duration: 0.6 } },
  hoverPop: { scale: 1.05, duration: 0.2, ease: 'back.out(1.7)' },
  stagger: { each: 0.08 },
};
```

### Step 9: Create Root Layout
```tsx
// src/app/layout.tsx
import { ColorProvider } from '@/contexts/ColorContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-tn-bg-light text-tn-fg min-h-screen">
        <ColorProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ColorProvider>
      </body>
    </html>
  );
}
```

### Step 10: Initialize Git
```bash
git init
git add .
git commit -m "feat: initialize Next.js 15 portfolio with TypeScript, Tailwind, GSAP"
```

---

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `package.json` | Created by create-next-app, add deps |
| `tsconfig.json` | Enable strict mode |
| `tailwind.config.ts` | Tokyo Night colors |
| `contentlayer.config.ts` | MDX document types |
| `next.config.mjs` | Contentlayer integration |
| `src/app/layout.tsx` | Root layout |
| `src/app/page.tsx` | Home page |
| `src/contexts/ColorContext.tsx` | Color theming |
| `src/lib/animations/presets.ts` | GSAP presets |
| `src/components/layout/Header.tsx` | Navigation |
| `src/components/layout/Footer.tsx` | Footer |

---

## Success Criteria

- [ ] `npm run dev` starts without errors
- [ ] Tokyo Night theme applied
- [ ] Header/Footer render correctly
- [ ] ColorContext provides dynamic colors
- [ ] GSAP animations work in at least one component
- [ ] Git repo initialized with clean commit

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Contentlayer + Next.js 15 incompatibility | Medium | High | Fallback to @next/mdx or next-mdx-remote |
| create-next-app defaults change | Low | Low | Verify output, adjust manually if needed |
| GSAP SSR issues | Low | Medium | Ensure all GSAP code in 'use client' components |

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Next.js over Astro | Higher job market demand, direct React port, better career value |
| Contentlayer over raw MDX | Type-safe content, better DX - with fallback plan |
| GSAP over pure Framer | More control for complex animations, MediaFlow patterns port |

---

## Post-Phase 1: Content Tasks (User)

While I build Phase 2, prepare:
1. Short bio (2-3 sentences)
2. Project descriptions for each of your 3 projects
3. Decide on hero tagline
4. Gather any existing screenshots/videos

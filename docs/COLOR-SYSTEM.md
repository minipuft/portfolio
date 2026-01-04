# Color System

Dynamic color theming system using React Context and CSS custom properties.

## Overview

The color system enables:
- Per-project accent color theming
- Tokyo Night base palette
- CSS variable integration for dynamic styling
- Smooth color transitions

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Project   │────▶│ setAccent   │────▶│   Context   │
│ accentColor │     │   Color()   │     │    State    │
└─────────────┘     └─────────────┘     └─────────────┘
                                               │
                          ┌────────────────────┴────────────────────┐
                          ▼                                         ▼
                   ┌─────────────┐                           ┌─────────────┐
                   │ --accent-   │                           │ --accent-   │
                   │   color     │                           │    rgb      │
                   └─────────────┘                           └─────────────┘
                          │                                         │
                          ▼                                         ▼
                   ┌─────────────┐                           ┌─────────────┐
                   │ Solid color │                           │ rgba() with │
                   │   usage     │                           │   opacity   │
                   └─────────────┘                           └─────────────┘
```

## Setup

### ColorContext

```tsx
// src/lib/colors/context.tsx
'use client';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { hexToRgbString } from './utils';

interface ColorContextValue {
  accentColor: string;    // Hex value: #7aa2f7
  accentRgb: string;      // RGB string: "122, 162, 247"
  setAccentColor: (hex: string) => void;
}

const ColorContext = createContext<ColorContextValue | null>(null);

const DEFAULT_COLOR = '#7aa2f7';  // Tokyo Night blue
const DEFAULT_RGB = '122, 162, 247';

export function ColorProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColorState] = useState(DEFAULT_COLOR);
  const [accentRgb, setAccentRgb] = useState(DEFAULT_RGB);

  const setAccentColor = useCallback((hex: string) => {
    setAccentColorState(hex);
    setAccentRgb(hexToRgbString(hex));
  }, []);

  return (
    <ColorContext.Provider value={{ accentColor, accentRgb, setAccentColor }}>
      <div
        style={{
          '--accent-color': accentColor,
          '--accent-rgb': accentRgb,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ColorContext.Provider>
  );
}

export function useColor() {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColor must be used within ColorProvider');
  }
  return context;
}
```

### Color Utilities

```tsx
// src/lib/colors/utils.ts

/**
 * Convert hex color to RGB string for CSS variables
 * @example hexToRgbString('#7aa2f7') => '122, 162, 247'
 */
export function hexToRgbString(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '122, 162, 247';  // Fallback to primary

  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

/**
 * Convert hex color to RGB tuple
 * @example hexToRgb('#7aa2f7') => [122, 162, 247]
 */
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [122, 162, 247];

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

/**
 * Convert RGB values to hex
 * @example rgbToHex(122, 162, 247) => '#7aa2f7'
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
```

## Usage

### In React Components

```tsx
'use client';
import { useColor } from '@/lib/colors/context';
import { useEffect } from 'react';

function ProjectPage({ project }) {
  const { setAccentColor } = useColor();

  // Set project-specific color on mount
  useEffect(() => {
    if (project.accentColor) {
      setAccentColor(project.accentColor);
    }

    // Reset to default on unmount
    return () => setAccentColor('#7aa2f7');
  }, [project.accentColor, setAccentColor]);

  return <div>{/* Project content */}</div>;
}
```

### In CSS/Tailwind

```css
/* Direct variable usage */
.accent-text {
  color: var(--accent-color);
}

/* With opacity via rgba() */
.accent-bg-10 {
  background: rgba(var(--accent-rgb), 0.1);
}

.accent-bg-20 {
  background: rgba(var(--accent-rgb), 0.2);
}

.accent-border {
  border-color: rgba(var(--accent-rgb), 0.5);
}

.accent-glow {
  box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.3);
}

/* Hover state */
.card:hover {
  background: rgba(var(--accent-rgb), 0.1);
  border-color: rgba(var(--accent-rgb), 0.5);
}
```

### Tailwind Custom Classes

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Static colors
        primary: '#7aa2f7',
        // ...
      },
      // For dynamic accent, use CSS in className or style
    },
  },
};
```

```tsx
// In components
<div className="bg-[rgba(var(--accent-rgb),0.1)]">
  Dynamic background
</div>

<div style={{ color: 'var(--accent-color)' }}>
  Dynamic text
</div>
```

## Tokyo Night Palette

### Base Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary | #7aa2f7 | 122, 162, 247 | Links, buttons, focus |
| Secondary | #bb9af7 | 187, 154, 247 | Accents, highlights |
| Background | #1a1b26 | 26, 27, 38 | Main background |
| Background Dark | #16161e | 22, 22, 30 | Cards, sections |

### Accent Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Peach | #ff9e64 | 255, 158, 100 | Warnings, attention |
| Green | #9ece6a | 158, 206, 106 | Success, positive |
| Cyan | #7dcfff | 125, 207, 255 | Info, links |
| Red | #f7768e | 247, 118, 142 | Errors, destructive |

### Gray Scale

| Level | Hex | RGB | Usage |
|-------|-----|-----|-------|
| 100 | #a9b1d6 | 169, 177, 214 | Primary text |
| 200 | #9aa5ce | 154, 165, 206 | Secondary text |
| 300 | #787c99 | 120, 124, 153 | Muted text |
| 400 | #565f89 | 86, 95, 137 | Borders |
| 500 | #414868 | 65, 72, 104 | Dividers |
| 600 | #363b54 | 54, 59, 84 | Card borders |
| 700 | #24283b | 36, 40, 59 | Input backgrounds |

## Project Accent Colors

Suggested colors for each project:

| Project | Color | Hex | Reasoning |
|---------|-------|-----|-----------|
| claude-prompts-mcp | Gold/Amber | #fbbf24 | AI, intelligence |
| MediaFlow | Cyan | #7dcfff | Media, visual |
| Spicetify | Green | #9ece6a | Spotify vibes |

## Advanced: Color Transitions

For smooth color changes when navigating between projects:

```tsx
// In ColorProvider wrapper div
<div
  style={{
    '--accent-color': accentColor,
    '--accent-rgb': accentRgb,
    transition: 'background-color 0.3s ease',
  } as React.CSSProperties}
>
```

```css
/* Elements that should transition */
.accent-bg {
  background: rgba(var(--accent-rgb), 0.1);
  transition: background-color 0.3s ease;
}
```

## Best Practices

1. **Always provide fallbacks** - Use default colors if extraction fails
2. **Use RGB for opacity** - Store as `r, g, b` string for `rgba()` usage
3. **Reset on unmount** - Return to default when leaving themed pages
4. **Memoize setters** - Use `useCallback` for context functions
5. **Limit scope** - Only use dynamic colors where meaningful

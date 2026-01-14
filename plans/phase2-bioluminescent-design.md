# Phase 2: Bioluminescent Design & Living Physics

## Vision Update
Shift from "Retro-Cyberpunk" (Static Neon) to **"Bioluminescent Organism"** (Living Light).
The interface should feel like a deep-sea creature: dormant in stillness, vibrant in motion.

---

## 1. Color System Upgrade: OKLCH
We will transition from Hex/RGB to **OKLCH** (Lightness, Chroma, Hue).
*   **Why?** Perceptual uniformity. Changing Hue in RGB changes brightness (Yellow is brighter than Blue). In OKLCH, Lightness is separate. This allows us to pulse "Energy" (Chroma/Lightness) without breaking the color harmony.
*   **Tailwind Integration:** We will use "Dynamic Primitives".
    *   Instead of 50 shades of blue, we define **Logic Variables**:
        *   `--primary-hue`: Derived from Scroll Position.
        *   `--energy-level`: Derived from Mouse Velocity (0.0 to 1.0).
        *   `--luminance-floor`: The resting brightness.
    *   **The Master Token:**
        ```css
        --living-accent: oklch(
            calc(var(--luminance-floor) + var(--energy-level) * 0.3) /* Lightness surges with speed */
            0.2                                                      /* Consistent Vivid Chroma */
            var(--primary-hue)                                       /* Hue shifts with scroll */
        );
        ```

### Performance & Efficiency
*   **CSS-Native:** All color mixing happens in the compositor or layout engine via CSS variables. Zero JS overhead for the gradient rendering itself.
*   **Token Strategy:** **Limit & Deepen.** Do not add more static tokens. Instead, make the existing semantic tokens (`--background`, `--foreground`, `--accent`) *smarter* by binding them to the physics variables.

---

## 2. The Physics Engine (The "Heartbeat")
We need a central store that synchronizes all motion data to prevent layout thrashing.

### New Hook: `useEnvironmentalPhysics`
Combines:
1.  **Velocity:** `useMouseVelocity` (New) - Tracks cursor speed.
2.  **Flow:** `useScrollVelocity` (Existing) - Tracks scroll momentum.
3.  **Disturbance:** `useRippleEffect` (Existing) - Tracks user clicks/impacts.

**Output:**
Updates a set of CSS Custom Properties on the `<body>` tag in a single `requestAnimationFrame` loop.
*   `--physics-velocity`
*   `--physics-scroll-speed`
*   `--physics-time`

---

## 3. The "Organic Grid" (Layout)
Replacing the rigid Bento Grid with **Deterministic Chaos**.

*   **Seeded Randomness:** Use a stable hash of the Project ID to determine cell span and offset. This ensures `SSR === Client` (No Hydration Mismatches).
*   **The "Gooey" Filter:**
    *   Use an SVG filter (Contrast + Blur) on the grid *background* layer to make adjacent cards feel like they are merging cells (Metaball effect).
    *   Keep content sharp on a top layer.

---

## 4. Component Roadmap

### Step 1: Foundation
- [ ] Create `useMouseVelocity` hook.
- [ ] Refactor `ThemeController` to use `useEnvironmentalPhysics`.
- [ ] Define OKLCH base variables in `globals.css`.

### Step 2: The Grid
- [ ] Create `OrganicGrid.tsx` (Seeded random layout).
- [ ] Implement `MetaballFilter.tsx` (SVG definition).

### Step 3: Integration
- [ ] Update `ProjectCard` to react to `--physics-velocity` (Glow intensifies on fast approach).
- [ ] Connect `BlogFeed` nodes to the "Neural Stream" visualization.

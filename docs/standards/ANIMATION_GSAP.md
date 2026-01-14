# GSAP & React Animation Standards

**Version**: 1.0
**Context**: "Year 3000" High-Performance WebGL/DOM Animation

---

## 1. The Golden Rule: Separation of Concerns

**Never** allow CSS Transitions and GSAP to fight over the same properties.

- **❌ Anti-Pattern**: Using `transition-all` on an element that GSAP animates (opacity, transform, x, y).
- **✅ Standard**: Use specific transitions (e.g., `transition-colors`, `transition-border`) for hover states, and let GSAP own the geometry/opacity.

**Why?**
CSS sees the GSAP change and tries to "tween" it, causing a fight, flickering, or "ghosting".

---

## 2. FOUC Prevention (Flash of Unstyled Content)

Elements animated "in" must be hidden *before* JavaScript executes.

### The "Robust Entry" Pattern

1.  **CSS (Global or Module)**:
    ```css
    [data-animate] {
      opacity: 0;
      visibility: hidden; /* Critical for layout stability */
      will-change: transform, opacity;
    }
    ```

2.  **GSAP (Preset/Logic)**:
    Use `autoAlpha`. It handles `opacity` + `visibility` automatically.
    ```javascript
    gsap.fromTo(element, 
      { autoAlpha: 0, y: 20 }, 
      { autoAlpha: 1, y: 0 }
    );
    ```

**Why?**
If you rely only on JS to hide elements, they will be visible for a split second (hydration gap). CSS ensures they are invisible from the first paint.

---

## 3. Hydration Safety & Dynamic Styles

**Problem**: Browser extensions (Dark Reader, etc.) modify inline styles *immediately*. React hydration checks fail if server HTML != client DOM.

- **❌ Anti-Pattern**: Inline styles for dynamic vars.
  ```tsx
  <div style={{ '--color': dynamicColor }} /> // Hydration Mismatch Risk
  ```

- **✅ Standard**: Set via GSAP/Effect after mount.
  ```tsx
  useGSAP(() => {
    ref.current.style.setProperty('--color', dynamicColor);
  }, [dynamicColor]);
  ```

---

## 4. React Integration (`useGSAP`)

Always use the `@gsap/react` hook. Never use `useEffect` for GSAP.

**Why?**
`useGSAP` correctly handles:
- Cleanup (reverting animations on unmount).
- React Strict Mode (double-invocation).
- Scope/Context (selector scoping).

```tsx
// ✅ Correct
useGSAP(() => {
  gsap.to('.box', { x: 100 });
}, { scope: containerRef });
```

## 5. Performance Checklist

- [ ] **`will-change`**: Use only on elements actively animating.
- [ ] **`ScrollTrigger.refresh()`**: Call this if layout shifts significantly (e.g., after loading images/fonts).
- [ ] **Batching**: Don't stagger 100 elements individually. Batch them or use `stagger: { amount: 0.5 }` to cap the total time.

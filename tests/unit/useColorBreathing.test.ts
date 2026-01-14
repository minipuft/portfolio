import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollColorTemperature } from '@/lib/hooks/useColorBreathing';

// Mock useReducedMotion
vi.mock('@/lib/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

// Mock useScrollProgress
vi.mock('@/lib/hooks/useMomentumScroll', () => ({
  useScrollProgress: () => 0.5, // Middle of page
}));

describe('useScrollColorTemperature', () => {
  it('should return a blended color at 50% scroll', () => {
    const { result } = renderHook(() => useScrollColorTemperature({
      warmColor: '#ff0000', // Red
      coolColor: '#0000ff', // Blue
    }));

    // At 50%, it should be purple-ish
    expect(result.current.temperature).toBe(0.5);
    expect(result.current.tint).toBeDefined();
    // We expect a hex color string
    expect(result.current.tint).toMatch(/^#[0-9a-f]{6}[0-9a-f]{2}$/);
  });
});

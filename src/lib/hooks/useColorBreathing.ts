'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { useScrollProgress } from './useMomentumScroll';

interface ColorBreathingOptions {
  baseColor: string; // Hex color
  hueRange?: number; // How much hue can shift (degrees, 0-30)
  saturationRange?: number; // Saturation shift range (0-20)
  lightnessRange?: number; // Lightness shift range (0-10)
  breathDuration?: number; // Full cycle duration in seconds
  scrollInfluence?: number; // 0-1, how much scroll affects color
}

interface ColorBreathingResult {
  color: string; // Current animated color (hex)
  hsl: { h: number; s: number; l: number };
  cssVar: string; // CSS variable format
  rgbVar: string; // RGB values for CSS rgba()
}

/**
 * Convert hex to HSL
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to hex
 */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert HSL to RGB values
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Hook for subtle color breathing animation
 * Creates organic, living color shifts over time
 */
export function useColorBreathing(options: ColorBreathingOptions): ColorBreathingResult {
  const {
    baseColor,
    hueRange = 8,
    saturationRange = 5,
    lightnessRange = 3,
    breathDuration = 8,
    scrollInfluence = 0.3,
  } = options;

  const reducedMotion = useReducedMotion();
  const scrollProgress = useScrollProgress();
  const [time, setTime] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Parse base color
  const baseHsl = useMemo(() => hexToHsl(baseColor), [baseColor]);

  // Animate time for breathing effect
  useEffect(() => {
    if (reducedMotion) return;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      setTime(elapsed);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [reducedMotion]);

  // Calculate breathing color
  const result = useMemo(() => {
    if (reducedMotion) {
      const rgb = hslToRgb(baseHsl.h, baseHsl.s, baseHsl.l);
      return {
        color: baseColor,
        hsl: baseHsl,
        cssVar: baseColor,
        rgbVar: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
      };
    }

    // Use multiple sine waves for organic feel
    const breathPhase = (time / breathDuration) * Math.PI * 2;
    const slowBreath = Math.sin(breathPhase);
    const fastBreath = Math.sin(breathPhase * 2.3) * 0.3;
    const combined = (slowBreath + fastBreath) / 1.3;

    // Scroll influence adds color temperature shift
    const scrollOffset = (scrollProgress - 0.5) * 2 * scrollInfluence;

    // Calculate shifts
    const hueShift = combined * hueRange + scrollOffset * hueRange * 0.5;
    const satShift = combined * saturationRange;
    const lightShift = combined * lightnessRange;

    // Apply shifts with clamping
    const newH = (baseHsl.h + hueShift + 360) % 360;
    const newS = Math.max(0, Math.min(100, baseHsl.s + satShift));
    const newL = Math.max(0, Math.min(100, baseHsl.l + lightShift));

    const newHex = hslToHex(newH, newS, newL);
    const rgb = hslToRgb(newH, newS, newL);

    return {
      color: newHex,
      hsl: { h: newH, s: newS, l: newL },
      cssVar: newHex,
      rgbVar: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
    };
  }, [baseColor, baseHsl, time, breathDuration, scrollProgress, scrollInfluence, hueRange, saturationRange, lightnessRange, reducedMotion]);

  return result;
}

/**
 * Hook for color temperature based on scroll position
 * Warm at top (sunrise), cool at bottom (night)
 */
export function useScrollColorTemperature(options: {
  warmColor?: string;
  coolColor?: string;
  intensity?: number;
} = {}): { temperature: number; tint: string } {
  const {
    warmColor = '#ff9e64', // Peach/orange
    coolColor = '#7aa2f7', // Blue
    intensity = 0.15,
  } = options;

  const scrollProgress = useScrollProgress();
  const reducedMotion = useReducedMotion();

  return useMemo(() => {
    if (reducedMotion) {
      return { temperature: 0.5, tint: 'transparent' };
    }

    // 0 = top (warm), 1 = bottom (cool)
    const temperature = scrollProgress;

    // Blend between warm and cool
    const warmHsl = hexToHsl(warmColor);
    const coolHsl = hexToHsl(coolColor);

    const blendedH = warmHsl.h + (coolHsl.h - warmHsl.h) * temperature;
    const blendedS = warmHsl.s + (coolHsl.s - warmHsl.s) * temperature;
    const blendedL = warmHsl.l + (coolHsl.l - warmHsl.l) * temperature;

    const tintColor = hslToHex(blendedH, blendedS, blendedL);

    return {
      temperature,
      tint: `${tintColor}${Math.round(intensity * 255).toString(16).padStart(2, '0')}`,
    };
  }, [scrollProgress, warmColor, coolColor, intensity, reducedMotion]);
}

/**
 * Hook for idle breathing effect on accent colors
 * Subtle pulse that makes elements feel alive
 */
export function useIdleBreathing(options: {
  minOpacity?: number;
  maxOpacity?: number;
  duration?: number;
} = {}): number {
  const {
    minOpacity = 0.8,
    maxOpacity = 1,
    duration = 4,
  } = options;

  const [opacity, setOpacity] = useState(maxOpacity);
  const reducedMotion = useReducedMotion();
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (opacity !== maxOpacity) setOpacity(maxOpacity);
      return;
    }

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const phase = (elapsed / duration) * Math.PI * 2;
      const breath = (Math.sin(phase) + 1) / 2; // 0-1 range
      const newOpacity = minOpacity + breath * (maxOpacity - minOpacity);

      setOpacity(newOpacity);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [reducedMotion, minOpacity, maxOpacity, duration]);

  return opacity;
}
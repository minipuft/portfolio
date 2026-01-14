'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface CursorPosition {
  x: number;
  y: number;
  normalizedX: number; // 0-1 range
  normalizedY: number; // 0-1 range
  velocityX: number;
  velocityY: number;
  isActive: boolean;
}

const defaultPosition: CursorPosition = {
  x: 0,
  y: 0,
  normalizedX: 0.5,
  normalizedY: 0.5,
  velocityX: 0,
  velocityY: 0,
  isActive: false,
};

// Shared cursor state for all subscribers
let cursorState: CursorPosition = { ...defaultPosition };
const listeners: Set<() => void> = new Set();
let isInitialized = false;
let lastX = 0;
let lastY = 0;
let lastTime = 0;
let rafId: number | null = null;

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function initializeCursorTracking() {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  const handleMouseMove = (e: MouseEvent) => {
    const now = performance.now();
    const deltaTime = now - lastTime || 16;

    const velocityX = (e.clientX - lastX) / deltaTime;
    const velocityY = (e.clientY - lastY) / deltaTime;

    cursorState = {
      x: e.clientX,
      y: e.clientY,
      normalizedX: e.clientX / window.innerWidth,
      normalizedY: e.clientY / window.innerHeight,
      velocityX: velocityX * 10, // Scale for usability
      velocityY: velocityY * 10,
      isActive: true,
    };

    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = now;

    // Use RAF to batch updates
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        notifyListeners();
        rafId = null;
      });
    }
  };

  const handleMouseLeave = () => {
    cursorState = {
      ...cursorState,
      isActive: false,
      velocityX: 0,
      velocityY: 0,
    };
    notifyListeners();
  };

  const handleMouseEnter = () => {
    cursorState = { ...cursorState, isActive: true };
    notifyListeners();
  };

  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('mouseleave', handleMouseLeave);
  document.addEventListener('mouseenter', handleMouseEnter);
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  initializeCursorTracking();

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): CursorPosition {
  return cursorState;
}

function getServerSnapshot(): CursorPosition {
  return defaultPosition;
}

/**
 * Hook to track global cursor position with velocity
 * Returns normalized coordinates (0-1) for easy use across components
 */
export function useCursorPosition(): CursorPosition {
  const reducedMotion = useReducedMotion();

  const position = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Return static center position if reduced motion is preferred
  if (reducedMotion) {
    return defaultPosition;
  }

  return position;
}

/**
 * Hook to get cursor position relative to a specific element
 */
export function useElementCursorPosition(
  elementRef: React.RefObject<HTMLElement | null>
): {
  relativeX: number;
  relativeY: number;
  distance: number;
  angle: number;
  isNear: boolean;
} {
  const cursor = useCursorPosition();
  const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0, centerX: 0, centerY: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setBounds({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          centerX: rect.x + rect.width / 2,
          centerY: rect.y + rect.height / 2,
        });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds, { passive: true });
    window.addEventListener('scroll', updateBounds, { passive: true });

    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds);
    };
  }, [elementRef]);

  const deltaX = cursor.x - bounds.centerX;
  const deltaY = cursor.y - bounds.centerY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const maxDimension = Math.max(bounds.width, bounds.height);
  const normalizedDistance = maxDimension > 0 ? distance / maxDimension : 0;

  return {
    relativeX: bounds.width > 0 ? (cursor.x - bounds.x) / bounds.width : 0.5,
    relativeY: bounds.height > 0 ? (cursor.y - bounds.y) / bounds.height : 0.5,
    distance: normalizedDistance,
    angle: Math.atan2(deltaY, deltaX),
    isNear: normalizedDistance < 2, // Within 2x the element's size
  };
}

/**
 * Calculate magnetic attraction/repulsion force
 */
export function useMagneticEffect(
  elementRef: React.RefObject<HTMLElement | null>,
  options: {
    strength?: number; // 0-1, how strong the effect
    radius?: number; // How far the effect reaches (in pixels)
    mode?: 'attract' | 'repel';
  } = {}
): { x: number; y: number; scale: number; isActive: boolean } {
  const { strength = 0.3, radius = 200, mode = 'attract' } = options;
  const cursor = useCursorPosition();
  const reducedMotion = useReducedMotion();
  const [bounds, setBounds] = useState({ centerX: 0, centerY: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setBounds({
          centerX: rect.x + rect.width / 2,
          centerY: rect.y + rect.height / 2,
        });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds, { passive: true });
    window.addEventListener('scroll', updateBounds, { passive: true });

    return () => {
      window.removeEventListener('resize', updateBounds);
      window.removeEventListener('scroll', updateBounds);
    };
  }, [elementRef]);

  if (reducedMotion || !cursor.isActive) {
    return { x: 0, y: 0, scale: 1, isActive: false };
  }

  const deltaX = cursor.x - bounds.centerX;
  const deltaY = cursor.y - bounds.centerY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance > radius) {
    return { x: 0, y: 0, scale: 1, isActive: false };
  }

  // Eased falloff - stronger effect when closer
  const falloff = 1 - distance / radius;
  const easedFalloff = falloff * falloff; // Quadratic easing
  const force = easedFalloff * strength;

  const directionMultiplier = mode === 'attract' ? 1 : -1;
  const normalizedX = distance > 0 ? deltaX / distance : 0;
  const normalizedY = distance > 0 ? deltaY / distance : 0;

  return {
    x: normalizedX * force * 30 * directionMultiplier,
    y: normalizedY * force * 30 * directionMultiplier,
    scale: 1 + easedFalloff * 0.05, // Subtle scale on proximity
    isActive: true,
  };
}

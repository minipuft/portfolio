'use client';

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface NeighborState {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

const NeighborContext = createContext<NeighborState | null>(null);

interface NeighborProviderProps {
  children: ReactNode;
}

/**
 * Provider for neighbor response system
 * Wrap a group of elements that should respond to each other
 */
export function NeighborProvider({ children }: NeighborProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const value = useMemo(() => ({
    activeId,
    setActiveId,
  }), [activeId]);

  return (
    <NeighborContext.Provider value={value}>
      {children}
    </NeighborContext.Provider>
  );
}

interface NeighborResponseOptions {
  id: string;
  inactiveScale?: number; // Scale when another item is active (default 0.97)
  inactiveOpacity?: number; // Opacity when another item is active (default 0.7)
}

interface NeighborResponseResult {
  isActive: boolean;
  isNeighborActive: boolean;
  scale: number;
  opacity: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

/**
 * Hook for individual items within a neighbor response group
 * Returns styles and handlers for emergent hierarchy effect
 */
export function useNeighborResponse(options: NeighborResponseOptions): NeighborResponseResult {
  const {
    id,
    inactiveScale = 0.97,
    inactiveOpacity = 0.7,
  } = options;

  const context = useContext(NeighborContext);
  const reducedMotion = useReducedMotion();

  // Stable fallback
  const noOp = useCallback(() => {}, []);
  const setActiveId = context?.setActiveId ?? noOp;
  const activeId = context?.activeId ?? null;

  const isActive = activeId === id;
  const isNeighborActive = activeId !== null && activeId !== id;

  const handleEnter = useCallback(() => {
    setActiveId(id);
  }, [id, setActiveId]);

  const handleLeave = useCallback(() => {
    setActiveId(null);
  }, [setActiveId]);

  // Calculate response values
  const scale = useMemo(() => {
    if (reducedMotion) return 1;
    if (isActive) return 1.02; // Slight emphasis
    if (isNeighborActive) return inactiveScale;
    return 1;
  }, [reducedMotion, isActive, isNeighborActive, inactiveScale]);

  const opacity = useMemo(() => {
    if (reducedMotion) return 1;
    if (isActive) return 1;
    if (isNeighborActive) return inactiveOpacity;
    return 1;
  }, [reducedMotion, isActive, isNeighborActive, inactiveOpacity]);

  return {
    isActive,
    isNeighborActive,
    scale,
    opacity,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
    onFocus: handleEnter,
    onBlur: handleLeave,
  };
}

/**
 * Calculate distance-based response for grid layouts
 * Closer neighbors are more affected than distant ones
 */
export function useGridNeighborResponse(options: {
  id: string;
  position: { row: number; col: number };
  activePosition?: { row: number; col: number } | null;
  maxDistance?: number;
  baseScale?: number;
  baseOpacity?: number;
}): { scale: number; opacity: number } {
  const {
    id,
    position,
    activePosition,
    maxDistance = 3,
    baseScale = 0.97,
    baseOpacity = 0.7,
  } = options;

  const context = useContext(NeighborContext);
  const reducedMotion = useReducedMotion();
  const activeId = context?.activeId ?? null;

  return useMemo(() => {
    if (reducedMotion || !activeId || activeId === id || !activePosition) {
      return { scale: 1, opacity: 1 };
    }

    // Calculate Manhattan distance
    const distance = Math.abs(position.row - activePosition.row) +
                    Math.abs(position.col - activePosition.col);

    if (distance >= maxDistance) {
      return { scale: 1, opacity: 1 };
    }

    // Falloff based on distance (closer = more affected)
    const falloff = 1 - (distance / maxDistance);
    const scaleReduction = (1 - baseScale) * falloff;
    const opacityReduction = (1 - baseOpacity) * falloff;

    return {
      scale: 1 - scaleReduction,
      opacity: 1 - opacityReduction,
    };
  }, [reducedMotion, activeId, id, position, activePosition, maxDistance, baseScale, baseOpacity]);
}

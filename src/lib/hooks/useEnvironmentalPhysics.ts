import { useEffect } from 'react';
import { useMouseVelocity } from './useMouseVelocity';
import { useScrollVelocity } from './useScrollVelocity';

/**
 * Aggregates all environmental physics (Mouse, Scroll) 
 * and binds them to global CSS variables for the UI to react to.
 * 
 * Variables:
 * --physics-velocity: 0.0 to 1.0 (Mouse Speed)
 * --physics-scroll-speed: 0.0 to 1.0 (Scroll Momentum)
 * --physics-energy: Combined energy level
 */
export function useEnvironmentalPhysics() {
  const mouseEnergy = useMouseVelocity({ decay: 0.92, sensitivity: 0.8 });
  const { velocity: scrollVelocity } = useScrollVelocity();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const body = document.body;
    
    // Normalize scroll velocity (approximate max scroll speed 100)
    const normalizedScroll = Math.min(Math.abs(scrollVelocity) / 100, 1);
    
    // Combined Energy: Heavily weighted by mouse, but boosted by scrolling
    const totalEnergy = Math.min(mouseEnergy + (normalizedScroll * 0.5), 1);

    // Batch updates
    body.style.setProperty('--physics-velocity', mouseEnergy.toFixed(3));
    body.style.setProperty('--physics-scroll-speed', normalizedScroll.toFixed(3));
    body.style.setProperty('--physics-energy', totalEnergy.toFixed(3));
    
  }, [mouseEnergy, scrollVelocity]);
}

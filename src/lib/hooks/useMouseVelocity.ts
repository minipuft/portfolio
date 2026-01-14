import { useEffect, useRef, useState } from 'react';

interface VelocityConfig {
  decay?: number; // How fast the energy dissipates (0-1)
  sensitivity?: number; // Multiplier for movement to energy
}

/**
 * Tracks mouse velocity and converts it to an "Energy" value (0-1).
 * High velocity = High energy.
 * Energy decays over time when the mouse stops.
 */
export function useMouseVelocity({ 
  decay = 0.9, 
  sensitivity = 0.5 
}: VelocityConfig = {}) {
  const [energy, setEnergy] = useState(0);
  const velocityRef = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Initial position setup
    if (typeof window === 'undefined') return;
    
    lastTime.current = performance.now();
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(now - lastTime.current, 1); // Avoid div by zero
      
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      
      // Calculate instantaneous velocity (pixels per ms)
      const dist = Math.sqrt(dx * dx + dy * dy);
      const instantVelocity = dist / dt;

      // Update refs
      lastPos.current = { x: e.clientX, y: e.clientY };
      lastTime.current = now;

      // Add to current velocity (cap at 1.0 for sanity)
      // We use a "target" approach: push velocity up based on movement
      velocityRef.current = Math.min(velocityRef.current + (instantVelocity * sensitivity), 1);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sensitivity]);

  // The Physics Loop: Decays energy when not moving
  useEffect(() => {
    const loop = () => {
      // Decay the velocity
      velocityRef.current *= decay;
      
      // Snap to 0 if very low to stop infinite renders
      if (velocityRef.current < 0.001) velocityRef.current = 0;

      // Update state if changed significantly
      setEnergy(prev => {
        if (Math.abs(prev - velocityRef.current) > 0.001) {
          return velocityRef.current;
        }
        return prev;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [decay]);

  return energy;
}

'use client';

import { useEffect } from 'react';
import { useScrollColorTemperature } from '@/lib/hooks/useColorBreathing';
import { useColor } from '@/contexts/ColorContext';

export default function ThemeController() {
  const { setAccentColor } = useColor();
  const { tint, temperature } = useScrollColorTemperature({
    warmColor: '#ff9e64', // Tokyo Night Orange
    coolColor: '#7aa2f7', // Tokyo Night Blue
    intensity: 0.8,
  });

  // Update global accent color based on scroll temperature
  useEffect(() => {
    // Only update if we have a valid tint
    if (tint && tint !== 'transparent') {
        // Extract the hex part without alpha for the main accent color
        const hex = tint.substring(0, 7);
        setAccentColor(hex);
    }
  }, [tint, setAccentColor]);

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 transition-colors duration-700"
      style={{
        background: `radial-gradient(circle at 50% ${100 - (temperature * 100)}%, ${tint}20 0%, transparent 50%)`
      }}
    />
  );
}

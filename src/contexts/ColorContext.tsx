'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface ColorContextValue {
  accentColor: string;
  accentRgb: string;
  setAccentColor: (color: string) => void;
  resetAccentColor: () => void;
}

const DEFAULT_ACCENT = '#7aa2f7';
const DEFAULT_RGB = '122, 162, 247';

const ColorContext = createContext<ColorContextValue>({
  accentColor: DEFAULT_ACCENT,
  accentRgb: DEFAULT_RGB,
  setAccentColor: () => {},
  resetAccentColor: () => {},
});

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return DEFAULT_RGB;
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

interface ColorProviderProps {
  children: ReactNode;
}

export function ColorProvider({ children }: ColorProviderProps) {
  const [accentColor, setAccentColorState] = useState(DEFAULT_ACCENT);
  const [accentRgb, setAccentRgb] = useState(DEFAULT_RGB);

  const setAccentColor = useCallback((color: string) => {
    setAccentColorState(color);
    setAccentRgb(hexToRgb(color));
  }, []);

  const resetAccentColor = useCallback(() => {
    setAccentColor(DEFAULT_ACCENT);
  }, [setAccentColor]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--accent-rgb', accentRgb);
  }, [accentColor, accentRgb]);

  return (
    <ColorContext.Provider value={{ accentColor, accentRgb, setAccentColor, resetAccentColor }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColor() {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
}

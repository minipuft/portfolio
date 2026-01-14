'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';

interface ScrambleTextProps {
  text: string;
  className?: string;
  hover?: boolean; // Scramble on hover
  autoStart?: boolean; // Scramble on mount/view
  speed?: number; // Speed of scramble (0-1)
  delay?: number;
}

export default function ScrambleText({
  text,
  className,
  hover = true,
  autoStart = true,
  speed = 0.5,
  delay = 0,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const reducedMotion = useReducedMotion();
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasRunRef = useRef(false);
  
  const scramble = useCallback(() => {
    if (isScrambling || reducedMotion) return;
    setIsScrambling(true);

    const length = text.length;
    let frame = 0;
    const totalFrames = 30 / speed; // Duration control

    const interval = setInterval(() => {
      let output = '';
      for (let i = 0; i < length; i++) {
        // Resolve characters from left to right
        const progress = frame / totalFrames;
        const charProgress = i / length;
        
        if (progress >= charProgress + 0.1) {
          // Resolved char
          output += text[i];
        } else if (progress >= charProgress) {
          // Scrambling char
          output += CHARS[Math.floor(Math.random() * CHARS.length)];
        } else {
          // Original char (or space/invisible) if we wanted a reveal, 
          // but here we just scramble-replace.
          // Let's keep original to prevent layout shift if monospace, 
          // or just show scramble.
          output += text[i]; 
        }
      }

      setDisplayText(output);
      frame++;

      if (frame > totalFrames + 5) { // Buffer
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, [text, speed, isScrambling, reducedMotion]);

  useGSAP(() => {
    if (!autoStart || reducedMotion || !elementRef.current || hasRunRef.current) return;

    // Trigger on view
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasRunRef.current) {
        hasRunRef.current = true;
        setTimeout(scramble, delay * 1000);
        observer.disconnect();
      }
    });

    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [autoStart, delay, reducedMotion]); // Removed scramble dependency to prevent loop

  return (
    <span
      ref={elementRef}
      className={cn('inline-block cursor-default', className)}
      onMouseEnter={hover ? scramble : undefined}
      aria-label={text} // Accessibility: Screen reader sees real text
    >
      <span aria-hidden="true">{displayText}</span>
    </span>
  );
}

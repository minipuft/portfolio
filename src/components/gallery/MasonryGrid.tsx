'use client';

import { useRef, useState, useEffect, ReactNode, Children } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { NeighborProvider } from '@/lib/hooks/useNeighborResponse';

gsap.registerPlugin(ScrollTrigger);

interface MasonryGridProps {
  children: ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
  staggerAnimation?: boolean;
  enableNeighborResponse?: boolean;
}

export default function MasonryGrid({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 3 },
  gap = 20,
  className,
  staggerAnimation = true,
  enableNeighborResponse = true,
}: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(3);
  const [mounted, setMounted] = useState(false);

  // Handle responsive column count
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1280) setColumnCount(columns.xl || 3);
      else if (width >= 1024) setColumnCount(columns.lg || 3);
      else if (width >= 768) setColumnCount(columns.md || 2);
      else setColumnCount(columns.sm || 1);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [columns]);

  // Distribute items into columns
  const distributedColumns = Array.from({ length: columnCount }, () => [] as ReactNode[]);
  Children.forEach(children, (child, index) => {
    distributedColumns[index % columnCount].push(child);
  });

  // Animation
  useGSAP(() => {
    if (!staggerAnimation || !containerRef.current || !mounted) return;

    const items = containerRef.current.querySelectorAll('[data-gallery-item]');
    
    gsap.fromTo(items, 
      { opacity: 0, y: 40, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, { scope: containerRef, dependencies: [mounted, columnCount] });

  const gridContent = (
    <div 
      ref={containerRef}
      className={cn("flex w-full", className)}
      style={{ gap: `${gap}px` }}
    >
      {distributedColumns.map((columnItems, i) => (
        <div 
          key={i} 
          className="flex flex-col flex-1"
          style={{ gap: `${gap}px` }}
        >
          {columnItems.map((item, j) => (
            <div key={j} className="w-full">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  if (enableNeighborResponse) {
    return <NeighborProvider>{gridContent}</NeighborProvider>;
  }

  return gridContent;
}

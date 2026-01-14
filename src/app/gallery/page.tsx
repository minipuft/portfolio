'use client';

import { useState, useCallback } from 'react';
import { MasonryGrid, GalleryItem, Lightbox, GalleryItemData } from '@/components/gallery';


// Sample gallery data - in production, this would come from MDX/CMS
const galleryItems: GalleryItemData[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600',
    alt: 'Code on screen',
    width: 800,
    height: 600,
    title: 'Clean Code',
    description: 'Beautiful syntax highlighting in action',
    category: 'Development',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=1000',
    alt: 'Laptop with code',
    width: 800,
    height: 1000,
    title: 'Development Setup',
    description: 'My daily driver for building projects',
    category: 'Workspace',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=533',
    alt: 'Programming environment',
    width: 800,
    height: 533,
    title: 'Focused Flow',
    description: 'Getting into the zone',
    category: 'Development',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=1200',
    alt: 'Macbook setup',
    width: 800,
    height: 1200,
    title: 'Minimal Setup',
    description: 'Less is more',
    category: 'Workspace',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=533',
    alt: 'Terminal window',
    width: 800,
    height: 533,
    title: 'Terminal Life',
    description: 'Command line mastery',
    category: 'Development',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&h=800',
    alt: 'GitHub contributions',
    width: 800,
    height: 800,
    title: 'Open Source',
    description: 'Contributing to the community',
    category: 'Projects',
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600',
    alt: 'VS Code editor',
    width: 800,
    height: 600,
    title: 'Editor of Choice',
    description: 'VS Code with Tokyo Night theme',
    category: 'Tools',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1537432376149-e84978a29c62?w=800&h=1100',
    alt: 'Desk setup',
    width: 800,
    height: 1100,
    title: 'Night Mode',
    description: 'Late night coding sessions',
    category: 'Workspace',
  },
];

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<GalleryItemData | null>(null);

  // Initialize Lenis smooth scroll
  // useMomentumScroll is now handled globally in RootLayout

  const handleItemClick = useCallback((item: GalleryItemData) => {
    setSelectedItem(item);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleNext = useCallback(() => {
    if (!selectedItem) return;
    const currentIndex = galleryItems.findIndex((i) => i.id === selectedItem.id);
    if (currentIndex < galleryItems.length - 1) {
      setSelectedItem(galleryItems[currentIndex + 1]);
    }
  }, [selectedItem]);

  const handlePrevious = useCallback(() => {
    if (!selectedItem) return;
    const currentIndex = galleryItems.findIndex((i) => i.id === selectedItem.id);
    if (currentIndex > 0) {
      setSelectedItem(galleryItems[currentIndex - 1]);
    }
  }, [selectedItem]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-20">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[var(--tn-fg-bright)]">Gallery</h1>
        <p className="mt-2 text-[var(--tn-fg-muted)]">
          A visual journey through my work and workspace
        </p>
      </div>

      {/* Masonry Grid */}
      <MasonryGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 3 }}
        gap={20}
      >
        {galleryItems.map((item, index) => (
          <GalleryItem
            key={item.id}
            item={item}
            onClick={handleItemClick}
            priority={index < 4}
          />
        ))}
      </MasonryGrid>

      {/* Lightbox */}
      <Lightbox
        item={selectedItem}
        items={galleryItems}
        onClose={handleClose}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type SidebarView = 'nav' | 'contact' | 'resume';

interface SidebarContextValue {
  isOpen: boolean;
  view: SidebarView;
  openSidebar: (view?: SidebarView) => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setView: (view: SidebarView) => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<SidebarView>('contact');

  const openSidebar = useCallback((newView?: SidebarView) => {
    if (newView) setView(newView);
    setIsOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider
      value={{ isOpen, view, openSidebar, closeSidebar, toggleSidebar, setView }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

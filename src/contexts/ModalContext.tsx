'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ModalState = 'idle' | 'entering' | 'open' | 'exiting';

interface ModalContextValue {
  isOpen: boolean;
  state: ModalState;
  openModal: () => void;
  closeModal: () => void;
  setEntering: () => void;
  setOpen: () => void;
  setExiting: () => void;
}

const ModalContext = createContext<ModalContextValue>({
  isOpen: false,
  state: 'idle',
  openModal: () => {},
  closeModal: () => {},
  setEntering: () => {},
  setOpen: () => {},
  setExiting: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<ModalState>('idle');

  const openModal = useCallback(() => {
    setIsOpen(true);
    setState('entering');
  }, []);

  const closeModal = useCallback(() => {
    setState('exiting');
    setTimeout(() => {
      setIsOpen(false);
      setState('idle');
    }, 450); // Match blur transition duration
  }, []);

  const setEntering = useCallback(() => setState('entering'), []);
  const setOpen = useCallback(() => setState('open'), []);
  const setExiting = useCallback(() => setState('exiting'), []);

  return (
    <ModalContext.Provider
      value={{ isOpen, state, openModal, closeModal, setEntering, setOpen, setExiting }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

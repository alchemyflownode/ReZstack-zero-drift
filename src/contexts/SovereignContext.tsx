// src/contexts/SovereignContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SovereignContextType {
  deltaZero: number;
  setDeltaZero: (value: number) => void;
  isLocked: boolean;
  toggleLock: () => void;
}

const SovereignContext = createContext<SovereignContextType | undefined>(undefined);

export function SovereignProvider({ children }: { children: ReactNode }) {
  const [deltaZero, setDeltaZero] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const toggleLock = () => setIsLocked(!isLocked);

  return (
    <SovereignContext.Provider value={{ deltaZero, setDeltaZero, isLocked, toggleLock }}>
      {children}
    </SovereignContext.Provider>
  );
}

export function useDeltaZero() {
  const context = useContext(SovereignContext);
  if (context === undefined) {
    throw new Error('useDeltaZero must be used within a SovereignProvider');
  }
  return context;
}

export default SovereignContext;

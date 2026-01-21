// src/types/sovereign.d.ts
declare global {
  interface Window {
    sovereignSocket?: {
      connect: () => void;
      send: (type: string, data: any) => void;
      on: (event: string, callback: Function) => void;
    };
  }
}

export interface SovereignVibe {
  score: number;
  status: 'STABLE' | 'DRIFTING' | 'CRITICAL';
  pedalTone: 'RESONANT' | 'WARNING' | 'CRITICAL';
  lastUpdate: number;
}

export interface EnforcementEvent {
  id: string;
  type: 'RESONANCE_OK' | 'DRIFT_WARNING' | 'LAW_VIOLATION' | 'RECOVERY';
  message: string;
  timestamp: number;
  details?: string;
  correctiveAction?: string;
  bytecodeHash?: string;
}

export interface SovereignState {
  vibe: SovereignVibe;
  events: EnforcementEvent[];
  isRecovering: boolean;
  isConnected: boolean;
}

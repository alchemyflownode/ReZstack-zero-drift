// src/hooks/useSovereignSync.ts
import { useState, useEffect, useCallback, useRef } from 'react';

// WebSocket manager for sovereign system
class SovereignWebSocketManager {
  private ws: WebSocket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnected = false;
  private connectionCallbacks: ((connected: boolean) => void)[] = [];

  constructor() {
    this.connect();
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    try {
      this.ws = new WebSocket('ws://localhost:3001/sovereign');
      
      this.ws.onopen = () => {
        console.log('✅ Sovereign WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connected', null);
        this.connectionCallbacks.forEach(cb => cb(true));
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit(data.type, data.payload);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('Sovereign WebSocket error:', error);
        this.isConnected = false;
        this.connectionCallbacks.forEach(cb => cb(false));
      };

      this.ws.onclose = () => {
        console.log('Sovereign WebSocket disconnected');
        this.isConnected = false;
        this.connectionCallbacks.forEach(cb => cb(false));
        this.attemptReconnect();
      };
    } catch (error) {
      console.log('⚠️ Sovereign WebSocket not available, using mock mode');
      this.isConnected = false;
      this.connectionCallbacks.forEach(cb => cb(false));
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), 3000);
    }
  }

  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    }
  }

  onConnectionChange(callback: (connected: boolean) => void) {
    this.connectionCallbacks.push(callback);
    return () => {
      const index = this.connectionCallbacks.indexOf(callback);
      if (index > -1) this.connectionCallbacks.splice(index, 1);
    };
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(listener => listener(data));
  }

  send(event: string, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: event, payload: data }));
    } else {
      console.log(`[MOCK] ${event}:`, data);
      // Simulate server response for mock mode
      setTimeout(() => {
        if (event === 'SOVEREIGN:RECORD_INTERVENTION') {
          this.emit('PS1:ENFORCEMENT_EVENT', {
            ...data,
            id: `mock-${Date.now()}`,
            timestamp: Date.now()
          });
        }
      }, 100);
    }
  }

  get connected() {
    return this.isConnected;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.eventListeners.clear();
    this.connectionCallbacks = [];
  }
}

// Singleton instance
const sovereignManager = new SovereignWebSocketManager();

export const useSovereignSync = () => {
  const [vibe, setVibe] = useState({ score: 100, status: 'STABLE', lastUpdate: Date.now() });
  const [enforcementEvents, setEnforcementEvents] = useState<any[]>([]);
  const [isRecovering, setIsRecovering] = useState(false);
  const [isConnected, setIsConnected] = useState(sovereignManager.connected);

  useEffect(() => {
    const handleVibeUpdate = (data: any) => {
      setVibe(data);
      setIsConnected(true);
    };

    const handleEnforcementEvent = (event: any) => {
      setEnforcementEvents(prev => [{
        ...event,
        id: event.id || `event-${Date.now()}`
      }, ...prev.slice(0, 49)]);
    };

    const handleRecoveryStart = () => {
      setIsRecovering(true);
      setEnforcementEvents(prev => [{
        id: `recovery-${Date.now()}`,
        type: 'RECOVERY',
        message: 'Sovereign recovery initiated',
        timestamp: Date.now(),
        details: 'Architectural rollback in progress'
      }, ...prev]);
    };

    const handleRecoveryComplete = (data: any) => {
      setIsRecovering(false);
      if (data?.success) {
        setVibe({ score: 100, status: 'STABLE', lastUpdate: Date.now() });
        setEnforcementEvents(prev => [{
          id: `recovery-complete-${Date.now()}`,
          type: 'RESONANCE_OK',
          message: 'Sovereign recovery completed successfully',
          timestamp: Date.now(),
          details: 'Architecture restored to resonant state'
        }, ...prev]);
      }
    };

    const handleConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
      if (connected) {
        // Request initial state
        sovereignManager.send('SOVEREIGN:GET_STATE', {});
      }
    };

    sovereignManager.on('SOVEREIGN:VIBE_UPDATE', handleVibeUpdate);
    sovereignManager.on('PS1:ENFORCEMENT_EVENT', handleEnforcementEvent);
    sovereignManager.on('SOVEREIGN:RECOVERY_STARTED', handleRecoveryStart);
    sovereignManager.on('SOVEREIGN:RECOVERY_COMPLETE', handleRecoveryComplete);
    const removeConnectionListener = sovereignManager.onConnectionChange(handleConnectionChange);

    // Initial mock events for demonstration
    if (!isConnected) {
      setTimeout(() => {
        setEnforcementEvents([
          {
            id: 'demo-1',
            type: 'RESONANCE_OK',
            message: 'Sovereign system initialized',
            timestamp: Date.now() - 60000,
            details: 'All architectural checks passing'
          },
          {
            id: 'demo-2',
            type: 'DRIFT_WARNING',
            message: 'Detected lodash.cloneDeep usage',
            timestamp: Date.now() - 30000,
            details: 'Auto-corrected to structuredClone()'
          }
        ]);
      }, 1000);
    }

    return () => {
      sovereignManager.off('SOVEREIGN:VIBE_UPDATE', handleVibeUpdate);
      sovereignManager.off('PS1:ENFORCEMENT_EVENT', handleEnforcementEvent);
      sovereignManager.off('SOVEREIGN:RECOVERY_STARTED', handleRecoveryStart);
      sovereignManager.off('SOVEREIGN:RECOVERY_COMPLETE', handleRecoveryComplete);
      removeConnectionListener();
    };
  }, []);

  const recordIntervention = useCallback((action: 'ACCEPT' | 'REJECT' | 'REVISE', context: string, hash?: string) => {
    const eventType = action === 'REJECT' ? 'LAW_VIOLATION' : 
                     action === 'REVISE' ? 'DRIFT_WARNING' : 'RESONANCE_OK';
    
    const event = {
      type: eventType,
      message: `Human ${action.toLowerCase()}ed: ${context.substring(0, 100)}${context.length > 100 ? '...' : ''}`,
      bytecodeHash: hash,
      correctiveAction: `Marked as ${action.toLowerCase()}ed by user`,
      timestamp: Date.now()
    };

    sovereignManager.send('SOVEREIGN:RECORD_INTERVENTION', event);
  }, []);

  const triggerRecovery = useCallback(() => {
    sovereignManager.send('SOVEREIGN:TRIGGER_RECOVERY', {});
  }, []);

  // Return a clean API without nested socket object
  return {
    // State
    vibe,
    enforcementEvents,
    isRecovering,
    isConnected,
    
    // Methods
    recordIntervention,
    triggerRecovery,
    
    // For compatibility if needed elsewhere
    socket: sovereignManager,
    isElectron: false
  };
};

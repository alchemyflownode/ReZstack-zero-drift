// src/stores/terminal-store.ts
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export interface TerminalMessage {
  id: string;
  type: "command" | "output" | "error" | "success";
  text: string;
  command?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface CommandHistory {
  id: string;
  command: string;
  output: string;
  status: "success" | "error" | "running";
  timestamp: Date;
  duration?: number;
}

interface TerminalState {
  // Terminal output
  terminalMessages: TerminalMessage[];
  commandHistory: CommandHistory[];
  isExecuting: boolean;
  lastCommand: string | null;
  currentCommandId: string | null;
  
  // Terminal UI state
  isTerminalOpen: boolean;
  terminalHeight: number; // percentage
  autoScroll: boolean;
  
  // Operations
  executeCommand: (command: string) => Promise<void>;
  stopCommand: () => Promise<void>;
  clearTerminal: () => void;
  addMessage: (message: Omit<TerminalMessage, "id" | "timestamp">) => void;
  toggleTerminal: () => void;
  setTerminalHeight: (height: number) => void;
  setAutoScroll: (enabled: boolean) => void;
  clearHistory: () => void;
  getHistoryByQuery: (query: string) => CommandHistory[];
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  terminalMessages: [
    {
      id: uuidv4(),
      type: "success",
      text: "??? Terminal Ready - Run commands with rezonic or npm",
      timestamp: new Date(),
    },
  ],
  commandHistory: [],
  isExecuting: false,
  lastCommand: null,
  currentCommandId: null,
  isTerminalOpen: false,
  terminalHeight: 35,
  autoScroll: true,

  // Execute terminal command via API or Electron bridge
  executeCommand: async (command: string) => {
    const { addMessage, commandHistory } = get();
    const commandId = Date.now().toString();
    const startTime = Date.now();

    set({ isExecuting: true, lastCommand: command, currentCommandId: commandId });

    // Add command to UI
    addMessage({
      type: "command",
      text: `$ rezonic ${command}`,
      command: command,
    });

    try {
      let data;
      
      // Check if running in Electron
      if (typeof window !== 'undefined' && (window as any).electron) {
        // Use Electron bridge
        console.log('??? Executing via Electron bridge:', command);
        data = await (window as any).electron.execute(command);
      } else {
        // Use HTTP for web version (FIXED PORT: 3001)
        console.log('?? Executing via HTTP:', command);
        const response = await fetch("http://localhost:3001/api/rezonic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        data = await response.json();
      }

      const duration = Date.now() - startTime;

      // Add response
      if (data.success) {
        addMessage({
          type: "output",
          text: data.output || "Command completed successfully",
          command: command,
        });

        addMessage({
          type: "success",
          text: `? Completed in ${duration}ms`,
          command: command,
          metadata: { duration },
        });

        // Add to history
        set({
          commandHistory: [
            {
              id: commandId,
              command,
              output: data.output || "",
              status: "success",
              timestamp: new Date(),
              duration,
            },
            ...commandHistory,
          ].slice(0, 100), // Keep last 100
        });
      } else {
        addMessage({
          type: "error",
          text: data.output || data.error || "Command failed",
          command: command,
        });

        set({
          commandHistory: [
            {
              id: commandId,
              command,
              output: data.output || data.error || "",
              status: "error",
              timestamp: new Date(),
              duration,
            },
            ...commandHistory,
          ].slice(0, 100),
        });
      }
    } catch (error: any) {
      console.error('Terminal execution error:', error);
      
      addMessage({
        type: "error",
        text: `? Error: ${error.message}`,
        command: command,
      });

      set({
        commandHistory: [
          {
            id: commandId,
            command,
            output: error.message,
            status: "error",
            timestamp: new Date(),
          },
          ...commandHistory,
        ].slice(0, 100),
      });
    } finally {
      set({ isExecuting: false, currentCommandId: null });
    }
  },

  // Stop/kill current command
  stopCommand: async () => {
    const { addMessage, currentCommandId } = get();
    
    if (!currentCommandId) {
      return;
    }

    try {
      // Note: Electron commands execute immediately, can't be stopped
      // This is mainly for web mode
      const response = await fetch("http://localhost:3001/api/terminal/kill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commandId: currentCommandId }),
      });

      if (response.ok) {
        addMessage({
          type: "success",
          text: "?? Command stopped by user",
        });
      } else {
        const data = await response.json();
        addMessage({
          type: "error",
          text: `? Failed to stop: ${data.error || 'Unknown error'}`,
        });
      }
    } catch (error: any) {
      addMessage({
        type: "error",
        text: `? Error stopping command: ${error.message}`,
      });
    } finally {
      set({ isExecuting: false, currentCommandId: null });
    }
  },

  // Add message to terminal
  addMessage: (message: Omit<TerminalMessage, "id" | "timestamp">) => {
    set({
      terminalMessages: [
        ...get().terminalMessages,
        {
          ...message,
          id: uuidv4(),
          timestamp: new Date(),
        },
      ],
    });
  },

  // Clear terminal
  clearTerminal: () => {
    set({
      terminalMessages: [
        {
          id: uuidv4(),
          type: "success",
          text: "?? Terminal cleared",
          timestamp: new Date(),
        },
      ],
    });
  },

  // Toggle terminal visibility
  toggleTerminal: () => {
    set({ isTerminalOpen: !get().isTerminalOpen });
  },

  // Set terminal height
  setTerminalHeight: (height: number) => {
    set({ terminalHeight: Math.max(15, Math.min(85, height)) });
  },

  // Set auto-scroll
  setAutoScroll: (enabled: boolean) => {
    set({ autoScroll: enabled });
  },

  // Clear history
  clearHistory: () => {
    set({ commandHistory: [] });
  },

  // Search history
  getHistoryByQuery: (query: string) => {
    return get().commandHistory.filter(
      (item) =>
        item.command.toLowerCase().includes(query.toLowerCase()) ||
        item.output.toLowerCase().includes(query.toLowerCase())
    );
  },
}));

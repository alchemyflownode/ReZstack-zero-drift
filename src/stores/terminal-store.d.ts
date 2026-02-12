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
    terminalMessages: TerminalMessage[];
    commandHistory: CommandHistory[];
    isExecuting: boolean;
    lastCommand: string | null;
    currentCommandId: string | null;
    isTerminalOpen: boolean;
    terminalHeight: number;
    autoScroll: boolean;
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
export declare const useTerminalStore: import("zustand").UseBoundStore<import("zustand").StoreApi<TerminalState>>;
export {};

declare class SovereignWebSocketManager {
    private ws;
    private eventListeners;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private isConnected;
    private connectionCallbacks;
    constructor();
    connect(): void;
    private attemptReconnect;
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    onConnectionChange(callback: (connected: boolean) => void): () => void;
    private emit;
    send(event: string, data: any): void;
    get connected(): boolean;
    disconnect(): void;
}
export declare const useSovereignSync: () => {
    vibe: {
        score: number;
        status: string;
        lastUpdate: number;
    };
    enforcementEvents: any[];
    isRecovering: boolean;
    isConnected: boolean;
    recordIntervention: (action: "ACCEPT" | "REJECT" | "REVISE", context: string, hash?: string) => void;
    triggerRecovery: () => void;
    socket: SovereignWebSocketManager;
    isElectron: boolean;
};
export {};

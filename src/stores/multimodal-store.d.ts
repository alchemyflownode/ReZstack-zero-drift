interface Message {
    id: string;
    content: string;
    isUser: boolean;
    model?: string;
    thinking?: boolean;
    sovereignStatus?: 'STABLE' | 'VIGILANT' | 'CRITICAL' | 'BYPASSED';
    vibeScore?: number;
    violations?: string[];
    fixesApplied?: string[];
    timestamp?: string;
    routingInfo?: {
        selectedModel: string;
        reasoning: string;
        confidence: number;
        estimatedVRAM: string;
        alternatives: any[];
    };
}
interface OllamaStatus {
    isConnected: boolean;
    isChecking: boolean;
    version: string;
    models: string[];
}
interface MultimodalStore {
    messages: Message[];
    availableModels: string[];
    selectedModel: string;
    ollamaStatus: OllamaStatus;
    isGenerating: boolean;
    smartRouterEnabled: boolean;
    sendMessage: (content: string, options?: {
        bypassCuration?: boolean;
    }) => Promise<void>;
    setSelectedModel: (model: string) => void;
    checkOllamaConnection: () => Promise<void>;
    loadModels: () => Promise<void>;
    clearMessages: () => void;
    refineWithZeroDrift: (messageId: string, content: string) => Promise<void>;
    toggleSmartRouter: () => void;
}
export declare const useMultimodalStore: import("zustand").UseBoundStore<import("zustand").StoreApi<MultimodalStore>>;
export {};

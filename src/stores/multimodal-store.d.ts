interface Message {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    model?: string;
    thinking?: boolean;
}
interface OllamaStatus {
    isConnected: boolean;
    isChecking: boolean;
    version: string;
    modelCount: number;
    lastChecked: Date | null;
}
interface MultimodalState {
    messages: Message[];
    availableModels: string[];
    selectedModel: string;
    ollamaStatus: OllamaStatus;
    isGenerating: boolean;
    sendMessage: (content: string) => Promise<void>;
    setSelectedModel: (model: string) => void;
    clearMessages: () => void;
    checkOllamaConnection: () => Promise<boolean>;
    loadModels: () => Promise<void>;
    generateResponse: (prompt: string, model?: string) => Promise<string>;
}
export declare const useMultimodalStore: import("zustand").UseBoundStore<import("zustand").StoreApi<MultimodalState>>;
export {};

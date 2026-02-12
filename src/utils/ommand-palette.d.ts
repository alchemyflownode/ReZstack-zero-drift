export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}
export interface AIConfig {
    model: string;
    temperature?: number;
    maxTokens?: number;
}
export declare class AIAssistant {
    private history;
    private config;
    configure(config: Partial<AIConfig>): void;
    addMessage(role: AIMessage['role'], content: string): void;
    getHistory(): AIMessage[];
    clearHistory(): void;
    getConfig(): AIConfig;
}
export declare const aiAssistant: AIAssistant;

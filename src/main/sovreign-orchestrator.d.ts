export interface SystemPhysics {
    tier: number;
    laws: string[];
    semanticNaming: boolean;
}
export declare class SovereignOrchestrator {
    private ollama;
    private availableModels;
    constructor(endpoint?: string);
    executeTask(task: string, physics: SystemPhysics, customModel?: string): Promise<{
        response: string;
        model: string;
        duration: number;
        tokens: number;
        tokensPerSecond: number;
        decision: {
            selectedModel: string;
            reasoning: string;
            confidence: number;
        };
    }>;
    getAvailableModels(): any[];
}
export declare function getOrchestrator(): SovereignOrchestrator;

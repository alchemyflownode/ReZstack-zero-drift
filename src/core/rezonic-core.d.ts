export interface OrchestrationMode {
    type: 'local' | 'browser' | 'hybrid';
    capabilities: string[];
    priority: number;
}
export interface ChainStep {
    id: string;
    model: string;
    role: 'creative' | 'structure' | 'technical' | 'polish';
    promptTemplate: string;
    temperature: number;
    context: number;
    preferredMode: OrchestrationMode['type'];
}
export interface ExecutionResult {
    output: string;
    modelUsed: string;
    modeUsed: OrchestrationMode['type'];
    duration: number;
    tokens: number;
    quality: number;
}
export declare class RezonicCore {
    private mode;
    private availableModes;
    constructor();
    private detectAvailableModes;
    private canUseLocalAI;
    executeChain(steps: ChainStep[], input: string): Promise<ExecutionResult[]>;
    private selectModeForStep;
    private executeLocalStep;
    private executeBrowserStep;
    private estimateTokens;
    private estimateQuality;
    getAvailableModes(): OrchestrationMode[];
    setMode(mode: OrchestrationMode['type']): void;
}

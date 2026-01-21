import { SystemPhysics } from '../types/orchestrator-types';
export interface ModelInfo {
    name: string;
    displayName: string;
    size: string;
    capabilities: string[];
    estimatedTokensPerSecond: number;
    maxContext: number;
    latency: 'low' | 'medium' | 'high';
    strength: string[];
    weakness: string[];
    preferredTasks: string[];
    memoryFootprint: 'small' | 'medium' | 'large';
    quantization?: string;
}
export interface TaskAnalysis {
    task: string;
    complexity: number;
    requiredCapabilities: string[];
    urgency: 'low' | 'medium' | 'high';
    tokenEstimate: number;
    tier: number;
    contextNeeded: number;
}
export interface OrchestrationResult {
    selectedModel: string;
    reasoning: string;
    confidence: number;
    estimatedTimeMs: number;
    tokensUsed: number;
    provider: 'ollama';
}
export declare class SovereignOrchestrator {
    private ollama;
    private availableModels;
    private modelPerformance;
    private modelRegistry;
    constructor(endpoint?: string);
    private initializeModels;
    private analyzeTask;
    private selectModel;
    private calculateModelScore;
    orchestrateTask(task: string, physics: SystemPhysics): Promise<OrchestrationResult>;
    executeTask(task: string, physics: SystemPhysics, customModel?: string): Promise<{
        response: any;
        model: string;
        duration: number;
        tokens: any;
        tokensPerSecond: number;
        decision: OrchestrationResult;
    }>;
    getAvailableModels(): ModelInfo[];
    getModelPerformance(): Map<string, {
        successes: number;
        failures: number;
        avgTime: number;
    }>;
    getModelRecommendation(taskDescription: string): ModelInfo[];
}
export declare function getOrchestrator(): SovereignOrchestrator;

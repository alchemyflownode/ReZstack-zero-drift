import { RezonicIR, ValidationResult } from "../types";
export interface OrchestrationResponse {
    selectedModel: string;
    reasoning: string;
    answer: string;
    suggestedMetrics: {
        tokensPerSec: number;
        latency: number;
    };
    retrievedContext?: string[];
    suggestedWorkflow?: string;
    compiledIR?: RezonicIR;
    compilerTrace?: string[];
}
export declare const enhancePrompt: (prompt: string) => Promise<string>;
export declare const orchestratePrompt: (prompt: string, context?: string[], errorTrace?: ValidationResult) => Promise<OrchestrationResponse>;
export declare function generateFallbackIR(prompt: string): RezonicIR;

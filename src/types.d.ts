export interface Physics {
    tier: 1 | 2 | 3;
    laws: string[];
    semanticNaming: boolean;
    deterministic: boolean;
    trustThreshold: number;
}
export declare const DEFAULT_PHYSICS: Physics;
export interface ModelInfo {
    name: string;
    displayName: string;
    tier: 1 | 2 | 3;
    capabilities: string[];
    tokensPerSecond: number;
    contextWindow: number;
    latency: 'low' | 'medium' | 'high';
    memoryFootprint: 'small' | 'medium' | 'large';
    preferredTasks: string[];
    quantization?: string;
}
export declare const MODEL_REGISTRY: ModelInfo[];
export interface TaskAnalysis {
    task: string;
    complexity: number;
    requiredCapabilities: string[];
    urgency: 'low' | 'medium' | 'high';
    tokenEstimate: number;
    tier: number;
    contextNeeded: number;
    detectedIntent: TaskIntent;
}
export type TaskIntent = 'code-generation' | 'debugging' | 'analysis' | 'content-creation' | 'architecture' | 'planning' | 'mathematical' | 'visual' | 'general';
export interface OrchestrationResult {
    selectedModel: string;
    reasoning: string;
    confidence: number;
    estimatedTimeMs: number;
    tokensUsed: number;
    provider: 'ollama' | 'browser' | 'hybrid';
}
export interface ExecutionResult {
    response: string;
    model: string;
    duration: number;
    tokens: number;
    tokensPerSecond: number;
    decision: OrchestrationResult;
    trustScore: number;
}
export interface SovereignTask {
    intent: string;
    domain: ProjectDomain;
    physics: Physics;
    priority: 'diagnosis' | 'prescription' | 'surgery' | 'recovery' | 'sovereignty';
    constraints?: string[];
    expectedOutput?: string;
}
export type ProjectDomain = 'web-application' | 'api-service' | 'library' | 'cli-tool' | 'mobile-app' | 'desktop-app' | 'ai-pipeline' | 'data-processing';
export interface WorkerNode {
    id: string;
    name: string;
    status: 'idle' | 'busy' | 'offline';
    capabilities: string[];
    lastHeartbeat: Date;
}
export interface WorkerManifest {
    id: string;
    name: string;
    type: 'comfyui' | 'ollama' | 'browser';
    version: string;
    endpoint: string;
    status: string;
    vramCapacity: number;
    vramUsed: number;
    capabilities: string[];
    availableNodes: string[];
    advertisingContract: {
        heartbeatInterval: number;
        protocol: string;
        encryption: string;
    };
    nodeRegistry: any[];
}
export type ViewType = 'dashboard' | 'orchestrator' | 'ide' | 'registry' | 'knowledge' | 'autonomous';
export interface OllamaModel {
    name: string;
    size: number;
    digest: string;
    modified_at: string;
    details?: {
        format: string;
        family: string;
        families: string[];
        parameter_size: string;
        quantization_level: string;
    };
}
export interface OllamaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
    context?: number[];
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
}
export interface RezonicIR {
    version: string;
    id: string;
    timestamp: string;
    dialect: string;
    target: string;
    executionHints: any;
    nodes: RezonicNode[];
    edges: [string, string][];
}
export interface RezonicNode {
    id: string;
    type: string;
    inputs: Record<string, any>;
    outputType: string;
    metadata?: any;
    workerRequirement?: {
        minVram?: number;
        requiredCapabilities?: string[];
    };
}
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
    remediation?: string;
}
export interface PerformanceMetric {
    time: string;
    tokensPerSec: number;
    memoryUsage: number;
    gpuLoad: number;
}
export interface IndexedFile {
    id: string;
    name: string;
    size: string;
    chunks: number;
    indexed: boolean;
    content: string;
}
export interface Workflow {
    id: string;
    name: string;
    type: string;
    engine: string;
    status: string;
    description: string;
}

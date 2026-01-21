export interface ModelCapability {
    name: string;
    size: string;
    strengths: string[];
    weaknesses: string[];
    speed: 'ultra-fast' | 'fast' | 'medium' | 'slow' | 'very-slow';
    tokensPerSecond: number;
    avgFirstToken: number;
    contextWindow: number;
    contextVerified: boolean;
    specialty: 'code' | 'general' | 'vision' | 'reasoning' | 'multilingual' | 'lightweight';
    trustLevel: 'verified' | 'community' | 'unverified';
    lastBenchmarked: Date;
    tested: boolean;
    notes: string;
    maxConcurrency: number;
    cooldownMs: number;
    gpuVramRequired?: number;
    recommendedGPU?: string;
}
export declare const REZSTACK_MODEL_ROSTER: Record<string, ModelCapability>;
export declare const FALLBACK_MODEL = "llama3.2:latest";
export declare const ROUTING_POLICY: {
    maxUnverifiedContext: number;
    verifiedBias: number;
    maxLatencyUrgent: number;
    maxLatencyNormal: number;
    maxLatencyComplex: number;
    enforceMaxConcurrency: boolean;
    enforceCooldown: boolean;
    preferLocalHeavyModels: boolean;
    gpuVramAvailable: number;
    gpuName: string;
};

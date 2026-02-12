export interface SystemProfile {
    gpu: {
        detected: boolean;
        name: string;
        vramGB: number;
        vendor: string;
        compute: string;
    };
    cpu: {
        cores: number;
        threads: number;
        ramGB: number;
    };
    ollama: {
        running: boolean;
        version?: string;
        modelsInstalled: string[];
    };
    recommendations: {
        modelsToPull: string[];
        modelsToAvoid: string[];
        optimalConcurrency: number;
        warnings: string[];
    };
    timestamp: Date;
    analyzed: boolean;
}
declare class GPUAnalyzer {
    private profile;
    private readonly STORAGE_KEY;
    analyze(force?: boolean): Promise<SystemProfile>;
    private detectGPU;
    private detectCPU;
    private detectOllama;
    private genRecs;
    private isFresh;
    private loadCached;
    private cache;
    getProfile(): any;
}
export declare const gpuAnalyzer: GPUAnalyzer;
export {};

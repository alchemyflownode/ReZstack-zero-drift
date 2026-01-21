export declare class DeterministicCodeAnalyzer {
    static analyzeComplexity(code: string): {
        cyclomatic: number;
        cognitive: number;
    };
}
export declare class DeterministicHealthMonitor {
    static checkHealth(metrics: any): Array<{
        metric: string;
        value: number;
        threshold: number;
        status: 'healthy' | 'warning' | 'critical';
    }>;
}

/**
 * RezStack Stress Test Suite
 */
export interface TestResult {
    name: string;
    passed: boolean;
    duration: number;
    details: string;
    error?: string;
}
export declare class RezStackStressTest {
    private results;
    private baseUrl;
    runAll(): Promise<TestResult[]>;
    testOllamaConnection(): Promise<void>;
    testSimpleGeneration(): Promise<void>;
    testCodeGeneration(): Promise<void>;
    private printResults;
}
export declare const stressTest: RezStackStressTest;

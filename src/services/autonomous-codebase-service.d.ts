export type CodebaseAction = 'refactor' | 'optimize' | 'security-scan' | 'dependency-update' | 'test-generation' | 'documentation' | 'architecture-review';
export interface CodebaseDiagnosis {
    timestamp: Date;
    component: string;
    issue: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestion: string;
    confidence: number;
    estimatedEffort: number;
}
export interface AutonomousAction {
    id: string;
    type: CodebaseAction;
    target: string;
    description: string;
    proposedChanges: string[];
    riskLevel: 'safe' | 'moderate' | 'high';
    requiresApproval: boolean;
    executionPlan: string;
}
export interface CodebaseMetrics {
    complexity: {
        cyclomatic: number;
        cognitive: number;
        halstead: number;
    };
    quality: {
        maintainability: number;
        testCoverage: number;
        duplication: number;
        violations: number;
    };
    dependencies: {
        outdated: number;
        vulnerable: number;
        unused: number;
    };
    architecture: {
        coupling: number;
        cohesion: number;
        modularity: number;
    };
}
declare class AutonomousCodebaseManager {
    private diagnosisHistory;
    private actionQueue;
    private executedActions;
    analyzeCodebase(codebasePath: string): Promise<CodebaseDiagnosis[]>;
    generateAutonomousActions(diagnoses: CodebaseDiagnosis[]): AutonomousAction[];
    executeAutonomousAction(action: AutonomousAction): Promise<{
        success: boolean;
        changes: string[];
        logs: string[];
    }>;
    executeActionBatch(actions: AutonomousAction[]): Promise<{
        completed: AutonomousAction[];
        failed: AutonomousAction[];
        summary: string;
    }>;
    getCodebaseMetrics(codebasePath: string): Promise<CodebaseMetrics>;
    private createActionFromDiagnosis;
}
export declare const autonomousCodebaseManager: AutonomousCodebaseManager;
export {};

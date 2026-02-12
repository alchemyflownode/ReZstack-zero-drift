export interface CurationAttempt {
    attemptNumber: number;
    timestamp: number;
    vibeScore: number;
    status: 'SOVEREIGN' | 'VIGILANT' | 'ROGUE' | 'CRITICAL';
    errors: string[];
}
export interface AcceptanceVerdict {
    accept: boolean;
    reason: 'MAX_ATTEMPTS_EXCEEDED' | 'MIN_THRESHOLD_MET' | 'CRITICAL_DRIFT' | 'INSUFFICIENT_QUALITY';
    message: string;
    nextAction: 'CONTINUE_CURATION' | 'ACCEPT_IMPERFECTION' | 'ROLLBACK' | 'ESCALATE';
}
export declare class WabiSariProtocol {
    private config;
    constructor(config?: Partial<typeof this.config>);
    evaluateAttempts(attempts: CurationAttempt[]): AcceptanceVerdict;
    calculateVibeScore(errorCount: number, warningCount: number, violationCount: number, complexityIncrease?: number): number;
    generateReport(attempts: CurationAttempt[]): string;
}

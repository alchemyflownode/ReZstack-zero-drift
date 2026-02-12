import { AcceptanceVerdict } from './WabiSariProtocol.js';
export interface CurationResult {
    originalHash: string;
    curatedHash: string;
    curatedContent: string;
    vibeScore: number;
    status: 'SOVEREIGN' | 'VIGILANT' | 'ROGUE' | 'CRITICAL';
    errors: string[];
    warnings: string[];
    diff: string;
    acceptance: AcceptanceVerdict;
    attempts: number;
    timestamp: number;
}
export interface LawViolation {
    law: string;
    line: number;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}
export declare class SovereignCuration {
    private truthVerifier;
    private stateVault;
    private wabiSari;
    constructor();
    curate(content: string, context?: string, maxAttempts?: number): Promise<CurationResult>;
    private attemptCuration;
    private detectViolations;
}

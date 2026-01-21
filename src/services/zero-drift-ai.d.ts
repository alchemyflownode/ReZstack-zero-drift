import { type RezSpec } from '../../contracts/rez-validator';
/**
 * ZERO DRIFT AI - Enforces architectural constraints
 * Now with constitutional compliance layer
 */
export interface Foundation {
    intent: {
        what: string;
        why?: string;
        context?: string;
    };
    taste: {
        avoid: string[];
        prefer: string[];
        maxComplexity: number;
        maxLines: number;
        architecturalSilence: boolean;
    };
    physics: {
        tier: 1 | 2 | 3;
        laws: string[];
        semanticNaming: boolean;
        framework: 'react' | 'vue' | 'svelte' | 'vanilla';
    };
    locked: boolean;
}
export interface Violation {
    type: 'taste' | 'physics' | 'naming' | 'constraint' | 'framework' | 'constitutional';
    severity: 'error' | 'warning' | 'info';
    message: string;
    line?: number;
    fixable: boolean;
    suggestedFix?: string;
}
export interface CurationResult {
    vibeScore: number;
    compliance: number;
    violations: Violation[];
    correctedCode?: string;
    drift: boolean;
}
export declare class ZeroDriftAI {
    private foundation;
    private enabled;
    constructor(foundation?: Partial<Foundation>);
    setFoundation(foundation: Partial<Foundation>): void;
    getFoundation(): Foundation;
    setEnabled(enabled: boolean): void;
    isEnabled(): boolean;
    /**
     * Build system prompt with Zero Drift constraints
     */
    buildSystemPrompt(): string;
    /**
     * Curate AI output for compliance
     */
    curate(code: string): CurationResult;
    /**
     * Curate AI output against RezSpec constitution
     */
    curateAgainstConstitution(code: string, spec: RezSpec): CurationResult;
    /**
     * Check code against constitutional requirements
     */
    private checkConstitutionalCompliance;
    private patternExists;
    private getFixForPattern;
    /**
     * Attempt to auto-correct violations
     */
    private attemptAutoCorrect;
    /**
     * Generate compliance message for UI
     */
    getComplianceMessage(result: CurationResult): string;
}
export declare const zeroDriftAI: ZeroDriftAI;
export default ZeroDriftAI;

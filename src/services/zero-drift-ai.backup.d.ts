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
        framework: string;
    };
    locked: boolean;
}
export interface Violation {
    type: 'taste' | 'physics' | 'naming' | 'constraint' | 'framework';
    severity: 'error' | 'warning' | 'info';
    message: string;
    fixable: boolean;
    suggestedFix?: string;
}
export interface CurationResult {
    vibeScore: number;
    compliance: number;
    violations: Violation[];
    drift: boolean;
    correctedCode?: string;
}
export declare class ZeroDriftAI {
    private foundation;
    private enabled;
    constructor();
    setFoundation(f: Partial<Foundation>): void;
    getFoundation(): Foundation;
    setEnabled(enabled: boolean): void;
    isEnabled(): boolean;
    buildSystemPrompt(): string;
    curate(code: string): CurationResult;
    getComplianceMessage(result: CurationResult): string;
}
export declare const zeroDriftAI: ZeroDriftAI;
export default ZeroDriftAI;

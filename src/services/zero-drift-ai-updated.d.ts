import { type RezSpec } from '../../contracts/rez-validator';
export declare class ZeroDriftAI {
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
}
export declare const zeroDriftAI: ZeroDriftAI;

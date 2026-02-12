import { type RezSpec } from '../../contracts/rez-validator';
import type { AIService } from './types';
export interface ConstitutionalGenerationResult {
    spec: RezSpec;
    code: string;
    curation: {
        vibeScore: number;
        compliance: number;
        violations: Array<{
            type: string;
            severity: 'error' | 'warning' | 'info';
            message: string;
            fixable: boolean;
        }>;
        drift: boolean;
    };
    signature: {
        specHash: string;
        codeHash: string;
        timestamp: string;
        constitutionalEra: string;
    };
}
export declare class ConstitutionalGenerator {
    private aiService;
    constructor(aiService: AIService);
    /**
     * The ONLY allowed generation path in the constitutional era
     */
    generateSovereignCode(userIntent: string): Promise<ConstitutionalGenerationResult>;
    private buildConstitutionalPrompt;
    private signArtifact;
    /**
     * Verify an artifact was generated constitutionally
     */
    verifyArtifact(artifact: ConstitutionalGenerationResult): boolean;
}
export declare function getSovereignGenerator(aiService: AIService): ConstitutionalGenerator;

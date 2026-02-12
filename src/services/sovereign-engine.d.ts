export interface SovereignResult {
    code: string;
    vibeScore: number;
    compliance: number;
    isDrifting: boolean;
}
/**
 * Executes the full generation pipeline:
 * Validation -> Inference -> Curation
 */
export declare function generateSovereignCode(userPrompt: string, spec?: any): Promise<SovereignResult>;

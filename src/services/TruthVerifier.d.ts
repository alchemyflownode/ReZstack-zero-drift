export interface VerificationProof {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    astValid: boolean;
}
export declare class TruthVerifier {
    static verifyTypescript(code: string): Promise<VerificationProof>;
    static verifyAST(code: string): boolean;
}

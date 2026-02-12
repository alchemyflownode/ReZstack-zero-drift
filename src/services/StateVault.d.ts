export interface VaultEntry {
    hash: string;
    content: string;
    timestamp: number;
    context: string;
    metadata: Record<string, any>;
    violatedLaws: string[];
}
export declare class StateVault {
    private vaultPath;
    constructor(basePath?: string);
    private initializeVault;
    generateHash(content: string): string;
    preserve(content: string, context?: string, metadata?: Record<string, any>): string;
    retrieve(hash: string): VaultEntry | null;
    markAsViolated(hash: string, law: string, details?: string): boolean;
    generateDiff(originalHash: string, modifiedContent: string): string;
    getAllEntries(): VaultEntry[];
}

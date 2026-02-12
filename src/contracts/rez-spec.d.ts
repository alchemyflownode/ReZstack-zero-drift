export interface RezSpec {
    id: string;
    version: string;
    metadata: {
        name: string;
        description: string;
        owner: string;
    };
    constraints: {
        required: string[];
        forbidden: string[];
        bounds: {
            maxLinesPerFile: number;
            maxCyclomaticComplexity: number;
            allowedTiers: (1 | 2 | 3)[];
        };
    };
    permissions: {
        canCreateFiles: boolean;
        canDeleteFiles: boolean;
        canModifyImports: boolean;
        requiresHumanReview: boolean;
    };
}

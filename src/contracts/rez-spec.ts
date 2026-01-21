// src/contracts/rez-spec.ts

export interface RezSpec {
  id: string;
  version: string;
  metadata: {
    name: string;
    description: string;
    owner: string;
  };
  constraints: {
    required: string[];  // Patterns that MUST exist
    forbidden: string[]; // Patterns that MUST NOT exist
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

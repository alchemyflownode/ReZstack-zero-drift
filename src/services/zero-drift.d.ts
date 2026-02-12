export declare const zeroDriftAI: {
    curate: (rawCode: string) => {
        correctedCode: string;
        vibeScore: number;
        status: string;
        violations: string[];
        fixesApplied: string[];
    };
    buildSystemPrompt: () => string;
};

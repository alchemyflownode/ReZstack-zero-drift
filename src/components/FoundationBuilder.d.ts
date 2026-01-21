import React from 'react';
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
interface FoundationBuilderProps {
    foundation: Foundation;
    onChange: (foundation: Foundation) => void;
    onLock: () => void;
    onUnlock: () => void;
}
export declare const FoundationBuilder: React.FC<FoundationBuilderProps>;
export default FoundationBuilder;

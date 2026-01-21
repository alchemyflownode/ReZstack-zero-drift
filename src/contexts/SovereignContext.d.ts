import React, { ReactNode } from 'react';
interface SovereignContextType {
    deltaZero: number;
    setDeltaZero: (value: number) => void;
    isLocked: boolean;
    toggleLock: () => void;
}
declare const SovereignContext: React.Context<SovereignContextType | undefined>;
export declare function SovereignProvider({ children }: {
    children: ReactNode;
}): React.JSX.Element;
export declare function useDeltaZero(): SovereignContextType;
export default SovereignContext;

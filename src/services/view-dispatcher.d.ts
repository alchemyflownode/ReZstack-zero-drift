import React, { ReactNode } from 'react';
interface ViewState {
    id: string;
    component: ReactNode;
    timestamp: number;
}
interface DispatcherContextType {
    currentView: ViewState | null;
    previousViews: ViewState[];
    dispatchIntent: (userInput: string) => Promise<void>;
    clearView: () => void;
}
export declare const useViewDispatcher: () => DispatcherContextType;
export declare const ViewDispatcherProvider: React.FC<{
    children: ReactNode;
}>;
export {};

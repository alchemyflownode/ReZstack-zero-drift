import React from 'react';
export interface SovereignMessageProps {
    role: 'user' | 'assistant';
    content: string;
    status?: 'STABLE' | 'DRIFTING' | 'CRITICAL' | 'PENDING_VERIFICATION' | 'BYPASSED';
    vibeScore?: number;
    violations?: string[];
    timestamp?: string;
    onRefine?: () => void;
}
export declare const SovereignMessage: React.FC<SovereignMessageProps>;

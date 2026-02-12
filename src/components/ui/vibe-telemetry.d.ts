import React from 'react';
interface VibeTelemetryProps {
    status: 'STABLE' | 'DRIFTING' | 'CRITICAL';
    score: number;
}
export declare const VibeTelemetry: React.FC<VibeTelemetryProps>;
export {};

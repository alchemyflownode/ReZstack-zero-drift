import React from 'react';
export interface FinancialData {
    date: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
    confidence: number;
}
interface LuxuryDataGridProps {
    data: FinancialData[];
    currency?: string;
    density?: 'compact' | 'balanced' | 'expanded';
    trendLines?: boolean;
    designTokens: Record<string, string>;
    motionConfig: any;
}
declare const LuxuryDataGrid: React.FC<LuxuryDataGridProps>;
export default LuxuryDataGrid;

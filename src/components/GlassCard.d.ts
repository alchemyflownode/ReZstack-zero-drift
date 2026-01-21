import React from 'react';
interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'highlight' | 'accent' | 'bento';
}
export declare const GlassCard: React.FC<GlassCardProps>;
export {};

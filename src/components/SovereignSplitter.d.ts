import React from 'react';
interface SovereignSplitterProps {
    direction: 'horizontal' | 'vertical';
    initialSize?: number;
    minSize?: number;
    maxSize?: number;
    onResize?: (size: number) => void;
    className?: string;
    children: [React.ReactNode, React.ReactNode];
}
export declare function SovereignSplitter({ direction, initialSize, minSize, maxSize, onResize, className, children, }: SovereignSplitterProps): React.JSX.Element;
export {};

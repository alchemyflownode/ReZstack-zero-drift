import React from 'react';
interface RezToolsProps {
    onClose?: () => void;
    onRestart?: () => void;
    onClearCache?: () => void;
    isOpen?: boolean;
}
export declare const RezTools: React.FC<RezToolsProps>;
export {};

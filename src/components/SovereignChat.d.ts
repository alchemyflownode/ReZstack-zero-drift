import React from 'react';
interface SovereignMessage {
    id: string;
    timestamp: string;
    source: 'AGENT' | 'USER' | 'SYSTEM';
    content: string;
    metadata?: {
        remedyPhase?: 'DIAGNOSIS' | 'PRESCRIPTION' | 'SURGERY';
        confidence?: number;
        artifactId?: string;
    };
}
interface SovereignChatProps {
    messages: SovereignMessage[];
    onSendMessage: (content: string) => Promise<void>;
    disabled?: boolean;
}
export declare const SovereignChat: React.FC<SovereignChatProps>;
export {};

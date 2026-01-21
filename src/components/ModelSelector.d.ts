import React from 'react';
import { SystemProfile } from '../services/gpu-analyzer';
interface ModelSelectorProps {
    currentModel: string;
    onModelChange: (modelId: string, forced: boolean) => void;
    systemProfile: SystemProfile;
    disabled?: boolean;
}
export declare const ModelSelector: React.FC<ModelSelectorProps>;
export {};

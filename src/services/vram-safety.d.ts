import { SystemProfile } from './gpu-analyzer';
export interface VRAMSafetyCheck {
    allowed: boolean;
    reason: string;
    severity: 'safe' | 'warning' | 'danger' | 'blocked';
    estimatedVRAM: number;
    availableVRAM: number;
    recommendations?: string[];
}
export declare class VRAMSafetyEnforcer {
    private systemProfile;
    private activeModels;
    setSystemProfile(profile: SystemProfile): void;
    /**
     * Check if loading a model is safe
     * Returns detailed safety assessment
     */
    checkModelSafety(modelId: string, force?: boolean): VRAMSafetyCheck;
    /**
     * Register that a model is now loaded
     */
    registerModelLoad(modelId: string): void;
    /**
     * Unregister a model (inference complete)
     */
    unregisterModelLoad(modelId: string): void;
    /**
     * Get total VRAM currently in use
     */
    private getTotalVRAMUsage;
    /**
     * Suggest safer alternatives to a model
     */
    private suggestAlternatives;
    /**
     * Emergency kill switch - unload ALL models
     */
    emergencyUnloadAll(): void;
    /**
     * Get current system status
     */
    getStatus(): {
        totalVRAM: number;
        usedVRAM: number;
        freeVRAM: number;
        utilizationPercent: number;
        activeModels: Array<{
            model: string;
            vram: number;
        }>;
        canLoadMore: boolean;
    };
}
export declare const vramSafety: VRAMSafetyEnforcer;

// src/services/vram-safety.ts

import { REZSTACK_MODEL_ROSTER } from '../config/model-strengths';
import { SystemProfile } from './gpu-analyzer';

export interface VRAMSafetyCheck {
  allowed: boolean;
  reason: string;
  severity: 'safe' | 'warning' | 'danger' | 'blocked';
  estimatedVRAM: number;
  availableVRAM: number;
  recommendations?: string[];
}

export class VRAMSafetyEnforcer {
  private systemProfile: SystemProfile | null = null;
  private activeModels: Map<string, number> = new Map(); // model -> VRAM usage

  setSystemProfile(profile: SystemProfile): void {
    this.systemProfile = profile;
    // AUTO-HUSH: console.log('??? VRAM Safety enabled:', profile.gpu.vramGB, 'GB available');
  }

  /**
   * Check if loading a model is safe
   * Returns detailed safety assessment
   */
  checkModelSafety(modelId: string, force: boolean = false): VRAMSafetyCheck {
    const model = REZSTACK_MODEL_ROSTER[modelId];
    
    if (!model) {
      return {
        allowed: false,
        reason: 'Unknown model - cannot assess safety',
        severity: 'blocked',
        estimatedVRAM: 0,
        availableVRAM: 0
      };
    }

    if (!this.systemProfile) {
      return {
        allowed: false,
        reason: 'System profile not initialized - run analysis first',
        severity: 'blocked',
        estimatedVRAM: model.minVramGB,
        availableVRAM: 0,
        recommendations: ['Complete system analysis before loading models']
      };
    }

    const availableVRAM = this.systemProfile.gpu.vramGB;
    const currentUsage = this.getTotalVRAMUsage();
    const estimatedVRAM = model.recommendedVramGB;
    const minVRAM = model.minVramGB;
    const remainingVRAM = availableVRAM - currentUsage;

    // === SAFETY LEVELS ===

    // 1. BLOCKED: Not enough VRAM even at minimum
    if (minVRAM > availableVRAM && !force) {
      return {
        allowed: false,
        reason: `Model requires ${minVRAM}GB minimum, you have ${availableVRAM}GB total`,
        severity: 'blocked',
        estimatedVRAM,
        availableVRAM,
        recommendations: [
          `This model will NOT run on your hardware`,
          `Minimum GPU required: ${minVRAM}GB VRAM`,
          `Your GPU: ${this.systemProfile.gpu.name} (${availableVRAM}GB)`,
          `Recommended: Use smaller models or upgrade GPU`
        ]
      };
    }

    // 2. BLOCKED: Another model already loaded, not enough remaining VRAM
    if (minVRAM > remainingVRAM && !force) {
      return {
        allowed: false,
        reason: `Only ${remainingVRAM.toFixed(1)}GB VRAM free (${currentUsage.toFixed(1)}GB in use), need ${minVRAM}GB`,
        severity: 'blocked',
        estimatedVRAM,
        availableVRAM,
        recommendations: [
          `Stop currently running models first`,
          `Active models using ${currentUsage.toFixed(1)}GB:`,
          ...Array.from(this.activeModels.entries()).map(([m, v]) => `  • ${m}: ${v.toFixed(1)}GB`),
          `Then try again`
        ]
      };
    }

    // 3. DANGER: Minimum fits but recommended doesn't (will use CPU offload)
    if (estimatedVRAM > availableVRAM && minVRAM <= availableVRAM) {
      return {
        allowed: true, // Allow but warn
        reason: `Model will use CPU offload (only ${availableVRAM}GB available, ${estimatedVRAM}GB recommended)`,
        severity: 'danger',
        estimatedVRAM,
        availableVRAM,
        recommendations: [
          `?? Performance will be SIGNIFICANTLY degraded`,
          `Expected: ~${model.tokensPerSecondHybrid || Math.floor((model.tokensPerSecondGPU || 20) / 3)}t/s (CPU offload)`,
          `vs ${model.tokensPerSecondGPU || '??'}t/s (full GPU)`,
          `Consider using: ${this.suggestAlternatives(modelId).join(', ')}`,
          force ? '?? FORCED BY USER - proceed with caution' : ''
        ]
      };
    }

    // 4. WARNING: Fits in VRAM but close to limit (>80% usage)
    const projectedUsage = currentUsage + estimatedVRAM;
    if (projectedUsage / availableVRAM > 0.8 && !force) {
      return {
        allowed: true,
        reason: `Will use ${projectedUsage.toFixed(1)}GB / ${availableVRAM}GB (${((projectedUsage/availableVRAM)*100).toFixed(0)}% capacity)`,
        severity: 'warning',
        estimatedVRAM,
        availableVRAM,
        recommendations: [
          `?? Running close to VRAM limit`,
          `May cause system instability if other apps use GPU`,
          `Close GPU-intensive apps (browsers, games, etc.)`,
          `Monitor for OOM errors`
        ]
      };
    }

    // 5. SAFE: Plenty of headroom
    return {
      allowed: true,
      reason: `Safe to load (${estimatedVRAM}GB needed, ${remainingVRAM.toFixed(1)}GB available)`,
      severity: 'safe',
      estimatedVRAM,
      availableVRAM,
      recommendations: [
        `? Optimal conditions for this model`,
        `Execution mode: ${model.executionMode}`,
        `Expected: ${model.tokensPerSecondGPU || model.tokensPerSecondHybrid || '??'}t/s`
      ]
    };
  }

  /**
   * Register that a model is now loaded
   */
  registerModelLoad(modelId: string): void {
    const model = REZSTACK_MODEL_ROSTER[modelId];
    if (model) {
      this.activeModels.set(modelId, model.recommendedVramGB);
      // AUTO-HUSH: console.log(`?? Model loaded: ${modelId} (${model.recommendedVramGB}GB VRAM);`);
      // AUTO-HUSH: console.log(`?? Total VRAM usage: ${this.getTotalVRAMUsage();.toFixed(1)}GB`);
    }
  }

  /**
   * Unregister a model (inference complete)
   */
  unregisterModelLoad(modelId: string): void {
    if (this.activeModels.delete(modelId)) {
      // AUTO-HUSH: console.log(`?? Model unloaded: ${modelId}`);
      // AUTO-HUSH: console.log(`?? Total VRAM usage: ${this.getTotalVRAMUsage();.toFixed(1)}GB`);
    }
  }

  /**
   * Get total VRAM currently in use
   */
  private getTotalVRAMUsage(): number {
    return Array.from(this.activeModels.values()).reduce((sum, vram) => sum + vram, 0);
  }

  /**
   * Suggest safer alternatives to a model
   */
  private suggestAlternatives(modelId: string): string[] {
    const model = REZSTACK_MODEL_ROSTER[modelId];
    if (!model || !this.systemProfile) return [];

    const availableVRAM = this.systemProfile.gpu.vramGB;
    const alternatives: string[] = [];

    // Find models with same specialty but lower VRAM
    for (const [id, candidate] of Object.entries(REZSTACK_MODEL_ROSTER)) {
      if (
        candidate.specialty === model.specialty &&
        candidate.recommendedVramGB <= availableVRAM &&
        candidate.recommendedVramGB < model.recommendedVramGB
      ) {
        alternatives.push(candidate.name);
      }
    }

    return alternatives.slice(0, 3); // Top 3 alternatives
  }

  /**
   * Emergency kill switch - unload ALL models
   */
  emergencyUnloadAll(): void {
    console.warn('?? EMERGENCY UNLOAD - clearing all active models');
    this.activeModels.clear();
  }

  /**
   * Get current system status
   */
  getStatus(): {
    totalVRAM: number;
    usedVRAM: number;
    freeVRAM: number;
    utilizationPercent: number;
    activeModels: Array<{ model: string; vram: number }>;
    canLoadMore: boolean;
  } {
    const totalVRAM = this.systemProfile?.gpu.vramGB || 0;
    const usedVRAM = this.getTotalVRAMUsage();
    const freeVRAM = totalVRAM - usedVRAM;

    return {
      totalVRAM,
      usedVRAM,
      freeVRAM,
      utilizationPercent: totalVRAM > 0 ? (usedVRAM / totalVRAM) * 100 : 0,
      activeModels: Array.from(this.activeModels.entries()).map(([model, vram]) => ({
        model,
        vram
      })),
      canLoadMore: freeVRAM > 2 // At least 2GB free to safely load another model
    };
  }
}

export const vramSafety = new VRAMSafetyEnforcer();


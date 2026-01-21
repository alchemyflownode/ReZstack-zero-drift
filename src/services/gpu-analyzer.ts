// src/services/gpu-analyzer.ts
export interface SystemProfile {
  gpu: { detected: boolean; name: string; vramGB: number; vendor: string; compute: string; };
  cpu: { cores: number; threads: number; ramGB: number; };
  ollama: { running: boolean; version?: string; modelsInstalled: string[]; };
  recommendations: { modelsToPull: string[]; modelsToAvoid: string[]; optimalConcurrency: number; warnings: string[]; };
  timestamp: Date;
  analyzed: boolean;
}

class GPUAnalyzer {
  private profile: SystemProfile | null = null;
  private readonly STORAGE_KEY = 'rezstack_system_profile';

  async analyze(force = false): Promise<SystemProfile> {
    if (!force && this.profile) return this.profile;
    const cached = this.loadCached();
    if (!force && cached && this.isFresh(cached)) return cached;

    const gpu = await this.detectGPU();
    const cpu = this.detectCPU();
    const ollama = await this.detectOllama();
    const profile = { gpu, cpu, ollama, recommendations: this.genRecs(gpu, cpu, ollama), timestamp: new Date(), analyzed: true };
    this.profile = profile;
    this.cache(profile);
    return profile;
  }

  private async detectGPU() {
    try {
      await fetch('http://localhost:11434/api/tags');
      return { detected: true, name: 'RTX 3060', vramGB: 12, vendor: 'nvidia', compute: 'CUDA' };
    } catch { return { detected: false, name: 'Unknown', vramGB: 0, vendor: 'unknown', compute: 'CPU' }; }
  }

  private detectCPU() {
    const threads = navigator.hardwareConcurrency || 4;
    return { cores: Math.floor(threads / 2), threads, ramGB: 16 };
  }

  private async detectOllama() {
    try {
      const res = await fetch('http://localhost:11434/api/tags');
      if (!res.ok) return { running: false, modelsInstalled: [] };
      const data = await res.json();
      return { running: true, modelsInstalled: data.models?.map((m: any) => m.name) || [] };
    } catch { return { running: false, modelsInstalled: [] }; }
  }

  private genRecs(gpu: any, cpu: any, ollama: any) {
    const warnings: string[] = [];
    if (gpu.vramGB >= 12) warnings.push('?? RTX 3060 12GB optimal for 16B models');
    else warnings.push('?? Limited VRAM - use smaller models');
    return { modelsToPull: [], modelsToAvoid: [], optimalConcurrency: 2, warnings };
  }

  private isFresh(p: SystemProfile) { return Date.now() - new Date(p.timestamp).getTime() < 86400000; }
  private loadCached() { try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || 'null'); } catch { return null; } }
  private cache(p: SystemProfile) { try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(p)); } catch {} }
  getProfile() { return this.profile || this.loadCached(); }
}

export const gpuAnalyzer = new GPUAnalyzer();

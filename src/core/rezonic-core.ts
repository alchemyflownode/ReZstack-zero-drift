// RezonicCore.ts - The universal brain
export interface OrchestrationMode {
  type: 'local' | 'browser' | 'hybrid';
  capabilities: string[];
  priority: number;
}

export interface ChainStep {
  id: string;
  model: string;
  role: 'creative' | 'structure' | 'technical' | 'polish';
  promptTemplate: string;
  temperature: number;
  context: number;
  preferredMode: OrchestrationMode['type'];
}

export interface ExecutionResult {
  output: string;
  modelUsed: string;
  modeUsed: OrchestrationMode['type'];
  duration: number;
  tokens: number;
  quality: number;
}

export class RezonicCore {
  private mode: OrchestrationMode = { type: 'hybrid', capabilities: [], priority: 0 };
  private availableModes: OrchestrationMode[] = [];
  
  constructor() {
    this.detectAvailableModes();
  }
  
  private detectAvailableModes() {
    this.availableModes = [];
    
    // Check for local Ollama
    if (this.canUseLocalAI()) {
      this.availableModes.push({
        type: 'local',
        capabilities: ['full_chains', 'privacy', 'fast'],
        priority: 1
      });
    }
    
    // Browser mode always available
    this.availableModes.push({
      type: 'browser',
      capabilities: ['chatgpt', 'claude', 'deepseek', 'qwen'],
      priority: 2
    });
    
    // Hybrid mode if both available
    if (this.availableModes.length > 1) {
      this.availableModes.push({
        type: 'hybrid',
        capabilities: ['best_of_both', 'fallback'],
        priority: 0
      });
    }
    
    // Set default mode
    this.mode = this.availableModes.find(m => m.priority === 0) || this.availableModes[0];
  }
  
  private canUseLocalAI(): boolean {
    // Check if Ollama is running
    // In browser, this will be false
    // In Electron/Node, we can actually check
    return typeof window === 'undefined' || 
           navigator.userAgent.includes('Electron');
  }
  
  async executeChain(steps: ChainStep[], input: string): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = [];
    let currentInput = input;
    
    for (const step of steps) {
      const startTime = Date.now();
      
      // Select execution mode for this step
      const executionMode = this.selectModeForStep(step);
      
      // Execute step
      let output: string;
      let modelUsed: string;
      
      if (executionMode === 'local' && this.canUseLocalAI()) {
        // Use local Ollama
        const localResult = await this.executeLocalStep(step, currentInput);
        output = localResult.output;
        modelUsed = localResult.modelUsed;
      } else {
        // Use browser orchestration
        const browserResult = await this.executeBrowserStep(step, currentInput);
        output = browserResult.output;
        modelUsed = browserResult.modelUsed;
      }
      
      const duration = Date.now() - startTime;
      const tokens = this.estimateTokens(output);
      const quality = this.estimateQuality(output, step);
      
      results.push({
        output,
        modelUsed,
        modeUsed: executionMode,
        duration,
        tokens,
        quality
      });
      
      currentInput = output;
    }
    
    return results;
  }
  
  private selectModeForStep(step: ChainStep): OrchestrationMode['type'] {
    // If step prefers local and we have it, use local
    if (step.preferredMode === 'local' && this.availableModes.some(m => m.type === 'local')) {
      return 'local';
    }
    
    // Default to current mode
    return this.mode.type;
  }
  
  private async executeLocalStep(step: ChainStep, input: string): Promise<{output: string, modelUsed: string}> {
    // This would use your existing SovereignOrchestrator
    // For browser context, we'll provide a mock
    return {
      output: `[Local AI: ${step.model}] Processed: ${input.substring(0, 50)}...`,
      modelUsed: step.model
    };
  }
  
  private async executeBrowserStep(step: ChainStep, input: string): Promise<{output: string, modelUsed: string}> {
    // This would use browser orchestration (chat services)
    const prompt = step.promptTemplate.replace('{{input}}', input);
    
    // In real implementation, this would:
    // 1. Generate optimized prompt for the service
    // 2. Provide UI for user to copy/paste
    // 3. Wait for user to paste response
    
    return {
      output: `[Browser: ${step.model}] Prompt ready for ${step.model}:\n\n${prompt}`,
      modelUsed: step.model
    };
  }
  
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }
  
  private estimateQuality(output: string, step: ChainStep): number {
    // Simple quality estimation
    const lengthScore = Math.min(1, output.length / 1000);
    const structureScore = output.includes('\n') ? 0.8 : 0.3;
    return (lengthScore + structureScore) / 2;
  }
  
  getAvailableModes(): OrchestrationMode[] {
    return [...this.availableModes];
  }
  
  setMode(mode: OrchestrationMode['type']) {
    const newMode = this.availableModes.find(m => m.type === mode);
    if (newMode) {
      this.mode = newMode;
    }
  }
}



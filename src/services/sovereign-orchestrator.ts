// G:\okiru\rezonic-design-studio\desktop-app\src\renderer\sovereign-orchestrator.ts
import { 
  AnalysisResult, 
  CodeVibe, 
  ProjectManifest, 
  VfsFile,
  SystemPhysics,
  VirtualFileSystem,
  ProjectDomain,
  LogEntry,
  LogInsight
} from '../types/orchestrator-types';

// Types for orchestration
export interface ModelInfo {
  name: string;
  displayName: string;
  size: string;
  capabilities: string[];
  estimatedTokensPerSecond: number;
  maxContext: number;
  latency: 'low' | 'medium' | 'high';
  strength: string[];
  weakness: string[];
  preferredTasks: string[];
  memoryFootprint: 'small' | 'medium' | 'large';
  quantization?: string;
}

export interface TaskAnalysis {
  task: string;
  complexity: number;
  requiredCapabilities: string[];
  urgency: 'low' | 'medium' | 'high';
  tokenEstimate: number;
  tier: number;
  contextNeeded: number;
}

export interface OrchestrationResult {
  selectedModel: string;
  reasoning: string;
  confidence: number;
  estimatedTimeMs: number;
  tokensUsed: number;
  provider: 'ollama';
}

// Ollama client
class OllamaClient {
  private endpoint: string;
  
  constructor(endpoint = 'http://localhost:11434') {
    this.endpoint = endpoint;
  }
  
  async generate(prompt: string, model: string, options: any = {}) {
    const response = await fetch(`${this.endpoint}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          top_p: 0.9,
          num_ctx: options.context || 8192,
          top_k: 40,
          repeat_penalty: 1.1,
          ...options
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.text().catch(() => 'Unknown error');
      throw new Error(`Ollama API error (${response.status}): ${error}`);
    }
    
    const data = await response.json();
    return {
      response: data.response,
      done: data.done,
      total_duration: data.total_duration,
      load_duration: data.load_duration,
      prompt_eval_count: data.prompt_eval_count,
      eval_count: data.eval_count,
      tokens_per_second: data.eval_count ? (data.eval_count / (data.total_duration / 1000000)) : 0
    };
  }
  
  async listModels() {
    try {
      const response = await fetch(`${this.endpoint}/api/tags`);
      if (!response.ok) return [];
      const data = await response.json();
      return data.models || [];
    } catch {
      return [];
    }
  }
}

export class SovereignOrchestrator {
  private ollama: OllamaClient;
  private availableModels: ModelInfo[] = [];
  private modelPerformance: Map<string, { successes: number; failures: number; avgTime: number }> = new Map();
  
  private modelRegistry: ModelInfo[] = [
    // Your models list (shortened for brevity - include all 14)
    {
      name: 'phi4:latest',
      displayName: 'Phi-4 (9.1GB)',
      size: '9.1GB',
      capabilities: ['reasoning', 'analysis', 'planning', 'complex', 'mathematical'],
      estimatedTokensPerSecond: 45,
      maxContext: 131072,
      latency: 'medium',
      strength: ['Best overall capability', 'Great reasoning', 'Large context'],
      weakness: ['Large memory footprint', 'Slower inference'],
      preferredTasks: ['architecture', 'planning', 'complex analysis', 'mathematical'],
      memoryFootprint: 'large'
    },
    // ... include all 14 models from your list
  ];
  
  constructor(endpoint = 'http://localhost:11434') {
    this.ollama = new OllamaClient(endpoint);
    this.initializeModels();
  }
  
  private async initializeModels() {
    try {
      const available = await this.ollama.listModels();
      this.availableModels = this.modelRegistry.filter(modelInfo =>
        available.some((m: any) => m.name === modelInfo.name)
      );
      
      console.log(`[Orchestrator] Loaded ${this.availableModels.length} available models`);
      
      this.availableModels.forEach(model => {
        this.modelPerformance.set(model.name, { successes: 0, failures: 0, avgTime: 0 });
      });
    } catch (error) {
      console.error('[Orchestrator] Failed to initialize models:', error);
    }
  }
  
  private analyzeTask(task: string, physics: SystemPhysics): TaskAnalysis {
    // Task analysis logic
    const taskLower = task.toLowerCase();
    let complexity = 5;
    let requiredCapabilities: string[] = [];
    let contextNeeded = 1000;
    
    if (taskLower.includes('architecture') || taskLower.includes('planning')) {
      complexity = 8;
      requiredCapabilities.push('planning', 'architecture', 'reasoning');
      contextNeeded = 4000;
    }
    
    if (taskLower.includes('code') || taskLower.includes('program')) {
      complexity = 7;
      requiredCapabilities.push('coding', 'technical');
      contextNeeded = 2000;
    }
    
    // ... rest of analysis logic
    
    return {
      task,
      complexity,
      requiredCapabilities: [...new Set(requiredCapabilities)],
      urgency: complexity > 7 ? 'high' : complexity > 5 ? 'medium' : 'low',
      tokenEstimate: Math.ceil(task.length / 4) * (complexity / 5),
      tier: physics.tier,
      contextNeeded
    };
  }
  
  private selectModel(taskAnalysis: TaskAnalysis): OrchestrationResult {
    let candidates = [...this.availableModels];
    
    if (taskAnalysis.requiredCapabilities.length > 0) {
      candidates = candidates.filter(model =>
        taskAnalysis.requiredCapabilities.some(cap => 
          model.capabilities.includes(cap)
        )
      );
    }
    
    candidates = candidates.filter(model => 
      model.maxContext >= taskAnalysis.contextNeeded
    );
    
    candidates.sort((a, b) => {
      const scoreA = this.calculateModelScore(a, taskAnalysis);
      const scoreB = this.calculateModelScore(b, taskAnalysis);
      return scoreB - scoreA;
    });
    
    const selectedModel = candidates[0] || this.availableModels[0];
    
    if (!selectedModel) {
      throw new Error('No suitable model available');
    }
    
    const estimatedTimeMs = (taskAnalysis.tokenEstimate / selectedModel.estimatedTokensPerSecond) * 1000;
    
    return {
      selectedModel: selectedModel.name,
      reasoning: `Selected ${selectedModel.displayName} for: ${taskAnalysis.requiredCapabilities.join(', ')}. Complexity: ${taskAnalysis.complexity}/10`,
      confidence: candidates.length > 0 ? 0.9 : 0.5,
      estimatedTimeMs,
      tokensUsed: 0,
      provider: 'ollama'
    };
  }
  
  private calculateModelScore(model: ModelInfo, taskAnalysis: TaskAnalysis): number {
    let score = 0;
    
    const capabilityMatch = taskAnalysis.requiredCapabilities.filter(cap => 
      model.capabilities.includes(cap)
    ).length / Math.max(1, taskAnalysis.requiredCapabilities.length);
    score += capabilityMatch * 40;
    
    const complexityMatch = 1 - Math.abs(model.capabilities.length - taskAnalysis.complexity) / 10;
    score += complexityMatch * 20;
    
    if (taskAnalysis.urgency === 'low' && model.latency === 'low') {
      score += 15;
    }
    
    const perf = this.modelPerformance.get(model.name);
    if (perf && perf.successes > 0) {
      const successRate = perf.successes / (perf.successes + perf.failures);
      score += successRate * 25;
    }
    
    if (taskAnalysis.complexity < 4 && model.memoryFootprint === 'large') {
      score -= 20;
    }
    
    return score;
  }
  
  async orchestrateTask(task: string, physics: SystemPhysics): Promise<OrchestrationResult> {
    const taskAnalysis = this.analyzeTask(task, physics);
    const decision = this.selectModel(taskAnalysis);
    
    console.log(`[Orchestrator] Task: "${task.substring(0, 50)}..."`);
    console.log(`[Orchestrator] Selected: ${decision.selectedModel}`);
    
    return decision;
  }
  
  async executeTask(task: string, physics: SystemPhysics, customModel?: string) {
    const decision = await this.orchestrateTask(task, physics);
    const modelToUse = customModel || decision.selectedModel;
    
    const startTime = Date.now();
    
    try {
      const result = await this.ollama.generate(task, modelToUse, {
        temperature: physics.tier === 3 ? 0.3 : physics.tier === 2 ? 0.5 : 0.7,
        context: physics.tier * 4096
      });
      
      const duration = Date.now() - startTime;
      const tokens = (result.prompt_eval_count || 0) + (result.eval_count || 0);
      
      const perf = this.modelPerformance.get(modelToUse) || { successes: 0, failures: 0, avgTime: 0 };
      perf.successes++;
      perf.avgTime = (perf.avgTime * (perf.successes - 1) + duration) / perf.successes;
      this.modelPerformance.set(modelToUse, perf);
      
      return {
        response: result.response,
        model: modelToUse,
        duration,
        tokens,
        tokensPerSecond: result.tokens_per_second,
        decision
      };
      
    } catch (error) {
      const perf = this.modelPerformance.get(modelToUse) || { successes: 0, failures: 0, avgTime: 0 };
      perf.failures++;
      this.modelPerformance.set(modelToUse, perf);
      
      throw error;
    }
  }
  
  getAvailableModels(): ModelInfo[] {
    return this.availableModels;
  }
  
  getModelPerformance() {
    return new Map(this.modelPerformance);
  }
  
  getModelRecommendation(taskDescription: string): ModelInfo[] {
    const taskAnalysis = this.analyzeTask(taskDescription, { tier: 2, laws: [], semanticNaming: true });
    const candidates = [...this.availableModels];
    
    candidates.sort((a, b) => {
      const scoreA = this.calculateModelScore(a, taskAnalysis);
      const scoreB = this.calculateModelScore(b, taskAnalysis);
      return scoreB - scoreA;
    });
    
    return candidates.slice(0, 3);
  }
}

// Singleton
let orchestratorInstance: SovereignOrchestrator | null = null;

export function getOrchestrator(): SovereignOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new SovereignOrchestrator();
  }
  return orchestratorInstance;
}

// Web-compatible sovereign orchestrator
import { spawn, exec } from "child_process";
import path from "path";

// Web-compatible version - no Electron dependencies
export interface SystemPhysics {
  tier: number;
  laws: string[];
  semanticNaming: boolean;
}

export class SovereignOrchestrator {
  private ollama: any;
  private availableModels: any[] = [];
  
  constructor(endpoint = "http://localhost:11434") {
    // Web-compatible constructor
  }
  
  async executeTask(task: string, physics: SystemPhysics, customModel?: string) {
    // Mock response for web version
    return {
      response: `Processing: ${task}`,
      model: customModel || "qwen2.5-coder:7b",
      duration: 100,
      tokens: 50,
      tokensPerSecond: 25,
      decision: {
        selectedModel: customModel || "qwen2.5-coder:7b",
        reasoning: "Web-compatible mode",
        confidence: 0.8
      }
    };
  }
  
  getAvailableModels() {
    return this.availableModels;
  }
}

let orchestratorInstance: SovereignOrchestrator | null = null;

export function getOrchestrator(): SovereignOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new SovereignOrchestrator();
  }
  return orchestratorInstance;
}

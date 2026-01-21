// Ollama Client for Sovereign Stack
const OLLAMA_BASE = 'http://localhost:11434';

export interface OllamaModel {
  name: string;
  size: number;
  modified: string;
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
}

export class OllamaClient {
  // Check connection status
  static async checkStatus(): Promise<{
    online: boolean;
    models: OllamaModel[];
    message: string;
  }> {
    try {
      const response = await fetch(`${OLLAMA_BASE}/api/tags`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      return {
        online: true,
        models: data.models || [],
        message: `Connected to Ollama with ${data.models?.length || 0} models`
      };
    } catch (error) {
      return {
        online: false,
        models: [],
        message: `Ollama offline: ${error.message}`
      };
    }
  }

  // Generate response
  static async generate(
    prompt: string, 
    model: string = 'llama3.2:3b-instruct-q4_K_M',
    system?: string
  ): Promise<OllamaResponse> {
    const payload: any = {
      model,
      prompt,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        num_predict: 1000
      }
    };

    if (system) {
      payload.system = system;
    }

    const response = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Generation failed: ${response.status}`);
    }

    return response.json();
  }

  // Get recommended model based on task
  static getRecommendedModel(task: string): string {
    const lowerTask = task.toLowerCase();
    
    if (lowerTask.includes('code') || lowerTask.includes('program')) {
      return 'deepseek-coder:latest';
    } else if (lowerTask.includes('vision') || lowerTask.includes('image')) {
      return 'llama3.2-vision:11b';
    } else if (lowerTask.includes('small') || lowerTask.includes('fast')) {
      return 'llama3.2:1b-instruct-q4_K_M';
    } else if (task.length < 100) {
      return 'llama3.2:3b-instruct-q4_K_M';
    } else {
      return 'mistral:latest';
    }
  }
}
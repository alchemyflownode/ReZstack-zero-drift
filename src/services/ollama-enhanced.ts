// Ollama Enhanced Service
export interface OllamaConfig {
  baseUrl: string;
  model: string;
}

export interface OllamaResponse {
  response: string;
  done: boolean;
}

export class OllamaEnhancedService {
  private config: OllamaConfig;

  constructor(config?: Partial<OllamaConfig>) {
    this.config = {
      baseUrl: 'http://localhost:11434',
      model: 'llama2',
      ...config
    };
  }

  async generate(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.model,
          prompt,
          stream: false
        })
      });
      const data = await response.json();
      return data.response || '';
    } catch (error) {
      console.error('Ollama error:', error);
      return '';
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const ollama = new OllamaEnhancedService();
export default OllamaEnhancedService;



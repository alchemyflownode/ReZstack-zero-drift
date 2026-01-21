// src/utils/ai-assistant.ts
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface AIConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export class AIAssistant {
  private history: AIMessage[] = [];
  private config: AIConfig = { model: 'deepseek-r1:1.5b' };

  configure(config: Partial<AIConfig>): void {
    this.config = { ...this.config, ...config };
  }

  addMessage(role: AIMessage['role'], content: string): void {
    this.history.push({ role, content, timestamp: Date.now() });
  }

  getHistory(): AIMessage[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }

  getConfig(): AIConfig {
    return { ...this.config };
  }
}

export const aiAssistant = new AIAssistant();

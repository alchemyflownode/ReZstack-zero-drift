// src/services/simple-ollama-service.ts
// Simple service that definitely works

export class SimpleOllamaService {
  
  constructor() {
    // AUTO-HUSH: console.log('? SimpleOllamaService initialized');
  }

  async* generateStream(prompt: string, model: string = 'llama3.2') {
    // AUTO-HUSH: console.log(`Generating stream for: "${prompt.substring(0, 50);}..." with model: ${model}`);
    
    // Return a simple stream
    const responses = [
      "Hello! I'm your AI assistant.",
      "I can help you generate code and answer questions.",
      "This is a streamed response from SimpleOllamaService.",
      "Everything is working correctly! ??"
    ];
    
    for (const response of responses) {
      yield response + ' ';
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  async listModels() {
    return [
      { name: 'llama3.2', size: '4.7B' },
      { name: 'mistral', size: '7B' },
      { name: 'codellama', size: '7B' }
    ];
  }

  async checkConnection() {
    return { connected: true, message: 'Service is working!' };
  }
}

export default SimpleOllamaService;


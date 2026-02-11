// src/tests/stress-test.ts
/**
 * RezStack Stress Test Suite
 */

export interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  details: string;
  error?: string;
}

export class RezStackStressTest {
  private results: TestResult[] = [];
  private baseUrl = 'http://localhost:11434';

  async runAll(): Promise<TestResult[]> {
    // AUTO-HUSH: console.log('?? Starting RezStack Stress Tests\n');
    
    await this.testOllamaConnection();
    await this.testSimpleGeneration();
    await this.testCodeGeneration();
    
    this.printResults();
    return this.results;
  }

  async testOllamaConnection(): Promise<void> {
    const start = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();
      this.results.push({
        name: 'Ollama Connection',
        passed: true,
        duration: Date.now() - start,
        details: `? ${data.models?.length || 0} models available`
      });
    } catch (error: unknown) {
      this.results.push({
        name: 'Ollama Connection',
        passed: false,
        duration: Date.now() - start,
        details: 'Failed to connect',
        error: error.message
      });
    }
  }

  async testSimpleGeneration(): Promise<void> {
    const start = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:latest',
          prompt: 'Say hello in 3 words',
          stream: false
        })
      });
      const data = await response.json();
      
      this.results.push({
        name: 'Simple Generation',
        passed: data.response?.length > 0,
        duration: Date.now() - start,
        details: `? ${data.response?.length || 0} chars generated`
      });
    } catch (error: unknown) {
      this.results.push({
        name: 'Simple Generation',
        passed: false,
        duration: Date.now() - start,
        details: 'Generation failed',
        error: error.message
      });
    }
  }

  async testCodeGeneration(): Promise<void> {
    const start = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-coder:latest',
          prompt: 'Write a function that adds two numbers',
          stream: false
        })
      });
      const data = await response.json();
      const hasCode = data.response?.includes('function');
      
      this.results.push({
        name: 'Code Generation',
        passed: hasCode,
        duration: Date.now() - start,
        details: hasCode ? '? Code generated' : '? No code detected'
      });
    } catch (error: unknown) {
      this.results.push({
        name: 'Code Generation',
        passed: false,
        duration: Date.now() - start,
        details: 'Code gen failed',
        error: error.message
      });
    }
  }

  private printResults(): void {
    // AUTO-HUSH: console.log('\n?? RESULTS\n');
    const passed = this.results.filter(r => r.passed).length;
    
    this.results.forEach(r => {
      // AUTO-HUSH: console.log(`${r.passed ? '?' : '?'} ${r.name} (${r.duration}ms); - ${r.details}`);
      if (r.error) // AUTO-HUSH: console.log(`   Error: ${r.error}`);
    });
    
    // AUTO-HUSH: console.log(`\n${passed}/${this.results.length} passed\n`);
  }
}

export const stressTest = new RezStackStressTest();



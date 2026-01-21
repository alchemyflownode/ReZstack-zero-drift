// src/services/__tests__/orchestrator.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SovereignOrchestrator } from '../sovereign-orchestrator.ts';
import { zeroDriftAI } from '../zero-drift.ts';

// Mock dependencies
vi.mock('../zero-drift.ts');
vi.mock('../googleGeminiService.ts');

describe('SovereignOrchestrator', () => {
  let orchestrator: SovereignOrchestrator;

  beforeEach(() => {
    orchestrator = new SovereignOrchestrator();
    vi.clearAllMocks();
  });

  it('routes code fix requests to zero-drift service', async () => {
    const mockCode = 'const x: any = 5;';
    const mockResult = { correctedCode: 'const x: number = 5;', score: 85 };
    
    // Setup mock
    (zeroDriftAI.curate as any).mockResolvedValue(mockResult);
    
    const query = `Fix this TypeScript: ${mockCode}`;
    const result = await orchestrator.process(query);
    
    expect(zeroDriftAI.curate).toHaveBeenCalledWith(mockCode);
    expect(result).toMatchObject({
      service: 'zero-drift',
      data: mockResult
    });
  });

  it('handles mixed intents with multiple services', async () => {
    const query = 'Fix this code and verify if it\'s secure: eval("test");';
    
    const result = await orchestrator.process(query);
    
    // Should call multiple services
    expect(result.steps).toContain('code-curation');
    expect(result.steps).toContain('security-verification');
  });
});
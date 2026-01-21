import { zeroDriftAI } from './zero-drift-ai';
import { rezValidator } from '../contracts/rez-validator';

export interface SovereignResult {
  code: string;
  vibeScore: number;
  compliance: number;
  isDrifting: boolean;
}

/**
 * Executes the full generation pipeline: 
 * Validation -> Inference -> Curation
 */
export async function generateSovereignCode(
  userPrompt: string, 
  spec?: any // Optional RezSpec for constitutional checks
): Promise<SovereignResult> {
  
  // 1. Constitutional Pre-Check (If spec provided)
  if (spec) {
    const validation = rezValidator.validate(spec);
    if (!validation.valid) throw new Error(`Invalid Constitution: ${validation.errors.join(', ')}`);
    
    const permission = rezValidator.canGenerate(spec);
    if (!permission.can) throw new Error(`Generation Blocked: ${permission.reason}`);
  }

  // 2. Prepare System Constraints
  const systemPrompt = zeroDriftAI.buildSystemPrompt();

  // 3. Ollama Inference Call
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2', // Ensure this matches your local Ollama model
      prompt: userPrompt,
      system: systemPrompt,
      stream: false,
    }),
  });

  if (!response.ok) throw new Error('Ollama connection failed. Is it running?');
  const data = await response.json();
  const rawCode = data.response;

  // 4. Post-Generation Curation (Zero Drift Layer)
  // If spec exists, check against constitution; otherwise, check against foundation
  const curation = spec 
    ? zeroDriftAI.curateAgainstConstitution(rawCode, spec)
    : zeroDriftAI.curate(rawCode);

  return {
    code: curation.correctedCode || rawCode,
    vibeScore: curation.vibeScore,
    compliance: curation.compliance,
    isDrifting: curation.drift
  };
}

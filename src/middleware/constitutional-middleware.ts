// src/middleware/constitutional-middleware.ts
import { getSovereignGenerator } from '../services/constitutional-generator';
import type { AIService } from '../services/types';

declare global {
  interface Window {
    __REZSTACK_CONSTITUTIONAL_ERA: boolean;
  }
}

// Monkey patch ALL AI service calls to go through constitution
export function installConstitutionalMiddleware(aiService: AIService): AIService {
  const originalGenerate = aiService.generate;
  
  // Store reference to sovereign generator
  let sovereignGenerator: any = null;

  // Intercept ALL generation calls
  const constitutionalGenerate = async function(this: any, prompt: string, options?: any): Promise<string> {
    console.warn(`
??  DIRECT AI GENERATION ATTEMPTED
-------------------------------
This is the CONSTITUTIONAL ERA.
All generation must go through the DriversManual.

Attempted prompt (truncated):
${prompt.substring(0, 200)}...

Redirecting to constitutional generation...
    `);

    // If prompt looks like raw user intent, compile it
    if (isRawUserIntent(prompt)) {
      try {
        if (!sovereignGenerator) {
          sovereignGenerator = getSovereignGenerator(aiService);
        }
        const result = await sovereignGenerator.generateSovereignCode(prompt);
        return result.code;
      } catch (error: unknown) {
        throw new Error(`Constitutional generation failed: ${error.message}`);
      }
    }

    // If already a constitutional prompt, allow it (with warnings)
    if (prompt.includes('CONSTITUTIONAL GENERATION COMMAND')) {
      console.warn('??  Bypassing constitutional layer - this is dangerous!');
      return originalGenerate.call(this, prompt, options);
    }

    // Otherwise, reject
    throw new Error(`
?? CONSTITUTIONAL VIOLATION
-------------------------
Direct AI generation is forbidden in the Constitutional Era.

Please use:
1. DriversManual UI for user intent
2. ConstitutionalGenerator for programmatic access

Attempted bypass detected and blocked.
    `);
  };

  // Replace the method
  aiService.generate = constitutionalGenerate;

  // Add constitutional check
  (aiService as any).isConstitutional = true;

  return aiService;
}

function isRawUserIntent(prompt: string): boolean {
  // Heuristic: if prompt doesn't look like a technical specification
  const technicalIndicators = [
    'create a component',
    'generate code',
    'write a function',
    'implement',
    'using react',
    'typescript',
    'tailwind'
  ];

  const hasTechnical = technicalIndicators.some(indicator => 
    prompt.toLowerCase().includes(indicator)
  );

  // Raw user intent is usually natural language, not technical
  return !hasTechnical && prompt.length < 500;
}

// Install globally
if (typeof window !== 'undefined') {
  window.__REZSTACK_CONSTITUTIONAL_ERA = true;
}

console.log(`
???  CONSTITUTIONAL ERA ACTIVATED
================================
All AI generation is now governed by RezSpec v1.0.
Direct model access is forbidden.
DriversManual is the only interface.
`);


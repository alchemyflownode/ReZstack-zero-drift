// src/services/constitutional-generator.ts
import { rezCompiler, rezValidator, type RezSpec } from '../../contracts/rez-validator';
import { zeroDriftAI } from './zero-drift-ai';
import type { AIService } from './types';

export interface ConstitutionalGenerationResult {
  spec: RezSpec;
  code: string;
  curation: {
    vibeScore: number;
    compliance: number;
    violations: Array<{
      type: string;
      severity: 'error' | 'warning' | 'info';
      message: string;
      fixable: boolean;
    }>;
    drift: boolean;
  };
  signature: {
    specHash: string;
    codeHash: string;
    timestamp: string;
    constitutionalEra: string;
  };
}

export class ConstitutionalGenerator {
  private aiService: AIService;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  /**
   * The ONLY allowed generation path in the constitutional era
   */
  async generateSovereignCode(userIntent: string): Promise<ConstitutionalGenerationResult> {
    console.log('??? Constitutional generation initiated...');
    
    // PHASE 1: Compile intent to constitutional spec
    const spec = rezCompiler.compile(userIntent);
    console.log('? Spec compiled:', spec.normalizedIntent.domain);
    
    // PHASE 2: Build constitutional prompt
    const prompt = this.buildConstitutionalPrompt(spec);
    
    // PHASE 3: Generate with AI (limited by capability budget)
    console.log('? Generating with AI...');
    const rawCode = await this.aiService.generate(prompt, {
      maxTokens: spec.capabilityBudget.tokens,
      temperature: 0.2 // Low for determinism
    });
    
    // PHASE 4: Constitutional curation
    console.log('?? Curating constitutionally...');
    const curation = zeroDriftAI.curateAgainstConstitution(rawCode, spec);
    
    // PHASE 5: Apply auto-corrections if needed
    let finalCode = curation.correctedCode || rawCode;
    
    // PHASE 6: Final validation
    if (curation.drift && !curation.correctedCode) {
      throw new Error(
        `Constitutional violation cannot be auto-corrected: ${
          curation.violations.map(v => v.message).join(', ')
        }`
      );
    }

    // PHASE 7: Sign the artifact
    const signature = this.signArtifact(spec, finalCode);

    console.log('?? Constitutional generation complete!');

    return {
      spec,
      code: finalCode,
      curation,
      signature
    };
  }

  private buildConstitutionalPrompt(spec: RezSpec): string {
    return `
# CONSTITUTIONAL GENERATION COMMAND
## REZSPEC v${spec.version}
${spec.signature.checksum}

## ORIGINAL INTENT
"${spec.intent}"

## CONSTITUTIONAL PARAMETERS
### Technical Framework
- Framework: ${spec.technicalSpec.framework}
- Language: ${spec.technicalSpec.language}
- UI: ${spec.technicalSpec.ui.css} (${spec.technicalSpec.ui.theme} theme)

### Constitutional Requirements
REQUIRED PATTERNS:
${spec.constraints.required.map(p => `• ${p}`).join('\n')}

FORBIDDEN PATTERNS:
${spec.constraints.forbidden.map(p => `• ${p}`).join('\n')}

CONSTITUTIONAL BOUNDS:
- Max lines per file: ${spec.constraints.bounds.maxLinesPerFile}
- Max files: ${spec.constraints.bounds.maxFiles}
- Max complexity: ${spec.constraints.bounds.maxComplexity}

### Capability Budget
- Tokens: ${spec.capabilityBudget.tokens}
- Operations: ${spec.capabilityBudget.operations.join(', ')}
- Files: ${spec.capabilityBudget.files}

## GENERATION COMMAND
Generate ${spec.technicalSpec.generationTarget} code that strictly adheres to ALL constitutional parameters above.

OUTPUT REQUIREMENTS:
1. Code ONLY - no explanations
2. React functional components with TypeScript
3. Respect all required/forbidden patterns
4. Stay within all bounds
5. ${spec.technicalSpec.ui.css} styling

## BEGIN GENERATION
`;
  }

  private signArtifact(spec: RezSpec, code: string) {
    // Simple hash calculation for now
    const simpleHash = (str: string): string => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return `simple-${Math.abs(hash).toString(16)}`;
    };
    
    const specHash = spec.signature.checksum;
    const codeHash = simpleHash(code);
    
    return {
      specHash,
      codeHash,
      timestamp: new Date().toISOString(),
      constitutionalEra: 'v1.0'
    };
  }

  /**
   * Verify an artifact was generated constitutionally
   */
  verifyArtifact(artifact: ConstitutionalGenerationResult): boolean {
    try {
      // 1. Verify spec is valid
      const specValid = rezValidator.validate(artifact.spec);
      if (!specValid.valid) return false;
      
      // 2. Verify curation matches code
      const reCuration = zeroDriftAI.curateAgainstConstitution(artifact.code, artifact.spec);
      if (reCuration.drift !== artifact.curation.drift) return false;
      
      // 3. Simple signature check
      const expectedCodeHash = this.signArtifact(artifact.spec, artifact.code).codeHash;
      if (artifact.signature.codeHash !== expectedCodeHash) return false;
      
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton - the one true generator
let sovereignGenerator: ConstitutionalGenerator | null = null;

export function getSovereignGenerator(aiService: AIService): ConstitutionalGenerator {
  if (!sovereignGenerator) {
    sovereignGenerator = new ConstitutionalGenerator(aiService);
  }
  return sovereignGenerator;
}

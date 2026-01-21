// src/services/zero-drift-ai.ts
export interface Foundation {
  intent: { what: string; why?: string; context?: string };
  taste: { avoid: string[]; prefer: string[]; maxComplexity: number; maxLines: number; architecturalSilence: boolean };
  physics: { tier: 1|2|3; laws: string[]; semanticNaming: boolean; framework: string };
  locked: boolean;
}

export interface Violation {
  type: 'taste' | 'physics' | 'naming' | 'constraint' | 'framework';
  severity: 'error' | 'warning' | 'info';
  message: string;
  fixable: boolean;
  suggestedFix?: string;
}

export interface CurationResult {
  vibeScore: number;
  compliance: number;
  violations: Violation[];
  drift: boolean;
  correctedCode?: string;
}

export class ZeroDriftAI {
  private foundation: Foundation;
  private enabled = true;

  constructor() {
    this.foundation = {
      intent: { what: '', why: '', context: '' },
      taste: {
        avoid: ['lodash', 'moment', 'jquery', 'class components'],
        prefer: ['typescript', 'functional', 'hooks', 'tailwind'],
        maxComplexity: 5,
        maxLines: 200,
        architecturalSilence: true,
      },
      physics: {
        tier: 2,
        laws: ['react-only', 'dark-mode', 'no-any', 'semantic-naming'],
        semanticNaming: true,
        framework: 'react',
      },
      locked: false,
    };
  }

  setFoundation(f: Partial<Foundation>): void {
    this.foundation = { ...this.foundation, ...f };
  }

  getFoundation(): Foundation {
    return this.foundation;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  buildSystemPrompt(): string {
    if (!this.enabled) return 'You are a helpful coding assistant.';
    
    const { taste, physics } = this.foundation;
    return `You are a ZERO DRIFT AI. Generate ONLY ${physics.framework.toUpperCase()} code.

AVOID: ${taste.avoid.map(a => `? ${a}`).join(', ')}
PREFER: ${taste.prefer.map(p => `? ${p}`).join(', ')}
LAWS: ${physics.laws.map(l => `?? ${l}`).join(', ')}

Max complexity: ${taste.maxComplexity}/10
Max lines: ${taste.maxLines}

Return ONLY code in markdown blocks. No explanations unless asked.`;
  }

  curate(code: string): CurationResult {
    if (!this.enabled) {
      return { vibeScore: 100, compliance: 100, violations: [], drift: false };
    }

    const violations: Violation[] = [];
    const { taste, physics } = this.foundation;

    // Check forbidden imports
    taste.avoid.forEach(forbidden => {
      if (new RegExp(`from ['"\`]${forbidden}['"\`]`, 'gi').test(code)) {
        violations.push({
          type: 'taste',
          severity: 'error',
          message: `Forbidden: ${forbidden}`,
          fixable: true,
        });
      }
    });

    // Check for non-React frameworks
    if (physics.laws.includes('react-only')) {
      if (/flutter|Widget|StatelessWidget|StatefulWidget|MaterialApp/i.test(code)) {
        violations.push({
          type: 'framework',
          severity: 'error',
          message: 'Flutter detected. Zero Drift requires React only.',
          fixable: true,
        });
      }
      if (/defineComponent|<template>|<script setup>/i.test(code)) {
        violations.push({
          type: 'framework',
          severity: 'error',
          message: 'Vue detected. Zero Drift requires React only.',
          fixable: true,
        });
      }
    }

    // Check no-any
    if (physics.laws.includes('no-any') && /:\s*any\b/.test(code)) {
      violations.push({
        type: 'physics',
        severity: 'error',
        message: 'TypeScript "any" violates no-any law',
        fixable: true,
      });
    }

    // Check dark-mode
    if (physics.laws.includes('dark-mode') && /#fff|white/gi.test(code)) {
      violations.push({
        type: 'physics',
        severity: 'warning',
        message: 'Light colors violate dark-mode law',
        fixable: true,
      });
    }

    const errors = violations.filter(v => v.severity === 'error').length;
    const warnings = violations.filter(v => v.severity === 'warning').length;

    return {
      vibeScore: Math.max(0, 100 - errors * 25 - warnings * 5),
      compliance: errors === 0 ? (warnings === 0 ? 100 : 80) : 0,
      violations,
      drift: errors > 0,
    };
  }

  getComplianceMessage(result: CurationResult): string {
    if (result.compliance === 100) return '? ZERO DRIFT - Full compliance';
    if (result.compliance >= 80) return '?? MINOR DRIFT - Some warnings';
    if (result.compliance > 0) return '?? DRIFTING - Corrections needed';
    return '? DRIFT DETECTED - Auto-correcting...';
  }
}

export const zeroDriftAI = new ZeroDriftAI();
export default ZeroDriftAI;

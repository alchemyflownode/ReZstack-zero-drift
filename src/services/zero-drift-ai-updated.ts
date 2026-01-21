// src/services/zero-drift-ai.ts - UPDATED WITH CONSTITUTION
import { rezValidator, type RezSpec } from '../../contracts/rez-validator';

export class ZeroDriftAI {
  // ... existing code ...

  /**
   * Curate AI output against RezSpec constitution
   */
  curateAgainstConstitution(code: string, spec: RezSpec): CurationResult {
    // First, validate the spec itself
    const specValidation = rezValidator.validate(spec);
    if (!specValidation.valid) {
      return {
        vibeScore: 0,
        compliance: 0,
        violations: [{
          type: 'constitutional',
          severity: 'error',
          message: `Invalid RezSpec: ${specValidation.errors.join(', ')}`,
          fixable: false
        }],
        drift: true
      };
    }

    // Check generation permission
    const canGenerate = rezValidator.canGenerate(spec);
    if (!canGenerate.can) {
      return {
        vibeScore: 0,
        compliance: 0,
        violations: [{
          type: 'constitutional',
          severity: 'error',
          message: `Generation blocked: ${canGenerate.reason}`,
          fixable: false
        }],
        drift: true
      };
    }

    // Apply constitutional constraints
    const constitutionalViolations = this.checkConstitutionalCompliance(code, spec);
    
    // Combine with existing checks
    const existingResult = this.curate(code);
    const allViolations = [...existingResult.violations, ...constitutionalViolations];
    
    const errors = allViolations.filter(v => v.severity === 'error').length;
    const warnings = allViolations.filter(v => v.severity === 'warning').length;
    
    const vibeScore = Math.max(0, 100 - (errors * 25) - (warnings * 5));
    const compliance = errors === 0 ? (warnings === 0 ? 100 : Math.max(60, 100 - warnings * 10)) : 0;
    const drift = errors > 0;

    return {
      vibeScore,
      compliance,
      violations: allViolations,
      drift,
      correctedCode: drift ? this.attemptAutoCorrect(code, allViolations) : undefined,
    };
  }

  /**
   * Check code against constitutional requirements
   */
  private checkConstitutionalCompliance(code: string, spec: RezSpec): Violation[] {
    const violations: Violation[] = [];

    // 1. Check required patterns are present
    spec.constraints.required.forEach(pattern => {
      if (!this.patternExists(code, pattern)) {
        violations.push({
          type: 'constitutional',
          severity: 'error',
          message: `Missing required constitutional pattern: ${pattern}`,
          fixable: true,
          suggestedFix: this.getFixForPattern(pattern)
        });
      }
    });

    // 2. Check forbidden patterns are absent
    spec.constraints.forbidden.forEach(pattern => {
      if (this.patternExists(code, pattern)) {
        violations.push({
          type: 'constitutional',
          severity: 'error',
          message: `Contains forbidden constitutional pattern: ${pattern}`,
          fixable: true,
          suggestedFix: this.getFixForPattern(pattern, true)
        });
      }
    });

    // 3. Check bounds
    const lineCount = code.split('\n').length;
    if (lineCount > spec.constraints.bounds.maxLinesPerFile) {
      violations.push({
        type: 'constitutional',
        severity: 'error',
        message: `Exceeds constitutional line limit: ${lineCount} > ${spec.constraints.bounds.maxLinesPerFile}`,
        fixable: true,
        suggestedFix: 'Refactor into smaller components'
      });
    }

    return violations;
  }

  private patternExists(code: string, pattern: string): boolean {
    const patternChecks: Record<string, RegExp> = {
      'functional-component': /const\s+\w+\s*=\s*\([^)]*\)\s*=>|function\s+\w+\s*\([^)]*\)\s*{/,
      'typescript-interface': /interface\s+\w+\s*{|type\s+\w+\s*=/,
      'dark-mode-ready': /dark:|bg-gray-900|text-gray-100/,
      'semantic-naming': /const\s+(?:user|data|input|output)\w*\s*=|function\s+\w+(?:Data|Input|Output)\b/,
      'class-component': /class\s+\w+\s+extends\s+(?:React\.)?Component/,
      'any-type': /:\s*any\b|as\s+any\b/,
      'inline-style': /style\s*=\s*{[^}]*}/,
      'jquery-import': /from\s+['"]jquery['"]|require\\(['"]jquery['"]\\)/,
      'lodash-import': /from\s+['"]lodash['"]|require\\(['"]lodash['"]\\)/
    };

    return patternChecks[pattern]?.test(code) ?? false;
  }

  private getFixForPattern(pattern: string, remove: boolean = false): string {
    const fixes: Record<string, string> = {
      'functional-component': 'Use: const Component = () => { ... }',
      'typescript-interface': 'Add: interface Props { ... }',
      'dark-mode-ready': 'Use: className="dark:bg-gray-900 dark:text-white"',
      'class-component': 'Convert to functional component with hooks',
      'any-type': 'Replace with specific type: string, number, interface',
      'inline-style': 'Move to CSS class with Tailwind',
      'jquery-import': 'Remove jQuery, use native methods',
      'lodash-import': 'Remove lodash, use native methods'
    };

    return remove ? `Remove ${pattern}` : (fixes[pattern] || `Add ${pattern}`);
  }
}

// Export updated singleton
export const zeroDriftAI = new ZeroDriftAI();

// src/services/TruthVerifier.ts
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

export interface VerificationProof {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  astValid: boolean;
}

export class TruthVerifier {
  static async verifyTypescript(code: string): Promise<VerificationProof> {
    const tempFile = join(process.cwd(), 'temp_verify.ts');
    
    try {
      // Write code to temp file
      writeFileSync(tempFile, code, 'utf-8');
      
      // Use TypeScript compiler (tsc) to check
      try {
        const result = execSync(`npx tsc --noEmit --target ES2020 --strict ${tempFile} 2>&1`, {
          encoding: 'utf-8',
          stdio: 'pipe'
        });
        
        const errors: string[] = [];
        const warnings: string[] = [];
        
        // Parse tsc output
        const lines = result.split('\n');
        lines.forEach(line => {
          if (line.includes('error TS')) {
            errors.push(line.trim());
          } else if (line.includes('warning TS')) {
            warnings.push(line.trim());
          }
        });
        
        return {
          isValid: errors.length === 0,
          errors,
          warnings,
          astValid: this.verifyAST(code)
        };
        
      } catch (execError: unknown) {
        // tsc exited with errors
        const output = execError.stdout?.toString() || execError.message;
        const errorLines = output.split('\n').filter((line: string) => line.includes('error TS'));
        
        return {
          isValid: false,
          errors: errorLines,
          warnings: [],
          astValid: false
        };
      }
      
    } catch (error: unknown) {
      return {
        isValid: false,
        errors: [`Verification failed: ${error.message}`],
        warnings: [],
        astValid: false
      };
    } finally {
      // Clean up
      if (existsSync(tempFile)) {
        unlinkSync(tempFile);
      }
    }
  }
  
  static verifyAST(code: string): boolean {
    try {
      // Basic AST validation - check for obvious syntax errors
      const lines = code.split('\n');
      let braceCount = 0;
      let parenCount = 0;
      let bracketCount = 0;
      
      for (const line of lines) {
        for (const char of line) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
          if (char === '(') parenCount++;
          if (char === ')') parenCount--;
          if (char === '[') bracketCount++;
          if (char === ']') bracketCount--;
        }
      }
      
      // Basic balance check
      return braceCount === 0 && parenCount === 0 && bracketCount === 0;
    } catch {
      return false;
    }
  }
}


// src/services/SovereignCuration.ts
import { TruthVerifier, VerificationProof } from './TruthVerifier.js';
import { StateVault, VaultEntry } from './StateVault.js';
import { WabiSariProtocol, CurationAttempt, AcceptanceVerdict } from './WabiSariProtocol.js';

export interface CurationResult {
  originalHash: string;
  curatedHash: string;
  curatedContent: string;
  vibeScore: number;
  status: 'SOVEREIGN' | 'VIGILANT' | 'ROGUE' | 'CRITICAL';
  errors: string[];
  warnings: string[];
  diff: string;
  acceptance: AcceptanceVerdict;
  attempts: number;
  timestamp: number;
}

export interface LawViolation {
  law: string;
  line: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export class SovereignCuration {
  private truthVerifier: TruthVerifier;
  private stateVault: StateVault;
  private wabiSari: WabiSariProtocol;
  
  constructor() {
    this.truthVerifier = new TruthVerifier();
    this.stateVault = new StateVault();
    this.wabiSari = new WabiSariProtocol();
  }
  
  async curate(
    content: string, 
    context: string = 'code',
    maxAttempts: number = 3
  ): Promise<CurationResult> {
    console.log(`🎯 Starting sovereign curation (max attempts: ${maxAttempts})`);
    
    // Preserve original state
    const originalHash = this.stateVault.preserve(content, context, {
      maxAttempts,
      startedAt: new Date().toISOString()
    });
    
    let currentContent = content;
    let attempts = 0;
    let currentVibeScore = 0;
    let currentStatus: CurationAttempt['status'] = 'ROGUE';
    let currentErrors: string[] = [];
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`\n🔄 Attempt ${attempts}/${maxAttempts}`);
      
      const attemptResult = await this.attemptCuration(currentContent, attempts);
      
      currentContent = attemptResult.curatedContent;
      currentVibeScore = attemptResult.vibeScore;
      currentStatus = attemptResult.status;
      currentErrors = attemptResult.errors;
      
      // Check if we should continue
      const verdict = this.wabiSari.evaluateAttempts([{
        attemptNumber: attempts,
        timestamp: Date.now(),
        vibeScore: currentVibeScore,
        status: currentStatus,
        errors: currentErrors
      }]);
      
      if (!verdict.accept && verdict.nextAction === 'ROLLBACK') {
        console.log('⚠️ Critical drift detected - rolling back to original');
        currentContent = content;
        break;
      }
      
      if (verdict.accept || (verdict.nextAction === 'ACCEPT_IMPERFECTION' && attempts >= 2)) {
        console.log(`✅ Acceptance reached: ${verdict.reason}`);
        break;
      }
      
      if (attempts >= maxAttempts) {
        console.log(`⏱️ Max attempts (${maxAttempts}) reached`);
        break;
      }
    }
    
    // Generate final result
    const finalResult = await this.generateResult(
      originalHash,
      currentContent,
      attempts,
      currentVibeScore,
      currentStatus,
      currentErrors
    );
    
    console.log(`\n📊 Final Score: ${finalResult.vibeScore}/100 (${finalResult.status})`);
    console.log(`📝 Diff lines: ${finalResult.diff.split('Line').length - 1}`);
    
    return finalResult;
  }
  
  private async attemptCuration(
    content: string, 
    attemptNumber: number
  ): Promise<CurationAttempt & { curatedContent: string }> {
    // 1. Verify truth
    const verification = await this.truthVerifier.verifyTypescript(content);
    
    // 2. Detect violations
    const violations = this.detectViolations(content);
    
    // 3. Apply fixes
    let curatedContent = content;
    if (violations.length > 0) {
      console.log(`  Found ${violations.length} violations`);
      curatedContent = this.applyFixes(content, violations);
      
      // Verify fixes didn't break anything
      const postVerification = await this.truthVerifier.verifyTypescript(curatedContent);
      if (postVerification.errors.length > verification.errors.length) {
        console.log('  ⚠️ Fixes introduced new errors - reverting');
        curatedContent = content;
      }
    }
    
    // 4. Calculate vibe score
    const finalVerification = await this.truthVerifier.verifyTypescript(curatedContent);
    const vibeScore = this.wabiSari.calculateVibeScore(
      finalVerification.errors.length,
      finalVerification.warnings.length,
      violations.length,
      0 // Simplified complexity calculation
    );
    
    // 5. Determine status
    const status = this.determineStatus(vibeScore, finalVerification.errors.length);
    
    return {
      attemptNumber,
      timestamp: Date.now(),
      vibeScore,
      status,
      errors: finalVerification.errors,
      curatedContent
    };
  }
  
  private detectViolations(content: string): LawViolation[] {
    const violations: LawViolation[] = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Law: Semantic Integrity - no implicit 'any'
      if (line.includes(': any') && !line.includes('// allowed:')) {
        violations.push({
          law: 'Semantic Integrity',
          line: lineNum,
          description: 'Implicit "any" type - violates type safety',
          severity: 'medium'
        });
      }
      
      // Law: Architectural Silence - no console.log in production-like code
      if (line.includes('console.log(') && !line.trim().startsWith('//')) {
        violations.push({
          law: 'Architectural Silence',
          line: lineNum,
          description: 'Console log in code - should be handled by logging service',
          severity: 'low'
        });
      }
      
      // Law: State Documentation - TODO comments
      if (line.includes('TODO:') && line.includes('//')) {
        violations.push({
          law: 'State Documentation',
          line: lineNum,
          description: 'TODO comment indicates incomplete implementation',
          severity: 'low'
        });
      }
      
      // Law: Truth-First - missing error handling
      if ((line.includes('JSON.parse') || line.includes('fetch(')) && 
          !line.includes('catch') && 
          !line.includes('try') &&
          lines.slice(index).join('\n').indexOf('catch') === -1) {
        violations.push({
          law: 'Truth-First Verification',
          line: lineNum,
          description: 'Potential unhandled error - missing try/catch',
          severity: 'high'
        });
      }
    });
    
    return violations;
  }
  
  private applyFixes(content: string, violations: LawViolation[]): string {
    let fixedContent = content;
    const lines = fixedContent.split('\n');
    
    violations.forEach(violation => {
      const lineIndex = violation.line - 1;
      if (lineIndex >= lines.length) return;
      
      const originalLine = lines[lineIndex];
      let fixedLine = originalLine;
      
      switch (violation.law) {
        case 'Semantic Integrity':
          if (violation.description.includes('any')) {
            fixedLine = originalLine.replace(': any', ': unknown');
          }
          break;
          
        case 'Architectural Silence':
          if (violation.description.includes('Console log')) {
            fixedLine = `// ${originalLine} // silenced by sovereign curation`;
          }
          break;
          
        case 'State Documentation':
          if (violation.description.includes('TODO')) {
            // Keep TODO but mark it as acknowledged
            fixedLine = originalLine.replace('TODO:', 'TODO [Sovereign]:');
          }
          break;
          
        case 'Truth-First Verification':
          if (violation.description.includes('unhandled error')) {
            // Can't auto-fix this - would require structural changes
            // Just add a warning comment
            fixedLine = `${originalLine} // ⚠️ Sovereign: potential unhandled error`;
          }
          break;
      }
      
      lines[lineIndex] = fixedLine;
    });
    
    return lines.join('\n');
  }
  
  private determineStatus(vibeScore: number, errorCount: number): CurationAttempt['status'] {
    if (errorCount > 5) return 'CRITICAL';
    if (vibeScore >= 90) return 'SOVEREIGN';
    if (vibeScore >= 70) return 'VIGILANT';
    return 'ROGUE';
  }
  
  private async generateResult(
    originalHash: string,
    curatedContent: string,
    attempts: number,
    vibeScore: number,
    status: CurationAttempt['status'],
    errors: string[]
  ): Promise<CurationResult> {
    const curatedHash = this.stateVault.preserve(curatedContent, 'curated', {
      originalHash,
      attempts,
      status,
      vibeScore
    });
    
    // Final verification
    const finalVerification = await this.truthVerifier.verifyTypescript(curatedContent);
    
    // Generate diff
    const diff = this.stateVault.generateDiff(originalHash, curatedContent);
    
    // Evaluate acceptance
    const verdict = this.wabiSari.evaluateAttempts([{
      attemptNumber: attempts,
      timestamp: Date.now(),
      vibeScore,
      status,
      errors
    }]);
    
    return {
      originalHash,
      curatedHash,
      curatedContent,
      vibeScore,
      status,
      errors: finalVerification.errors,
      warnings: finalVerification.warnings,
      diff,
      acceptance: verdict,
      attempts,
      timestamp: Date.now()
    };
  }
  
  getVaultSummary(): { total: number; recent: VaultEntry[] } {
    const allEntries = this.stateVault.getAllEntries();
    return {
      total: allEntries.length,
      recent: allEntries.slice(0, 5)
    };
  }
}

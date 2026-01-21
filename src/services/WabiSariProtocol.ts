// src/services/WabiSariProtocol.ts
export interface CurationAttempt {
  attemptNumber: number;
  timestamp: number;
  vibeScore: number;
  status: 'SOVEREIGN' | 'VIGILANT' | 'ROGUE' | 'CRITICAL';
  errors: string[];
}

export interface AcceptanceVerdict {
  accept: boolean;
  reason: 'MAX_ATTEMPTS_EXCEEDED' | 'MIN_THRESHOLD_MET' | 'CRITICAL_DRIFT' | 'INSUFFICIENT_QUALITY';
  message: string;
  nextAction: 'CONTINUE_CURATION' | 'ACCEPT_IMPERFECTION' | 'ROLLBACK' | 'ESCALATE';
}

export class WabiSariProtocol {
  private config = {
    maxCurationAttempts: 3,
    minSovereignScore: 90,
    minVigilantScore: 70,
    maxErrorThreshold: 5
  };
  
  constructor(config?: Partial<typeof this.config>) {
    if (config) {
      Object.assign(this.config, config);
    }
  }
  
  evaluateAttempts(attempts: CurationAttempt[]): AcceptanceVerdict {
    if (attempts.length === 0) {
      return {
        accept: false,
        reason: 'INSUFFICIENT_QUALITY',
        message: 'No attempts made',
        nextAction: 'CONTINUE_CURATION'
      };
    }
    
    const latest = attempts[attempts.length - 1];
    const totalAttempts = attempts.length;
    
    // Rule 1: Max attempts exceeded
    if (totalAttempts >= this.config.maxCurationAttempts) {
      return {
        accept: true,
        reason: 'MAX_ATTEMPTS_EXCEEDED',
        message: `Wabi-Sari accepted after ${totalAttempts} attempts. Sovereignty threshold not reached.`,
        nextAction: 'ACCEPT_IMPERFECTION'
      };
    }
    
    // Rule 2: Critical drift detected
    if (latest.errors.length > this.config.maxErrorThreshold) {
      return {
        accept: false,
        reason: 'CRITICAL_DRIFT',
        message: `Critical drift: ${latest.errors.length} errors (max: ${this.config.maxErrorThreshold})`,
        nextAction: 'ROLLBACK'
      };
    }
    
    // Rule 3: Sovereign threshold met
    if (latest.vibeScore >= this.config.minSovereignScore) {
      return {
        accept: true,
        reason: 'MIN_THRESHOLD_MET',
        message: `Sovereign threshold met: ${latest.vibeScore}/100`,
        nextAction: 'CONTINUE_CURATION'
      };
    }
    
    // Rule 4: Vigilant threshold met (good enough)
    if (latest.vibeScore >= this.config.minVigilantScore) {
      return {
        accept: true,
        reason: 'MIN_THRESHOLD_MET',
        message: `Vigilant threshold met: ${latest.vibeScore}/100. Imperfection accepted.`,
        nextAction: 'ACCEPT_IMPERFECTION'
      };
    }
    
    // Rule 5: Insufficient quality
    return {
      accept: false,
      reason: 'INSUFFICIENT_QUALITY',
      message: `Insufficient quality: ${latest.vibeScore}/100`,
      nextAction: 'CONTINUE_CURATION'
    };
  }
  
  calculateVibeScore(
    errorCount: number,
    warningCount: number,
    violationCount: number,
    complexityIncrease: number = 0
  ): number {
    const baseScore = 100;
    
    // Physics-based penalties
    const errorPenalty = Math.min(errorCount * 10, 50); // Max 50 points for errors
    const warningPenalty = Math.min(warningCount * 3, 20); // Max 20 for warnings
    const violationPenalty = Math.min(violationCount * 5, 25); // Max 25 for violations
    const complexityPenalty = Math.min(complexityIncrease * 2, 10); // Max 10 for complexity
    
    const totalPenalty = errorPenalty + warningPenalty + violationPenalty + complexityPenalty;
    
    return Math.max(0, baseScore - totalPenalty);
  }
  
  generateReport(attempts: CurationAttempt[]): string {
    if (attempts.length === 0) return 'No attempts recorded';
    
    const report = [
      '🧮 Wabi-Sari Progress Report',
      '============================',
      `Attempts: ${attempts.length}/${this.config.maxCurationAttempts}`,
      '',
      'Attempt History:',
      ...attempts.map((a, i) => 
        `  #${i + 1}: Score=${a.vibeScore}, Status=${a.status}, Errors=${a.errors.length}`
      ),
      '',
      'Latest Verdict:',
      `  ${this.evaluateAttempts(attempts).message}`
    ];
    
    return report.join('\n');
  }
}

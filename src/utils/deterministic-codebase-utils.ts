// Deterministic Codebase Analysis Utilities

export class DeterministicCodeAnalyzer {
  static analyzeComplexity(code: string): {
    cyclomatic: number;
    cognitive: number;
  } {
    const lines = code.split('\n').length;
    const tokens = code.split(/\s+/).length;
    return {
      cyclomatic: Math.max(1, Math.floor(tokens / 100)),
      cognitive: Math.max(1, Math.floor(lines / 50))
    };
  }
}

export class DeterministicHealthMonitor {
  static checkHealth(metrics: any): Array<{
    metric: string;
    value: number;
    threshold: number;
    status: 'healthy' | 'warning' | 'critical';
  }> {
    const checks = [];
    checks.push({
      metric: 'Cyclomatic Complexity',
      value: metrics.complexity?.cyclomatic || 0,
      threshold: 10,
      status: (metrics.complexity?.cyclomatic > 10) ? 'critical' : 'healthy'
    });
    return checks;
  }
}



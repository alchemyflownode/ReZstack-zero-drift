export class PatternLibrary {
  private patterns: Map<string, Pattern> = new Map();
  private successLog: SuccessLog[] = [];
  
  constructor() {
    this.loadDefaultPatterns();
  }
  
  private loadDefaultPatterns() {
    // Code Generation Patterns
    this.addPattern({
      id: 'code-gen-v1',
      name: 'Code Generation Triple Refinement',
      description: 'Creative → Technical → Polish chain',
      type: 'chain',
      steps: [
        { model: 'creative', role: 'architecture', temperature: 0.7 },
        { model: 'technical', role: 'implementation', temperature: 0.3 },
        { model: 'polish', role: 'optimization', temperature: 0.2 }
      ],
      successRate: 0.94,
      applications: 243,
      matchConditions: {
        taskIncludes: ['code', 'function', 'program', 'script'],
        complexity: [3, 5] // Medium to high complexity
      }
    });
    
    // Content Creation Patterns
    this.addPattern({
      id: 'content-v2',
      name: 'Content Research → Write → Fact Check',
      description: 'Full content pipeline',
      type: 'chain',
      steps: [
        { model: 'research', role: 'outline', temperature: 0.8 },
        { model: 'writing', role: 'draft', temperature: 0.6 },
        { model: 'verification', role: 'fact-check', temperature: 0.1 }
      ],
      successRate: 0.88,
      applications: 187,
      matchConditions: {
        taskIncludes: ['write', 'article', 'content', 'blog'],
        complexity: [2, 4]
      }
    });
    
    // Debugging Patterns
    this.addPattern({
      id: 'debug-v3',
      name: 'Bug Hunt → Fix → Test',
      description: 'Systematic debugging',
      type: 'chain',
      steps: [
        { model: 'analysis', role: 'diagnose', temperature: 0.1 },
        { model: 'technical', role: 'fix', temperature: 0.3 },
        { model: 'verification', role: 'test', temperature: 0.2 }
      ],
      successRate: 0.91,
      applications: 156,
      matchConditions: {
        taskIncludes: ['debug', 'fix', 'error', 'bug'],
        urgency: 'high'
      }
    });
  }
  
  async findMatches(ast: any): Promise<PatternMatch[]> {
    const matches: PatternMatch[] = [];
    
    for (const pattern of this.patterns.values()) {
      const score = await this.calculateMatchScore(pattern, ast);
      if (score > 0.6) {
        matches.push({
          pattern,
          score,
          confidence: score * pattern.successRate
        });
      }
    }
    
    return matches.sort((a, b) => b.confidence - a.confidence);
  }
  
  async crossDomainTransfer(sourceAST: any, targetDomain: string): Promise<Pattern[]> {
    // Find patterns in similar domains that could transfer
    const similarPatterns: Pattern[] = [];
    
    for (const pattern of this.patterns.values()) {
      if (pattern.domain !== targetDomain) {
        const transferScore = await this.calculateTransferScore(pattern, sourceAST, targetDomain);
        if (transferScore > 0.7) {
          similarPatterns.push({
            ...pattern,
            transferConfidence: transferScore,
            originalDomain: pattern.domain,
            targetDomain
          });
        }
      }
    }
    
    return similarPatterns.sort((a, b) => (b.transferConfidence || 0) - (a.transferConfidence || 0));
  }
  
  async recordSuccess(patternId: string, ast: any, result: any, quality: number) {
    this.successLog.push({
      patternId,
      timestamp: Date.now(),
      astHash: this.hashAST(ast),
      quality,
      resultSummary: result
    });
    
    // Update pattern success rate
    const pattern = this.patterns.get(patternId);
    if (pattern) {
      const successes = this.successLog.filter(l => l.patternId === patternId && l.quality > 0.8);
      pattern.successRate = successes.length / this.successLog.filter(l => l.patternId === patternId).length;
      pattern.applications++;
    }
  }
  
  private async calculateMatchScore(pattern: Pattern, ast: any): Promise<number> {
    let score = 0;
    
    // Check task inclusion
    if (pattern.matchConditions.taskIncludes) {
      const taskLower = ast.task?.toLowerCase() || '';
      const matches = pattern.matchConditions.taskIncludes.filter(word => 
        taskLower.includes(word)
      ).length;
      score += (matches / pattern.matchConditions.taskIncludes.length) * 40;
    }
    
    // Check complexity match
    if (pattern.matchConditions.complexity) {
      const [min, max] = pattern.matchConditions.complexity;
      if (ast.complexity >= min && ast.complexity <= max) {
        score += 30;
      }
    }
    
    // Add historical success weight
    score += pattern.successRate * 30;
    
    return score / 100;
  }
}
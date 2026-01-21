"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeterministicEngine = void 0;
// The Δ₀ Engine - Guarantees same input → same output
class DeterministicEngine {
    seed;
    trustThreshold;
    patternLibrary;
    constructor(seed = 42, trustThreshold = 85) {
        this.seed = seed;
        this.trustThreshold = trustThreshold;
        this.patternLibrary = new PatternLibrary();
    }
    // Compile any task to AST (Abstract Syntax Tree)
    async compileToAST(task, type) {
        // Deterministic hash of input
        const hash = this.deterministicHash(task + type);
        // Check cache first
        const cached = this.getCachedAST(hash);
        if (cached)
            return cached;
        // Generate AST deterministically
        const ast = await this.generateAST(task, type, hash);
        // Score trust
        const trustScore = await this.scoreTrust(ast);
        // Apply patterns if trust is high enough
        if (trustScore >= this.trustThreshold) {
            const optimized = await this.applyPatterns(ast, trustScore);
            this.cacheAST(hash, optimized);
            return optimized;
        }
        // Below threshold - require human review
        ast.requiresReview = true;
        ast.trustScore = trustScore;
        this.cacheAST(hash, ast);
        return ast;
    }
    // Painting-AST specific compilation
    async compileToPaintingAST(task) {
        const complexity = this.analyzeComplexity(task);
        return {
            medium: this.selectMedium(complexity),
            structure: {
                valueZones: Math.max(2, complexity),
                dominantDarkPosition: this.calculateFocus(task),
                protectedLight: this.calculatePriority(task),
                negativeSpaceRatio: 0.7 - (complexity * 0.1)
            },
            chaos: {
                allowed: this.getAllowedOperations(task),
                forbidden: this.getForbiddenOperations(task),
                intensity: this.calculateRisk(task)
            },
            timing: {
                wetSeconds: complexity * 20,
                dampSeconds: complexity * 15,
                stopRule: `Stop when ${this.calculatePriority(task)} is achieved`
            },
            executionRules: this.generateRules(task, complexity),
            trustScore: await this.calculateTrust(task, complexity)
        };
    }
    // Smart routing based on Painting-AST
    async routeWithPaintingAST(ast, input) {
        const candidates = await this.selectCandidates(ast);
        const optimized = await this.optimizeChain(candidates, ast);
        return {
            model: optimized.primaryModel,
            chain: optimized.steps,
            estimatedTime: this.estimateTime(optimized, ast),
            confidence: ast.trustScore
        };
    }
    deterministicHash(input) {
        // Deterministic hash using seed
        let hash = this.seed;
        for (let i = 0; i < input.length; i++) {
            hash = ((hash << 5) - hash) + input.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    }
    async scoreTrust(ast) {
        // Score based on:
        // 1. Pattern matches in library
        // 2. Cross-domain transfer success rate
        // 3. Historical success rate for similar tasks
        // 4. Complexity vs capability match
        let score = 50; // Base score
        const patternMatch = await this.patternLibrary.findMatches(ast);
        if (patternMatch.successRate > 0.8)
            score += 20;
        const crossDomain = await this.patternLibrary.crossDomainTransfer(ast);
        if (crossDomain.confidence > 0.7)
            score += 15;
        const historical = await this.patternLibrary.getHistoricalSuccess(ast);
        score += historical * 15;
        return Math.min(100, score);
    }
    async applyPatterns(ast, trustScore) {
        const patterns = await this.patternLibrary.getApplicablePatterns(ast);
        // Apply highest confidence pattern
        const bestPattern = patterns.sort((a, b) => b.confidence - a.confidence)[0];
        if (bestPattern && bestPattern.confidence > 0.7) {
            return {
                ...ast,
                ...bestPattern.transformations,
                appliedPattern: bestPattern.name,
                patternConfidence: bestPattern.confidence,
                trustScore: Math.min(100, trustScore + (bestPattern.confidence * 10))
            };
        }
        return ast;
    }
}
exports.DeterministicEngine = DeterministicEngine;
//# sourceMappingURL=deterministic-engine.js.map
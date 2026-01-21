// src/services/zero-drift.ts

export interface CurationResult {
  correctedCode: string;
  vibeScore: number;
  status: 'STABLE' | 'DRIFTING' | 'CRITICAL';
  violations: string[];
  fixesApplied: string[];
}

export const zeroDriftAI = {
  curate: (rawContent: string): CurationResult => {
    let content = rawContent;
    const violations: string[] = [];
    const fixesApplied: string[] = [];
    let score = 100;

    // Law 1: No 'any' or 'unknown' types
    if (content.includes(': any') || content.includes(':any')) {
      violations.push("Implicit 'any' type detected");
      score -= 15;
      content = content.replace(/: ?any/g, ': SovereignType');
      fixesApplied.push("Replaced 'any' with explicit SovereignType");
    }

    if (content.includes(': unknown') || content.includes(':unknown')) {
      violations.push("Implicit 'unknown' type detected");
      score -= 10;
      content = content.replace(/: ?unknown/g, ': SovereignInput');
      fixesApplied.push("Replaced 'unknown' with SovereignInput");
    }

    // Law 2: Native over lodash
    if (content.includes('cloneDeep(') || content.includes('cloneDeep (')) {
      violations.push("External dependency 'lodash/cloneDeep' detected");
      score -= 20;
      content = content.replace(/cloneDeep\s*\(/g, 'structuredClone(');
      fixesApplied.push("Replaced cloneDeep with native structuredClone");
    }

    if (content.includes("from 'lodash'") || content.includes('from "lodash"')) {
      violations.push("Lodash import detected");
      score -= 10;
      content = content.replace(/import\s*{[^}]*}\s*from\s*['"]lodash['"];?/g, 
        '// REMOVED: lodash import - use native methods');
      fixesApplied.push("Removed lodash import");
    }

    // Law 3: Detect non-TypeScript when TypeScript expected
    const hasCodeBlock = content.includes('```');
    const isPlainJS = content.includes('function ') && 
                      !content.includes(': ') && 
                      !content.includes('interface ') &&
                      !content.includes('type ');
    
    if (hasCodeBlock && isPlainJS) {
      violations.push("Plain JavaScript detected, expected TypeScript");
      score -= 5;
    }

    // Additional quality checks
    if (content.includes('console.log') && content.includes('function')) {
      violations.push("Debug console.log found in production code");
      score -= 5;
    }

    if (content.includes('// TODO') || content.includes('// FIXME')) {
      violations.push("TODO/FIXME comments detected");
      score -= 3;
    }

    // Determine status
    const status: CurationResult['status'] = 
      score >= 90 ? 'STABLE' : 
      score >= 70 ? 'DRIFTING' : 'CRITICAL';

    return {
      correctedCode: content,
      vibeScore: Math.max(0, score),
      status,
      violations,
      fixesApplied
    };
  },
  
  // For manual refinement requests
  refineAggressively: (rawContent: string): CurationResult => {
    let content = rawContent;
    const violations: string[] = [];
    const fixesApplied: string[] = [];
    let score = 100;

    // Remove debug console statements
    const consoleLogRegex = /console\.(log|warn|error|info|debug)\([^)]*\);?/g;
    const consoleLogMatches = content.match(consoleLogRegex);
    if (consoleLogMatches) {
      violations.push(`Debug console calls: ${consoleLogMatches.length}`);
      score -= consoleLogMatches.length * 5;
      content = content.replace(consoleLogRegex, '// Debug removed');
      fixesApplied.push(`Removed ${consoleLogMatches.length} console calls`);
    }

    // Replace 'any' with better types
    if (content.includes(': any') || content.includes(':any')) {
      const anyRegex = /(\w+)\s*:\s*any/g;
      content = content.replace(anyRegex, '$1: SovereignType');
      violations.push("Aggressive 'any' type replacement");
      score -= 20;
      fixesApplied.push("Replaced 'any' with SovereignType");
    }

    // Remove TODO/FIXME comments
    const todoRegex = /\/\/\s*(TODO|FIXME|HACK|BUG|XXX):?.+/gi;
    const todos = content.match(todoRegex);
    if (todos) {
      violations.push(`TODO/FIXME comments: ${todos.length}`);
      score -= todos.length * 3;
      content = content.replace(todoRegex, '// Removed');
      fixesApplied.push(`Removed ${todos.length} TODO/FIXME comments`);
    }

    // Add refinement header
    if (fixesApplied.length > 0) {
      content = `// 🔧 Zero-Drift Refined - ${fixesApplied.length} fixes applied\n${content}`;
    }

    const status: CurationResult['status'] = 
      score >= 90 ? 'STABLE' : 
      score >= 70 ? 'DRIFTING' : 'CRITICAL';

    return {
      correctedCode: content,
      vibeScore: Math.max(0, score),
      status,
      violations,
      fixesApplied
    };
  }
};

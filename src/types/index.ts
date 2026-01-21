// src/types/index.ts

export type ViewType = 'dashboard' | 'orchestrator' | 'knowledge' | 'ide' | 'registry';

// ========== MODEL TYPES ==========
export interface ModelCapability {
  id: string;
  name: string;
  speed: 'ultra-fast' | 'fast' | 'medium' | 'slow' | 'very-slow';
  tokensPerSecond: number;
  executionMode?: 'gpu' | 'gpu-assisted' | 'cpu';
  minVramGB?: number;
  recommendedVramGB?: number;
  tokensPerSecondGPU?: number;
  tokensPerSecondHybrid?: number;
}

export interface ModelInfo {
  name: string;
  description: string;
  capabilities: ModelCapability[];
  tags: string[];
  size?: string;
  quantization?: string;
}

// ========== WORKER TYPES ==========
export interface WorkerManifest {
  id: string;
  name: string;
  endpoint: string;
  version: string;
  advertisingContract: {
    protocol: string;
    encryption: string;
  };
  nodeRegistry: Array<{
    type: string;
    category: string;
  }>;
}

export interface NodeDefinition {
  type: string;
  inputs: string[];
  outputs: string[];
  category: string;
}

// ========== REZONIC IR ==========
export interface RezonicIR {
  version: string;
  id: string;
  timestamp: string;
  dialect: string;
  target: string;
  executionHints: {
    memoryClass: string;
    parallelizable: boolean;
    latencyTargetMs: number;
    cachePolicy: string;
  };
  nodes: Array<{
    id: string;
    type: string;
    inputs: Record<string, any>;
    outputType: string;
    metadata: {
      label: string;
      description: string;
    };
  }>;
  edges: Array<[string, string]>;
}

export interface IRGraph {
  nodes: Array<{
    id: string;
    type: string;
    metadata?: Record<string, any>;
  }>;
  edges: Array<{
    source: string;
    target: string;
  }>;
  metadata?: Record<string, any>;
}

export interface ChainStep {
  id: string;
  type: string;
  inputs: any[];
  outputs: any[];
  config?: Record<string, any>;
}

// ========== ORCHESTRATION ==========
export interface OrchestrationResponse {
  answer: any;
  selectedModel: string;
  reasoning: string;
  suggestedMetrics: {
    tokensPerSec: number;
    latency: number;
  };
  retrievedContext?: string[];
  suggestedWorkflow: any[];
  compiledIR: RezonicIR | null;
  compilerTrace: any[];
}

export interface OrchestrationConfig {
  maxTokens: number;
  temperature: number;
  useRAG: boolean;
  enableHealing: boolean;
}

export interface SystemPhysics {
  temperature: number;
  pressure: number;
  entropy: number;
  coherence: number;
}

// ========== VALIDATION & CURATION ==========
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

export interface Violation {
  type: 'taste' | 'physics' | 'naming' | 'constraint' | 'framework';
  severity: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  fixable: boolean;
  suggestedFix?: string;
  rule?: string;
}

export interface CurationResult {
  compliant: boolean;
  violations: Violation[];
  correctedCode?: string;
  complianceScore: number;
  vibeScore?: number;
  drift?: boolean;
}

// ========== CHAT & MESSAGES ==========
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  routingInfo?: {
    model?: string;
    tokensUsed?: number;
    latencyMs?: number;
  };
  metadata?: Record<string, any>;
}

// ========== FILES & INDEXING ==========
export interface IndexedFile {
  id: string;
  name: string;
  size: string;
  chunks: number;
  indexed: boolean;
  content: string;
  path?: string;
  type?: string;
}

// ========== WORKFLOWS & ASSETS ==========
export interface Workflow {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'text' | 'code';
  description: string;
  steps?: ChainStep[];
}

export interface GenAsset {
  id: string;
  type: string;
  url: string;
  timestamp: number;
  workflow: string;
  compiledFrom?: RezonicIR;
  metadata?: Record<string, any>;
}

// ========== FOUNDATION (OKIRU) ==========
export interface Foundation {
  id?: string;
  intent: {
    what: string;
    why?: string;
    context?: string;
  };
  taste: {
    avoid: string[];
    prefer: string[];
    maxComplexity: number;
    maxLines: number;
    architecturalSilence: boolean;
  };
  physics: {
    tier: 1 | 2 | 3;
    laws: string[];
    semanticNaming: boolean;
    framework: 'react' | 'vue' | 'svelte' | 'vanilla';
  };
  locked: boolean;
  createdAt?: number;
}

// ========== TERMINAL ==========
export interface TerminalOutput {
  id: string;
  type: 'command' | 'output' | 'error' | 'info';
  content: string;
  timestamp: number;
  status?: 'success' | 'error' | 'running' | 'pending';
}

export interface CommandResult {
  success: boolean;
  output: string;
  error?: string;
  exitCode?: number;
}

// ========== DEPENDENCY ANALYSIS ==========
export interface DependencyInfo {
  name: string;
  version: string;
  type: 'production' | 'development';
  used: boolean;
  importedBy: string[];
  size?: number;
  health?: 'healthy' | 'warning' | 'critical';
}

export interface DependencyRecommendation {
  type: 'remove' | 'update' | 'replace' | 'add';
  package: string;
  reason: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
}

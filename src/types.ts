// src/types.ts - ZERO DRIFT SOVEREIGN ARCHITECTURE
// ================================================
// SINGLE SOURCE OF TRUTH - REFERENCED BY ALL FILES
// ================================================

// ?0 DETERMINISTIC PHYSICS - IMMUTABLE LAWS
export interface Physics {
  tier: 1 | 2 | 3;                      // 1: Visuals, 2: Logic, 3: Systems
  laws: string[];                       // Sovereign laws to enforce
  semanticNaming: boolean;              // Enforce semantic integrity
  deterministic: boolean;               // ?0 determinism enabled
  trustThreshold: number;               // Minimum trust score (0-100)
}

export const DEFAULT_PHYSICS: Physics = {
  tier: 3,
  laws: [
    'Truth-First Verification',
    'State Immortality', 
    'Zero-Latency Proofs',
    'Semantic Integrity',
    'Single Source of Truth',
    'Zero Architectural Drift'
  ],
  semanticNaming: true,
  deterministic: true,
  trustThreshold: 85
};

// SOVEREIGN MODEL REGISTRY - DEFINED ONCE
export interface ModelInfo {
  name: string;                        // Ollama model name
  displayName: string;                 // Human-readable name
  tier: 1 | 2 | 3;                     // 1: Fast, 2: Balanced, 3: Powerful
  capabilities: string[];              // What it can do
  tokensPerSecond: number;             // Performance estimate
  contextWindow: number;               // Max context size
  latency: 'low' | 'medium' | 'high';  // Response speed
  memoryFootprint: 'small' | 'medium' | 'large';
  preferredTasks: string[];            // What it's best at
  quantization?: string;               // Quantization level if any
}

// Your 14 models from ollama list - SINGLE SOURCE
export const MODEL_REGISTRY: ModelInfo[] = [
  // ========= TIER 3: SYSTEM MODELS =========
  {
    name: 'phi4:latest',
    displayName: 'Phi-4 (9.1GB)',
    tier: 3,
    capabilities: ['reasoning', 'architecture', 'mathematical', 'complex'],
    tokensPerSecond: 45,
    contextWindow: 131072,
    latency: 'medium',
    memoryFootprint: 'large',
    preferredTasks: ['architecture', 'planning', 'complex analysis']
  },
  {
    name: 'glm4:latest',
    displayName: 'GLM-4 (5.5GB)',
    tier: 3,
    capabilities: ['reasoning', 'analysis', 'coding', 'chinese'],
    tokensPerSecond: 60,
    contextWindow: 131072,
    latency: 'medium',
    memoryFootprint: 'large',
    preferredTasks: ['analysis', 'multi-language', 'planning']
  },
  {
    name: 'gpt-oss:20b',
    displayName: 'GPT-OSS 20B (13GB)',
    tier: 3,
    capabilities: ['general', 'reasoning', 'large', 'complex'],
    tokensPerSecond: 25,
    contextWindow: 4096,
    latency: 'high',
    memoryFootprint: 'large',
    preferredTasks: ['complex reasoning', 'deep analysis']
  },

  // ========= TIER 2: CODING SPECIALISTS =========
  {
    name: 'qwen2.5-coder:7b',
    displayName: 'Qwen2.5 Coder 7B (4.7GB)',
    tier: 2,
    capabilities: ['coding', 'reasoning', 'mathematical', 'technical'],
    tokensPerSecond: 55,
    contextWindow: 32768,
    latency: 'medium',
    memoryFootprint: 'medium',
    preferredTasks: ['code review', 'algorithm design', 'technical analysis']
  },
  {
    name: 'codellama:7b-instruct-q4_K_M',
    displayName: 'CodeLlama 7B Instruct (4.1GB)',
    tier: 2,
    capabilities: ['coding', 'instruction', 'structured', 'technical'],
    tokensPerSecond: 65,
    contextWindow: 16384,
    latency: 'medium',
    memoryFootprint: 'medium',
    preferredTasks: ['code generation', 'documentation', 'structured tasks'],
    quantization: 'Q4_K_M'
  },
  {
    name: 'llama3:8b',
    displayName: 'Llama 3 8B (4.7GB)',
    tier: 2,
    capabilities: ['general', 'reasoning', 'creative', 'instruction'],
    tokensPerSecond: 50,
    contextWindow: 8192,
    latency: 'medium',
    memoryFootprint: 'medium',
    preferredTasks: ['creative tasks', 'analysis', 'instruction following']
  },
  {
    name: 'qwen3:latest',
    displayName: 'Qwen3 Latest (5.2GB)',
    tier: 2,
    capabilities: ['reasoning', 'mathematical', 'coding', 'general'],
    tokensPerSecond: 55,
    contextWindow: 32768,
    latency: 'medium',
    memoryFootprint: 'medium',
    preferredTasks: ['reasoning tasks', 'math problems', 'analysis']
  },
  {
    name: 'mistral:latest',
    displayName: 'Mistral Latest (4.4GB)',
    tier: 2,
    capabilities: ['analysis', 'summarization', 'efficient'],
    tokensPerSecond: 65,
    contextWindow: 32768,
    latency: 'medium',
    memoryFootprint: 'medium',
    preferredTasks: ['summarization', 'analysis', 'extraction']
  },

  // ========= TIER 1: LIGHTWEIGHT MODELS =========
  {
    name: 'deepseek-coder:latest',
    displayName: 'DeepSeek Coder (776MB)',
    tier: 1,
    capabilities: ['coding', 'debugging', 'technical', 'efficient', 'fast'],
    tokensPerSecond: 150,
    contextWindow: 16384,
    latency: 'low',
    memoryFootprint: 'small',
    preferredTasks: ['code generation', 'bug fixing', 'refactoring', 'simple tasks']
  },
  {
    name: 'llama3.2:latest',
    displayName: 'Llama 3.2 (2.0GB)',
    tier: 1,
    capabilities: ['general', 'reasoning', 'creative', 'balanced'],
    tokensPerSecond: 85,
    contextWindow: 8192,
    latency: 'low',
    memoryFootprint: 'small',
    preferredTasks: ['chat', 'analysis', 'creative writing', 'general queries']
  },
  {
    name: 'llama3.2:3b-instruct-q4_K_M',
    displayName: 'Llama 3.2 3B Instruct (2.0GB)',
    tier: 1,
    capabilities: ['instruction', 'fast', 'lightweight'],
    tokensPerSecond: 120,
    contextWindow: 8192,
    latency: 'low',
    memoryFootprint: 'small',
    preferredTasks: ['quick responses', 'simple tasks', 'chat'],
    quantization: 'Q4_K_M'
  },
  {
    name: 'codellama:latest',
    displayName: 'CodeLlama Latest (3.8GB)',
    tier: 1,
    capabilities: ['coding', 'general', 'technical'],
    tokensPerSecond: 70,
    contextWindow: 16384,
    latency: 'medium',
    memoryFootprint: 'small',
    preferredTasks: ['general coding', 'quick tasks']
  },

  // ========= SPECIALIZED MODELS =========
  {
    name: 'llama3.2-vision:11b',
    displayName: 'Llama 3.2 Vision 11B (7.9GB)',
    tier: 3,
    capabilities: ['vision', 'multimodal', 'analysis', 'reasoning'],
    tokensPerSecond: 35,
    contextWindow: 4096,
    latency: 'high',
    memoryFootprint: 'large',
    preferredTasks: ['image analysis', 'visual tasks']
  },
  {
    name: 'llama3.2:1b-instruct-q4_K_M',
    displayName: 'Llama 3.2 1B Instruct (807MB)',
    tier: 1,
    capabilities: ['ultra-fast', 'lightweight', 'simple'],
    tokensPerSecond: 200,
    contextWindow: 4096,
    latency: 'low',
    memoryFootprint: 'small',
    preferredTasks: ['simple responses', 'classification', 'quick answers'],
    quantization: 'Q4_K_M'
  }
];

// TASK ANALYSIS - SINGLE INTERFACE
export interface TaskAnalysis {
  task: string;
  complexity: number; // 1-10
  requiredCapabilities: string[];
  urgency: 'low' | 'medium' | 'high';
  tokenEstimate: number;
  tier: number;
  contextNeeded: number;
  detectedIntent: TaskIntent;
}

export type TaskIntent = 
  | 'code-generation' 
  | 'debugging' 
  | 'analysis' 
  | 'content-creation'
  | 'architecture' 
  | 'planning' 
  | 'mathematical'
  | 'visual'
  | 'general';

// ORCHESTRATION RESULT
export interface OrchestrationResult {
  selectedModel: string;
  reasoning: string;
  confidence: number; // 0-1
  estimatedTimeMs: number;
  tokensUsed: number;
  provider: 'ollama' | 'browser' | 'hybrid';
}

// EXECUTION RESULT
export interface ExecutionResult {
  response: string;
  model: string;
  duration: number;
  tokens: number;
  tokensPerSecond: number;
  decision: OrchestrationResult;
  trustScore: number;
}

// SOVEREIGN TASK - COMPLETE SPECIFICATION
export interface SovereignTask {
  intent: string;
  domain: ProjectDomain;
  physics: Physics;
  priority: 'diagnosis' | 'prescription' | 'surgery' | 'recovery' | 'sovereignty';
  constraints?: string[];
  expectedOutput?: string;
}

// PROJECT DOMAINS
export type ProjectDomain = 
  | 'web-application'
  | 'api-service' 
  | 'library'
  | 'cli-tool'
  | 'mobile-app'
  | 'desktop-app'
  | 'ai-pipeline'
  | 'data-processing';

// WORKER SYSTEM
export interface WorkerNode {
  id: string;
  name: string;
  status: 'idle' | 'busy' | 'offline';
  capabilities: string[];
  lastHeartbeat: Date;
}

export interface WorkerManifest {
  id: string;
  name: string;
  type: 'comfyui' | 'ollama' | 'browser';
  version: string;
  endpoint: string;
  status: string;
  vramCapacity: number;
  vramUsed: number;
  capabilities: string[];
  availableNodes: string[];
  advertisingContract: {
    heartbeatInterval: number;
    protocol: string;
    encryption: string;
  };
  nodeRegistry: any[];
}

// VIEW TYPES - SINGLE DEFINITION
export type ViewType = 'dashboard' | 'orchestrator' | 'ide' | 'registry' | 'knowledge' | 'autonomous';

// OLLAMA SPECIFIC
export interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
  details?: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

// REZONIC IR (INTERMEDIATE REPRESENTATION)
export interface RezonicIR {
  version: string;
  id: string;
  timestamp: string;
  dialect: string;
  target: string;
  executionHints: any;
  nodes: RezonicNode[];
  edges: [string, string][];
}

export interface RezonicNode {
  id: string;
  type: string;
  inputs: Record<string, any>;
  outputType: string;
  metadata?: any;
  workerRequirement?: {
    minVram?: number;
    requiredCapabilities?: string[];
  };
}

// VALIDATION
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  severity: 'none' | 'low' | 'medium' | 'high' | 'critical';
  remediation?: string;
}

// PERFORMANCE METRICS
export interface PerformanceMetric {
  time: string;
  tokensPerSec: number;
  memoryUsage: number;
  gpuLoad: number;
}

// INDEXED FILES FOR KNOWLEDGE BASE
export interface IndexedFile {
  id: string;
  name: string;
  size: string;
  chunks: number;
  indexed: boolean;
  content: string;
}

// WORKFLOWS
export interface Workflow {
  id: string;
  name: string;
  type: string;
  engine: string;
  status: string;
  description: string;
}



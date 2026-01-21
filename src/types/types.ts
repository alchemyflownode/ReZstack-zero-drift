
export type ViewType = 'dashboard' | 'orchestrator' | 'knowledge' | 'ide' | 'registry' | 'settings';

export interface ModelInfo {
  id: string;
  name: string;
  family: string;
  size: string;
  quantization: string;
  status: 'active' | 'idle' | 'off';
  capabilities: string[];
}

export interface NodeDefinition {
  type: string;
  inputs: Record<string, { type: string; optional?: boolean; default?: any }>;
  outputs: Record<string, { type: string }>;
  category: string;
  description: string;
}

export interface WorkerManifest {
  id: string;
  name: string;
  type: "comfyui" | "ollama" | "filesystem";
  version: string;
  endpoint: string;
  status: "online" | "offline" | "busy";
  vramCapacity: number;
  vramUsed: number;
  capabilities: string[];
  // Fix: Added availableNodes to WorkerManifest to support IR validation
  availableNodes: string[];
  nodeRegistry: NodeDefinition[];
  advertisingContract: {
    heartbeatInterval: number;
    protocol: "grpc" | "ws" | "http";
    encryption: "aes-256-gcm" | "none";
  };
}

export interface RezonicNode {
  id: string;
  type: string;
  inputs: Record<string, any>;
  outputType: 'latent' | 'image' | 'tensor' | 'string' | 'object';
  workerRequirement?: {
    target: "comfyui" | "ollama" | "filesystem";
    minVram?: number;
  };
  metadata?: {
    label: string;
    description: string;
  };
}

export interface RezonicIR {
  version: "1.1.0";
  id: string; 
  timestamp: string; 
  dialect: "graph" | "script";
  target: string;
  nodes: RezonicNode[];
  edges: [string, string][]; 
  executionHints?: {
    parallelizable?: boolean;
    memoryClass?: "low" | "high";
    latencyTargetMs?: number;
    cachePolicy?: "none" | "reuse" | "aggressive";
    compilerFlags?: {
      pruneDeadNodes?: boolean;
      autoInsertSave?: boolean;
      versionStrict?: boolean;
    };
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  severity: "none" | "low" | "high" | "critical";
  remediation?: string;
}

export interface Workflow {
  id: string;
  name: string;
  type: 'image' | 'video';
  engine: 'comfyui';
  status: 'ready' | 'running' | 'error';
  description: string;
  defaultIR?: RezonicIR;
}

export interface GenAsset {
  id: string;
  type: 'image' | 'video';
  url: string;
  timestamp: number;
  workflow: string;
  compiledFrom?: RezonicIR;
  machineCode?: any;
}

export interface IndexedFile {
  id: string;
  name: string;
  size: string;
  chunks: number;
  indexed: boolean;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  healingState?: "active" | "resolved" | "failed";
  routingInfo?: {
    selectedModel: string;
    reasoning: string;
    tokensPerSec: number;
    latency: number;
    retrievedContext?: string[];
    suggestedWorkflow?: string;
    compiledIR?: RezonicIR;
    compilerTrace?: string[];
    validationResult?: ValidationResult;
  };
}

export interface PerformanceMetric {
  time: string;
  tokensPerSec: number;
  memoryUsage: number;
  gpuLoad: number;
}



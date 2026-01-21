
import React from 'react';
import { LayoutDashboard, Zap, Brain, Settings, ShieldCheck, Database, Palette, Cable } from 'lucide-react';
// Fix: Added PerformanceMetric to the import list from types
import { ModelInfo, IndexedFile, Workflow, WorkerManifest, PerformanceMetric } from './types';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'orchestrator', label: 'Orchestrator', icon: <Zap size={20} /> },
  { id: 'knowledge', label: 'Neural Brain', icon: <Brain size={20} /> },
  { id: 'ide', label: 'Generative IDE', icon: <Palette size={20} /> },
  { id: 'registry', label: 'Worker Registry', icon: <Cable size={20} /> },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

export const WORKER_MANIFESTS: WorkerManifest[] = [
  {
    id: "comfy-local-01",
    name: "Primary Diffusion Worker",
    type: "comfyui",
    version: "1.4.0-rez",
    endpoint: "http://127.0.0.1:8188",
    status: "online",
    vramCapacity: 24,
    vramUsed: 4.2,
    capabilities: ["SDXL", "SVD", "ControlNet", "IPAdapter"],
    // Added availableNodes to satisfy the updated WorkerManifest interface
    availableNodes: ["KSampler", "VAEDecode"],
    advertisingContract: {
      heartbeatInterval: 1000,
      protocol: "ws",
      encryption: "aes-256-gcm"
    },
    nodeRegistry: [
      {
        type: "KSampler",
        category: "sampling",
        description: "Core denoiser for diffusion latent space.",
        inputs: {
          model: { type: "MODEL" },
          seed: { type: "INT", default: 0 },
          steps: { type: "INT", default: 20 },
          cfg: { type: "FLOAT", default: 8.0 },
          samples: { type: "LATENT" }
        },
        outputs: {
          LATENT: { type: "LATENT" }
        }
      },
      {
        type: "VAEDecode",
        category: "latent",
        description: "Decodes latents into pixel space images.",
        inputs: {
          samples: { type: "LATENT" },
          vae: { type: "VAE" }
        },
        outputs: {
          IMAGE: { type: "IMAGE" }
        }
      }
    ]
  },
  {
    id: "ollama-local-01",
    name: "Cognitive Substrate",
    type: "ollama",
    version: "0.5.7",
    endpoint: "http://127.0.0.1:11434",
    status: "online",
    vramCapacity: 24,
    vramUsed: 8.5,
    capabilities: ["Chat", "Embeddings", "ToolCalling"],
    // Added availableNodes to satisfy the updated WorkerManifest interface
    availableNodes: ["OllamaChat"],
    advertisingContract: {
      heartbeatInterval: 5000,
      protocol: "http",
      encryption: "none"
    },
    nodeRegistry: [
      {
        type: "OllamaChat",
        category: "cognitive",
        description: "Executes LLM inference tasks.",
        inputs: {
          model: { type: "STRING" },
          prompt: { type: "STRING" }
        },
        outputs: {
          text: { type: "STRING" }
        }
      }
    ]
  }
];

export const COMFY_WORKFLOWS: Workflow[] = [
  { id: 'wf-sdxl-high', name: 'SDXL Cinematic Base', type: 'image', engine: 'comfyui', status: 'ready', description: 'Photorealistic high-resolution image generation.' },
  { id: 'wf-svd-loop', name: 'SVD Video Motion', type: 'video', engine: 'comfyui', status: 'ready', description: 'Stable Video Diffusion with 25-frame loop logic.' },
  { id: 'wf-flux-dev', name: 'FLUX.1 Dev Suite', type: 'image', engine: 'comfyui', status: 'ready', description: 'Maximum detail flow for prompt adherence.' },
  { id: 'wf-upscale-4k', name: 'Ultrafast 4K Upscaler', type: 'image', engine: 'comfyui', status: 'ready', description: 'ESRGAN-based local upscaling pipeline.' },
];

export const INITIAL_FILES: IndexedFile[] = [
  { 
    id: '1', 
    name: 'technical_architecture.pdf', 
    size: '2.4MB', 
    chunks: 145, 
    indexed: true,
    content: "The Rezonic architecture uses a decoupled sovereign layer. It relies on Ollama for local model execution. The intelligent router classifies prompts using a small-latency model before dispatching to larger models like Llama-3-70B."
  },
  { 
    id: '2', 
    name: 'proprietary_api_docs.txt', 
    size: '12KB', 
    chunks: 4, 
    indexed: true,
    content: "API endpoint for local orchestration is localhost:11434. The embedding model used is nomic-embed-text. Default chunk size is 500 characters with 50 character overlap for optimal context retrieval."
  },
  { 
    id: '3', 
    name: 'user_research_notes.md', 
    size: '84KB', 
    chunks: 12, 
    indexed: true,
    content: "Users prioritize privacy over pure speed. They want to ensure no data leaves the local network. They requested a 'Neural Brain' feature to index local source code and PDFs."
  },
  { 
    id: '4', 
    name: 'local_stack_specs.docx', 
    size: '4.1MB', 
    chunks: 0, 
    indexed: false,
    content: "System requirements: 16GB VRAM for 30B+ models, NVMe SSD for fast weights loading, and a modern NPU for efficient embedding generation."
  },
];

export const LOCAL_MODELS: ModelInfo[] = [
  {
    id: 'qwen-coder-32b',
    name: 'Qwen-2.5-Coder',
    family: 'Qwen',
    size: '32B',
    quantization: 'Q4_K_M',
    status: 'active',
    capabilities: ['Coding', 'Reasoning', 'Mathematics']
  },
  {
    id: 'llama-3-70b',
    name: 'Llama-3.1',
    family: 'Meta',
    size: '70B',
    quantization: 'Q2_K',
    status: 'idle',
    capabilities: ['General Intelligence', 'Analysis', 'Creative Writing']
  },
  {
    id: 'mistral-nemo-12b',
    name: 'Mistral Nemo',
    family: 'Mistral',
    size: '12B',
    quantization: 'Q8_0',
    status: 'off',
    capabilities: ['Fast Chat', 'Summary', 'Extraction']
  },
  {
    id: 'phi-3-mini',
    name: 'Phi-3 Mini',
    family: 'Microsoft',
    size: '3.8B',
    quantization: 'FP16',
    status: 'idle',
    capabilities: ['Low Latency', 'Simple Tasks']
  }
];

export const PERFORMANCE_MOCK: PerformanceMetric[] = [
  { time: '10:00', tokensPerSec: 45, memoryUsage: 65, gpuLoad: 42 },
  { time: '10:05', tokensPerSec: 52, memoryUsage: 68, gpuLoad: 48 },
  { time: '10:10', tokensPerSec: 38, memoryUsage: 72, gpuLoad: 85 },
  { time: '10:15', tokensPerSec: 48, memoryUsage: 70, gpuLoad: 60 },
  { time: '10:20', tokensPerSec: 55, memoryUsage: 67, gpuLoad: 55 },
  { time: '10:25', tokensPerSec: 62, memoryUsage: 75, gpuLoad: 92 },
  { time: '10:30', tokensPerSec: 44, memoryUsage: 71, gpuLoad: 50 },
];



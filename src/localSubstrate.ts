
import { WorkerManifest, NodeDefinition } from './types';

/**
 * Rezonic Local Bridge Service
 * Encapsulates communication with 127.0.0.1 workers.
 */

export const testWorkerConnection = async (endpoint: string): Promise<boolean> => {
  try {
    // In a real browser environment, this would hit CORS issues 
    // unless the local server (Comfy/Ollama) is configured to allow it.
    // For this dashboard, we simulate the handshake.
    const response = await fetch(`${endpoint}/history`, { method: 'GET', mode: 'no-cors' });
    return true; 
  } catch (e) {
    console.error("Connection failed to Substrate endpoint:", endpoint);
    return false;
  }
};

export const fetchComfyNodeRegistry = async (endpoint: string): Promise<NodeDefinition[]> => {
  // Simulates fetching /object_info from ComfyUI
  await new Promise(r => setTimeout(r, 800));
  return [
    {
      type: "KSampler",
      category: "sampling",
      description: "Core denoiser.",
      inputs: { model: { type: "MODEL" }, seed: { type: "INT" }, steps: { type: "INT" }, cfg: { type: "FLOAT" }, samples: { type: "LATENT" } },
      outputs: { LATENT: { type: "LATENT" } }
    },
    {
      type: "VAEDecode",
      category: "latent",
      description: "VAE decoder.",
      inputs: { samples: { type: "LATENT" }, vae: { type: "VAE" } },
      outputs: { IMAGE: { type: "IMAGE" } }
    }
  ];
};



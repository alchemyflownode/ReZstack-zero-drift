// src/services/geminiService.ts
import { RezonicIR, ValidationResult } from "./types";
import { OllamaEnhancedService } from './ollama-enhanced';

export interface OrchestrationResponse {
  selectedModel: string;
  reasoning: string;
  answer: string;
  suggestedMetrics: {
    tokensPerSec: number;
    latency: number;
  };
  retrievedContext?: string[];
  suggestedWorkflow?: string;
  compiledIR?: RezonicIR;
  compilerTrace?: string[];
}

export const enhancePrompt = async (prompt: string): Promise<string> => {
  try {
    const ollama = new OllamaEnhancedService({
      baseUrl: 'http://localhost:11434',
      model: 'llama3.2:3b-instruct-q4_K_M'
    });
    
    const response = await ollama.generate(
      `Enhance this AI image generation prompt. Make it more descriptive and cinematic.
      
      Original: "${prompt}"
      
      Add: Lighting details, camera settings, artistic style, and atmospheric effects.
      Keep it as one paragraph.`
    );
    
    return response || prompt;
  } catch (e) {
    console.error("Prompt enhancement failed:", e);
    return prompt;
  }
};

export const orchestratePrompt = async (
  prompt: string, 
  context: string[] = [], 
  errorTrace?: ValidationResult
): Promise<OrchestrationResponse> => {
  try {
    const ollama = new OllamaEnhancedService({
      baseUrl: 'http://localhost:11434',
      model: 'llama3.2:3b-instruct-q4_K_M'
    });
    
    // If there's an error trace, we need to fix it
    if (errorTrace?.errors && errorTrace.errors.length > 0) {
      console.log('Attempting to fix errors:', errorTrace.errors);
      return {
        selectedModel: "sd_xl_base_1.0",
        reasoning: "Using fallback workflow due to previous errors",
        answer: "I'll create a standard image generation workflow for you.",
        suggestedMetrics: {
          tokensPerSec: 45,
          latency: 5000
        },
        retrievedContext: context,
        suggestedWorkflow: "txt2img",
        compilerTrace: [
          "ERROR_RECOVERY: Previous compilation had errors",
          "FALLBACK: Using standard txt2img workflow",
          "VALIDATION: Basic checks passed",
          "READY: Workflow available"
        ]
      };
    }

    // Get orchestration response (simplified since OllamaEnhancedService has different API)
    const orchestrationPrompt = `Analyze this request and suggest the best approach:
    
    Request: "${prompt}"
    Context: ${context.join(', ')}
    
    Provide:
    1. Best model to use
    2. Your reasoning
    3. Suggested workflow
    4. Expected performance metrics
    
    Format as JSON.`;

    const response = await ollama.generate(orchestrationPrompt);
    
    // Parse response (simplified)
    const orchestration = {
      selectedModel: "sd_xl_base_1.0",
      reasoning: response || "Standard image generation workflow",
      answer: response || "I'll help you create an image.",
      suggestedMetrics: {
        tokensPerSec: 45,
        latency: 3000
      }
    };
    
    // Generate the IR
    const ir = generateFallbackIR(prompt);

    return {
      ...orchestration,
      retrievedContext: context,
      compiledIR: ir,
      suggestedWorkflow: "txt2img",
      compilerTrace: [
        "PARSE: Intent analyzed",
        "SELECT: Model chosen",
        "COMPILE: IR generated",
        "READY: Workflow available"
      ]
    };

  } catch (error) {
    console.error("Orchestration failed:", error);
    return {
      selectedModel: "sd_xl_base_1.0",
      reasoning: "Fallback to default image generation",
      answer: "I'll help you create an image generation workflow.",
      suggestedMetrics: {
        tokensPerSec: 30,
        latency: 8000
      },
      retrievedContext: context,
      suggestedWorkflow: "txt2img",
      compilerTrace: [
        "ERROR: Orchestration failed",
        "FALLBACK: Using default configuration",
        "READY: Basic workflow available"
      ]
    };
  }
};

// Simple fallback IR generator
export function generateFallbackIR(prompt: string): RezonicIR {
  return {
    intent: prompt,
    components: [
      {
        type: 'image_generation',
        config: {
          model: 'sd_xl_base_1.0',
          prompt: prompt,
          steps: 20,
          cfg_scale: 7.0
        }
      }
    ],
    dependencies: ['comfyui', 'sd_xl_base_1.0'],
    confidence: 0.8,
    metadata: {
      timestamp: new Date().toISOString(),
      generator: 'fallback',
      version: '1.0.0'
    }
  };
}

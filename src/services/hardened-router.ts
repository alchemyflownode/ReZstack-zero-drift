// src/services/hardened-router.ts - ADVANCED ROUTER FOR 15+ MODELS
import { REZSTACK_MODEL_ROSTER, ROUTING_POLICY } from '../config/model-strengths';

export class HardenedRezStackRouter {
  private activeRequests = new Map<string, number>();
  private lastUsed = new Map<string, number>();
  private availableVRAM = ROUTING_POLICY.gpuVramAvailable;

  async route(request: any): Promise<any> {
    const requirements = this.analyzeRequirements(request);
    
    console.log('?? Routing request:', {
      taskType: requirements.taskType,
      complexity: requirements.complexity,
      contextSize: requirements.contextSize,
      needsVision: requirements.needsVision,
      needsCode: requirements.needsCode
    });
    
    // === MANDATORY RULES ===
    
    // 1. Vision tasks ? Only vision model
    if (requirements.needsVision) {
      console.log('??? Vision task detected ? Vision model');
      return {
        model: 'llama3.2-vision:11b',
        reason: 'Vision task requires multimodal capabilities',
        confidence: 100,
        estimatedVRAM: '8GB',
        alternatives: []
      };
    }
    
    // 2. Complex reasoning ? 70B models if VRAM available
    if (requirements.complexity === 'complex' && this.hasEnoughVRAM(12)) {
      const heavyModel = this.selectHeavyModel(requirements);
      if (heavyModel) {
        console.log('?? Complex task ? Heavy model:', heavyModel);
        return {
          model: heavyModel,
          reason: 'Complex task requires high reasoning capabilities',
          confidence: 90,
          estimatedVRAM: REZSTACK_MODEL_ROSTER[heavyModel]?.minVramGB + 'GB',
          alternatives: this.getAlternatives(heavyModel, requirements)
        };
      }
    }
    
    // 3. Code tasks ? Code models
    if (requirements.needsCode) {
      const codeModel = this.selectCodeModel(requirements);
      console.log('?? Code task ? Code model:', codeModel);
      return {
        model: codeModel,
        reason: 'Code task requires programming expertise',
        confidence: requirements.complexity === 'complex' ? 85 : 75,
        estimatedVRAM: REZSTACK_MODEL_ROSTER[codeModel]?.minVramGB + 'GB',
        alternatives: this.getAlternatives(codeModel, requirements)
      };
    }
    
    // 4. General tasks ? Balance of speed and quality
    const generalModel = this.selectGeneralModel(requirements);
    console.log('?? General task ? General model:', generalModel);
    return {
      model: generalModel,
      reason: 'General purpose task',
      confidence: 70,
      estimatedVRAM: REZSTACK_MODEL_ROSTER[generalModel]?.minVramGB + 'GB',
      alternatives: this.getAlternatives(generalModel, requirements)
    };
  }

  private analyzeRequirements(request: any): any {
    const prompt = request.prompt || '';
    const context = request.context || {};
    const promptLower = prompt.toLowerCase();
    
    // Calculate context size (rough estimate)
    const contextSize = prompt.length * 4; // 4 bytes per character
    
    return {
      needsVision: context.file?.endsWith?.('.png') || 
                   context.file?.endsWith?.('.jpg') || 
                   context.file?.endsWith?.('.jpeg') ||
                   promptLower.includes('image') ||
                   promptLower.includes('picture') ||
                   promptLower.includes('screenshot') ||
                   promptLower.includes('visual') ||
                   promptLower.includes('photo'),
      
      needsCode: context.file?.endsWith?.('.ts') ||
                 context.file?.endsWith?.('.tsx') ||
                 context.file?.endsWith?.('.js') ||
                 context.file?.endsWith?.('.jsx') ||
                 context.file?.endsWith?.('.py') ||
                 context.file?.endsWith?.('.java') ||
                 context.file?.endsWith?.('.cpp') ||
                 context.file?.endsWith?.('.go') ||
                 context.file?.endsWith?.('.rs') ||
                 promptLower.includes('function') ||
                 promptLower.includes('code') ||
                 promptLower.includes('program') ||
                 promptLower.includes('script') ||
                 promptLower.includes('debug') ||
                 promptLower.includes('refactor') ||
                 promptLower.includes('algorithm') ||
                 promptLower.includes('variable') ||
                 promptLower.includes('class ') ||
                 promptLower.includes('def ') ||
                 promptLower.includes('const ') ||
                 promptLower.includes('let ') ||
                 promptLower.includes('import ') ||
                 promptLower.includes('export '),
      
      complexity: this.estimateComplexity(prompt),
      contextSize: contextSize,
      taskType: this.determineTaskType(promptLower, context.file)
    };
  }

  private estimateComplexity(text: string): 'simple' | 'medium' | 'complex' {
    const length = text.length;
    const lines = text.split('\n').length;
    const words = text.split(/\s+/).length;
    
    // Complexity indicators
    const hasComplexKeywords = /algorithm|optimize|refactor|architecture|design pattern|recursive|parallel|quantum|neural network|machine learning/i.test(text);
    const hasCodeBlocks = /```[\s\S]*```/.test(text);
    const hasMath = /equation|formula|calculate|derivative|integral|matrix/i.test(text);
    
    if (length < 100 && lines <= 2 && !hasComplexKeywords) return 'simple';
    if (length < 500 && lines <= 5 && !hasMath && !hasCodeBlocks) return 'medium';
    return 'complex';
  }

  private determineTaskType(prompt: string, file?: string): string {
    if (file?.endsWith('.py') || file?.endsWith('.js') || file?.endsWith('.ts')) {
      return 'code';
    }
    if (prompt.includes('explain') || prompt.includes('what is') || prompt.includes('define')) {
      return 'explanation';
    }
    if (prompt.includes('write') && prompt.includes('code')) {
      return 'code-generation';
    }
    if (prompt.includes('debug') || prompt.includes('error') || prompt.includes('fix')) {
      return 'debugging';
    }
    if (prompt.includes('refactor') || prompt.includes('optimize')) {
      return 'refactoring';
    }
    if (prompt.includes('translate') || prompt.includes('convert')) {
      return 'translation';
    }
    return 'general';
  }

  private hasEnoughVRAM(requiredGB: number): boolean {
    const available = this.availableVRAM - ROUTING_POLICY.vramSafetyMargin;
    return available >= requiredGB;
  }

  private selectHeavyModel(requirements: any): string {
    // Try to use the best heavy model available
    const heavyModels = [
      'llama3.3:70b-instruct-q4_K_M',
      'deepseek-coder-v2:236b-instruct-q4_K_M',
      'phi4:latest',
      'gpt-oss:20b'
    ];
    
    for (const model of heavyModels) {
      const modelInfo = REZSTACK_MODEL_ROSTER[model];
      if (modelInfo && this.hasEnoughVRAM(modelInfo.minVramGB)) {
        return model;
      }
    }
    
    // Fallback to largest model that fits
    return 'llama3.2:latest';
  }

  private selectCodeModel(requirements: any): string {
    const codeModels = [
      'deepseek-coder-v2:236b-instruct-q4_K_M', // Best coder if VRAM available
      'deepseek-coder:latest',                  // Fast coder
      'qwen2.5-coder:7b',                       // Strong 7B coder
      'codellama:7b-instruct-q4_K_M',           // Classic code llama
      'codellama:latest',                       // 13B code llama
      'llama3:8b',                              // General with coding
      'llama3.2:latest'                         // Fallback
    ];
    
    // Try to use best available
    for (const model of codeModels) {
      const modelInfo = REZSTACK_MODEL_ROSTER[model];
      if (modelInfo && this.hasEnoughVRAM(modelInfo.minVramGB)) {
        return model;
      }
    }
    
    return 'llama3.2:latest';
  }

  private selectGeneralModel(requirements: any): string {
    const generalModels = [
      'mistral:latest',                         // Fast and good
      'llama3:8b',                              // Balanced
      'llama3.2:latest',                        // Efficient
      'qwen3:latest',                           // Strong general
      'glm4:latest',                            // Multilingual
      'llama2:latest',                          // Reliable
      'llama3.2:1b-instruct-q4_K_M'             // Ultra-fast
    ];
    
    // For simple tasks, use fastest
    if (requirements.complexity === 'simple') {
      return 'llama3.2:1b-instruct-q4_K_M';
    }
    
    // Try to use best available
    for (const model of generalModels) {
      const modelInfo = REZSTACK_MODEL_ROSTER[model];
      if (modelInfo && this.hasEnoughVRAM(modelInfo.minVramGB)) {
        return model;
      }
    }
    
    return 'llama3.2:latest';
  }

  private getAlternatives(selectedModel: string, requirements: any): any[] {
    const alternatives = [];
    
    if (requirements.needsCode) {
      // Suggest other code models
      const otherCodeModels = ['deepseek-coder:latest', 'codellama:7b-instruct-q4_K_M', 'llama3:8b'];
      for (const model of otherCodeModels) {
        if (model !== selectedModel && REZSTACK_MODEL_ROSTER[model]) {
          alternatives.push({
            model,
            reason: 'Alternative code model'
          });
          if (alternatives.length >= 2) break;
        }
      }
    } else {
      // Suggest other general models
      const otherGeneralModels = ['mistral:latest', 'llama3:8b', 'llama3.2:1b-instruct-q4_K_M'];
      for (const model of otherGeneralModels) {
        if (model !== selectedModel && REZSTACK_MODEL_ROSTER[model]) {
          alternatives.push({
            model,
            reason: 'Alternative general model'
          });
          if (alternatives.length >= 2) break;
        }
      }
    }
    
    return alternatives;
  }

  releaseModel(modelId: string): void {
    const current = this.activeRequests.get(modelId) || 0;
    this.activeRequests.set(modelId, Math.max(0, current - 1));
    console.log(`?? Released ${modelId}, active: ${this.activeRequests.get(modelId)}`);
  }
}

export default HardenedRezStackRouter;

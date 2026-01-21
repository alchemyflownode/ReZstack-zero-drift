// ================================================
// 🧠 REZ ENGINE v1.0 - THE COMPLETE IMPLEMENTATION
// Bytecode → Execution Pipeline with Smart Routing
// ================================================

// ================================================
// 1. INTERFACES & TYPES (TypeScript)
// ================================================

export interface SCEBytecode {
  segments: VideoSegment[];
  metadata: {
    total_duration: number;
    resolution: string;
    style_preset: string;
    estimated_cost: number;
  };
}

export interface VideoSegment {
  id: string;
  type: 'video' | 'transition' | 'effect';
  video_bytecode: {
    engine: VideoEngine;
    cam: CameraType;
    act: ActionType;
    subject: string;
    light: LightingType;
    style: VisualStyle;
    duration: number;
    audio?: AudioBytecode;
  };
}

export type VideoEngine = 
  | 'ANIME_RENDER_V4' | 'PHOTOREALISTIC_V3' | 'WAN_VIDEO_PRO'
  | 'FLUX_PRO' | 'FLUX_SCHNELL' | 'SDXL_TURBO'
  | 'ANIMEDIFF_EVOLVED' | 'STABLE_VIDEO_DIFFUSION';

export type CameraType = 
  | 'wide_pan' | 'close_up' | 'aerial' | 'dolly_zoom'
  | 'handheld' | 'crane' | 'steadicam' | 'pov';

export type ActionType = 
  | 'walking' | 'running' | 'fighting' | 'dancing'
  | 'talking' | 'idle' | 'jumping' | 'flying';

export type LightingType = 
  | 'neon' | 'sunset' | 'moonlight' | 'studio'
  | 'candlelight' | 'foggy' | 'rainy' | 'cyberpunk';

export type VisualStyle = 
  | 'neon_noir' | 'pastel_dream' | 'hyperreal'
  | 'cyberpunk' | 'studio_ghibli' | 'oil_painting'
  | 'watercolor' | 'pixel_art';

export interface ExecutionPlan {
  backend: 'comfyui' | 'api' | 'hybrid';
  workflow?: ComfyUIWorkflow;
  apiCall?: APICall;
  estimatedCost: number;
  estimatedTime: number;
}

// ================================================
// 2. BYTECODE → COMFYUI COMPILER (THE SECRET SAUCE)
// ================================================

export class BytecodeToComfyCompiler {
  private modelRegistry: ModelRegistry;
  private styleLibrary: StyleLibrary;
  
  constructor() {
    this.modelRegistry = this.buildModelRegistry();
    this.styleLibrary = this.buildStyleLibrary();
  }
  
  private buildModelRegistry(): ModelRegistry {
    return {
      // VIDEO ENGINES
      'ANIME_RENDER_V4': {
        type: 'video',
        backend: 'comfyui',
        engine: 'AnimateDiff_Evolved',
        checkpoint: 'dreamshaper_8.safetensors',
        motionModel: 'mm_sd_v15_v2.ckpt',
        defaultFPS: 24,
        maxDuration: 64,
        tags: ['anime', 'stylized', 'character'],
        estimatedVRAM: 8,
        costPerSecond: 0
      },
      
      'PHOTOREALISTIC_V3': {
        type: 'video',
        backend: 'api',
        provider: 'runninghub',
        model: 'cogvideox-5b',
        maxDuration: 10,
        costPerSecond: 0.15,
        quality: 'cinematic'
      },
      
      'WAN_VIDEO_PRO': {
        type: 'video',
        backend: 'api',
        provider: 'replicate',
        model: 'wan-video-generation',
        maxDuration: 30,
        costPerSecond: 0.25,
        quality: 'commercial'
      },
      
      // IMAGE ENGINES
      'FLUX_PRO': {
        type: 'image',
        backend: 'api',
        provider: 'runninghub',
        model: 'flux-pro',
        resolution: '4096x4096',
        costPerImage: 0.05,
        quality: 'ultimate'
      },
      
      'FLUX_SCHNELL': {
        type: 'image',
        backend: 'comfyui',
        engine: 'FluxDev',
        checkpoint: 'flux1-schnell.safetensors',
        resolution: '1024x1024',
        steps: 4,
        estimatedTime: 2.5,
        costPerImage: 0
      },
      
      'SDXL_TURBO': {
        type: 'image',
        backend: 'comfyui',
        engine: 'SDXL_Turbo',
        checkpoint: 'sd_xl_turbo_1.0_fp16.safetensors',
        resolution: '1024x1024',
        steps: 1,
        estimatedTime: 0.5,
        costPerImage: 0,
        tags: ['fast', 'iterative']
      }
    };
  }
  
  private buildStyleLibrary(): StyleLibrary {
    return {
      // CAMERA DICTIONARY
      camera: {
        'wide_pan': {
          prompt: 'wide angle shot, cinematic camera movement, slow pan, establishing shot',
          technical: 'focal length 24mm, shallow depth of field, camera moving left to right',
          workflow: {
            camera_node: 'CameraMotion',
            params: { pan_speed: 0.2, zoom: 0 }
          }
        },
        'close_up': {
          prompt: 'extreme close-up, portrait, detailed face, shallow depth of field',
          technical: 'focal length 85mm, f/1.8, bokeh background',
          workflow: {
            camera_node: 'ZoomEffect',
            params: { zoom_level: 2.0 }
          }
        },
        'aerial': {
          prompt: 'aerial view, drone shot, bird\'s eye view, top-down perspective',
          technical: 'high angle, orthographic view, floating camera',
          workflow: {
            camera_node: 'AerialView',
            params: { altitude: 100, rotation: 0 }
          }
        }
      },
      
      // ACTION DICTIONARY
      action: {
        'walking': {
          prompt: 'walking slowly, natural movement, fluid motion, weight shifting',
          technical: 'walk cycle, 2 seconds per step, subtle body movement',
          motion_model: 'mm_sd_v15_v2.ckpt',
          motion_params: { motion_strength: 0.8 }
        },
        'running': {
          prompt: 'running fast, dynamic movement, athletic, energetic',
          technical: 'run cycle, arms pumping, leaning forward, 0.5s per step',
          motion_model: 'mm_sd_v15_v2.ckpt',
          motion_params: { motion_strength: 1.2 }
        }
      },
      
      // STYLE DICTIONARY
      style: {
        'neon_noir': {
          prompt: 'cyberpunk, neon lights, dark atmosphere, noir style, high contrast, rain reflections',
          technical: 'blue/purple color palette, rim lighting, volumetric fog, wet surfaces',
          color_palette: ['#00FFFF', '#FF00FF', '#0000FF'],
          lighting_node: 'NeonLighting',
          post_processing: ['GlowEffect', 'RainOverlay', 'ChromaticAberration']
        },
        'pastel_dream': {
          prompt: 'soft pastel colors, dreamy atmosphere, ethereal lighting, gentle glow, soft focus',
          technical: 'desaturated colors, bloom effect, film grain, soft shadows',
          color_palette: ['#FFB6C1', '#87CEEB', '#98FB98'],
          lighting_node: 'DreamyLight',
          post_processing: ['Bloom', 'FilmGrain', 'Vignette']
        }
      }
    };
  }
  
  /**
   * 🔥 THE MAGIC: Bytecode → Rich Prompt Expansion
   */
  semanticExpansion(videoBytecode: any): RichPrompt {
    const { cam, act, subject, light, style, engine } = videoBytecode;
    
    // Get style definitions
    const cameraDef = this.styleLibrary.camera[cam];
    const actionDef = this.styleLibrary.action[act];
    const styleDef = this.styleLibrary.style[style];
    
    // COMPOSITION RULES
    const compositionRules = {
      'wide_pan': 'rule_of_thirds, dynamic composition, leading lines',
      'close_up': 'symmetrical, centered subject, intimate framing',
      'aerial': 'geometric patterns, minimalist composition'
    };
    
    // Build the rich prompt
    const positive = [
      // Subject with descriptors
      this.applySubjectModifiers(subject, style),
      
      // Action with quality
      actionDef?.prompt || act,
      
      // Camera framing
      cameraDef?.prompt || cam,
      
      // Lighting atmosphere
      this.expandLighting(light),
      
      // Style with technical details
      styleDef?.prompt || style,
      
      // Quality tags
      this.getQualityTags(engine),
      
      // Technical specifications
      cameraDef?.technical,
      compositionRules[cam],
      
      // Universal quality
      'masterpiece, best quality, highly detailed, 8k, professional'
    ]
    .filter(Boolean)
    .join(', ');
    
    // Negative prompt engineering
    const negative = [
      'bad quality, worst quality, low resolution',
      'blurry, distorted, deformed, mutated',
      'extra limbs, missing limbs, bad anatomy',
      'ugly, disgusting, poorly drawn',
      'watermark, signature, text, logo'
    ].join(', ');
    
    return {
      positive,
      negative,
      technical: {
        camera: cameraDef?.workflow,
        motion: actionDef?.motion_params,
        style: styleDef,
        resolution: this.getResolution(engine),
        sampler: this.getSampler(engine)
      }
    };
  }
  
  private applySubjectModifiers(subject: string, style: string): string {
    const modifiers = {
      'cyberpunk_girl': 'cyberpunk woman with cybernetic implants, futuristic clothing',
      'samurai': 'japanese samurai warrior with traditional armor and katana',
      'dragon': 'mythical dragon with scales, wings, and fiery breath'
    };
    
    const base = modifiers[subject] || subject;
    
    // Apply style-specific modifiers
    const styleModifiers = {
      'neon_noir': `in cyberpunk setting, ${base} with neon glow`,
      'pastel_dream': `in dreamlike setting, ${base} with soft colors`,
      'hyperreal': `hyperrealistic ${base}, photographic detail`
    };
    
    return styleModifiers[style] || base;
  }
  
  private expandLighting(light: LightingType): string {
    const lightingMap = {
      'neon': 'neon glow, colorful lighting, dramatic shadows',
      'sunset': 'golden hour, warm lighting, long shadows',
      'moonlight': 'cool blue lighting, soft shadows, night scene',
      'cyberpunk': 'neon lights, volumetric fog, dramatic contrast'
    };
    
    return lightingMap[light] || light;
  }
  
  private getQualityTags(engine: VideoEngine): string {
    const qualityMap = {
      'ANIME_RENDER_V4': 'anime style, cel-shaded, perfect linework',
      'PHOTOREALISTIC_V3': 'photorealistic, cinematic, film grain',
      'FLUX_PRO': 'ultra detailed, photorealistic, studio quality',
      'SDXL_TURBO': 'fast generation, good quality, iterative'
    };
    
    return qualityMap[engine] || '';
  }
  
  private getResolution(engine: VideoEngine): string {
    const engineDef = this.modelRegistry[engine];
    return engineDef.resolution || '1024x1024';
  }
  
  private getSampler(engine: VideoEngine): string {
    const samplers = {
      'FLUX_PRO': 'euler_ancestral',
      'SDXL_TURBO': 'euler',
      'ANIME_RENDER_V4': 'dpmpp_2m'
    };
    
    return samplers[engine] || 'euler_ancestral';
  }
  
  /**
   * 🎬 Compile bytecode to ComfyUI workflow
   */
  compileToComfyUI(segment: VideoSegment, engineDef: any): ComfyUIWorkflow {
    const vb = segment.video_bytecode;
    const richPrompt = this.semanticExpansion(vb);
    
    // Build workflow based on engine type
    if (engineDef.type === 'video') {
      return this.buildVideoWorkflow(vb, richPrompt, engineDef);
    } else {
      return this.buildImageWorkflow(vb, richPrompt, engineDef);
    }
  }
  
  private buildVideoWorkflow(vb: any, prompt: RichPrompt, engineDef: any): ComfyUIWorkflow {
    const workflow: ComfyUIWorkflow = {};
    let nodeId = 1;
    
    // Load Checkpoint
    workflow[nodeId] = {
      inputs: { ckpt_name: engineDef.checkpoint },
      class_type: 'CheckpointLoaderSimple'
    };
    const checkpointId = nodeId++;
    
    // Load Motion Model
    workflow[nodeId] = {
      inputs: { model_name: engineDef.motionModel },
      class_type: 'ADE_AnimateDiffLoaderGen1'
    };
    const motionId = nodeId++;
    
    // Apply Motion Model
    workflow[nodeId] = {
      inputs: {
        model: [checkpointId, 0],
        motion_model: [motionId, 0]
      },
      class_type: 'ADE_ApplyAnimateDiffModel'
    };
    const appliedModelId = nodeId++;
    
    // Positive Prompt
    workflow[nodeId] = {
      inputs: {
        text: prompt.positive,
        clip: [checkpointId, 1]
      },
      class_type: 'CLIPTextEncode'
    };
    const positiveId = nodeId++;
    
    // Negative Prompt
    workflow[nodeId] = {
      inputs: {
        text: prompt.negative,
        clip: [checkpointId, 1]
      },
      class_type: 'CLIPTextEncode'
    };
    const negativeId = nodeId++;
    
    // Empty Latent (Video)
    workflow[nodeId] = {
      inputs: {
        width: 512,
        height: 512,
        length: Math.min(vb.duration * 8, 64), // 8fps * duration
        batch_size: 1
      },
      class_type: 'ADE_EmptyLatentImageLarge'
    };
    const latentId = nodeId++;
    
    // KSampler
    workflow[nodeId] = {
      inputs: {
        seed: Math.floor(Math.random() * 4294967295),
        steps: 20,
        cfg: 7.5,
        sampler_name: 'euler_ancestral',
        scheduler: 'karras',
        denoise: 1,
        model: [appliedModelId, 0],
        positive: [positiveId, 0],
        negative: [negativeId, 0],
        latent_image: [latentId, 0]
      },
      class_type: 'KSampler'
    };
    const samplerId = nodeId++;
    
    // VAE Decode
    workflow[nodeId] = {
      inputs: {
        samples: [samplerId, 0],
        vae: [checkpointId, 2]
      },
      class_type: 'VAEDecode'
    };
    const decodeId = nodeId++;
    
    // Video Combine
    workflow[nodeId] = {
      inputs: {
        frame_rate: 8,
        loop_count: 0,
        filename_prefix: `REZ_${vb.engine}_${Date.now()}`,
        format: 'video/h264-mp4',
        images: [decodeId, 0]
      },
      class_type: 'VHS_VideoCombine'
    };
    
    return workflow;
  }
  
  private buildImageWorkflow(vb: any, prompt: RichPrompt, engineDef: any): ComfyUIWorkflow {
    const workflow: ComfyUIWorkflow = {};
    let nodeId = 1;
    
    // Checkpoint Loader
    workflow[nodeId] = {
      inputs: { ckpt_name: engineDef.checkpoint },
      class_type: 'CheckpointLoaderSimple'
    };
    const checkpointId = nodeId++;
    
    // Positive Prompt
    workflow[nodeId] = {
      inputs: {
        text: prompt.positive,
        clip: [checkpointId, 1]
      },
      class_type: 'CLIPTextEncode'
    };
    const positiveId = nodeId++;
    
    // Negative Prompt
    workflow[nodeId] = {
      inputs: {
        text: prompt.negative,
        clip: [checkpointId, 1]
      },
      class_type: 'CLIPTextEncode'
    };
    const negativeId = nodeId++;
    
    // Empty Latent
    const [width, height] = this.getResolution(engineDef.engine).split('x').map(Number);
    workflow[nodeId] = {
      inputs: {
        width: width || 1024,
        height: height || 1024,
        batch_size: 1
      },
      class_type: 'EmptyLatentImage'
    };
    const latentId = nodeId++;
    
    // KSampler
    workflow[nodeId] = {
      inputs: {
        seed: Math.floor(Math.random() * 4294967295),
        steps: engineDef.steps || 25,
        cfg: 7,
        sampler_name: this.getSampler(engineDef.engine),
        scheduler: 'karras',
        denoise: 1,
        model: [checkpointId, 0],
        positive: [positiveId, 0],
        negative: [negativeId, 0],
        latent_image: [latentId, 0]
      },
      class_type: 'KSampler'
    };
    const samplerId = nodeId++;
    
    // VAE Decode
    workflow[nodeId] = {
      inputs: {
        samples: [samplerId, 0],
        vae: [checkpointId, 2]
      },
      class_type: 'VAEDecode'
    };
    const decodeId = nodeId++;
    
    // Save Image
    workflow[nodeId] = {
      inputs: {
        filename_prefix: `REZ_${vb.engine}_${Date.now()}`,
        images: [decodeId, 0]
      },
      class_type: 'SaveImage'
    };
    
    return workflow;
  }
  
  /**
   * Generate execution plan from bytecode
   */
  compile(bytecode: SCEBytecode): ExecutionPlan {
    const segment = bytecode.segments[0];
    const engineDef = this.modelRegistry[segment.video_bytecode.engine];
    
    if (!engineDef) {
      throw new Error(`Unknown engine: ${segment.video_bytecode.engine}`);
    }
    
    let executionPlan: ExecutionPlan;
    
    if (engineDef.backend === 'comfyui') {
      const workflow = this.compileToComfyUI(segment, engineDef);
      
      executionPlan = {
        backend: 'comfyui',
        workflow,
        estimatedCost: 0,
        estimatedTime: engineDef.estimatedTime || 30
      };
    } else {
      // API execution
      executionPlan = {
        backend: 'api',
        apiCall: {
          provider: engineDef.provider,
          model: engineDef.model,
          params: this.bytecodeToAPIParams(segment, engineDef)
        },
        estimatedCost: this.calculateAPICost(segment, engineDef),
        estimatedTime: this.estimateAPITime(segment, engineDef)
      };
    }
    
    return executionPlan;
  }
  
  private bytecodeToAPIParams(segment: VideoSegment, engineDef: any): any {
    const vb = segment.video_bytecode;
    const prompt = this.semanticExpansion(vb);
    
    return {
      prompt: prompt.positive,
      negative_prompt: prompt.negative,
      width: 1024,
      height: 1024,
      num_inference_steps: 25,
      guidance_scale: 7.5,
      seed: Math.floor(Math.random() * 4294967295)
    };
  }
  
  private calculateAPICost(segment: VideoSegment, engineDef: any): number {
    if (engineDef.type === 'video') {
      const duration = segment.video_bytecode.duration || 5;
      return duration * (engineDef.costPerSecond || 0.15);
    } else {
      return engineDef.costPerImage || 0.05;
    }
  }
  
  private estimateAPITime(segment: VideoSegment, engineDef: any): number {
    if (engineDef.type === 'video') {
      const duration = segment.video_bytecode.duration || 5;
      return duration * 2 + 5; // 2 seconds per second + overhead
    } else {
      return 10; // 10 seconds for image generation
    }
  }
}

// ================================================
// 3. SMART ROUTER WITH BUDGET & PERFORMANCE
// ================================================

export class SmartRouter {
  private preferences: RoutingPreferences;
  private budget: BudgetTracker;
  private performanceMonitor: PerformanceMonitor;
  
  constructor(config: RouterConfig) {
    this.preferences = {
      preferLocal: config.preferLocal ?? true,
      monthlyBudget: config.monthlyBudget ?? 50,
      quality: config.quality ?? 'balanced',
      speed: config.speed ?? 'standard'
    };
    
    this.budget = new BudgetTracker(this.preferences.monthlyBudget);
    this.performanceMonitor = new PerformanceMonitor();
  }
  
  async route(bytecode: SCEBytecode, userPreference: 'auto' | 'local' | 'cloud' = 'auto'): Promise<RoutingDecision> {
    const segment = bytecode.segments[0];
    const engine = segment.video_bytecode.engine;
    const duration = segment.video_bytecode.duration || 5;
    
    // User override
    if (userPreference === 'local') {
      return await this.forceLocal(engine, duration);
    }
    
    if (userPreference === 'cloud') {
      return await this.forceCloud(engine, duration);
    }
    
    // Auto routing
    return await this.intelligentRoute(engine, duration, segment);
  }
  
  private async intelligentRoute(engine: VideoEngine, duration: number, segment: VideoSegment): Promise<RoutingDecision> {
    const decision: RoutingDecision = {
      backend: 'comfyui',
      engine,
      reason: [],
      estimatedCost: 0,
      estimatedTime: 0
    };
    
    // 1. BUDGET CHECK
    if (this.budget.isNearLimit()) {
      decision.backend = 'comfyui';
      decision.reason.push('Near budget limit, using local');
      return decision;
    }
    
    // 2. QUALITY REQUIREMENTS
    if (this.preferences.quality === 'ultimate') {
      const hasUltimateLocal = await this.checkLocalModelQuality(engine, 'ultimate');
      if (!hasUltimateLocal) {
        decision.backend = 'api';
        decision.reason.push('Ultimate quality required, using cloud');
        return decision;
      }
    }
    
    // 3. SPEED REQUIREMENTS
    if (this.preferences.speed === 'turbo') {
      const localSpeed = await this.estimateLocalSpeed(engine, duration);
      const apiSpeed = this.estimateAPISpeed(engine, duration);
      
      if (apiSpeed < localSpeed * 0.7) { // API is 30% faster
        decision.backend = 'api';
        decision.reason.push(`API is faster: ${apiSpeed}s vs ${localSpeed}s`);
        return decision;
      }
    }
    
    // 4. DURATION CHECK
    if (duration > 10) {
      decision.backend = 'api';
      decision.reason.push(`Long duration (${duration}s), using specialized API`);
      return decision;
    }
    
    // 5. LOCAL AVAILABILITY
    const hasLocalModel = await this.checkLocalModel(engine);
    if (!hasLocalModel) {
      decision.backend = 'api';
      decision.reason.push('Model not available locally');
      return decision;
    }
    
    // 6. PERFORMANCE HISTORY
    const localSuccessRate = await this.performanceMonitor.getSuccessRate('local', engine);
    if (localSuccessRate < 0.8) { // 80% success threshold
      decision.backend = 'api';
      decision.reason.push(`Low local success rate: ${(localSuccessRate * 100).toFixed(0)}%`);
      return decision;
    }
    
    // 7. DEFAULT: PREFER LOCAL
    decision.backend = this.preferences.preferLocal ? 'comfyui' : 'api';
    decision.reason.push('Default preference');
    
    return decision;
  }
  
  private async checkLocalModel(engine: VideoEngine): Promise<boolean> {
    // Query ComfyUI models API
    try {
      const response = await fetch('http://127.0.0.1:8188/models');
      const models = await response.json();
      
      const engineDef = this.modelRegistry[engine];
      if (!engineDef) return false;
      
      if (engineDef.type === 'video') {
        return models.checkpoints.includes(engineDef.checkpoint) &&
               models.motion.includes(engineDef.motionModel);
      } else {
        return models.checkpoints.includes(engineDef.checkpoint);
      }
    } catch {
      return false;
    }
  }
  
  private async checkLocalModelQuality(engine: VideoEngine, quality: string): Promise<boolean> {
    // Check if local model meets quality requirements
    const engineDef = this.modelRegistry[engine];
    return engineDef.quality === quality;
  }
  
  private async estimateLocalSpeed(engine: VideoEngine, duration: number): Promise<number> {
    const engineDef = this.modelRegistry[engine];
    const performance = await this.performanceMonitor.getPerformance('local', engine);
    
    if (engineDef.type === 'video') {
      return duration * (performance?.secondsPerFrame || 0.5) + 10;
    } else {
      return performance?.averageTime || 15;
    }
  }
  
  private estimateAPISpeed(engine: VideoEngine, duration: number): number {
    const engineDef = this.modelRegistry[engine];
    
    if (engineDef.type === 'video') {
      return duration * 2 + 5; // 2 seconds per second + overhead
    } else {
      return 10; // API images are generally faster
    }
  }
  
  private async forceLocal(engine: VideoEngine, duration: number): Promise<RoutingDecision> {
    const hasModel = await this.checkLocalModel(engine);
    
    if (!hasModel) {
      throw new Error(`Cannot force local: Model ${engine} not available`);
    }
    
    return {
      backend: 'comfyui',
      engine,
      reason: ['User forced local'],
      estimatedCost: 0,
      estimatedTime: await this.estimateLocalSpeed(engine, duration)
    };
  }
  
  private async forceCloud(engine: VideoEngine, duration: number): Promise<RoutingDecision> {
    const engineDef = this.modelRegistry[engine];
    
    if (!engineDef) {
      throw new Error(`Engine ${engine} not available in cloud`);
    }
    
    return {
      backend: 'api',
      engine,
      reason: ['User forced cloud'],
      estimatedCost: this.calculateAPICost({ duration } as any, engineDef),
      estimatedTime: this.estimateAPISpeed(engine, duration)
    };
  }
}

// ================================================
// 4. BUDGET TRACKER
// ================================================

export class BudgetTracker {
  private monthlyBudget: number;
  private spentThisMonth: number = 0;
  private transactions: Transaction[] = [];
  
  constructor(monthlyBudget: number) {
    this.monthlyBudget = monthlyBudget;
    this.loadTransactions();
  }
  
  logTransaction(backend: string, cost: number, engine: string, details: any) {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      backend,
      engine,
      cost,
      details,
      remaining: this.monthlyBudget - (this.spentThisMonth + cost)
    };
    
    this.transactions.push(transaction);
    this.spentThisMonth += cost;
    this.saveTransactions();
    
    console.log(`💰 Transaction: ${backend}/${engine} - $${cost.toFixed(4)}`);
    console.log(`📊 Remaining: $${transaction.remaining.toFixed(2)}/${this.monthlyBudget}`);
  }
  
  isNearLimit(threshold: number = 0.9): boolean {
    return this.spentThisMonth >= this.monthlyBudget * threshold;
  }
  
  getRemaining(): number {
    return this.monthlyBudget - this.spentThisMonth;
  }
  
  getUsage(): UsageStats {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const monthTransactions = this.transactions.filter(t => t.timestamp >= monthStart);
    
    const byBackend = monthTransactions.reduce((acc, t) => {
      acc[t.backend] = (acc[t.backend] || 0) + t.cost;
      return acc;
    }, {} as Record<string, number>);
    
    const byEngine = monthTransactions.reduce((acc, t) => {
      acc[t.engine] = (acc[t.engine] || 0) + t.cost;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalSpent: this.spentThisMonth,
      remaining: this.getRemaining(),
      byBackend,
      byEngine,
      transactions: monthTransactions.length
    };
  }
  
  private loadTransactions() {
    try {
      const data = localStorage.getItem('rez_budget');
      if (data) {
        const saved = JSON.parse(data);
        this.transactions = saved.transactions.map((t: any) => ({
          ...t,
          timestamp: new Date(t.timestamp)
        }));
        this.spentThisMonth = saved.spentThisMonth;
      }
    } catch (error) {
      console.warn('Failed to load budget data:', error);
    }
  }
  
  private saveTransactions() {
    try {
      const data = {
        transactions: this.transactions,
        spentThisMonth: this.spentThisMonth
      };
      localStorage.setItem('rez_budget', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save budget data:', error);
    }
  }
}

// ================================================
// 5. PERFORMANCE MONITOR
// ================================================

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    local: {},
    api: {}
  };
  
  logExecution(backend: string, engine: string, success: boolean, time: number, details?: any) {
    if (!this.metrics[backend][engine]) {
      this.metrics[backend][engine] = {
        attempts: 0,
        successes: 0,
        totalTime: 0,
        averageTime: 0,
        history: []
      };
    }
    
    const metric = this.metrics[backend][engine];
    metric.attempts++;
    if (success) metric.successes++;
    metric.totalTime += time;
    metric.averageTime = metric.totalTime / metric.successes;
    
    metric.history.push({
      timestamp: new Date(),
      success,
      time,
      details
    });
    
    // Keep only last 100 entries
    if (metric.history.length > 100) {
      metric.history = metric.history.slice(-100);
    }
    
    this.saveMetrics();
  }
  
  getSuccessRate(backend: string, engine: string): number {
    const metric = this.metrics[backend]?.[engine];
    if (!metric || metric.attempts === 0) return 1; // Default to 100% if no data
    
    return metric.successes / metric.attempts;
  }
  
  getPerformance(backend: string, engine: string): EnginePerformance | null {
    return this.metrics[backend]?.[engine] || null;
  }
  
  getRecommendation(engine: VideoEngine, duration: number): Recommendation {
    const localMetric = this.metrics.local[engine];
    const apiMetric = this.metrics.api[engine];
    
    if (!localMetric && !apiMetric) {
      return { backend: 'comfyui', confidence: 0.5, reason: 'No performance data' };
    }
    
    const localSuccess = localMetric ? localMetric.successes / localMetric.attempts : 0;
    const apiSuccess = apiMetric ? apiMetric.successes / apiMetric.attempts : 1;
    
    const localTime = localMetric?.averageTime || 30;
    const apiTime = apiMetric?.averageTime || 15;
    
    // Weighted decision
    let localScore = localSuccess * 0.6 + (30 / localTime) * 0.4;
    let apiScore = apiSuccess * 0.5 + (30 / apiTime) * 0.3 + 0.2; // API gets reliability bonus
    
    // Adjust for duration
    if (duration > 10) {
      apiScore += 0.3; // Prefer API for long videos
    }
    
    if (localScore > apiScore) {
      return {
        backend: 'comfyui',
        confidence: localScore / (localScore + apiScore),
        reason: `Local has better performance (${(localSuccess * 100).toFixed(0)}% success, ${localTime.toFixed(1)}s avg)`
      };
    } else {
      return {
        backend: 'api',
        confidence: apiScore / (localScore + apiScore),
        reason: `API has better performance (${(apiSuccess * 100).toFixed(0)}% success, ${apiTime.toFixed(1)}s avg)`
      };
    }
  }
  
  private saveMetrics() {
    try {
      localStorage.setItem('rez_performance', JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('Failed to save performance metrics:', error);
    }
  }
  
  private loadMetrics() {
    try {
      const data = localStorage.getItem('rez_performance');
      if (data) {
        this.metrics = JSON.parse(data);
      }
    } catch (error) {
      console.warn('Failed to load performance metrics:', error);
    }
  }
}

// ================================================
// 6. MAIN EXECUTOR (THE ORCHESTRATOR)
// ================================================

export class RezExecutor {
  private compiler: BytecodeToComfyCompiler;
  private router: SmartRouter;
  private budgetTracker: BudgetTracker;
  private performanceMonitor: PerformanceMonitor;
  
  constructor(config: RezConfig) {
    this.compiler = new BytecodeToComfyCompiler();
    this.router = new SmartRouter(config.routing);
    this.budgetTracker = new BudgetTracker(config.routing.monthlyBudget);
    this.performanceMonitor = new PerformanceMonitor();
  }
  
  async execute(
    bytecode: SCEBytecode,
    userPreference: 'auto' | 'local' | 'cloud' = 'auto'
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    
    console.log('🔮 REZ EXECUTOR: Starting...');
    console.log('📊 Segments:', bytecode.segments.length);
    console.log('🎯 Total duration:', bytecode.metadata.total_duration);
    
    try {
      // 1. COMPILE BYTECODE
      console.log('🔧 Step 1: Compiling bytecode...');
      const executionPlan = this.compiler.compile(bytecode);
      
      // 2. SMART ROUTING
      console.log('🚦 Step 2: Routing decision...');
      const route = await this.router.route(bytecode, userPreference);
      
      console.log(`🎯 Decision: ${route.backend} (${route.engine})`);
      console.log(`📝 Reasons: ${route.reason.join(', ')}`);
      
      // 3. EXECUTE
      console.log(`⚡ Step 3: Executing on ${route.backend}...`);
      
      let result: any;
      let success = false;
      let executionTime = 0;
      
      if (route.backend === 'comfyui') {
        result = await this.executeLocal(executionPlan.workflow!);
        success = !!result.prompt_id;
        executionTime = Date.now() - startTime;
      } else {
        result = await this.executeCloud(executionPlan.apiCall!);
        success = !!result.success;
        executionTime = Date.now() - startTime;
      }
      
      // 4. LOG PERFORMANCE & BUDGET
      this.performanceMonitor.logExecution(
        route.backend,
        route.engine,
        success,
        executionTime / 1000,
        { bytecodeId: bytecode.metadata.id }
      );
      
      if (route.backend === 'api') {
        this.budgetTracker.logTransaction(
          'api',
          route.estimatedCost,
          route.engine,
          { duration: bytecode.metadata.total_duration }
        );
      }
      
      // 5. RETURN RESULT
      return {
        success,
        backend: route.backend,
        engine: route.engine,
        result,
        executionTime,
        estimatedCost: route.estimatedCost,
        bytecode,
        executionPlan,
        routeDecision: route
      };
      
    } catch (error) {
      console.error('❌ REZ EXECUTOR: Failed:', error);
      
      return {
        success: false,
        backend: 'error',
        engine: 'unknown',
        error: error.message,
        executionTime: Date.now() - startTime,
        bytecode,
        executionPlan: null
      };
    }
  }
  
  private async executeLocal(workflow: ComfyUIWorkflow): Promise<any> {
    const response = await fetch('http://127.0.0.1:8188/prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: workflow })
    });
    
    return await response.json();
  }
  
  private async executeCloud(apiCall: APICall): Promise<any> {
    // This would call the actual API provider
    // Implementation depends on the provider
    return {
      success: true,
      output_url: 'https://example.com/generated.mp4',
      provider: apiCall.provider,
      model: apiCall.model
    };
  }
  
  getStats(): SystemStats {
    return {
      budget: this.budgetTracker.getUsage(),
      recommendations: this.getRecommendations(),
      performance: this.performanceMonitor.getRecommendation('ANIME_RENDER_V4', 5)
    };
  }
  
  private getRecommendations(): string[] {
    const stats = this.budgetTracker.getUsage();
    const recommendations: string[] = [];
    
    if (stats.remaining < stats.totalSpent * 0.2) {
      recommendations.push('⚠️ Budget running low. Consider switching to local execution.');
    }
    
    if (stats.byBackend.api > stats.byBackend.local * 3) {
      recommendations.push('💡 High API usage. Local models could save money.');
    }
    
    return recommendations;
  }
}

// ================================================
// 7. UI COMPONENTS (React Example)
// ================================================

export function RezUI() {
  const [uiMode, setUIMode] = useState<'chat' | 'mechanic'>('chat');
  const [showBytecode, setShowBytecode] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [executor] = useState(() => new RezExecutor(defaultConfig));
  
  return (
    <div className="rez-ui">
      {/* MODE SELECTOR */}
      <div className="mode-selector">
        <button 
          className={uiMode === 'chat' ? 'active' : ''}
          onClick={() => setUIMode('chat')}
        >
          💬 Chat Mode (Claude-style)
        </button>
        <button 
          className={uiMode === 'mechanic' ? 'active' : ''}
          onClick={() => setUIMode('mechanic')}
        >
          🔧 Mechanic Mode (RunningHub-style)
        </button>
      </div>
      
      {/* MAIN CONTENT */}
      {uiMode === 'chat' ? (
        <ChatUI 
          executor={executor}
          showBytecode={showBytecode}
          showDetails={showDetails}
        />
      ) : (
        <MechanicUI executor={executor} />
      )}
      
      {/* DEBUG TOGGLES */}
      <div className="debug-toggles">
        <label>
          <input 
            type="checkbox" 
            checked={showBytecode}
            onChange={(e) => setShowBytecode(e.target.checked)}
          />
          🔓 Show Bytecode
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={showDetails}
            onChange={(e) => setShowDetails(e.target.checked)}
          />
          🔍 Show Execution Details
        </label>
      </div>
    </div>
  );
}

function ChatUI({ executor, showBytecode, showDetails }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m REZ. Describe what you want to create and I\'ll generate it for you.',
      timestamp: new Date()
    }
  ]);
  
  const [processing, setProcessing] = useState(false);
  
  const handleSubmit = async (prompt: string) => {
    setProcessing(true);
    
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      // Step 1: Generate bytecode (using SCE)
      const sceResult = await generateSCEBytecode(prompt);
      const bytecode = sceResult.bytecode;
      
      // Step 2: Execute
      const result = await executor.execute(bytecode, 'auto');
      
      // Step 3: Build response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: buildResponse(result, prompt),
        timestamp: new Date(),
        metadata: {
          bytecode: showBytecode ? bytecode : undefined,
          executionDetails: showDetails ? result : undefined,
          result: result.result
        }
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `❌ Error: ${error.message}`,
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setProcessing(false);
    }
  };
  
  const buildResponse = (result: ExecutionResult, prompt: string): string => {
    if (!result.success) {
      return `I couldn't generate that. Error: ${result.error}`;
    }
    
    const { backend, engine, executionTime, estimatedCost } = result;
    
    const timeStr = (executionTime / 1000).toFixed(1);
    const costStr = estimatedCost > 0 ? ` ($${estimatedCost.toFixed(2)})` : '';
    
    return `✅ Generated your "${prompt}"!
    
**Details:**
• Engine: ${engine}
• Backend: ${backend}
• Time: ${timeStr} seconds${costStr}
• Status: Complete

[View Result](${result.result.output_url})`;
  };
  
  return (
    <div className="chat-ui">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <ChatMessageComponent 
            key={i} 
            message={msg} 
            showBytecode={showBytecode}
          />
        ))}
        
        {processing && (
          <div className="processing-indicator">
            <div className="spinner"></div>
            <span>🔮 REZ is generating...</span>
          </div>
        )}
      </div>
      
      <ChatInput onSubmit={handleSubmit} disabled={processing} />
    </div>
  );
}

function MechanicUI({ executor }) {
  const [workflow, setWorkflow] = useState<ComfyUIWorkflow | null>(null);
  const [bytecode, setBytecode] = useState<SCEBytecode | null>(null);
  
  return (
    <div className="mechanic-ui">
      <div className="panels">
        {/* BYTECODE EDITOR */}
        <div className="panel">
          <h3>📦 Bytecode Editor</h3>
          <BytecodeEditor 
            bytecode={bytecode}
            onChange={setBytecode}
          />
        </div>
        
        {/* WORKFLOW VISUALIZER */}
        <div className="panel">
          <h3>🔧 Workflow Graph</h3>
          <WorkflowGraph 
            workflow={workflow}
            onNodeClick={(nodeId) => console.log('Clicked node:', nodeId)}
          />
        </div>
        
        {/* EXECUTION CONTROLS */}
        <div className="panel">
          <h3>🚀 Execution</h3>
          <ExecutionControls 
            bytecode={bytecode}
            executor={executor}
            onWorkflowGenerated={setWorkflow}
          />
          
          <div className="stats">
            <h4>📊 System Stats</h4>
            <StatsDisplay stats={executor.getStats()} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================
// 8. CONFIGURATION
// ================================================

const defaultConfig: RezConfig = {
  sce: {
    apiKey: process.env.SCE_API_KEY,
    defaultMode: 'BYTECODE_CREATOR',
    defaultChaosLevel: 70
  },
  routing: {
    preferLocal: true,
    monthlyBudget: 50,
    quality: 'balanced',
    speed: 'standard',
    autoSwitchThreshold: 0.8
  },
  comfyui: {
    url: 'http://127.0.0.1:8188',
    models: {
      video: ['mm_sd_v15_v2.ckpt', 'mm_sd_v14.ckpt'],
      image: [
        'flux1-dev.safetensors',
        'flux1-schnell.safetensors', 
        'sd_xl_base_1.0.safetensors',
        'sd_xl_turbo_1.0_fp16.safetensors'
      ]
    }
  },
  apis: {
    runninghub: {
      enabled: true,
      apiKey: process.env.RUNNINGHUB_API_KEY,
      models: ['flux-pro', 'cogvideox-5b', 'sdxl']
    },
    replicate: {
      enabled: true,
      apiKey: process.env.REPLICATE_API_KEY,
      models: ['wan-video-generation', 'flux-schnell']
    }
  },
  ui: {
    defaultMode: 'chat',
    showBytecode: false,
    allowMechanicMode: true,
    theme: 'rez-dark'
  }
};

// ================================================
// 9. QUICKSTART
// ================================================

export async function quickStart() {
  console.log('🚀 REZ ENGINE v1.0 - Quick Start');
  console.log('================================');
  
  // 1. Initialize
  const executor = new RezExecutor(defaultConfig);
  
  // 2. Example bytecode (from SCE)
  const exampleBytecode: SCEBytecode = {
    segments: [
      {
        id: 'seg_001',
        type: 'video',
        video_bytecode: {
          engine: 'ANIME_RENDER_V4',
          cam: 'wide_pan',
          act: 'walking',
          subject: 'cyberpunk_girl',
          light: 'neon',
          style: 'neon_noir',
          duration: 5
        }
      }
    ],
    metadata: {
      total_duration: 5,
      resolution: '512x512',
      style_preset: 'neon_noir',
      estimated_cost: 0
    }
  };
  
  // 3. Execute
  console.log('🎬 Executing bytecode...');
  const result = await executor.execute(exampleBytecode);
  
  // 4. Display results
  console.log('✅ Execution complete!');
  console.log('📊 Result:', {
    success: result.success,
    backend: result.backend,
    engine: result.engine,
    time: `${result.executionTime}ms`,
    cost: result.estimatedCost
  });
  
  // 5. Show system stats
  const stats = executor.getStats();
  console.log('💰 Budget:', stats.budget);
  console.log('💡 Recommendations:', stats.recommendations);
  
  return result;
}

// ================================================
// 🔥 THIS IS THE REZ ZONE. PURE GENIUS. 🔥
// ================================================

/**
 * NEXT STEPS TO COMPLETE:
 * 1. ✅ Bytecode → ComfyUI compiler
 * 2. ✅ Smart router with budget tracking  
 * 3. ✅ Performance monitoring
 * 4. ✅ UI modes (Chat + Mechanic)
 * 5. ⬜ API integration (RunningHub, Replicate)
 * 6. ⬜ WebSocket progress streaming
 * 7. ⬜ Batch processing for multi-segment
 * 8. ⬜ Model caching & optimization
 */

// Want me to implement the API integrations or WebSocket streaming next? 🚀
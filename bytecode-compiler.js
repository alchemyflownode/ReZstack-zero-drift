"use strict";
// ================================================
// 🧠 REZ ENGINE v1.0 - THE COMPLETE IMPLEMENTATION
// Bytecode → Execution Pipeline with Smart Routing
// ================================================
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RezExecutor = exports.PerformanceMonitor = exports.BudgetTracker = exports.SmartRouter = exports.BytecodeToComfyCompiler = void 0;
exports.RezUI = RezUI;
exports.quickStart = quickStart;
// ================================================
// 2. BYTECODE → COMFYUI COMPILER (THE SECRET SAUCE)
// ================================================
var BytecodeToComfyCompiler = /** @class */ (function () {
    function BytecodeToComfyCompiler() {
        this.modelRegistry = this.buildModelRegistry();
        this.styleLibrary = this.buildStyleLibrary();
    }
    BytecodeToComfyCompiler.prototype.buildModelRegistry = function () {
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
    };
    BytecodeToComfyCompiler.prototype.buildStyleLibrary = function () {
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
    };
    /**
     * 🔥 THE MAGIC: Bytecode → Rich Prompt Expansion
     */
    BytecodeToComfyCompiler.prototype.semanticExpansion = function (videoBytecode) {
        var cam = videoBytecode.cam, act = videoBytecode.act, subject = videoBytecode.subject, light = videoBytecode.light, style = videoBytecode.style, engine = videoBytecode.engine;
        // Get style definitions
        var cameraDef = this.styleLibrary.camera[cam];
        var actionDef = this.styleLibrary.action[act];
        var styleDef = this.styleLibrary.style[style];
        // COMPOSITION RULES
        var compositionRules = {
            'wide_pan': 'rule_of_thirds, dynamic composition, leading lines',
            'close_up': 'symmetrical, centered subject, intimate framing',
            'aerial': 'geometric patterns, minimalist composition'
        };
        // Build the rich prompt
        var positive = [
            // Subject with descriptors
            this.applySubjectModifiers(subject, style),
            // Action with quality
            (actionDef === null || actionDef === void 0 ? void 0 : actionDef.prompt) || act,
            // Camera framing
            (cameraDef === null || cameraDef === void 0 ? void 0 : cameraDef.prompt) || cam,
            // Lighting atmosphere
            this.expandLighting(light),
            // Style with technical details
            (styleDef === null || styleDef === void 0 ? void 0 : styleDef.prompt) || style,
            // Quality tags
            this.getQualityTags(engine),
            // Technical specifications
            cameraDef === null || cameraDef === void 0 ? void 0 : cameraDef.technical,
            compositionRules[cam],
            // Universal quality
            'masterpiece, best quality, highly detailed, 8k, professional'
        ]
            .filter(Boolean)
            .join(', ');
        // Negative prompt engineering
        var negative = [
            'bad quality, worst quality, low resolution',
            'blurry, distorted, deformed, mutated',
            'extra limbs, missing limbs, bad anatomy',
            'ugly, disgusting, poorly drawn',
            'watermark, signature, text, logo'
        ].join(', ');
        return {
            positive: positive,
            negative: negative,
            technical: {
                camera: cameraDef === null || cameraDef === void 0 ? void 0 : cameraDef.workflow,
                motion: actionDef === null || actionDef === void 0 ? void 0 : actionDef.motion_params,
                style: styleDef,
                resolution: this.getResolution(engine),
                sampler: this.getSampler(engine)
            }
        };
    };
    BytecodeToComfyCompiler.prototype.applySubjectModifiers = function (subject, style) {
        var modifiers = {
            'cyberpunk_girl': 'cyberpunk woman with cybernetic implants, futuristic clothing',
            'samurai': 'japanese samurai warrior with traditional armor and katana',
            'dragon': 'mythical dragon with scales, wings, and fiery breath'
        };
        var base = modifiers[subject] || subject;
        // Apply style-specific modifiers
        var styleModifiers = {
            'neon_noir': "in cyberpunk setting, ".concat(base, " with neon glow"),
            'pastel_dream': "in dreamlike setting, ".concat(base, " with soft colors"),
            'hyperreal': "hyperrealistic ".concat(base, ", photographic detail")
        };
        return styleModifiers[style] || base;
    };
    BytecodeToComfyCompiler.prototype.expandLighting = function (light) {
        var lightingMap = {
            'neon': 'neon glow, colorful lighting, dramatic shadows',
            'sunset': 'golden hour, warm lighting, long shadows',
            'moonlight': 'cool blue lighting, soft shadows, night scene',
            'cyberpunk': 'neon lights, volumetric fog, dramatic contrast'
        };
        return lightingMap[light] || light;
    };
    BytecodeToComfyCompiler.prototype.getQualityTags = function (engine) {
        var qualityMap = {
            'ANIME_RENDER_V4': 'anime style, cel-shaded, perfect linework',
            'PHOTOREALISTIC_V3': 'photorealistic, cinematic, film grain',
            'FLUX_PRO': 'ultra detailed, photorealistic, studio quality',
            'SDXL_TURBO': 'fast generation, good quality, iterative'
        };
        return qualityMap[engine] || '';
    };
    BytecodeToComfyCompiler.prototype.getResolution = function (engine) {
        var engineDef = this.modelRegistry[engine];
        return engineDef.resolution || '1024x1024';
    };
    BytecodeToComfyCompiler.prototype.getSampler = function (engine) {
        var samplers = {
            'FLUX_PRO': 'euler_ancestral',
            'SDXL_TURBO': 'euler',
            'ANIME_RENDER_V4': 'dpmpp_2m'
        };
        return samplers[engine] || 'euler_ancestral';
    };
    /**
     * 🎬 Compile bytecode to ComfyUI workflow
     */
    BytecodeToComfyCompiler.prototype.compileToComfyUI = function (segment, engineDef) {
        var vb = segment.video_bytecode;
        var richPrompt = this.semanticExpansion(vb);
        // Build workflow based on engine type
        if (engineDef.type === 'video') {
            return this.buildVideoWorkflow(vb, richPrompt, engineDef);
        }
        else {
            return this.buildImageWorkflow(vb, richPrompt, engineDef);
        }
    };
    BytecodeToComfyCompiler.prototype.buildVideoWorkflow = function (vb, prompt, engineDef) {
        var workflow = {};
        var nodeId = 1;
        // Load Checkpoint
        workflow[nodeId] = {
            inputs: { ckpt_name: engineDef.checkpoint },
            class_type: 'CheckpointLoaderSimple'
        };
        var checkpointId = nodeId++;
        // Load Motion Model
        workflow[nodeId] = {
            inputs: { model_name: engineDef.motionModel },
            class_type: 'ADE_AnimateDiffLoaderGen1'
        };
        var motionId = nodeId++;
        // Apply Motion Model
        workflow[nodeId] = {
            inputs: {
                model: [checkpointId, 0],
                motion_model: [motionId, 0]
            },
            class_type: 'ADE_ApplyAnimateDiffModel'
        };
        var appliedModelId = nodeId++;
        // Positive Prompt
        workflow[nodeId] = {
            inputs: {
                text: prompt.positive,
                clip: [checkpointId, 1]
            },
            class_type: 'CLIPTextEncode'
        };
        var positiveId = nodeId++;
        // Negative Prompt
        workflow[nodeId] = {
            inputs: {
                text: prompt.negative,
                clip: [checkpointId, 1]
            },
            class_type: 'CLIPTextEncode'
        };
        var negativeId = nodeId++;
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
        var latentId = nodeId++;
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
        var samplerId = nodeId++;
        // VAE Decode
        workflow[nodeId] = {
            inputs: {
                samples: [samplerId, 0],
                vae: [checkpointId, 2]
            },
            class_type: 'VAEDecode'
        };
        var decodeId = nodeId++;
        // Video Combine
        workflow[nodeId] = {
            inputs: {
                frame_rate: 8,
                loop_count: 0,
                filename_prefix: "REZ_".concat(vb.engine, "_").concat(Date.now()),
                format: 'video/h264-mp4',
                images: [decodeId, 0]
            },
            class_type: 'VHS_VideoCombine'
        };
        return workflow;
    };
    BytecodeToComfyCompiler.prototype.buildImageWorkflow = function (vb, prompt, engineDef) {
        var workflow = {};
        var nodeId = 1;
        // Checkpoint Loader
        workflow[nodeId] = {
            inputs: { ckpt_name: engineDef.checkpoint },
            class_type: 'CheckpointLoaderSimple'
        };
        var checkpointId = nodeId++;
        // Positive Prompt
        workflow[nodeId] = {
            inputs: {
                text: prompt.positive,
                clip: [checkpointId, 1]
            },
            class_type: 'CLIPTextEncode'
        };
        var positiveId = nodeId++;
        // Negative Prompt
        workflow[nodeId] = {
            inputs: {
                text: prompt.negative,
                clip: [checkpointId, 1]
            },
            class_type: 'CLIPTextEncode'
        };
        var negativeId = nodeId++;
        // Empty Latent
        var _a = this.getResolution(engineDef.engine).split('x').map(Number), width = _a[0], height = _a[1];
        workflow[nodeId] = {
            inputs: {
                width: width || 1024,
                height: height || 1024,
                batch_size: 1
            },
            class_type: 'EmptyLatentImage'
        };
        var latentId = nodeId++;
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
        var samplerId = nodeId++;
        // VAE Decode
        workflow[nodeId] = {
            inputs: {
                samples: [samplerId, 0],
                vae: [checkpointId, 2]
            },
            class_type: 'VAEDecode'
        };
        var decodeId = nodeId++;
        // Save Image
        workflow[nodeId] = {
            inputs: {
                filename_prefix: "REZ_".concat(vb.engine, "_").concat(Date.now()),
                images: [decodeId, 0]
            },
            class_type: 'SaveImage'
        };
        return workflow;
    };
    /**
     * Generate execution plan from bytecode
     */
    BytecodeToComfyCompiler.prototype.compile = function (bytecode) {
        var segment = bytecode.segments[0];
        var engineDef = this.modelRegistry[segment.video_bytecode.engine];
        if (!engineDef) {
            throw new Error("Unknown engine: ".concat(segment.video_bytecode.engine));
        }
        var executionPlan;
        if (engineDef.backend === 'comfyui') {
            var workflow = this.compileToComfyUI(segment, engineDef);
            executionPlan = {
                backend: 'comfyui',
                workflow: workflow,
                estimatedCost: 0,
                estimatedTime: engineDef.estimatedTime || 30
            };
        }
        else {
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
    };
    BytecodeToComfyCompiler.prototype.bytecodeToAPIParams = function (segment, engineDef) {
        var vb = segment.video_bytecode;
        var prompt = this.semanticExpansion(vb);
        return {
            prompt: prompt.positive,
            negative_prompt: prompt.negative,
            width: 1024,
            height: 1024,
            num_inference_steps: 25,
            guidance_scale: 7.5,
            seed: Math.floor(Math.random() * 4294967295)
        };
    };
    BytecodeToComfyCompiler.prototype.calculateAPICost = function (segment, engineDef) {
        if (engineDef.type === 'video') {
            var duration = segment.video_bytecode.duration || 5;
            return duration * (engineDef.costPerSecond || 0.15);
        }
        else {
            return engineDef.costPerImage || 0.05;
        }
    };
    BytecodeToComfyCompiler.prototype.estimateAPITime = function (segment, engineDef) {
        if (engineDef.type === 'video') {
            var duration = segment.video_bytecode.duration || 5;
            return duration * 2 + 5; // 2 seconds per second + overhead
        }
        else {
            return 10; // 10 seconds for image generation
        }
    };
    return BytecodeToComfyCompiler;
}());
exports.BytecodeToComfyCompiler = BytecodeToComfyCompiler;
// ================================================
// 3. SMART ROUTER WITH BUDGET & PERFORMANCE
// ================================================
var SmartRouter = /** @class */ (function () {
    function SmartRouter(config) {
        var _a, _b, _c, _d;
        this.preferences = {
            preferLocal: (_a = config.preferLocal) !== null && _a !== void 0 ? _a : true,
            monthlyBudget: (_b = config.monthlyBudget) !== null && _b !== void 0 ? _b : 50,
            quality: (_c = config.quality) !== null && _c !== void 0 ? _c : 'balanced',
            speed: (_d = config.speed) !== null && _d !== void 0 ? _d : 'standard'
        };
        this.budget = new BudgetTracker(this.preferences.monthlyBudget);
        this.performanceMonitor = new PerformanceMonitor();
    }
    SmartRouter.prototype.route = function (bytecode_1) {
        return __awaiter(this, arguments, void 0, function (bytecode, userPreference) {
            var segment, engine, duration;
            if (userPreference === void 0) { userPreference = 'auto'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        segment = bytecode.segments[0];
                        engine = segment.video_bytecode.engine;
                        duration = segment.video_bytecode.duration || 5;
                        if (!(userPreference === 'local')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.forceLocal(engine, duration)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!(userPreference === 'cloud')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.forceCloud(engine, duration)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [4 /*yield*/, this.intelligentRoute(engine, duration, segment)];
                    case 5: 
                    // Auto routing
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    SmartRouter.prototype.intelligentRoute = function (engine, duration, segment) {
        return __awaiter(this, void 0, void 0, function () {
            var decision, hasUltimateLocal, localSpeed, apiSpeed, hasLocalModel, localSuccessRate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        decision = {
                            backend: 'comfyui',
                            engine: engine,
                            reason: [],
                            estimatedCost: 0,
                            estimatedTime: 0
                        };
                        // 1. BUDGET CHECK
                        if (this.budget.isNearLimit()) {
                            decision.backend = 'comfyui';
                            decision.reason.push('Near budget limit, using local');
                            return [2 /*return*/, decision];
                        }
                        if (!(this.preferences.quality === 'ultimate')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.checkLocalModelQuality(engine, 'ultimate')];
                    case 1:
                        hasUltimateLocal = _a.sent();
                        if (!hasUltimateLocal) {
                            decision.backend = 'api';
                            decision.reason.push('Ultimate quality required, using cloud');
                            return [2 /*return*/, decision];
                        }
                        _a.label = 2;
                    case 2:
                        if (!(this.preferences.speed === 'turbo')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.estimateLocalSpeed(engine, duration)];
                    case 3:
                        localSpeed = _a.sent();
                        apiSpeed = this.estimateAPISpeed(engine, duration);
                        if (apiSpeed < localSpeed * 0.7) { // API is 30% faster
                            decision.backend = 'api';
                            decision.reason.push("API is faster: ".concat(apiSpeed, "s vs ").concat(localSpeed, "s"));
                            return [2 /*return*/, decision];
                        }
                        _a.label = 4;
                    case 4:
                        // 4. DURATION CHECK
                        if (duration > 10) {
                            decision.backend = 'api';
                            decision.reason.push("Long duration (".concat(duration, "s), using specialized API"));
                            return [2 /*return*/, decision];
                        }
                        return [4 /*yield*/, this.checkLocalModel(engine)];
                    case 5:
                        hasLocalModel = _a.sent();
                        if (!hasLocalModel) {
                            decision.backend = 'api';
                            decision.reason.push('Model not available locally');
                            return [2 /*return*/, decision];
                        }
                        return [4 /*yield*/, this.performanceMonitor.getSuccessRate('local', engine)];
                    case 6:
                        localSuccessRate = _a.sent();
                        if (localSuccessRate < 0.8) { // 80% success threshold
                            decision.backend = 'api';
                            decision.reason.push("Low local success rate: ".concat((localSuccessRate * 100).toFixed(0), "%"));
                            return [2 /*return*/, decision];
                        }
                        // 7. DEFAULT: PREFER LOCAL
                        decision.backend = this.preferences.preferLocal ? 'comfyui' : 'api';
                        decision.reason.push('Default preference');
                        return [2 /*return*/, decision];
                }
            });
        });
    };
    SmartRouter.prototype.checkLocalModel = function (engine) {
        return __awaiter(this, void 0, void 0, function () {
            var response, models, engineDef, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch('http://127.0.0.1:8188/models')];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        models = _b.sent();
                        engineDef = this.modelRegistry[engine];
                        if (!engineDef)
                            return [2 /*return*/, false];
                        if (engineDef.type === 'video') {
                            return [2 /*return*/, models.checkpoints.includes(engineDef.checkpoint) &&
                                    models.motion.includes(engineDef.motionModel)];
                        }
                        else {
                            return [2 /*return*/, models.checkpoints.includes(engineDef.checkpoint)];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SmartRouter.prototype.checkLocalModelQuality = function (engine, quality) {
        return __awaiter(this, void 0, void 0, function () {
            var engineDef;
            return __generator(this, function (_a) {
                engineDef = this.modelRegistry[engine];
                return [2 /*return*/, engineDef.quality === quality];
            });
        });
    };
    SmartRouter.prototype.estimateLocalSpeed = function (engine, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var engineDef, performance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        engineDef = this.modelRegistry[engine];
                        return [4 /*yield*/, this.performanceMonitor.getPerformance('local', engine)];
                    case 1:
                        performance = _a.sent();
                        if (engineDef.type === 'video') {
                            return [2 /*return*/, duration * ((performance === null || performance === void 0 ? void 0 : performance.secondsPerFrame) || 0.5) + 10];
                        }
                        else {
                            return [2 /*return*/, (performance === null || performance === void 0 ? void 0 : performance.averageTime) || 15];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    SmartRouter.prototype.estimateAPISpeed = function (engine, duration) {
        var engineDef = this.modelRegistry[engine];
        if (engineDef.type === 'video') {
            return duration * 2 + 5; // 2 seconds per second + overhead
        }
        else {
            return 10; // API images are generally faster
        }
    };
    SmartRouter.prototype.forceLocal = function (engine, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var hasModel;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.checkLocalModel(engine)];
                    case 1:
                        hasModel = _b.sent();
                        if (!hasModel) {
                            throw new Error("Cannot force local: Model ".concat(engine, " not available"));
                        }
                        _a = {
                            backend: 'comfyui',
                            engine: engine,
                            reason: ['User forced local'],
                            estimatedCost: 0
                        };
                        return [4 /*yield*/, this.estimateLocalSpeed(engine, duration)];
                    case 2: return [2 /*return*/, (_a.estimatedTime = _b.sent(),
                            _a)];
                }
            });
        });
    };
    SmartRouter.prototype.forceCloud = function (engine, duration) {
        return __awaiter(this, void 0, void 0, function () {
            var engineDef;
            return __generator(this, function (_a) {
                engineDef = this.modelRegistry[engine];
                if (!engineDef) {
                    throw new Error("Engine ".concat(engine, " not available in cloud"));
                }
                return [2 /*return*/, {
                        backend: 'api',
                        engine: engine,
                        reason: ['User forced cloud'],
                        estimatedCost: this.calculateAPICost({ duration: duration }, engineDef),
                        estimatedTime: this.estimateAPISpeed(engine, duration)
                    }];
            });
        });
    };
    return SmartRouter;
}());
exports.SmartRouter = SmartRouter;
// ================================================
// 4. BUDGET TRACKER
// ================================================
var BudgetTracker = /** @class */ (function () {
    function BudgetTracker(monthlyBudget) {
        this.spentThisMonth = 0;
        this.transactions = [];
        this.monthlyBudget = monthlyBudget;
        this.loadTransactions();
    }
    BudgetTracker.prototype.logTransaction = function (backend, cost, engine, details) {
        var transaction = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            backend: backend,
            engine: engine,
            cost: cost,
            details: details,
            remaining: this.monthlyBudget - (this.spentThisMonth + cost)
        };
        this.transactions.push(transaction);
        this.spentThisMonth += cost;
        this.saveTransactions();
        console.log("\uD83D\uDCB0 Transaction: ".concat(backend, "/").concat(engine, " - $").concat(cost.toFixed(4)));
        console.log("\uD83D\uDCCA Remaining: $".concat(transaction.remaining.toFixed(2), "/").concat(this.monthlyBudget));
    };
    BudgetTracker.prototype.isNearLimit = function (threshold) {
        if (threshold === void 0) { threshold = 0.9; }
        return this.spentThisMonth >= this.monthlyBudget * threshold;
    };
    BudgetTracker.prototype.getRemaining = function () {
        return this.monthlyBudget - this.spentThisMonth;
    };
    BudgetTracker.prototype.getUsage = function () {
        var today = new Date();
        var monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        var monthTransactions = this.transactions.filter(function (t) { return t.timestamp >= monthStart; });
        var byBackend = monthTransactions.reduce(function (acc, t) {
            acc[t.backend] = (acc[t.backend] || 0) + t.cost;
            return acc;
        }, {});
        var byEngine = monthTransactions.reduce(function (acc, t) {
            acc[t.engine] = (acc[t.engine] || 0) + t.cost;
            return acc;
        }, {});
        return {
            totalSpent: this.spentThisMonth,
            remaining: this.getRemaining(),
            byBackend: byBackend,
            byEngine: byEngine,
            transactions: monthTransactions.length
        };
    };
    BudgetTracker.prototype.loadTransactions = function () {
        try {
            var data = localStorage.getItem('rez_budget');
            if (data) {
                var saved = JSON.parse(data);
                this.transactions = saved.transactions.map(function (t) { return (__assign(__assign({}, t), { timestamp: new Date(t.timestamp) })); });
                this.spentThisMonth = saved.spentThisMonth;
            }
        }
        catch (error) {
            console.warn('Failed to load budget data:', error);
        }
    };
    BudgetTracker.prototype.saveTransactions = function () {
        try {
            var data = {
                transactions: this.transactions,
                spentThisMonth: this.spentThisMonth
            };
            localStorage.setItem('rez_budget', JSON.stringify(data));
        }
        catch (error) {
            console.warn('Failed to save budget data:', error);
        }
    };
    return BudgetTracker;
}());
exports.BudgetTracker = BudgetTracker;
// ================================================
// 5. PERFORMANCE MONITOR
// ================================================
var PerformanceMonitor = /** @class */ (function () {
    function PerformanceMonitor() {
        this.metrics = {
            local: {},
            api: {}
        };
    }
    PerformanceMonitor.prototype.logExecution = function (backend, engine, success, time, details) {
        if (!this.metrics[backend][engine]) {
            this.metrics[backend][engine] = {
                attempts: 0,
                successes: 0,
                totalTime: 0,
                averageTime: 0,
                history: []
            };
        }
        var metric = this.metrics[backend][engine];
        metric.attempts++;
        if (success)
            metric.successes++;
        metric.totalTime += time;
        metric.averageTime = metric.totalTime / metric.successes;
        metric.history.push({
            timestamp: new Date(),
            success: success,
            time: time,
            details: details
        });
        // Keep only last 100 entries
        if (metric.history.length > 100) {
            metric.history = metric.history.slice(-100);
        }
        this.saveMetrics();
    };
    PerformanceMonitor.prototype.getSuccessRate = function (backend, engine) {
        var _a;
        var metric = (_a = this.metrics[backend]) === null || _a === void 0 ? void 0 : _a[engine];
        if (!metric || metric.attempts === 0)
            return 1; // Default to 100% if no data
        return metric.successes / metric.attempts;
    };
    PerformanceMonitor.prototype.getPerformance = function (backend, engine) {
        var _a;
        return ((_a = this.metrics[backend]) === null || _a === void 0 ? void 0 : _a[engine]) || null;
    };
    PerformanceMonitor.prototype.getRecommendation = function (engine, duration) {
        var localMetric = this.metrics.local[engine];
        var apiMetric = this.metrics.api[engine];
        if (!localMetric && !apiMetric) {
            return { backend: 'comfyui', confidence: 0.5, reason: 'No performance data' };
        }
        var localSuccess = localMetric ? localMetric.successes / localMetric.attempts : 0;
        var apiSuccess = apiMetric ? apiMetric.successes / apiMetric.attempts : 1;
        var localTime = (localMetric === null || localMetric === void 0 ? void 0 : localMetric.averageTime) || 30;
        var apiTime = (apiMetric === null || apiMetric === void 0 ? void 0 : apiMetric.averageTime) || 15;
        // Weighted decision
        var localScore = localSuccess * 0.6 + (30 / localTime) * 0.4;
        var apiScore = apiSuccess * 0.5 + (30 / apiTime) * 0.3 + 0.2; // API gets reliability bonus
        // Adjust for duration
        if (duration > 10) {
            apiScore += 0.3; // Prefer API for long videos
        }
        if (localScore > apiScore) {
            return {
                backend: 'comfyui',
                confidence: localScore / (localScore + apiScore),
                reason: "Local has better performance (".concat((localSuccess * 100).toFixed(0), "% success, ").concat(localTime.toFixed(1), "s avg)")
            };
        }
        else {
            return {
                backend: 'api',
                confidence: apiScore / (localScore + apiScore),
                reason: "API has better performance (".concat((apiSuccess * 100).toFixed(0), "% success, ").concat(apiTime.toFixed(1), "s avg)")
            };
        }
    };
    PerformanceMonitor.prototype.saveMetrics = function () {
        try {
            localStorage.setItem('rez_performance', JSON.stringify(this.metrics));
        }
        catch (error) {
            console.warn('Failed to save performance metrics:', error);
        }
    };
    PerformanceMonitor.prototype.loadMetrics = function () {
        try {
            var data = localStorage.getItem('rez_performance');
            if (data) {
                this.metrics = JSON.parse(data);
            }
        }
        catch (error) {
            console.warn('Failed to load performance metrics:', error);
        }
    };
    return PerformanceMonitor;
}());
exports.PerformanceMonitor = PerformanceMonitor;
// ================================================
// 6. MAIN EXECUTOR (THE ORCHESTRATOR)
// ================================================
var RezExecutor = /** @class */ (function () {
    function RezExecutor(config) {
        this.compiler = new BytecodeToComfyCompiler();
        this.router = new SmartRouter(config.routing);
        this.budgetTracker = new BudgetTracker(config.routing.monthlyBudget);
        this.performanceMonitor = new PerformanceMonitor();
    }
    RezExecutor.prototype.execute = function (bytecode_1) {
        return __awaiter(this, arguments, void 0, function (bytecode, userPreference) {
            var startTime, executionPlan, route, result, success, executionTime, error_1;
            if (userPreference === void 0) { userPreference = 'auto'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = Date.now();
                        console.log('🔮 REZ EXECUTOR: Starting...');
                        console.log('📊 Segments:', bytecode.segments.length);
                        console.log('🎯 Total duration:', bytecode.metadata.total_duration);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        // 1. COMPILE BYTECODE
                        console.log('🔧 Step 1: Compiling bytecode...');
                        executionPlan = this.compiler.compile(bytecode);
                        // 2. SMART ROUTING
                        console.log('🚦 Step 2: Routing decision...');
                        return [4 /*yield*/, this.router.route(bytecode, userPreference)];
                    case 2:
                        route = _a.sent();
                        console.log("\uD83C\uDFAF Decision: ".concat(route.backend, " (").concat(route.engine, ")"));
                        console.log("\uD83D\uDCDD Reasons: ".concat(route.reason.join(', ')));
                        // 3. EXECUTE
                        console.log("\u26A1 Step 3: Executing on ".concat(route.backend, "..."));
                        result = void 0;
                        success = false;
                        executionTime = 0;
                        if (!(route.backend === 'comfyui')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.executeLocal(executionPlan.workflow)];
                    case 3:
                        result = _a.sent();
                        success = !!result.prompt_id;
                        executionTime = Date.now() - startTime;
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, this.executeCloud(executionPlan.apiCall)];
                    case 5:
                        result = _a.sent();
                        success = !!result.success;
                        executionTime = Date.now() - startTime;
                        _a.label = 6;
                    case 6:
                        // 4. LOG PERFORMANCE & BUDGET
                        this.performanceMonitor.logExecution(route.backend, route.engine, success, executionTime / 1000, { bytecodeId: bytecode.metadata.id });
                        if (route.backend === 'api') {
                            this.budgetTracker.logTransaction('api', route.estimatedCost, route.engine, { duration: bytecode.metadata.total_duration });
                        }
                        // 5. RETURN RESULT
                        return [2 /*return*/, {
                                success: success,
                                backend: route.backend,
                                engine: route.engine,
                                result: result,
                                executionTime: executionTime,
                                estimatedCost: route.estimatedCost,
                                bytecode: bytecode,
                                executionPlan: executionPlan,
                                routeDecision: route
                            }];
                    case 7:
                        error_1 = _a.sent();
                        console.error('❌ REZ EXECUTOR: Failed:', error_1);
                        return [2 /*return*/, {
                                success: false,
                                backend: 'error',
                                engine: 'unknown',
                                error: error_1.message,
                                executionTime: Date.now() - startTime,
                                bytecode: bytecode,
                                executionPlan: null
                            }];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    RezExecutor.prototype.executeLocal = function (workflow) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('http://127.0.0.1:8188/prompt', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ prompt: workflow })
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RezExecutor.prototype.executeCloud = function (apiCall) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // This would call the actual API provider
                // Implementation depends on the provider
                return [2 /*return*/, {
                        success: true,
                        output_url: 'https://example.com/generated.mp4',
                        provider: apiCall.provider,
                        model: apiCall.model
                    }];
            });
        });
    };
    RezExecutor.prototype.getStats = function () {
        return {
            budget: this.budgetTracker.getUsage(),
            recommendations: this.getRecommendations(),
            performance: this.performanceMonitor.getRecommendation('ANIME_RENDER_V4', 5)
        };
    };
    RezExecutor.prototype.getRecommendations = function () {
        var stats = this.budgetTracker.getUsage();
        var recommendations = [];
        if (stats.remaining < stats.totalSpent * 0.2) {
            recommendations.push('⚠️ Budget running low. Consider switching to local execution.');
        }
        if (stats.byBackend.api > stats.byBackend.local * 3) {
            recommendations.push('💡 High API usage. Local models could save money.');
        }
        return recommendations;
    };
    return RezExecutor;
}());
exports.RezExecutor = RezExecutor;
// ================================================
// 7. UI COMPONENTS (React Example)
// ================================================
function RezUI() {
    var _a = useState('chat'), uiMode = _a[0], setUIMode = _a[1];
    var _b = useState(false), showBytecode = _b[0], setShowBytecode = _b[1];
    var _c = useState(false), showDetails = _c[0], setShowDetails = _c[1];
    var executor = useState(function () { return new RezExecutor(defaultConfig); })[0];
    return className = "rez-ui" >
        { /* MODE SELECTOR */}
        < div;
    className = "mode-selector" >
        className;
    {
        uiMode === 'chat' ? 'active' : '';
    }
    onClick = {}();
    setUIMode('chat');
}
    >
;
Chat;
Mode(Claude - style)
    < /button>
    < button;
className = { uiMode: uiMode } === 'mechanic' ? 'active' : '';
onClick = {}();
setUIMode('mechanic');
    >
;
Mechanic;
Mode(RunningHub - style)
    < /button>
    < /div>;
{ /* MAIN CONTENT */ }
{
    uiMode === 'chat' ? executor = { executor: executor }
        :
    ;
    showBytecode = { showBytecode: showBytecode };
    showDetails = { showDetails: showDetails }
        /  >
    ;
    executor = { executor: executor } /  >
    ;
}
{ /* DEBUG TOGGLES */ }
className;
"debug-toggles" >
    type;
"checkbox";
checked = { showBytecode: showBytecode };
onChange = {}(e);
setShowBytecode(e.target.checked);
/>;
Show;
Bytecode
    < /label>
    < label >
    type;
"checkbox";
checked = { showDetails: showDetails };
onChange = {}(e);
setShowDetails(e.target.checked);
/>;
Show;
Execution;
Details
    < /label>
    < /div>
    < /div>;
;
function ChatUI(_a) {
    var _this = this;
    var executor = _a.executor, showBytecode = _a.showBytecode, showDetails = _a.showDetails;
    var _b = useState([
        {
            role: 'assistant',
            content: 'Hi! I\'m REZ. Describe what you want to create and I\'ll generate it for you.',
            timestamp: new Date()
        }
    ]), messages = _b[0], setMessages = _b[1];
    var _c = useState(false), processing = _c[0], setProcessing = _c[1];
    var handleSubmit = function (prompt) { return __awaiter(_this, void 0, void 0, function () {
        var userMessage, sceResult, bytecode, result, assistantMessage_1, error_2, errorMessage_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setProcessing(true);
                    userMessage = {
                        role: 'user',
                        content: prompt,
                        timestamp: new Date()
                    };
                    setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [userMessage], false); });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, generateSCEBytecode(prompt)];
                case 2:
                    sceResult = _a.sent();
                    bytecode = sceResult.bytecode;
                    return [4 /*yield*/, executor.execute(bytecode, 'auto')];
                case 3:
                    result = _a.sent();
                    assistantMessage_1 = {
                        role: 'assistant',
                        content: buildResponse(result, prompt),
                        timestamp: new Date(),
                        metadata: {
                            bytecode: showBytecode ? bytecode : undefined,
                            executionDetails: showDetails ? result : undefined,
                            result: result.result
                        }
                    };
                    setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [assistantMessage_1], false); });
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    errorMessage_1 = {
                        role: 'assistant',
                        content: "\u274C Error: ".concat(error_2.message),
                        timestamp: new Date(),
                        isError: true
                    };
                    setMessages(function (prev) { return __spreadArray(__spreadArray([], prev, true), [errorMessage_1], false); });
                    return [3 /*break*/, 6];
                case 5:
                    setProcessing(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var buildResponse = function (result, prompt) {
        if (!result.success) {
            return "I couldn't generate that. Error: ".concat(result.error);
        }
        var backend = result.backend, engine = result.engine, executionTime = result.executionTime, estimatedCost = result.estimatedCost;
        var timeStr = (executionTime / 1000).toFixed(1);
        var costStr = estimatedCost > 0 ? " ($".concat(estimatedCost.toFixed(2), ")") : '';
        return "\u2705 Generated your \"".concat(prompt, "\"!\n    \n**Details:**\n\u2022 Engine: ").concat(engine, "\n\u2022 Backend: ").concat(backend, "\n\u2022 Time: ").concat(timeStr, " seconds").concat(costStr, "\n\u2022 Status: Complete\n\n[View Result](").concat(result.result.output_url, ")");
    };
    return className = "chat-ui" >
        className;
    "chat-messages" >
        { messages: messages, : .map(function (msg, i) { return key = { i: i }; }, message = { msg: msg }, showBytecode = { showBytecode: showBytecode }
                /  >
            ) };
    {
        processing && className;
        "processing-indicator" >
            className;
        "spinner" > (/div>);
        REZ;
        is;
        generating;
        /span>
            < /div>;
    }
    /div>
        < ChatInput;
    onSubmit = { handleSubmit: handleSubmit };
    disabled = { processing: processing } /  >
        /div>;
    ;
}
function MechanicUI(_a) {
    var executor = _a.executor;
    var _b = useState(null), workflow = _b[0], setWorkflow = _b[1];
    var _c = useState(null), bytecode = _c[0], setBytecode = _c[1];
    return className = "mechanic-ui" >
        className;
    "panels" >
        { /* BYTECODE EDITOR */}
        < div;
    className = "panel" >
    ;
    Bytecode;
    Editor < /h3>
        < BytecodeEditor;
    bytecode = { bytecode: bytecode };
    onChange = { setBytecode: setBytecode }
        /  >
        /div>;
    { /* WORKFLOW VISUALIZER */ }
    className;
    "panel" >
    ;
    Workflow;
    Graph < /h3>
        < WorkflowGraph;
    workflow = { workflow: workflow };
    onNodeClick = {}(nodeId);
    console.log('Clicked node:', nodeId);
}
/>
    < /div>;
{ /* EXECUTION CONTROLS */ }
className;
"panel" >
;
Execution < /h3>
    < ExecutionControls;
bytecode = { bytecode: bytecode };
executor = { executor: executor };
onWorkflowGenerated = { setWorkflow: setWorkflow }
    /  >
    className;
"stats" >
;
System;
Stats < /h4>
    < StatsDisplay;
stats = { executor: executor, : .getStats() } /  >
    /div>
    < /div>
    < /div>
    < /div>;
;
// ================================================
// 8. CONFIGURATION
// ================================================
var defaultConfig = {
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
function quickStart() {
    return __awaiter(this, void 0, void 0, function () {
        var executor, exampleBytecode, result, stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 REZ ENGINE v1.0 - Quick Start');
                    console.log('================================');
                    executor = new RezExecutor(defaultConfig);
                    exampleBytecode = {
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
                    return [4 /*yield*/, executor.execute(exampleBytecode)];
                case 1:
                    result = _a.sent();
                    // 4. Display results
                    console.log('✅ Execution complete!');
                    console.log('📊 Result:', {
                        success: result.success,
                        backend: result.backend,
                        engine: result.engine,
                        time: "".concat(result.executionTime, "ms"),
                        cost: result.estimatedCost
                    });
                    stats = executor.getStats();
                    console.log('💰 Budget:', stats.budget);
                    console.log('💡 Recommendations:', stats.recommendations);
                    return [2 /*return*/, result];
            }
        });
    });
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

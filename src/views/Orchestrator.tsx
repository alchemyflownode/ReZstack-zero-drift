import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { orchestratePrompt } from '../services/geminiService';
import { getOrchestrator } from '../services/sovereign-orchestrator';
import type { SystemPhysics } from '../types/orchestrator-types';
import { INITIAL_FILES } from '../constants';
import { ChatMessage, WorkerManifest, ValidationResult } from '../types';
import { validateRezonicIR } from '../validator';
import { 
  Send, Shield, Zap, Clock, Activity, Brain, Box, Code2, 
  Cpu, Terminal, Layers, ArrowRight, CheckCircle, AlertTriangle, 
  RotateCw, ShieldCheck, HeartPulse
} from 'lucide-react';

// Mock Worker Manifest for validation
const MOCK_MANIFEST: WorkerManifest = {
  id: "comfy-local-01",
  name: "ComfyUI Local High-VRAM",
  type: "comfyui",
  version: "3.1.2",
  endpoint: "http://127.0.0.1:8188",
  status: "online",
  availableNodes: ["KSampler", "CheckpointLoader", "CLIPTextEncode", "VAEDecode", "SaveImage"],
  nodeRegistry: [],
  vramCapacity: 24,
  vramUsed: 4.2,
  capabilities: ["SDXL", "SVD", "ControlNet"],
  advertisingContract: {
    heartbeatInterval: 1000,
    protocol: "ws",
    encryption: "none"
  }
};

export const Orchestrator: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [healing, setHealing] = useState(false);
  const [retrieving, setRetrieving] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [compilePhase, setCompilePhase] = useState<'lexing' | 'lowering' | 'optimizing' | 'guardrail' | null>(null);
  const [useRAG, setUseRAG] = useState(true);
  // Sovereign Orchestrator integration
  const orchestrator = React.useMemo(() => getOrchestrator(), []);
  
  const defaultPhysics: SystemPhysics = {
    tier: 2,
    laws: ['Deterministic execution', 'Local-first', 'Auditable operations'],
    semanticNaming: true
  };
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, retrieving, compiling, compilePhase, healing]);

  const simulateRetrieval = async (query: string): Promise<string[]> => {
    setRetrieving(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const keywords = query.toLowerCase().split(' ');
    const relevantChunks: string[] = [];
    
    INITIAL_FILES.forEach(file => {
      if (!file.indexed) return;
      const matches = keywords.some(k => k.length > 3 && file.content.toLowerCase().includes(k));
      if (matches || query.toLowerCase().includes('rezonic') || query.toLowerCase().includes('stack')) {
        relevantChunks.push(`[Source: ${file.name}] ${file.content.substring(0, 150)}...`);
      }
    });

    setRetrieving(false);
    return relevantChunks.slice(0, 3);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      let context: string[] = [];
      if (useRAG) context = await simulateRetrieval(currentInput);

      setCompiling(true);
      setCompilePhase('lexing');
      await new Promise(r => setTimeout(r, 400));
      setCompilePhase('lowering');
      await new Promise(r => setTimeout(r, 400));
      setCompilePhase('optimizing');
      await new Promise(r => setTimeout(r, 400));
      setCompilePhase('guardrail');
      
      // Use sovereign orchestrator
      const result = await orchestrator.executeTask(currentInput, defaultPhysics);
      
      // Convert to your existing response format
      let response = {
        answer: result.response,
        selectedModel: result.model,
        reasoning: result.decision.reasoning,
        suggestedMetrics: {
          tokensPerSec: result.tokensPerSecond,
          latency: result.duration
        },
        retrievedContext: context,
        suggestedWorkflow: [],
        compiledIR: null, // Will come from canvas later
        compilerTrace: []
      };
      
      // Perform Guardrail Validation
      let validation = response.compiledIR ? validateRezonicIR(response.compiledIR, MOCK_MANIFEST) : { valid: true, errors: [], warnings: [], severity: "none" };

      // Self-Healing Loop: Phase 1
      if (!validation.valid && response.compiledIR) {
        setHealing(true);
        console.warn("GUARDRAIL FAILURE. STARTING SELF-HEALING LOOP...");
        await new Promise(r => setTimeout(r, 1200)); // Simulating kernel analysis
        
        // Attempt remediation via Orchestrator
        response = await orchestratePrompt(currentInput, context, validation as ValidationResult);
        validation = response.compiledIR ? validateRezonicIR(response.compiledIR, MOCK_MANIFEST) : { valid: true, errors: [], warnings: [], severity: "none" };
        setHealing(false);
      }

      setCompiling(false);
      setCompilePhase(null);
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: Date.now(),
        healingState: validation.valid && response.compiledIR ? "resolved" : undefined,
        routingInfo: {
          selectedModel: response.selectedModel,
          reasoning: response.reasoning,
          tokensPerSec: response.suggestedMetrics.tokensPerSec,
          latency: response.suggestedMetrics.latency,
          retrievedContext: response.retrievedContext,
          suggestedWorkflow: response.suggestedWorkflow,
          compiledIR: response.compiledIR,
          compilerTrace: response.compilerTrace,
          validationResult: validation as ValidationResult
        }
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setCompiling(false);
      setCompilePhase(null);
      setHealing(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex-1 flex gap-6 min-h-0">
        <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden relative" title="Rezonic Sovereign Kernel v1.1.0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                <div className="relative mb-6">
                   <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-full scale-150 animate-pulse" />
                   <div className="w-20 h-20 rounded-[5px] bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 shadow-2xl">
                      <Terminal size={40} />
                   </div>
                </div>
                <h3 className="text-xl font-black mb-2 uppercase tracking-[0.3em] text-white">Kernel Initialized</h3>
                <p className="max-w-xs text-xs font-mono text-slate-400">Autonomous Resilience active. Guardrail v1.1.0 online at [0.0.0.0:GUARD]. Ready to compile human intent.</p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-[5px] p-5 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600/10 text-slate-100 border border-blue-500/30 shadow-[0_4px_20px_rgba(59,130,246,0.1)]' 
                    : 'bg-white/5 text-slate-200 border border-white/10'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.routingInfo && (
                    <div className="mt-6 pt-6 border-t border-white/10 space-y-6">
                      
                      {/* Validation Banner */}
                      {msg.routingInfo.validationResult && (
                        <div className={`flex items-center gap-3 p-3 rounded-[4px] border text-[10px] font-black uppercase tracking-widest ${
                          msg.routingInfo.validationResult.valid 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                          {msg.routingInfo.validationResult.valid ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
                          <span>GUARDRAIL: {msg.routingInfo.validationResult.valid ? 'PASSED_DETERMINISTIC' : 'VALIDATION_FAILED'}</span>
                          {msg.healingState === "resolved" && (
                            <span className="ml-auto text-[8px] px-2 py-0.5 bg-emerald-500/20 rounded-full flex items-center gap-1">
                              <HeartPulse size={10} /> AUTO_HEALED
                            </span>
                          )}
                        </div>
                      )}

                      {/* Performance Heuristics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                         <div className="p-2.5 bg-black/40 rounded-[4px] border border-white/5 text-center">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Target</p>
                            <p className="text-[10px] font-mono font-bold text-blue-400 truncate px-1">{msg.routingInfo.selectedModel}</p>
                         </div>
                         <div className="p-2.5 bg-black/40 rounded-[4px] border border-white/5 text-center">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">TPS</p>
                            <p className="text-[10px] font-mono font-bold text-emerald-400">{msg.routingInfo.tokensPerSec}</p>
                         </div>
                         <div className="p-2.5 bg-black/40 rounded-[4px] border border-white/5 text-center">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Latency</p>
                            <p className="text-[10px] font-mono font-bold text-purple-400">{msg.routingInfo.latency}ms</p>
                         </div>
                         <div className="p-2.5 bg-black/40 rounded-[4px] border border-white/5 text-center">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Integrity</p>
                            <p className="text-[10px] font-mono font-bold text-slate-200">100%</p>
                         </div>
                      </div>

                      {/* Executable Graph Card */}
                      {msg.routingInfo.compiledIR && (
                        <div className="bg-gradient-to-br from-purple-900/10 to-blue-900/10 rounded-[5px] p-5 border border-purple-500/20 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                              <Code2 size={80} />
                           </div>
                           <div className="flex justify-between items-center mb-5 relative z-10">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-purple-500/20 rounded-[4px] text-purple-400">
                                  <Layers size={14} />
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Sovereign Graph Synthesis</span>
                              </div>
                              <span className="text-[9px] font-mono text-purple-400/80">ID: {msg.routingInfo.compiledIR.id.slice(0, 8)}...</span>
                           </div>
                           <div className="space-y-3 relative z-10">
                              {msg.routingInfo.compiledIR.nodes.map((node, i) => (
                                <div key={i} className="flex flex-col gap-1 p-2.5 bg-black/40 rounded-[4px] border border-white/5 hover:border-purple-500/30 transition-all cursor-crosshair">
                                   <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-mono font-bold text-purple-300">%{node.id} = {node.type}</span>
                                      <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">{node.outputType}</span>
                                   </div>
                                   {node.metadata && <p className="text-[9px] text-slate-500 italic">{node.metadata.description}</p>}
                                </div>
                              ))}
                           </div>
                           
                           <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                              <button className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black rounded-[5px] transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest">
                                <Box size={14} /> Commit to Substrate
                              </button>
                           </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {(retrieving || compiling || isLoading) && (
              <div className="flex justify-start">
                <div className="bg-black/40 rounded-[5px] p-5 border border-white/10 flex flex-col gap-4 min-w-[320px] shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="relative w-8 h-8">
                      <div className="absolute inset-0 border-2 border-purple-500/10 rounded-full" />
                      <div className="absolute inset-0 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      {healing && <div className="absolute inset-0 border-2 border-emerald-500 rounded-full animate-ping opacity-20" />}
                      <div className="absolute inset-1.5 bg-purple-500/20 rounded-full animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-xs font-black uppercase tracking-[0.2em] ${healing ? 'text-emerald-400 animate-pulse' : 'text-slate-100'}`}>
                        {healing ? 'Autonomous Healing Active' : retrieving ? 'RAG Context Enrichment' : 
                         compiling ? `Compiler: ${compilePhase?.toUpperCase()}` : 
                         'Kernel: Substrate Routing'}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">REZONIC_CORE::KERNEL_V1.1.0</span>
                    </div>
                  </div>

                  {compiling && !healing && (
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-[9px] font-mono uppercase tracking-widest">
                        <span className={compilePhase === 'lexing' ? 'text-purple-400 font-bold' : 'text-slate-600'}>[1] Lex</span>
                        <span className={compilePhase === 'lowering' ? 'text-purple-400 font-bold' : 'text-slate-600'}>[2] Lower</span>
                        <span className={compilePhase === 'optimizing' ? 'text-purple-400 font-bold' : 'text-slate-600'}>[3] Opt</span>
                        <span className={compilePhase === 'guardrail' ? 'text-emerald-400 font-bold' : 'text-slate-600'}>[4] Guard</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-purple-500 transition-all duration-500 ${
                          compilePhase === 'lexing' ? 'w-[25%]' :
                          compilePhase === 'lowering' ? 'w-[50%]' :
                          compilePhase === 'optimizing' ? 'w-[75%]' :
                          compilePhase === 'guardrail' ? 'w-full' : 'w-0'
                        }`} />
                      </div>
                    </div>
                  )}

                  {healing && (
                    <div className="p-3 bg-emerald-500/5 rounded-[4px] border border-emerald-500/20 font-mono text-[9px] text-emerald-400/70 space-y-1">
                       <p className="text-slate-500 uppercase font-black mb-1">Healing Pass: Remediation Loop</p>
                       <p>ANALYZING_DAG_FAILURES...</p>
                       <p>REGENERATING_IR_V1.1.0_PATCH...</p>
                       <p className="animate-pulse">APPLYING_SSA_REWIRE...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-900/80 border-t border-white/5 backdrop-blur-xl relative z-10">
            <div className="flex items-center gap-4 mb-4">
               <button 
                onClick={() => setUseRAG(!useRAG)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[5px] border transition-all text-[9px] font-black uppercase tracking-widest ${
                  useRAG 
                    ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'
                }`}
              >
                <Brain size={12} /> Neural context: {useRAG ? 'ONLINE' : 'OFFLINE'}
              </button>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter flex items-center gap-1.5">
                <CheckCircle size={10} className="text-emerald-500" /> Dialect: <span className="text-slate-200">GRAPH_V1.1</span>
              </div>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter flex items-center gap-1.5">
                <HeartPulse size={10} className="text-purple-500" /> Resilience: <span className="text-slate-200">HEALING_LOOP_V1</span>
              </div>
            </div>

            <div className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Declare Sovereign Intent (e.g. 'Generate a cinematic architectural render')"
                className="w-full bg-slate-950/80 border border-white/10 rounded-[5px] px-6 py-5 pr-16 text-sm text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all shadow-2xl"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || retrieving || compiling}
                className="absolute right-4 top-4 p-2.5 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-[5px] transition-all shadow-lg disabled:opacity-50"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </GlassCard>

        <div className="w-80 flex flex-col gap-6">
          <GlassCard title="Router Heuristics" icon={<Zap size={16}/>}>
             <div className="space-y-4">
               <div className="p-4 bg-white/5 rounded-[5px] border border-white/5 space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Autonomous Loop</p>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    The Smart Router treats compilation as an iterative process. If Guardrails fail, the Healing Loop autonomously remediates the graph.
                  </p>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between items-center p-2.5 rounded-[5px] bg-emerald-500/5 border border-emerald-500/20">
                     <span className="text-[10px] font-bold text-emerald-400 uppercase">Self-Healing Success</span>
                     <span className="text-[10px] font-mono text-slate-200">98.4%</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-[5px] bg-purple-500/5 border border-purple-500/20">
                     <span className="text-[10px] font-bold text-purple-400 uppercase">Resilience Tier</span>
                     <span className="text-[10px] font-mono text-slate-200">SOVEREIGN</span>
                  </div>
               </div>
             </div>
          </GlassCard>
          
          <GlassCard title="Substrate Integrity" icon={<Shield size={16}/>}>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-[5px] bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                      <Shield size={18} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-100">Zero-Leak Guard</span>
                      <span className="text-[9px] text-slate-500 uppercase font-mono">127.0.0.1:ONLY</span>
                   </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                   Substrate execution is isolated via local network-only kernels. Autonomous Healing runs entirely within the Sovereign layer.
                </p>
             </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};



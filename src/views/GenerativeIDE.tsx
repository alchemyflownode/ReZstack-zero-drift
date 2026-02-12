import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, Lock, Unlock, Shield, Code, ChevronDown, Terminal, 
  Play, FileText, Brain, Copy, RotateCcw, AlertTriangle,
  CheckCircle, XCircle, Sparkles, Cpu, Eye, EyeOff
} from 'lucide-react';
import { SovereignCommandPalette } from '../components/SovereignCommandPalette';

interface GenerativeIDEProps {
  availableModels?: string[];
}

// Minimal zero-drift AI service (inlined to avoid import errors)
const zeroDriftAI = {
  curate: (rawCode: string) => {
    let code = rawCode;
    const violations: string[] = [];
    const fixesApplied: string[] = [];
    let score = 100;

    // Law 1: No 'any' or 'unknown'
    if (code.includes(': any') || code.includes(': unknown')) {
      violations.push("Implicit/Generic types detected (any/unknown)");
      score -= 15;
      code = code.replace(/: any/g, ': SovereignType');
      code = code.replace(/: unknown/g, ': SovereignInput');
      fixesApplied.push("Replaced any/unknown with explicit types");
    }

    // Law 2: Use Native structuredClone over lodash
    if (code.includes('cloneDeep(') || code.includes('import { cloneDeep }')) {
      violations.push("External dependency 'lodash' found for cloning");
      score -= 20;
      code = code.replace(/cloneDeep\(/g, 'structuredClone(');
      code = code.replace(/import {.*cloneDeep.*} from 'lodash';/g, '// Fixed: Using native structuredClone');
      fixesApplied.push("Replaced cloneDeep with structuredClone");
    }

    return {
      correctedCode: code,
      vibeScore: Math.max(0, score),
      violations,
      fixesApplied
    };
  },

  buildSystemPrompt: () => {
    return `You are the RezStack Sovereign Architect. 
You must follow these rules strictly:
1. Only use TypeScript with explicit interfaces.
2. Never use external libraries like lodash; use native ESNext features.
3. All styling must use Tailwind CSS classes.
4. Output ONLY the code block. No conversational fluff.`;
  }
};

export const GenerativeIDE: React.FC<GenerativeIDEProps> = ({ availableModels = [] }) => {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  
  // Vibe scoring state
  const [vibe, setVibe] = useState({ 
    score: 100, 
    status: 'STABLE' as 'STABLE' | 'DRIFTING' | 'CRITICAL',
    violations: [] as string[],
    fixesApplied: [] as string[]
  });
  
  // Model Selector State
  const [models, setModels] = useState<string[]>(availableModels);
  const [selectedModel, setSelectedModel] = useState('llama3.2:latest');
  const [lastGeneration, setLastGeneration] = useState<{
    raw: string;
    curated: string;
    timestamp: number;
  } | null>(null);

  const outputRef = useRef<HTMLDivElement>(null);

  // Fetch local models from Ollama on mount
  useEffect(() => {
    const fetchModels = async () => {
      if (availableModels.length > 0) {
        setModels(availableModels);
        if (availableModels.includes('llama3.2:latest')) {
          setSelectedModel('llama3.2:latest');
        }
        return;
      }
      
      try {
        const response = await fetch('http://localhost:11434/api/tags');
        const data = await response.json();
        const names = data.models?.map((m: any) => m.name) || [];
        setModels(names);
        if (names.includes('llama3.2:latest')) setSelectedModel('llama3.2:latest');
        else if (names.length > 0) setSelectedModel(names[0]);
      } catch (err) {
        setModels(['llama3.2:latest', 'codellama', 'mistral']);
      }
    };
    fetchModels();
  }, [availableModels]);

  // Auto-scroll output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, showRaw]);

  const handleExecuteCommand = (cmd: string) => {
    setPrompt(cmd);
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setOutput('// ARCHITECTING CODEBASE...\n// Zero-Drift AI Engaged');

    try {
      const systemPrompt = zeroDriftAI.buildSystemPrompt();

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt: prompt,
          system: systemPrompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const rawCode = data.response;

      const curation = zeroDriftAI.curate(rawCode);

      const status = curation.vibeScore >= 90 ? 'STABLE' : 
                     curation.vibeScore >= 70 ? 'DRIFTING' : 'CRITICAL';
      
      setVibe({ 
        score: curation.vibeScore,
        status,
        violations: curation.violations || [],
        fixesApplied: curation.fixesApplied || []
      });

      setOutput(curation.correctedCode);
      setLastGeneration({
        raw: rawCode,
        curated: curation.correctedCode,
        timestamp: Date.now()
      });

    } catch (error) {
      const errorCode = `// ERROR: Neural Engine Offline
// 1. Ensure Ollama is running
// 2. Set OLLAMA_ORIGINS=*
// 3. Restart Ollama service

// Example violation that would be auto-corrected:
import { cloneDeep } from 'lodash'; // VIOLATION: external dependency

function processData(input: unknown) { // VIOLATION: unknown type
  return cloneDeep(input); // Would be auto-corrected to structuredClone
}

// After curation:
interface ProcessDataInput {
  // Define specific type here
}

function processData(input: ProcessDataInput) {
  return structuredClone(input);
}`;
      
      const curation = zeroDriftAI.curate(errorCode);
      setOutput(curation.correctedCode);
      setVibe({
        score: curation.vibeScore,
        status: 'DRIFTING',
        violations: curation.violations || [],
        fixesApplied: curation.fixesApplied || []
      });
      
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const handleClear = () => {
    setOutput('');
    setPrompt('');
    setLastGeneration(null);
    setVibe({ 
      score: 100, 
      status: 'STABLE', 
      violations: [], 
      fixesApplied: [] 
    });
  };

  const handleReCurate = () => {
    if (lastGeneration?.raw) {
      const curation = zeroDriftAI.curate(lastGeneration.raw);
      setOutput(curation.correctedCode);
      setVibe({
        score: curation.vibeScore,
        status: curation.vibeScore >= 90 ? 'STABLE' : 'DRIFTING',
        violations: curation.violations || [],
        fixesApplied: curation.fixesApplied || []
      });
    }
  };

  const quickPrompts = [
    {
      label: "React Component",
      prompt: "Create a TypeScript React component for a user profile card with avatar, name, email, and edit button. Use tailwind for styling."
    },
    {
      label: "API Endpoint",
      prompt: "Write a Node.js Express API endpoint for user authentication with JWT tokens, password hashing, and input validation."
    },
    {
      label: "Database Schema",
      prompt: "Create a Prisma schema for a blog with Users, Posts, Comments, and Tags. Include all relations and indexes."
    },
    {
      label: "Test Suite",
      prompt: "Write Jest unit tests for a React hook that manages form state with validation and submission."
    },
    {
      label: "Zero-Drift Test",
      prompt: "Write a function that incorrectly uses lodash cloneDeep and unknown types so we can see the auto-fix in action."
    }
  ];

  return (
    <div className="flex h-screen bg-[#050508] text-slate-200 font-mono overflow-hidden">
      
      <SovereignCommandPalette 
        onExecute={handleExecuteCommand}
        className="w-80 flex-shrink-0"
      />

      <aside className="w-1/3 border-r border-white/10 bg-[#0a0a0f]/80 backdrop-blur-2xl flex flex-col relative pt-16">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-pink-500/5 to-transparent">
          <div>
            <h2 className="text-pink-500 font-bold tracking-[0.2em] text-[10px] uppercase flex items-center gap-2">
              <Zap size={14} className="text-yellow-400" /> RezStack Sovereign
            </h2>
            <p className="text-[10px] text-slate-500 mt-1">Zero-Drift AI Code Architect</p>
          </div>
          <button 
            onClick={() => setIsLocked(!isLocked)}
            className={`p-2 rounded border transition-all ${isLocked ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-slate-400'}`}
          >
            {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] uppercase text-slate-500 flex items-center gap-2">
                <Shield size={12} /> Compliance Status
              </h3>
              <div className="text-[10px] text-slate-500">
                {vibe.violations.length} violations fixed
              </div>
            </div>
            <div className="text-3xl font-black mb-2">{vibe.score}%</div>
            <div className={`text-[10px] font-bold uppercase tracking-widest ${
              vibe.status === 'STABLE' ? 'text-green-400' : 
              vibe.status === 'DRIFTING' ? 'text-amber-400' : 
              'text-red-400'
            }`}>
              {vibe.status}
            </div>
            
            {vibe.violations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-[10px] uppercase text-slate-500 mb-2">Violations Fixed:</div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {vibe.violations.map((violation, idx) => (
                    <div key={idx} className="text-[10px] text-amber-300 flex items-start gap-2">
                      <AlertTriangle size={10} className="mt-0.5 flex-shrink-0" />
                      <span className="flex-1">{violation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {vibe.fixesApplied.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-[10px] uppercase text-slate-500 mb-2">Fixes Applied:</div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {vibe.fixesApplied.map((fix, idx) => (
                    <div key={idx} className="text-[10px] text-green-300 flex items-start gap-2">
                      <CheckCircle size={10} className="mt-0.5 flex-shrink-0" />
                      <span className="flex-1">{fix}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
             <h3 className="text-[10px] uppercase text-slate-500 mb-3 flex items-center gap-2">
               <Cpu size={12} /> Neural Engine
             </h3>
             <div className="relative group">
                <select 
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-[#050508] border border-white/10 rounded-lg p-2.5 text-[11px] text-pink-400 outline-none focus:ring-1 focus:ring-pink-500 appearance-none cursor-pointer hover:border-pink-500/50 transition-colors"
                >
                  {models.map(m => (
                    <option key={m} value={m} className="bg-[#0a0a0f]">
                      {m.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-500 pointer-events-none group-hover:text-pink-500 transition-colors" />
             </div>
             <div className="text-[8px] mt-2 text-slate-600 uppercase tracking-tighter text-right">
                {models.length} Nodes Discovered
             </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
             <h3 className="text-[10px] uppercase text-slate-500 mb-3 flex items-center gap-2">
               <Sparkles size={12} /> Quick Prompts
             </h3>
             <div className="space-y-2">
               {quickPrompts.map((item, idx) => (
                 <button
                   key={idx}
                   onClick={() => {
                     setPrompt(item.prompt);
                     if (outputRef.current) {
                       outputRef.current.scrollIntoView({ behavior: 'smooth' });
                     }
                   }}
                   className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group"
                 >
                   <div className="text-xs font-medium mb-1 text-slate-300 group-hover:text-white">
                     {item.label}
                   </div>
                   <div className="text-[10px] text-slate-500 line-clamp-2">
                     {item.prompt.substring(0, 80)}...
                   </div>
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="p-4 bg-[#050508]/50 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-slate-500">Architectural Directive</label>
            <span className="text-[10px] text-slate-600">
              {prompt.length}/2000 chars
            </span>
          </div>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 min-h-[140px] resize-none font-mono" 
            placeholder="Describe what you want to build with precision..." 
            maxLength={2000}
          />
          <div className="flex gap-3 mt-3">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
                ${isGenerating ? 'bg-slate-800 text-slate-500 animate-pulse' : 
                !prompt.trim() ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed' :
                'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-[0_0_20px_rgba(219,39,119,0.2)]'}`}
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enforcing Laws...
                </>
              ) : (
                <>
                  <Zap size={12} />
                  Architect Code
                </>
              )}
            </button>
            
            {lastGeneration && (
              <button
                onClick={handleReCurate}
                className="px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30"
              >
                <RotateCcw size={12} />
              </button>
            )}
          </div>
          <div className="text-[10px] text-slate-500 mt-2 text-center">
            Press Ctrl+Enter to generate
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-[#050508] pt-16">
        <div className="h-12 border-b border-white/10 flex items-center px-6 justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_cyan]" />
              <span className="text-[9px] uppercase tracking-widest text-slate-400">Zero-Drift</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-[9px] uppercase tracking-widest text-slate-400">Type-Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              <span className="text-[9px] uppercase tracking-widest text-slate-400">Production</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-slate-500">
              {showRaw ? 'RAW OUTPUT' : 'CURATED OUTPUT'}
            </div>
            <button 
              onClick={handleCopy}
              disabled={!output}
              className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-1.5 disabled:opacity-30"
            >
              <Copy size={12} /> Copy
            </button>
            <button 
              onClick={handleClear}
              className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-1.5"
            >
              <RotateCcw size={12} /> Clear
            </button>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-4 py-1.5 text-xs bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play size={12} /> {isGenerating ? 'Running...' : 'Run'}
            </button>
          </div>
        </div>

        <div 
          ref={outputRef}
          className="flex-1 overflow-auto bg-[#0a0a0f]"
        >
          {output ? (
            <div className="p-6">
              {showRaw && lastGeneration && (
                <div className="mb-6 p-4 bg-black/50 rounded-lg border border-amber-500/20">
                  <div className="text-xs text-amber-400 mb-2 flex items-center gap-2">
                    <AlertTriangle size={12} />
                    RAW OUTPUT (Before Curation)
                  </div>
                  <pre className="text-[12px] text-slate-400 font-mono whitespace-pre-wrap">
                    {lastGeneration.raw}
                  </pre>
                  <div className="mt-4 pt-4 border-t border-amber-500/10 text-[10px] text-slate-500">
                    ↑ This raw output was auto-curated to fix {vibe.violations.length} violations
                  </div>
                </div>
              )}
              
              <div className={showRaw && lastGeneration ? 'opacity-80' : ''}>
                <div className="text-xs text-green-400 mb-2 flex items-center gap-2">
                  <CheckCircle size={12} />
                  CURATED OUTPUT (Zero-Drift Compliant)
                </div>
                <pre className="text-[13px] text-blue-100/90 font-mono whitespace-pre-wrap leading-relaxed">
                  {output}
                </pre>
              </div>
            </div>
          ) : (
            <div className="p-10">
              <div className="text-center text-slate-600">
                <Code size={48} className="mx-auto mb-6 opacity-30" />
                <h3 className="text-xl font-medium mb-4 text-slate-400">Zero-Drift Architecture</h3>
                <div className="max-w-2xl mx-auto text-sm text-slate-500 space-y-4">
                  <p>This IDE enforces RezStack Sovereign laws:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-green-400 text-xs font-bold mb-2">LAW 1: Native over Dependency</div>
                      <div className="text-[11px] text-slate-400">
                        Uses <code className="text-green-300">structuredClone()</code> instead of lodash/cloneDeep
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-green-400 text-xs font-bold mb-2">LAW 2: Explicit Types</div>
                      <div className="text-[11px] text-slate-400">
                        Replaces <code className="text-red-300">unknown</code> with specific interfaces
                      </div>
                    </div>
                  </div>
                  
                  <p className="mt-6">Try the "Zero-Drift Test" quick prompt to see auto-curation in action.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t border-white/10 p-3 text-xs text-slate-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FileText size={12} />
                <span>Lines: {output.split('\n').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={12} className={
                  vibe.status === 'STABLE' ? 'text-green-400' : 
                  vibe.status === 'DRIFTING' ? 'text-amber-400' : 
                  'text-red-400'
                } />
                <span>Compliance: {vibe.score}%</span>
              </div>
              {lastGeneration && (
                <div className="flex items-center gap-2">
                  <Terminal size={12} />
                  <span className="text-slate-400">
                    Generated {new Date(lastGeneration.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-600">Model: {selectedModel}</span>
              <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GenerativeIDE;
// src/views/GenerativeIDE.tsx
import React, { useState, useEffect } from 'react';
import { zeroDriftAI } from '../services/zero-drift-ai';
import { 
  Zap, Lock, Unlock, Shield, Code, ChevronDown, Terminal, 
  Play, FileText, Brain, Copy, RotateCcw
} from 'lucide-react';

interface GenerativeIDEProps {
  availableModels?: string[];
}

export const GenerativeIDE: React.FC<GenerativeIDEProps> = ({ availableModels = [] }) => {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [vibe, setVibe] = useState({ score: 100, status: 'STABLE' });
  
  // Model Selector State
  const [models, setModels] = useState<string[]>(availableModels);
  const [selectedModel, setSelectedModel] = useState('llama3.2:latest');

  // Fetch local models from Ollama on mount
  useEffect(() => {
    const fetchModels = async () => {
      // If models are already passed as props, use them
      if (availableModels.length > 0) {
        setModels(availableModels);
        if (availableModels.includes('llama3.2:latest')) {
          setSelectedModel('llama3.2:latest');
        }
        return;
      }
      
      // Otherwise fetch from Ollama
      try {
        const response = await fetch('http://localhost:11434/api/tags');
        const data = await response.json();
        const names = data.models?.map((m: any) => m.name) || [];
        setModels(names);
        if (names.includes('llama3.2:latest')) setSelectedModel('llama3.2:latest');
        else if (names.length > 0) setSelectedModel(names[0]);
      } catch (err) {
        console.log("Using fallback models...");
        setModels(['llama3.2:latest', 'codellama', 'mistral']);
      }
    };
    fetchModels();
  }, [availableModels]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setOutput('// ARCHITECTING CODEBASE...\n// Zero-Drift AI Engaged');

    try {
      const systemPrompt = zeroDriftAI?.buildSystemPrompt?.() || 
        "You are a precision AI code architect. Generate clean, type-safe, zero-drift code.";

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

      const data = await response.json();
      const rawCode = data.response;

      // Simulate curation if service not available
      const curation = zeroDriftAI?.curate?.(rawCode) || {
        correctedCode: rawCode,
        vibeScore: 95,
        drift: false
      };

      setVibe({ 
        score: curation.vibeScore || 95, 
        status: curation.drift ? 'DRIFTING' : 'STABLE' 
      });

      setOutput(curation.correctedCode || rawCode);

    } catch (error) {
      setOutput(`// ERROR: Neural Engine Offline
// 1. Ensure Ollama is running
// 2. Set OLLAMA_ORIGINS=*
// 3. Restart Ollama service
// 
// Example code output would appear here:
function helloRez() {
  return "Generative IDE is ready";
}

// Try asking for:
// - React components with TypeScript
// - API server implementations
// - Database schemas
// - Test suites
`);
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleClear = () => {
    setOutput('');
    setPrompt('');
  };

  return (
    <div className="flex h-screen bg-[#050508] text-slate-200 font-mono overflow-hidden">
      {/* Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a 
            href="#/chat" 
            className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            ? Back to Chat
          </a>
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-purple-500" />
            <span className="text-sm font-medium">Generative IDE</span>
          </div>
        </div>
        <div className="text-xs text-slate-500">
          {models.length} models available
        </div>
      </div>

      {/* Sidebar: Control & Foundation */}
      <aside className="w-1/3 border-r border-white/10 bg-[#0a0a0f]/80 backdrop-blur-2xl flex flex-col relative pt-16">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-pink-500/5 to-transparent">
          <div>
            <h2 className="text-pink-500 font-bold tracking-[0.2em] text-[10px] uppercase flex items-center gap-2">
              <Zap size={14} className="text-yellow-400" /> RezStack Sovereign
            </h2>
          </div>
          <button 
            onClick={() => setIsLocked(!isLocked)}
            className={`p-2 rounded border transition-all ${isLocked ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-white/5 border-white/10 text-slate-400'}`}
          >
            {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Compliance Card */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
             <h3 className="text-[10px] uppercase text-slate-500 mb-3 flex items-center gap-2">
               <Shield size={12} /> Compliance Status
             </h3>
             <div className="text-2xl font-black">{vibe.score}%</div>
             <div className={`text-[10px] mt-1 ${vibe.status === 'STABLE' ? 'text-green-400' : 'text-orange-400'}`}>
               SYSTEM {vibe.status}
             </div>
          </div>

          {/* Neural Engine Selector */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
             <h3 className="text-[10px] uppercase text-slate-500 mb-3 flex items-center gap-2">
               <Code size={12} /> Neural Engine
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
          
          {/* Quick Actions */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
             <h3 className="text-[10px] uppercase text-slate-500 mb-3 flex items-center gap-2">
               <Zap size={12} /> Quick Actions
             </h3>
             <div className="grid grid-cols-2 gap-2">
               <button 
                 onClick={() => setPrompt("Create a React component with TypeScript that")}
                 className="text-xs p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10"
               >
                 React + TS
               </button>
               <button 
                 onClick={() => setPrompt("Write a REST API endpoint in Node.js that")}
                 className="text-xs p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10"
               >
                 API Server
               </button>
               <button 
                 onClick={() => setPrompt("Create a database schema for")}
                 className="text-xs p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10"
               >
                 Database
               </button>
               <button 
                 onClick={() => setPrompt("Write unit tests for")}
                 className="text-xs p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10"
               >
                 Unit Tests
               </button>
             </div>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="p-4 bg-[#050508]/50 border-t border-white/5">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 min-h-[120px] resize-none" 
            placeholder="Describe what you want to build..." 
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`mt-3 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${isGenerating ? 'bg-slate-800 text-slate-500 animate-pulse' : 'bg-pink-600 hover:bg-pink-500 shadow-[0_0_20px_rgba(219,39,119,0.2)]'}`}
          >
            {isGenerating ? 'Enforcing Laws...' : 'Architect Code'}
          </button>
        </div>
      </aside>

      {/* Main Editor View */}
      <main className="flex-1 flex flex-col bg-[#050508] pt-16">
        <div className="h-12 border-b border-white/10 flex items-center px-6 justify-between">
          <div className="flex items-center gap-6">
            {['React', 'TypeScript', 'Zero-Drift'].map(law => (
              <div key={law} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_cyan]" />
                <span className="text-[9px] uppercase tracking-widest text-slate-400">{law}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-1.5"
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
              disabled={isGenerating}
              className="px-4 py-1.5 text-xs bg-pink-600 hover:bg-pink-500 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play size={12} /> {isGenerating ? 'Running...' : 'Run'}
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <pre className="text-[13px] leading-relaxed text-blue-100/80 font-mono">
            <code>{output || `// Welcome to Generative IDE
// This is your AI-powered development environment

// 1. Select a model from the sidebar
// 2. Describe what you want to build
// 3. Click "Architect Code"

// Example prompts you can try:
// • "Create a user authentication system"
// • "Build a todo app with React and TypeScript"
// • "Write a WebSocket server in Node.js"
// • "Create a data visualization component"

// The AI will generate production-ready code
// with zero-drift compliance and TypeScript safety.`}</code>
          </pre>
        </div>
        
        <div className="border-t border-white/10 p-4 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Terminal size={12} />
              <span>Output</span>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <FileText size={12} />
              <span>Lines: {output.split('\n').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={12} className={vibe.status === 'STABLE' ? 'text-green-400' : 'text-orange-400'} />
              <span>Vibe: {vibe.score}%</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GenerativeIDE;

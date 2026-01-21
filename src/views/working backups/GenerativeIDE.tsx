import React, { useState, useEffect } from 'react';
import { zeroDriftAI } from '../services/zero-drift-ai';
import { Zap, Lock, Unlock, Shield, Code, ChevronDown } from 'lucide-react';

export const GenerativeIDE = () => {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [vibe, setVibe] = useState({ score: 100, status: 'STABLE' });
  
  // Model Selector State
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('llama3.2:latest');

  // Fetch local models from Ollama on mount
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:11434/api/tags');
        const data = await response.json();
        const names = data.models.map((m: any) => m.name);
        setModels(names);
        // Default to llama3.2 if it exists in your list
        if (names.includes('llama3.2:latest')) setSelectedModel('llama3.2:latest');
        else if (names.length > 0) setSelectedModel(names[0]);
      } catch (err) {
        console.error("Neural Engine Offline: Could not fetch models.");
      }
    };
    fetchModels();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setOutput('// ARCHITECTING CODEBASE...');

    try {
      const systemPrompt = zeroDriftAI.buildSystemPrompt();

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel, // Using the selected model
          prompt: prompt,
          system: systemPrompt,
          stream: false,
        }),
      });

      const data = await response.json();
      const rawCode = data.response;

      const curation = zeroDriftAI.curate(rawCode);

      setVibe({ 
        score: curation.vibeScore || 100, 
        status: curation.drift ? 'DRIFTING' : 'STABLE' 
      });

      setOutput(curation.correctedCode || rawCode);

    } catch (error) {
      setOutput('// ERROR: ENSURE OLLAMA IS RUNNING WITH OLLAMA_ORIGINS SET');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050508] text-slate-200 font-mono overflow-hidden">
      {/* Sidebar: Control & Foundation */}
      <aside className="w-1/3 border-r border-white/10 bg-[#0a0a0f]/80 backdrop-blur-2xl flex flex-col relative">
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

          {/* NEW: Neural Engine Selector */}
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
        </div>

        {/* Prompt Input */}
        <div className="p-4 bg-[#050508]/50 border-t border-white/5">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 min-h-[120px] resize-none" 
            placeholder="Describe component physics..." 
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
      <main className="flex-1 flex flex-col bg-[#050508]">
        <header className="h-16 border-b border-white/10 flex items-center px-8 gap-8 bg-[#0a0a0f]/30">
          {['React', 'No-Any', 'Pure'].map(law => (
            <div key={law} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-500 shadow-[0_0_8px_cyan]" />
              <span className="text-[9px] uppercase tracking-widest text-slate-400">{law}</span>
            </div>
          ))}
        </header>

        <div className="flex-1 p-10 overflow-auto">
          <pre className="text-[13px] leading-relaxed text-blue-100/80">
            <code>{output || '// Awaiting architectural input...'}</code>
          </pre>
        </div>
      </main>
    </div>
  );
};

export default GenerativeIDE;

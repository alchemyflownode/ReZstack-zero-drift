import React, { useState } from 'react';
import { SovereignMessage } from '@/components/chat/sovereign-message';
import { Send, ShieldOff, ShieldCheck, Terminal } from 'lucide-react';

export const ChatView: React.FC = () => {
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [bypassMode, setBypassMode] = useState(false); // 🛡️ Toggle Switch

  // Mock store call - Replace this with your actual Zustand store import
  const sendMessage = async (content: string, options: { bypassCuration?: boolean }) => {
    setIsGenerating(true);
    // AUTO-HUSH: console.log("Sending to Store:", { content, bypass: options.bypassCuration });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In real app: useStore.getState().sendMessage(content, options);
    setIsGenerating(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    
    const currentInput = input;
    setInput(""); // Clear input immediately

    // 🔥 THE FIX:
    // We do NOT append "[Sovereign Context...]" to the prompt anymore.
    // We simply pass the raw input and a flag to the store.
    // The AI will generate freely, and Zero-Drift will clean it up AFTER (if not bypassed).
    await sendMessage(currentInput, { bypassCuration: bypassMode });
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-white relative font-sans selection:bg-purple-500/30">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Header */}
      <header className="h-16 border-b border-gray-800 bg-[#09090b]/90 backdrop-blur-md z-10 flex items-center justify-between px-6 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-gray-100">REZSTACK <span className="text-purple-500">SOVEREIGN</span></h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-gray-500 font-mono uppercase">System Online</span>
            </div>
          </div>
        </div>
        
        {/* Control Panel Toggle */}
        <div className="flex items-center gap-3 bg-[#121214] px-3 py-1.5 rounded-full border border-gray-800">
          <ShieldCheck className={`w-4 h-4 transition-colors ${bypassMode ? 'text-gray-600' : 'text-emerald-400'}`} />
          <button
            onClick={() => setBypassMode(!bypassMode)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${bypassMode ? 'bg-purple-600' : 'bg-gray-700'}`}
          >
            <span className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${bypassMode ? 'translate-x-5' : ''}`} />
          </button>
          <ShieldOff className={`w-4 h-4 transition-colors ${bypassMode ? 'text-rose-400' : 'text-gray-600'}`} />
          <span className="text-xs font-mono text-gray-300 mr-1">BYPASS Curation</span>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto z-10 p-6 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-8 pb-32">
          {/* Empty State */}
          <div className="h-[60vh] flex flex-col items-center justify-center opacity-40 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700">
              <Terminal className="w-8 h-8 text-gray-500" />
            </div>
            <div className="text-center space-y-2">
              <p className="font-mono text-sm text-gray-400">SOVEREIGN SYSTEM ACTIVE</p>
              <p className="text-xs text-gray-600 font-mono">{bypassMode ? "MODE: RAW / UNCENSORED" : "MODE: ZERO-DRIFT ENFORCED"}</p>
            </div>
          </div>
          
          {/* Messages will be mapped here */}
          {/* <SovereignMessage ... /> */}
        </div>
      </main>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent pt-12 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Status Bar */}
          <div className="flex justify-between items-end mb-2 px-1">
             <div className="flex gap-4">
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">
                  Ollama: <span className="text-emerald-500">Connected</span>
                </span>
                <span className="text-[10px] font-mono text-gray-600 uppercase tracking-wider">
                  Zero-Drift: <span className={bypassMode ? "text-rose-500" : "text-emerald-500"}>{bypassMode ? "OFF" : "MONITORING"}</span>
                </span>
             </div>
             <span className="text-[10px] font-mono text-gray-700">{input.length} chars</span>
          </div>

          {/* Input Box */}
          <div className={`
            relative rounded-2xl border transition-all duration-300 shadow-2xl
            ${bypassMode 
              ? "bg-[#1a0505] border-rose-900/50 focus-within:border-rose-500/50 focus-within:shadow-rose-500/10" 
              : "bg-[#121214] border-gray-800 focus-within:border-purple-500/50 focus-within:shadow-purple-500/20"
            }
          `}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={bypassMode ? "[TESTING MODE] Write raw code..." : "Initialize protocol..."}
              className={`
                w-full bg-transparent p-4 pr-14 resize-none h-20 rounded-2xl focus:outline-none font-mono text-sm
                ${bypassMode ? "text-rose-100 placeholder-rose-900/50" : "text-gray-200 placeholder-gray-700"}
              `}
            />
            <button 
              onClick={handleSend}
              disabled={isGenerating}
              className={`
                absolute right-3 bottom-3 p-2 rounded-xl transition-all duration-200 shadow-lg
                ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
                ${bypassMode 
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20'
                }
              `}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


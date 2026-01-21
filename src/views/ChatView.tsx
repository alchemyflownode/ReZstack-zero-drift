// src/views/ChatView.tsx
import React, { useState, useEffect, useRef } from 'react';
import { SovereignMessage } from '@/components/chat/sovereign-message';
import { Send, ShieldOff, ShieldCheck, Terminal, RefreshCcw, X } from 'lucide-react';
import { useMultimodalStore } from '@/stores/multimodal-store';

export const ChatView: React.FC = () => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Store State
  const { 
    messages, 
    isGenerating, 
    sendMessage, 
    refineWithZeroDrift,
    availableModels,
    selectedModel,
    setSelectedModel,
    loadModels,
    clearMessages
  } = useMultimodalStore();

  // UI State
  const [bypassMode, setBypassMode] = useState(false);

  // Initialize models on mount
  useEffect(() => {
    loadModels();
  }, [loadModels]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    
    const currentInput = input;
    setInput(""); // Clear input immediately

    // Send to store with bypass flag
    await sendMessage(currentInput, { bypassCuration: bypassMode });
  };

  const handleRefine = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.content) {
      await refineWithZeroDrift(messageId, message.content);
    }
  };

  // Helper for formatting time
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-white relative font-sans selection:bg-purple-500/30 overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Header */}
      <header className="h-16 border-b border-gray-800 bg-[#09090b]/90 backdrop-blur-md z-10 flex items-center justify-between px-6 sticky top-0 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-gray-100 leading-none">REZSTACK <span className="text-purple-500">SOVEREIGN</span></h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${availableModels.length > 0 ? 'bg-emerald-500' : 'bg-rose-500'} ${availableModels.length > 0 ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                {availableModels.length > 0 ? 'System Online' : 'System Offline'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Header Controls */}
        <div className="flex items-center gap-6">
          
          {/* Model Selector */}
          {availableModels.length > 0 && (
            <div className="hidden md:block">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-[#121214] border border-gray-800 text-xs text-gray-300 px-3 py-1.5 rounded-md focus:outline-none focus:border-purple-500 font-mono cursor-pointer hover:bg-[#1c1c1f] transition-colors"
              >
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Bypass Toggle */}
          <div className="flex items-center gap-2 bg-[#121214] px-3 py-1.5 rounded-full border border-gray-800/50">
            <ShieldCheck className={`w-4 h-4 transition-colors ${bypassMode ? 'text-gray-700' : 'text-emerald-400'}`} />
            <button
              onClick={() => setBypassMode(!bypassMode)}
              className={`relative w-9 h-5 rounded-full transition-colors duration-300 focus:outline-none ${bypassMode ? 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.3)]' : 'bg-gray-700'}`}
              aria-label="Toggle Bypass Mode"
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm ${bypassMode ? 'translate-x-4' : ''}`} />
            </button>
            <ShieldOff className={`w-4 h-4 transition-colors ${bypassMode ? 'text-rose-400' : 'text-gray-700'}`} />
            <span className="text-xs font-medium text-gray-300 mr-1 hidden sm:inline">BYPASS</span>
          </div>

          {/* Clear Chat */}
          <button 
            onClick={clearMessages}
            className="text-gray-500 hover:text-white transition-colors"
            title="Clear History"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto z-10 p-6 scroll-smooth" id="chat-container">
        <div className="max-w-4xl mx-auto space-y-6 pb-4">
          
          {/* Empty State */}
          {messages.length === 0 && (
            <div className="h-[65vh] flex flex-col items-center justify-center opacity-50 space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700/50 shadow-2xl">
                <Terminal className="w-10 h-10 text-gray-500" />
              </div>
              <div className="text-center space-y-3">
                <p className="font-mono text-lg text-gray-300 font-semibold tracking-tight">SOVEREIGN STACK ACTIVE</p>
                <p className="text-xs text-gray-600 font-mono max-w-xs mx-auto leading-relaxed">
                  Zero-Drift protocol is monitoring. 
                  {bypassMode 
                    ? " CURRENT MODE: BYPASS (RAW)" 
                    : " CURRENT MODE: ENFORCED (CURATED)"}
                </p>
                {availableModels.length === 0 && (
                   <p className="text-rose-500 text-xs mt-4 font-mono animate-pulse">
                     ⚠️ Ollama connection lost. Ensure localhost:11434 is active.
                   </p>
                )}
              </div>
            </div>
          )}
          
          {/* Messages Map */}
          {messages.map((msg) => (
            <SovereignMessage
              key={msg.id}
              role={msg.isUser ? 'user' : 'assistant'}
              content={msg.content}
              status={msg.sovereignStatus}
              vibeScore={msg.vibeScore}
              violations={msg.violations}
              timestamp={formatTime(msg.timestamp)}
              onRefine={() => handleRefine(msg.id)}
            />
          ))}

          {/* Thinking Indicator */}
          {isGenerating && (
            <div className="flex w-full justify-start my-4">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#121214] border border-purple-500/30 rounded-2xl rounded-tl-sm shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs font-mono text-gray-400 ml-2">Processing...</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent pt-12 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Status Bar */}
          <div className="flex justify-between items-end mb-3 px-1">
             <div className="flex gap-4 font-mono text-[10px] uppercase tracking-wider">
                <span className="text-gray-600">
                  Models: <span className="text-gray-300">{availableModels.length}</span>
                </span>
                <span className="text-gray-600">
                  Messages: <span className="text-gray-300">{messages.length}</span>
                </span>
                <span className={`transition-colors duration-300 ${bypassMode ? "text-rose-500" : "text-emerald-500"}`}>
                  Protocol: <span className="font-bold">{bypassMode ? "OFF" : "ON"}</span>
                </span>
             </div>
             <span className="text-[10px] font-mono text-gray-700">
               {input.length} chars
             </span>
          </div>

          {/* Input Box */}
          <div className={`
            relative rounded-2xl border transition-all duration-300 shadow-2xl overflow-hidden
            ${bypassMode 
              ? "bg-[#1a0505] border-rose-900/50 focus-within:border-rose-500/50 focus-within:shadow-[0_0_20px_rgba(244,63,94,0.1)]" 
              : "bg-[#121214] border-gray-800 focus-within:border-purple-500/50 focus-within:shadow-[0_0_20px_rgba(168,85,247,0.1)]"
            }
          `}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter' && !e.shiftKey) { 
                  e.preventDefault(); 
                  handleSend(); 
                } 
              }}
              placeholder={bypassMode ? "[TESTING MODE] Enter raw code or prompts..." : "Initialize protocol..."}
              disabled={isGenerating}
              className={`
                w-full bg-transparent p-4 pr-14 resize-none h-20 focus:outline-none font-mono text-sm transition-colors
                ${bypassMode ? "text-rose-100 placeholder-rose-900/40" : "text-gray-200 placeholder-gray-700"}
                ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            />
            
            <div className="absolute right-3 bottom-3 flex gap-2">
                {/* Clear Input Button */}
                {input.length > 0 && (
                    <button 
                        onClick={() => setInput("")}
                        className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                {/* Send Button */}
                <button 
                  onClick={handleSend}
                  disabled={isGenerating}
                  className={`
                    p-2 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center
                    ${isGenerating ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105 active:scale-95 hover:brightness-110'}
                    ${bypassMode 
                      ? 'bg-rose-600 text-white shadow-rose-500/20' 
                      : 'bg-purple-600 text-white shadow-purple-500/20'
                    }
                  `}
                >
                  <Send className="w-4 h-4" />
                </button>
            </div>
          </div>
          
          {/* Footer Note */}
          <div className="text-center mt-3">
             <span className="text-[9px] text-gray-700 font-mono tracking-widest uppercase opacity-70">
                Sovereign Causality Feed • Zero-Drift Engine {bypassMode ? '• Disabled' : '• Active'}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default export to fix the import error in App.tsx
export default ChatView;

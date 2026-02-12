import React, { useState, useRef, useEffect } from 'react';
import { useMultimodalStore } from '../stores/multimodal-store';
import { SovereignMessage } from '../components/chat/sovereign-message';
import { Send, ShieldOff, ShieldCheck, Terminal, RefreshCw, X } from 'lucide-react';
import TerminalPanel from '../components/Terminal/TerminalPanel';

export const ChatView: React.FC = () => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [bypassMode, setBypassMode] = useState(false);
  
  // ===== SOVEREIGN TERMINAL STATE =====
  const [terminalPath, setTerminalPath] = useState('.');
  const workspace = "G:\\okiru\\app builder\\RezStackFinal2\\RezStackFinal";

  // Store
  let store;
  try {
    store = useMultimodalStore();
  } catch (e) {
    store = {
      messages: [],
      isGenerating: false,
      availableModels: [],
      selectedModel: '',
      isConnected: true,
      sendMessage: async () => {},
      refineWithZeroDrift: async () => {},
      loadModels: async () => {},
      setSelectedModel: () => {},
      clearMessages: () => {}
    };
  }

  const { 
    messages = [], 
    isGenerating = false, 
    sendMessage, 
    refineWithZeroDrift,
    availableModels = [],
    selectedModel = '',
    setSelectedModel,
    loadModels,
    clearMessages,
    isConnected = true
  } = store;

  useEffect(() => {
    loadModels?.();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;
    const currentInput = input;
    setInput('');
    await sendMessage?.(currentInput, { bypassCuration: bypassMode });
  };

  const handleRefine = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message?.content) {
      await refineWithZeroDrift?.(messageId, message.content);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString || dateString === 'Invalid Date') {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-white relative overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-gray-800 bg-[#09090b]/90 backdrop-blur-md z-10 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm">REZSTACK <span className="text-purple-500">SOVEREIGN</span></h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-[10px] text-gray-500 font-mono">
                {isConnected ? 'System Online' : 'System Offline'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {availableModels.length > 0 && (
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel?.(e.target.value)}
              className="bg-[#121214] border border-gray-800 text-xs text-gray-300 px-3 py-1.5 rounded-md"
            >
              {availableModels.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-2 bg-[#121214] px-3 py-1.5 rounded-full">
            <ShieldCheck className={`w-4 h-4 ${bypassMode ? 'text-gray-700' : 'text-emerald-400'}`} />
            <button
              onClick={() => setBypassMode(!bypassMode)}
              className={`relative w-9 h-5 rounded-full transition-colors ${bypassMode ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${bypassMode ? 'translate-x-4' : ''}`} />
            </button>
            <ShieldOff className={`w-4 h-4 ${bypassMode ? 'text-rose-400' : 'text-gray-700'}`} />
            <span className="text-xs font-medium text-gray-300 mr-1">BYPASS</span>
          </div>

          <button onClick={() => clearMessages?.()} className="text-gray-500 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto z-10 p-6">
        <div className="max-w-4xl mx-auto space-y-6 pb-4">
          {messages.length === 0 && (
            <div className="h-[40vh] flex flex-col items-center justify-center opacity-50">
              <Terminal className="w-10 h-10 text-gray-500" />
              <p className="font-mono text-lg text-gray-300 mt-4">SOVEREIGN STACK ACTIVE</p>
              <p className="text-xs text-gray-600 font-mono mt-2">
                {bypassMode ? "BYPASS MODE: RAW" : "ENFORCED MODE: CURATED"}
              </p>
            </div>
          )}
          
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

          {isGenerating && (
            <div className="flex w-full justify-start my-4">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#121214] border border-purple-500/30 rounded-2xl">
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

      {/* ===== 🦊 SOVEREIGN TERMINAL - WITH CAT/SCAN/FIX ===== */}
      <div className="px-6 pb-4">
        <TerminalPanel 
          workspace={workspace}
          currentPath={terminalPath}
          onPathChange={setTerminalPath}
        />
      </div>

      {/* Input Area */}
      <div className="px-6 pb-6">
        <div className={`
          relative rounded-2xl border transition-all duration-300 overflow-hidden
          ${bypassMode ? 'bg-[#1a0505] border-rose-900/50' : 'bg-[#121214] border-gray-800'}
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
            placeholder={bypassMode ? "[TESTING MODE] Enter raw code..." : "Initialize protocol..."}
            disabled={isGenerating}
            className="w-full bg-transparent p-4 pr-14 resize-none h-20 focus:outline-none font-mono text-sm text-gray-200"
          />
          
          <div className="absolute right-3 bottom-3 flex gap-2">
            {input.length > 0 && (
              <button onClick={() => setInput('')} className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-gray-800">
                <X className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={handleSend}
              disabled={isGenerating}
              className={`p-2 rounded-xl transition-all ${
                bypassMode ? 'bg-rose-600' : 'bg-purple-600'
              } text-white shadow-lg`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;

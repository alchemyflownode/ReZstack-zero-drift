import React, { useState, useRef, useEffect } from 'react';
import { useMultimodalStore } from '../stores/multimodal-store';
import { Send, Terminal, RefreshCw, X } from 'lucide-react';
import TerminalPanel from '../components/Terminal/TerminalPanel';

export const ChatView: React.FC = () => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [bypassMode, setBypassMode] = useState(false);
  
  // ===== TERMINAL STATE =====
  const [terminalPath, setTerminalPath] = useState('.');
  const workspace = "G:\\okiru\\app builder";

  // ===== SAFE STORE ACCESS =====
  let store;
  try {
    store = useMultimodalStore();
  } catch (e) {
    console.warn('Store not available, using mock');
    store = {
      messages: [],
      isGenerating: false,
      isConnected: false,
      sendMessage: async () => {},
      clearMessages: () => {}
    };
  }

  const { 
    messages = [], 
    isGenerating = false, 
    isConnected = false,
    sendMessage, 
    clearMessages 
  } = store;

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

  const formatTime = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="h-14 border-b border-border bg-surface/50 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Sovereign <span className="text-accent">Chat</span></h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-error'}`} />
              <span className="text-[10px] text-text-tertiary">
                {isConnected ? 'Connected' : 'Offline'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setBypassMode(!bypassMode)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              bypassMode ? 'bg-warning/20 text-warning' : 'bg-surface-hover text-text-secondary'
            }`}
          >
            {bypassMode ? 'BYPASS ON' : 'BYPASS OFF'}
          </button>
          
          <button
            onClick={() => clearMessages?.()}
            className="p-1.5 hover:bg-surface-hover rounded text-text-secondary"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Terminal size={32} className="mx-auto text-text-tertiary mb-4" />
              <p className="text-text-secondary text-sm">No messages yet</p>
              <p className="text-text-tertiary text-xs mt-2">Start a conversation below</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[80%] p-4 rounded-lg
                  ${msg.isUser 
                    ? 'bg-accent/10 border border-accent/20' 
                    : 'bg-surface border border-border'
                  }
                `}>
                  <div className="flex items-center gap-2 mb-2 text-xs">
                    <span className="font-medium text-text-primary">
                      {msg.isUser ? 'You' : 'Assistant'}
                    </span>
                    <span className="text-text-tertiary">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          
          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-surface border border-border p-4 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Terminal */}
      <div className="px-6 pb-4">
        <TerminalPanel 
          workspace={workspace}
          currentPath={terminalPath}
          onPathChange={setTerminalPath}
        />
      </div>

      {/* Input */}
      <div className="px-6 pb-6">
        <div className="relative">
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
            placeholder="Type your message..."
            className="w-full bg-surface border border-border rounded-lg pl-4 pr-24 py-3 text-sm resize-none outline-none focus:border-accent transition-colors"
            rows={1}
          />
          <div className="absolute right-2 bottom-2 flex gap-1">
            {input.length > 0 && (
              <button
                onClick={() => setInput('')}
                className="p-1.5 hover:bg-surface-hover rounded text-text-tertiary"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              className="p-1.5 bg-accent text-white rounded disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;

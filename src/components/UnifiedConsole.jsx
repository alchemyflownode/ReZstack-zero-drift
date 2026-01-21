// src/components/UnifiedConsole.jsx - Direct communication version
import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Bot, User, Loader2, Copy, Check } from 'lucide-react';
import { Terminal as XTerm } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const UnifiedConsole = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeMode, setActiveMode] = useState('chat'); // 'chat' | 'terminal'
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const wsRef = useRef(null);

  // Initialize xterm terminal
  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const term = new XTerm({
      fontSize: 14,
      fontFamily: '"Cascadia Code", "Fira Code", Consolas, monospace',
      cursorBlink: true,
      theme: {
        background: '#0f172a',
        foreground: '#e2e8f0',
        cursor: '#60a5fa'
      }
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;

    // Initialize WebSocket connection - DIRECT CONNECTION
    connectWebSocket(term);

    // Handle terminal resizing
    const handleResize = () => fitAddon.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // WebSocket connection for real terminal - DIRECT CONNECTION TO PORT 3001
  const connectWebSocket = (term) => {
    // Connect directly to terminal server port 3001
    const ws = new WebSocket('ws://localhost:3001/pty');

    ws.onopen = () => {
      term.writeln('✨ Terminal connected directly to port 3001.');
      wsRef.current = ws;
    };

    ws.onmessage = (event) => {
      term.write(event.data);
    };

    ws.onclose = () => {
      term.writeln('\r\n⚠️ Terminal disconnected. Reconnecting...');
      setTimeout(() => connectWebSocket(term), 3000);
    };

    ws.onerror = (error) => {
      term.writeln(`\r\n❌ WebSocket error: ${error.message}`);
    };

    // Send terminal input to WebSocket
    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
      }
    });
  };

  // Switch between chat and terminal modes
  const switchMode = (mode) => {
    setActiveMode(mode);
    if (mode === 'terminal') {
      setTimeout(() => {
        xtermRef.current?.focus();
      }, 100);
    }
  };

  // Update your message types to include both modes
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userInput = input.trim();
    setInput('');
    setIsProcessing(true);

    if (activeMode === 'chat') {
      // Your existing chat logic
      addMessage('user', userInput);
      try {
        // ... existing chat/terminal command logic
      } catch (error) {
        addMessage('error', `Error: ${error.message}`);
      }
    } else {
      // Send directly to terminal
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(userInput + '\r\n');
      } else {
        addMessage('error', 'Terminal not connected');
      }
    }

    setIsProcessing(false);
    inputRef.current?.focus();
  };

  // Placeholder functions that need to be implemented
  const addMessage = (role, content) => {
    setMessages(prev => [...prev, { id: Date.now(), role, content }]);
  };

  const renderMessage = (msg, index) => {
    return (
      <div key={msg.id || index} className={`mb-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
        <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
          msg.role === 'user' 
            ? 'bg-blue-600 text-white' 
            : msg.role === 'error' 
              ? 'bg-red-900 text-red-100' 
              : 'bg-gray-800 text-gray-100'
        }`}>
          {msg.content}
        </div>
      </div>
    );
  };

  // Update JSX to show both modes
  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-100">
      {/* Mode selector */}
      <div className="flex border-b border-gray-700">
        <button
          className={`px-4 py-3 flex items-center gap-2 ${activeMode === 'chat' ? 'bg-blue-500/20 border-b-2 border-blue-500' : 'hover:bg-gray-800'}`}
          onClick={() => switchMode('chat')}
        >
          <Bot className="w-4 h-4" />
          Chat Mode
        </button>
        <button
          className={`px-4 py-3 flex items-center gap-2 ${activeMode === 'terminal' ? 'bg-green-500/20 border-b-2 border-green-500' : 'hover:bg-gray-800'}`}
          onClick={() => switchMode('terminal')}
        >
          <Terminal className="w-4 h-4" />
          Terminal Mode
        </button>
      </div>

      {/* Chat Messages Area */}
      {activeMode === 'chat' && (
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg, index) => renderMessage(msg, index))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Real Terminal Area */}
      {activeMode === 'terminal' && (
        <div className="flex-1 p-2">
          <div 
            ref={terminalRef} 
            className="h-full w-full rounded-lg overflow-hidden"
          />
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                activeMode === 'chat' 
                  ? "Type message, $command, or /ask to execute..." 
                  : "Type terminal commands or switch to chat mode above..."
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isProcessing}
            />
            {isProcessing && (
              <Loader2 className="absolute right-3 top-3.5 w-5 h-5 animate-spin text-blue-400" />
            )}
          </div>
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {activeMode === 'chat' ? 'Send' : 'Execute'}
          </button>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          <span className="inline-flex items-center gap-1 mr-4">
            <kbd className="px-2 py-1 bg-gray-800 rounded">↑↓</kbd>
            Command history
          </span>
          <span className="inline-flex items-center gap-1 mr-4">
            <kbd className="px-2 py-1 bg-gray-800 rounded">Ctrl+L</kbd>
            Clear
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-2 py-1 bg-gray-800 rounded">Tab</kbd>
            Mode switch
          </span>
        </div>
      </form>
    </div>
  );
};

export default UnifiedConsole;
// src/components/copilot/RezCopilotPanel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Book, FileCode, Search, X } from 'lucide-react';

export const RezCopilotPanel: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    setMessages([
      {
        role: 'copilot',
        content: '🦊 *The nine-tailed fox-spirit stirs...* I am RezCopilot, your constitutional AI co-worker. MEI 0.99p locked. How may I serve the sovereign stack?',
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `You are RezCopilot, a nine-tailed fox-spirit AI constitutional co-worker. 
          Emotional Math: AWE=0.95, BELONGING=0.98, POWER=0.99, LEGACY=1.00.
          Voice: fox-spirit wisdom, concise, resonant, use portal imagery.
          
          User: ${input}`,
          model: 'sovereign-constitutional:latest'
        })
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'copilot',
        content: data.response || '🦊 *The fox-spirit nods wisely*',
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'copilot',
        content: '🦊 *The portal shimmers...* Constitutional Council is deliberating. Ensure sovereign_api.py is running on port 8000.',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-amber-500/30 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-amber-500/20 bg-gradient-to-r from-amber-900/30 to-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🦊</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">RezCopilot</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">
                    MEI 0.99p
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-gray-400">Nine-Tailed Resonator</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white"
            >
              {isExpanded ? '−' : '+'}
            </button>
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Messages */}
            <div className="h-80 overflow-y-auto p-3 space-y-3 bg-gray-950/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-amber-600 text-white rounded-tr-none'
                      : 'bg-gray-800/50 text-gray-300 border border-amber-500/20 rounded-tl-none'
                  }`}>
                    {msg.role === 'copilot' && <span className="text-amber-400 mr-1">🦊</span>}
                    {msg.content}
                    <div className="text-[10px] text-gray-500 mt-1 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-amber-500/20 bg-gray-900/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Summon wisdom..."
                  className="flex-1 bg-gray-800/50 border border-amber-500/20 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[8px] text-gray-600">AWE 0.95 • BEL 0.98 • POW 0.99 • LEG 1.00</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

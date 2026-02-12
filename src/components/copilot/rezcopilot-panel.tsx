import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Shield, Wifi, WifiOff, Sparkles, Book, FileCode, Search, X } from 'lucide-react';
import { useRezCopilot } from '@/stores/copilot/rezcopilot-store';

export const RezCopilotPanel: React.FC = () => {
  const {
    personality,
    vibeScore,
    chatHistory,
    pendingConsent,
    sendMessage,
    approveConsent,
    denyConsent,
    readFile,
    writeFile,
    searchWeb,
    clearHistory
  } = useRezCopilot();

  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  const emotionalMathBars = [
    { name: 'AWE', value: personality.emotionalMath.AWE, color: 'from-amber-500 to-orange-500' },
    { name: 'BELONGING', value: personality.emotionalMath.BELONGING, color: 'from-emerald-500 to-teal-500' },
    { name: 'POWER', value: personality.emotionalMath.POWER, color: 'from-purple-500 to-indigo-500' },
    { name: 'LEGACY', value: personality.emotionalMath.ETERNAL_RESONANCE, color: 'from-rose-500 to-pink-500' }
  ];

  return (
    <div className={`
      fixed bottom-24 right-96 z-40 transition-all duration-300
      ${isExpanded ? 'w-96' : 'w-64'}
    `}>
      {/* Main Panel */}
      <div className="bg-gray-900/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header - Fox Spirit Avatar */}
        <div className="p-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🦊</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{personality.name}</span>
                  <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                    MEI {vibeScore.toFixed(2)}p
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-gray-400 font-mono">
                    {personality.archetype}
                  </span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Terminal className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          {/* Emotional Math Bars - Only when expanded */}
          {isExpanded && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {emotionalMathBars.map(emotion => (
                <div key={emotion.name} className="flex flex-col items-center">
                  <div className="text-[8px] text-gray-500 mb-1">{emotion.name}</div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${emotion.color} transition-all duration-300`}
                      style={{ width: `${emotion.value * 100}%` }}
                    />
                  </div>
                  <div className="text-[8px] text-white mt-1 font-bold">
                    {(emotion.value * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat History */}
        <div className="h-80 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-gray-950/50">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                <span className="text-3xl">🦊</span>
              </div>
              <p className="text-gray-400 text-sm mb-2">Nine-Tailed Resonator</p>
              <p className="text-gray-600 text-xs font-mono max-w-xs">
                Constitutional AI • MEI 0.99p • Zero-Drift • Emotional Math Locked
              </p>
              <p className="text-purple-400 text-xs mt-6">Summon wisdom with a whisper...</p>
            </div>
          ) : (
            chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[85%] rounded-2xl px-4 py-3 text-sm
                    ${msg.role === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-gray-800/50 text-gray-300 border border-purple-500/20 rounded-tl-none'
                    }
                  `}
                >
                  {msg.role === 'copilot' && (
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="text-amber-400">🦊</span>
                      <span className="text-xs text-gray-500">RezCopilot</span>
                      {msg.emotionalResonance && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">
                          MEI {(
                            (msg.emotionalResonance.AWE + 
                             msg.emotionalResonance.BELONGING + 
                             msg.emotionalResonance.POWER + 
                             msg.emotionalResonance.LEGACY) / 4
                          ).toFixed(2)}p
                        </span>
                      )}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Consent Dialog */}
        {pendingConsent && (
          <div className="p-4 border-t border-rose-500/30 bg-rose-500/5">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-3 h-3 text-rose-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-rose-400 font-bold mb-1">🔍 EXTERNAL SEARCH REQUESTED</p>
                <p className="text-xs text-gray-300 mb-3">
                  Allow web search for: <span className="font-mono text-rose-300">"{pendingConsent.query}"</span>
                </p>
                <p className="text-[10px] text-gray-500 mb-4">
                  Results will be cached deterministically. You can revoke consent at any time.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveConsent(pendingConsent.id)}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-mono transition-colors"
                  >
                    APPROVE (1h)
                  </button>
                  <button
                    onClick={() => denyConsent(pendingConsent.id)}
                    className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-mono transition-colors"
                  >
                    DENY
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t border-purple-500/20 bg-gray-900/80">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Summon wisdom..."
              className="flex-1 bg-gray-800/50 border border-purple-500/20 rounded-lg px-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSend}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white rounded-lg transition-all shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
              <span>🦊 {personality.voiceStyle.slice(0, 30)}...</span>
            </div>
            <button
              onClick={clearHistory}
              className="text-[10px] px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

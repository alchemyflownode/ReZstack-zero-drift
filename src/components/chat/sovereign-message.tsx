// src/components/chat/sovereign-message.tsx
import React from 'react';

export interface SovereignMessageProps {
  role: 'user' | 'assistant';
  content: string;
  status?: 'STABLE' | 'DRIFTING' | 'CRITICAL' | 'PENDING_VERIFICATION' | 'BYPASSED';
  vibeScore?: number;
  violations?: string[];
  timestamp?: string;
  onRefine?: () => void;
}

export const SovereignMessage: React.FC<SovereignMessageProps> = ({
  role,
  content,
  status = 'STABLE',
  vibeScore = 0,
  violations = [],
  timestamp,
  onRefine,
}) => {
  const isUser = role === 'user';

  // Status colors for badges
  const getStatusColor = () => {
    switch (status) {
      case 'STABLE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'DRIFTING': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'BYPASSED': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    // FIX: Added 'flex' alignment and 'mb-6' to prevent overlapping
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 w-full`}>
      
      <div className={`max-w-[85%] rounded-2xl p-4 border ${
        isUser 
          ? 'bg-purple-600/20 border-purple-500/30' 
          : 'bg-gray-900/80 border-gray-800'
      }`}>
        
        {/* Header: Role & Timestamp */}
        <div className="flex items-center justify-between mb-3 border-b border-gray-700/50 pb-2">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
            {isUser ? 'User' : 'Assistant'}
          </span>
          
          {timestamp && (
            <span className="text-xs text-gray-500 font-mono">
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Content Block */}
        <pre className="text-sm whitespace-pre-wrap font-mono text-gray-200 leading-relaxed overflow-x-auto">
          {content}
        </pre>

        {/* Footer: Vibe & Controls */}
        {!isUser && (
          <div className="mt-4 pt-3 border-t border-gray-700/50">
            
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-3">
              {status && (
                <div className={`text-xs px-3 py-1 rounded-full border font-semibold ${getStatusColor()}`}>
                  {status}
                </div>
              )}

              {/* Vibe Score */}
              {vibeScore > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-mono">VIBE:</span>
                  <span className={`text-xs font-bold font-mono ${
                    vibeScore >= 90 ? 'text-emerald-400' :
                    vibeScore >= 70 ? 'text-amber-400' :
                    'text-rose-400'
                  }`}>
                    {vibeScore}/100
                  </span>
                </div>
              )}
            </div>

            {/* Violations List */}
            {violations && violations.length > 0 && (
              <div className="space-y-1 mb-3">
                {violations.map((violation, i) => (
                  <div key={i} className="text-xs text-amber-300/90 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                    ⚠ {violation}
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {(status === 'DRIFTING' || status === 'CRITICAL') && onRefine && (
                <button
                  onClick={onRefine}
                  className="flex-1 py-2 px-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 text-xs font-bold transition-all duration-200"
                >
                  🔧 Refine
                </button>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

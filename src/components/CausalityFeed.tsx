// src/components/CausalityFeed.tsx
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Activity, Shield, Zap, AlertCircle, CheckCircle } from 'lucide-react';

interface CausalityEvent {
  id: string;
  type: 'RESONANCE' | 'DRIFT' | 'FIX' | 'SYSTEM';
  message: string;
  timestamp: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const CausalityFeed: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [events, setEvents] = useState<CausalityEvent[]>([
    {
      id: '1',
      type: 'SYSTEM',
      message: 'Sovereign Limbic System Initialized',
      timestamp: new Date(Date.now() - 30000),
      priority: 'LOW'
    },
    {
      id: '2',
      type: 'RESONANCE',
      message: 'Zero-Drift Curation Engine Active',
      timestamp: new Date(Date.now() - 20000),
      priority: 'MEDIUM'
    },
    {
      id: '3',
      type: 'DRIFT',
      message: 'Detected :any type in response - Auto-corrected to SovereignType',
      timestamp: new Date(Date.now() - 10000),
      priority: 'HIGH'
    },
    {
      id: '4',
      type: 'FIX',
      message: 'Replaced cloneDeep with native structuredClone',
      timestamp: new Date(Date.now() - 5000),
      priority: 'MEDIUM'
    }
  ]);

  const getEventIcon = (type: CausalityEvent['type']) => {
    switch (type) {
      case 'RESONANCE': return <CheckCircle size={12} className="text-green-400" />;
      case 'DRIFT': return <AlertCircle size={12} className="text-amber-400" />;
      case 'FIX': return <Zap size={12} className="text-cyan-400" />;
      case 'SYSTEM': return <Shield size={12} className="text-purple-400" />;
    }
  };

  const getEventColor = (type: CausalityEvent['type']) => {
    switch (type) {
      case 'RESONANCE': return 'text-green-400/80';
      case 'DRIFT': return 'text-amber-400/80';
      case 'FIX': return 'text-cyan-400/80';
      case 'SYSTEM': return 'text-purple-400/80';
    }
  };

  const getPriorityColor = (priority: CausalityEvent['priority']) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-500/20';
      case 'MEDIUM': return 'bg-amber-500/20';
      case 'HIGH': return 'bg-red-500/20';
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-7xl z-50">
      {/* Premium Glass Container */}
      <div className={`
        glass-card rounded-2xl overflow-hidden transition-all duration-500
        ${isExpanded ? 'shadow-2xl' : 'shadow-lg'}
      `}>
        
        {/* Minimal Header - Always Visible */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            {/* Pulsing Status Indicator */}
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 blur-sm animate-ping opacity-30" />
            </div>
            
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-white/60" />
                <span className="text-[11px] font-semibold tracking-[0.15em] text-white/70 uppercase">
                  Causality Feed
                </span>
              </div>
              <div className="text-[9px] text-white/40 font-mono mt-1">
                {events.length} events • Last updated: {events[0]?.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Resonance Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-green-400/80">
                RES: 100%
              </span>
            </div>
            
            {/* Expand/Collapse Icon */}
            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronUp size={18} className="text-white/40" />
            </div>
          </div>
        </button>
        
        {/* Expandable Content */}
        <div className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${isExpanded ? 'max-h-96' : 'max-h-0'}
        `}>
          <div className="px-4 py-3 border-t border-white/5">
            {/* Event Stream */}
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/2 hover:bg-white/5 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getEventIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${getEventColor(event.type)}`}>
                        {event.type}
                      </span>
                      <div className={`px-1.5 py-0.5 rounded text-[8px] ${getPriorityColor(event.priority)}`}>
                        {event.priority}
                      </div>
                      <span className="text-[10px] text-white/30 ml-auto">
                        {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {event.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Minimal Footer */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-[10px] text-white/40">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500/60" />
                    RESONANCE
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-amber-500/60" />
                    DRIFT
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-cyan-500/60" />
                    FIX
                  </span>
                </div>
                <span className="font-mono">
                  SOVEREIGN LIMBIC v1.0
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

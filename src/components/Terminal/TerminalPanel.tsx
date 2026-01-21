// src/components/Terminal/TerminalPanel.tsx
import React, { useState, useEffect } from 'react';
import { useSovereignSync } from '../../hooks/useSovereignSync';
import { 
  Terminal, Shield, AlertTriangle, CheckCircle, 
  Zap, RefreshCw, XCircle, Info, Copy, Play, StopCircle
} from 'lucide-react';

export const TerminalPanel = () => {
  const [logs, setLogs] = useState<Array<{
    id: string;
    message: string;
    type: 'RESONANCE_OK' | 'DRIFT_WARNING' | 'LAW_VIOLATION' | 'SYSTEM' | 'RECOVERY';
    timestamp: number;
    details?: string;
  }>>([]);
  
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const sovereign = useSovereignSync();

  useEffect(() => {
    // Convert enforcement events to terminal logs
    const newLogs = sovereign.enforcementEvents.map(event => ({
      id: event.id || `event-${Date.now()}`,
      message: event.message,
      type: event.type,
      timestamp: event.timestamp || Date.now(),
      details: event.correctiveAction
    }));
    
    if (!isPaused) {
      setLogs(newLogs);
    }
  }, [sovereign.enforcementEvents, isPaused]);

  // Add recovery status logs
  useEffect(() => {
    if (sovereign.isRecovering) {
      const recoveryLog = {
        id: `recovery-${Date.now()}`,
        message: 'Sovereign recovery in progress...',
        type: 'RECOVERY' as const,
        timestamp: Date.now(),
        details: 'Architectural rollback initiated'
      };
      
      if (!isPaused) {
        setLogs(prev => [recoveryLog, ...prev.slice(0, 49)]);
      }
    }
  }, [sovereign.isRecovering, isPaused]);

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'RESONANCE_OK': return 'text-cyan-400';
      case 'DRIFT_WARNING': return 'text-amber-400';
      case 'LAW_VIOLATION': return 'text-red-400';
      case 'RECOVERY': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'RESONANCE_OK': return <CheckCircle size={14} />;
      case 'DRIFT_WARNING': return <AlertTriangle size={14} />;
      case 'LAW_VIOLATION': return <XCircle size={14} />;
      case 'RECOVERY': return <RefreshCw size={14} className="animate-spin" />;
      default: return <Info size={14} />;
    }
  };

  const getTypeBg = (type: string) => {
    switch(type) {
      case 'RESONANCE_OK': return 'bg-cyan-500/10';
      case 'DRIFT_WARNING': return 'bg-amber-500/10';
      case 'LAW_VIOLATION': return 'bg-red-500/10';
      case 'RECOVERY': return 'bg-purple-500/10';
      default: return 'bg-gray-500/10';
    }
  };

  const handleCopyLog = (log: any) => {
    const text = `[${log.type}] ${new Date(log.timestamp).toLocaleString()}: ${log.message}`;
    navigator.clipboard.writeText(text);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-80 bg-black/95 border-t border-gray-800 backdrop-blur-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-cyan-400" />
            <h3 className="text-sm font-medium">Sovereign Causality Feed</h3>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-cyan-500/10 rounded text-xs text-cyan-400 border border-cyan-500/30">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              LIVE
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
              sovereign.vibe.status === 'STABLE' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
              sovereign.vibe.status === 'DRIFTING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
              'bg-red-500/10 text-red-400 border border-red-500/30'
            }`}>
              <Shield size={12} />
              {sovereign.vibe.status.toUpperCase()}
            </div>
            
            <div className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300 border border-gray-700">
              Vibe: {sovereign.vibe.score}%
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1.5 rounded text-xs flex items-center gap-1.5 ${
              isPaused 
                ? 'bg-amber-600 hover:bg-amber-700' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {isPaused ? <Play size={12} /> : <StopCircle size={12} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <button
            onClick={handleClearLogs}
            className="px-3 py-1.5 rounded text-xs bg-gray-800 hover:bg-gray-700 flex items-center gap-1.5"
          >
            <XCircle size={12} />
            Clear
          </button>
        </div>
      </div>
      
      {/* Logs Container */}
      <div className="flex-1 overflow-hidden flex">
        {/* Main Logs Panel */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-gray-600 italic h-full flex items-center justify-center">
              <div className="text-center">
                <Terminal size={32} className="mx-auto mb-3 opacity-30" />
                <p>Waiting for causality events...</p>
                <p className="text-[10px] mt-2 text-gray-500">
                  The limbic system will log architectural decisions here
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map(log => (
                <div 
                  key={log.id}
                  className={`rounded-lg border p-3 cursor-pointer transition-all hover:bg-white/5 ${
                    expandedLog === log.id ? 'ring-1 ring-cyan-500/30' : ''
                  } ${getTypeBg(log.type)} border-gray-700/50`}
                  onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex-shrink-0 ${getTypeColor(log.type)}`}>
                      {getTypeIcon(log.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getTypeColor(log.type)}`}>
                            {log.type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-gray-600 text-[10px]">
                            {(log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "")}
                          </span>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyLog(log);
                          }}
                          className="text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                      
                      <div className="text-gray-200">{log.message}</div>
                      
                      {expandedLog === log.id && log.details && (
                        <div className="mt-2 pt-2 border-t border-gray-700/50">
                          <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                            Details
                          </div>
                          <div className="text-gray-300 text-xs">{log.details}</div>
                        </div>
                      )}
                      
                      {log.type === 'LAW_VIOLATION' && (
                        <div className="mt-2 flex gap-2">
                          <div className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-300 rounded border border-red-500/30">
                            Requires Attention
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Sidebar - Statistics */}
        <div className="w-64 border-l border-gray-800 bg-black/50 p-4 overflow-y-auto">
          <div className="mb-6">
            <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Causality Statistics</h4>
            
            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-gray-500 mb-1">Event Distribution</div>
                <div className="space-y-1.5">
                  {['RESONANCE_OK', 'DRIFT_WARNING', 'LAW_VIOLATION', 'RECOVERY'].map(type => {
                    const count = logs.filter(l => l.type === type).length;
                    const percentage = logs.length > 0 ? (count / logs.length * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${getTypeColor(type).replace('text-', 'bg-')}`} />
                          <span className="text-xs text-gray-300">{type.replace(/_/g, ' ')}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {count} ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-800">
                <div className="text-[10px] text-gray-500 mb-1">Timeline</div>
                <div className="text-xs text-gray-300">
                  {logs.length > 0 ? (
                    <>
                      First: {(logs[logs.length - 1].timestamp ? new Date(logs[logs.length - 1].timestamp).toLocaleTimeString() : "")}<br/>
                      Last: {(logs[0].timestamp ? new Date(logs[0].timestamp).toLocaleTimeString() : "")}<br/>
                      Total: {logs.length} events
                    </>
                  ) : (
                    'No events recorded'
                  )}
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-800">
                <div className="text-[10px] text-gray-500 mb-1">System Status</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Monitor</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-green-500 animate-pulse'}`} />
                      <span className="text-xs text-gray-400">{isPaused ? 'Paused' : 'Active'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-300">Recovery</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${sovereign.isRecovering ? 'bg-purple-500 animate-pulse' : 'bg-gray-500'}`} />
                      <span className="text-xs text-gray-400">{sovereign.isRecovering ? 'In Progress' : 'Ready'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="pt-4 border-t border-gray-800">
            <h4 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Event Legend</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <CheckCircle size={10} className="text-cyan-400" />
                </div>
                <span className="text-xs text-gray-300">Resonance OK</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <AlertTriangle size={10} className="text-amber-400" />
                </div>
                <span className="text-xs text-gray-300">Drift Warning</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                  <XCircle size={10} className="text-red-400" />
                </div>
                <span className="text-xs text-gray-300">Law Violation</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <RefreshCw size={10} className="text-purple-400" />
                </div>
                <span className="text-xs text-gray-300">Recovery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-800 bg-black/70 text-xs text-gray-500 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>
            Events: {logs.length} | 
            Paused: {isPaused ? 'Yes' : 'No'} | 
            Recovery: {sovereign.isRecovering ? 'Active' : 'Idle'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {sovereign.isRecovering && (
            <div className="flex items-center gap-1 text-purple-400">
              <RefreshCw size={12} className="animate-spin" />
              <span>Architectural Recovery in Progress...</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Zap size={12} className="text-cyan-400" />
            <span>Sovereign Limbic System v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};




// src/components/RoutingDisplay.tsx
import React from 'react';
import { Cpu, Brain, Zap, Clock } from 'lucide-react';

export const RoutingDisplay: React.FC<{ decision: any; metrics?: any }> = ({ decision, metrics }) => (
  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-4">
    <div className="flex items-start gap-3">
      {decision.executionMode === 'gpu' ? <Cpu className="w-5 h-5 text-green-400" /> : <Brain className="w-5 h-5 text-blue-400" />}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-white">{decision.modelInfo?.name || decision.model}</h3>
          <span className="px-2 py-1 rounded text-xs bg-blue-500/20 border border-blue-500/50 text-blue-300">
            {decision.confidence}% confidence
          </span>
        </div>
        <p className="text-gray-300 text-sm">{decision.reason}</p>
        {metrics && (
          <div className="flex gap-4 mt-2 text-xs text-gray-400">
            {metrics.tokensPerSecond && <div className="flex items-center gap-1"><Zap className="w-3 h-3" />{metrics.tokensPerSecond} t/s</div>}
            {metrics.latency && <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{metrics.latency.toFixed(0)}ms</div>}
          </div>
        )}
      </div>
    </div>
  </div>
);

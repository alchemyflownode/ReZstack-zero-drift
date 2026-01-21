// src/components/ArchitectureVisualizer.tsx
import React from 'react';
import { Code, Layers, GitBranch, Cpu, Shield, Zap } from 'lucide-react';

export const ArchitectureVisualizer = ({ augmentation }: { augmentation: any }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="text-purple-500" size={24} />
        <h3 className="text-xl font-bold">Generated Architecture</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Code size={16} className="text-blue-400" />
            <span className="text-sm font-medium">Stack</span>
          </div>
          {Object.entries(augmentation.recommendedStack).map(([key, value]: [string, any]) => (
            <div key={key} className="text-xs mb-1">
              <span className="text-gray-400">{key}: </span>
              <span className="text-blue-300">{value.tool}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch size={16} className="text-green-400" />
            <span className="text-sm font-medium">Structure</span>
          </div>
          <pre className="text-xs text-gray-300 whitespace-pre-wrap">
            {augmentation.projectStructure}
          </pre>
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-cyan-400" />
          <span className="text-sm font-medium">Sovereign Warnings</span>
        </div>
        <div className="space-y-2">
          {augmentation.warnings?.map((warning: any, idx: number) => (
            <div key={idx} className="text-xs p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="font-medium text-amber-400">{warning.type}</div>
              <div className="text-gray-300">{warning.message}</div>
              <div className="text-green-400 mt-1">💡 {warning.suggestion}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

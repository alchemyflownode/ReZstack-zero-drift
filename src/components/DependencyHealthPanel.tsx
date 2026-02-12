import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Cpu } from 'lucide-react';

export const DependencyHealthPanel = () => {
  return (
    <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
      <h3 className="font-semibold mb-3 flex items-center">
        <Shield size={18} className="mr-2 text-purple-400" />
        System Health
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Ollama</span>
          <span className="text-xs flex items-center text-green-400">
            <CheckCircle size={12} className="mr-1" />
            Connected
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">JARVIS API</span>
          <span className="text-xs flex items-center text-green-400">
            <CheckCircle size={12} className="mr-1" />
            8002
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Constitutional Council</span>
          <span className="text-xs flex items-center text-purple-400">
            <Cpu size={12} className="mr-1" />
            5/5 Seated
          </span>
        </div>
      </div>
    </div>
  );
};

export default DependencyHealthPanel;

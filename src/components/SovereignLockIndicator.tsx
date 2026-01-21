import React from 'react';
import { useDeltaZero } from '../contexts/SovereignContext';
import { Shield, Cpu, Lock, Unlock } from 'lucide-react';

export function SovereignLockIndicator() {
  const { active, toggle } = useDeltaZero();
  
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/50 border border-gray-700">
      <div className="flex items-center gap-1.5">
        {active ? (
          <>
            <Lock className="w-4 h-4 text-rezonic-accent" />
            <span className="text-sm font-medium text-rezonic-accent">Î”â‚€ Active</span>
          </>
        ) : (
          <>
            <Unlock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">Î”â‚€ Inactive</span>
          </>
        )}
      </div>
      
      <button
        onClick={toggle}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          active
            ? 'bg-rezonic-accent/20 text-rezonic-accent hover:bg-rezonic-accent/30'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
        title={active ? 'Disable Delta Zero enforcement' : 'Enable Delta Zero enforcement'}
      >
        {active ? 'Disable' : 'Enable'}
      </button>
      
      <div className="flex items-center gap-1 ml-2 pl-2 border-l border-gray-700">
        <Cpu className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs text-gray-400">Local AI</span>
      </div>
    </div>
  );
}



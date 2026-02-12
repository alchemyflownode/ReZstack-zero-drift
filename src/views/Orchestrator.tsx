import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Cpu } from 'lucide-react';

export const Orchestrator = () => {
  return (
    <div className="p-6 bg-[#09090b] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Rezonic Orchestrator</h1>
      <GlassCard>
        <div className="flex items-center gap-3">
          <Cpu className="w-8 h-8 text-purple-400" />
          <div>
            <div className="text-sm text-gray-400">Orchestrator Status</div>
            <div className="text-xl font-bold text-white">Active</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Orchestrator;

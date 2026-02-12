import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { Activity, Cpu, Shield, Brain } from 'lucide-react';

export const Dashboard = () => {
  return (
    <div className="p-6 bg-[#09090b] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Sovereign Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            <div>
              <div className="text-sm text-gray-400">Constitutional Council</div>
              <div className="text-xl font-bold text-white">5 Justices</div>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-green-400" />
            <div>
              <div className="text-sm text-gray-400">Security Score</div>
              <div className="text-xl font-bold text-white">92%</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;

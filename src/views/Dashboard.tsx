import React from 'react';
import { GlassCard } from '../components/GlassCard';
import { 
  Cpu, Box, Brain, Terminal, Activity, CheckCircle2, MoreVertical
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const workers = [
    {
      id: 'comfy-core-01',
      title: 'COMFYUI CORE SUBSTRATE',
      sub: 'comfy-core-01',
      tags: ['KSAMPLER', 'CHECKPOINTLOADERSIMPLE', 'CLIPTEXTENCODE'],
      status: 'online',
      icon: <Cpu size={20} className="text-[#00f5d4]" />
    },
    {
      id: 'comfy-plugin-controlnet',
      title: 'CUSTOM NODE: CONTROLNET-AUX',
      sub: 'comfy-plugin-controlnet',
      tags: ['CANNYEDGEPREPROCESSOR', 'CONTROLNETAPPLY'],
      status: 'online',
      icon: <Box size={20} className="text-[#00f5d4]" />
    },
    {
      id: 'ollama-phi4',
      title: 'OLLAMA: PHI-4 (LOGIC)',
      sub: 'ollama-phi4',
      tags: ['LLMREASONING', 'STRUCTUREDJSONEXTRACTOR'],
      status: 'online',
      icon: <Brain size={20} className="text-purple-400" />
    }
  ];

  return (
    <div className="space-y-12 h-full">
      {/* Substrate Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workers.map((worker) => (
          <div key={worker.id} className="bg-[#111116] border border-white/[0.05] rounded-[5px] p-6 hover:bg-white/[0.02] transition-all cursor-pointer group">
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 bg-black/40 border border-white/[0.03] rounded-[4px] flex items-center justify-center">
                {worker.icon}
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
            </div>

            <div className="mb-8">
              <h3 className="text-[11px] font-black text-white uppercase tracking-widest mb-1">{worker.title}</h3>
              <p className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">{worker.sub}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {worker.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-black border border-white/[0.03] text-[8px] font-black text-slate-400 rounded-full uppercase tracking-tighter group-hover:border-[#00f5d4]/20 transition-all">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Artifacts Feed Section */}
      <div className="pt-12 border-t border-white/[0.03]">
        <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center gap-3">
          <Activity size={14} className="text-[#00f5d4]" />
          RECENT SUBSTRATE ARTIFACTS
        </h4>
        
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 opacity-40">
           {[...Array(8)].map((_, i) => (
             <div key={i} className="aspect-square bg-white/[0.01] border border-dashed border-white/[0.05] rounded-[5px]" />
           ))}
        </div>
      </div>
    </div>
  );
};



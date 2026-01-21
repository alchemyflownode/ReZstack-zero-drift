
import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { WORKER_MANIFESTS } from '../constants';
import { testWorkerConnection } from '../localSubstrate';
import { 
  Cable, Activity, ShieldCheck, Cpu, Box, Server, 
  Terminal, Share2, Globe, Lock, CheckCircle, Search,
  RefreshCw, Wifi, WifiOff, Link2
} from 'lucide-react';

export const WorkerRegistry: React.FC = () => {
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, 'online' | 'offline' | 'checking'>>({
    "comfy-local-01": 'online',
    "ollama-local-01": 'online'
  });

  const checkStatus = async (workerId: string, endpoint: string) => {
    setStatuses(prev => ({ ...prev, [workerId]: 'checking' }));
    const ok = await testWorkerConnection(endpoint);
    setStatuses(prev => ({ ...prev, [workerId]: ok ? 'online' : 'offline' }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Worker Registry</h2>
          <p className="text-slate-400">Discover and manage advertised Substrate Worker Plugin Manifests.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 transition-all uppercase tracking-widest">
            <Search size={14} /> Scan Subnet
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg uppercase tracking-widest">
            <Share2 size={14} /> Advertise Node
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {WORKER_MANIFESTS.map((worker) => (
          <GlassCard key={worker.id} className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              {worker.type === 'comfyui' ? <Box size={100} /> : <Terminal size={100} />}
            </div>

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                  statuses[worker.id] === 'online' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 
                  statuses[worker.id] === 'checking' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                  'bg-red-500/10 border-red-500/20 text-red-500'
                }`}>
                  {worker.type === 'comfyui' ? <Box size={24} /> : <Server size={24} />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {worker.name}
                    {statuses[worker.id] === 'online' && <CheckCircle size={14} className="text-emerald-500" />}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{worker.id} Ã¢â‚¬Â¢ v{worker.version}</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                <button 
                  onClick={() => checkStatus(worker.id, worker.endpoint)}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"
                  title="Refresh Heartbeat"
                >
                  <RefreshCw size={14} className={statuses[worker.id] === 'checking' ? 'animate-spin text-blue-400' : ''} />
                </button>
                <div className="flex items-center gap-2">
                   <span className={`w-1.5 h-1.5 rounded-full ${statuses[worker.id] === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
                   <span className={`text-[10px] font-mono uppercase font-bold ${statuses[worker.id] === 'online' ? 'text-emerald-400' : 'text-red-500'}`}>
                     {statuses[worker.id]}
                   </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 group-hover:border-blue-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 size={12} className="text-blue-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Local Link</span>
                </div>
                <p className="text-xs font-mono text-slate-200">{worker.endpoint}</p>
              </div>
              <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={12} className="text-purple-400" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol</span>
                </div>
                <p className="text-xs font-mono text-slate-200 uppercase">{worker.advertisingContract.protocol} / {worker.advertisingContract.encryption}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Advertised Capabilities</span>
                 <span className="text-[10px] font-mono text-slate-400">{worker.nodeRegistry.length} Functions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {worker.capabilities.map((cap) => (
                  <span key={cap} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-slate-300">
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-slate-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Registry Contract</span>
                  </div>
                  <button className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors font-bold uppercase tracking-widest">Pull Live Schema</button>
               </div>
               <div className="space-y-2">
                 {worker.nodeRegistry.slice(0, 3).map((node) => (
                   <div key={node.type} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                         <span className="text-[11px] font-mono text-slate-200">{node.type}</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">{node.category}</span>
                   </div>
                 ))}
                 {worker.nodeRegistry.length > 3 && (
                   <p className="text-center text-[9px] text-slate-600 font-bold uppercase pt-2">+{worker.nodeRegistry.length - 3} more nodes discovered</p>
                 )}
               </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard title="Sovereign Discovery Stats" icon={<Activity size={16}/>}>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Worker Discovery</p>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white tracking-tighter">0.8ms</span>
                  <span className="text-emerald-400 text-[10px] font-bold uppercase">Nominal</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[95%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               </div>
            </div>
            <div className="space-y-3">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Manifest Integrity</p>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white tracking-tighter">100%</span>
                  <span className="text-blue-400 text-[10px] font-bold uppercase">Verified</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
               </div>
            </div>
            <div className="space-y-3">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subnet Broadcast</p>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white tracking-tighter">ACTIVE</span>
                  <span className="text-purple-400 text-[10px] font-bold uppercase">Sovereign</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 w-[60%] shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
               </div>
            </div>
         </div>
      </GlassCard>
    </div>
  );
};




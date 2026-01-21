import React from 'react';
import { ViewType } from '../types';
import { LayoutGrid, Share2, History, Terminal, ShieldCheck, Cpu, Zap } from 'lucide-react';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const items = [
    { id: 'dashboard', label: 'SUBSTRATE HUB', icon: <LayoutGrid size={18} /> },
    { id: 'ide', label: 'VISUAL GRAPH', icon: <Share2 size={18} /> },
    { id: 'knowledge', label: 'ASSET LEDGER', icon: <History size={18} /> },
    { id: 'registry', label: 'DEV TERMINAL', icon: <Terminal size={18} /> },
  ];

  return (
    <aside className="w-64 h-full flex flex-col bg-[#0b0b0e] border-r border-white/[0.03] py-6 px-4">
      {/* Brand */}
      <div className="px-4 mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-[5px] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-sm font-black text-white tracking-widest uppercase">REZONIC</h1>
          <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">SSA_CORE_V2.0</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as ViewType)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-[5px] transition-all text-[10px] font-black tracking-widest uppercase ${
              activeView === item.id 
                ? 'bg-[#1a2d33] text-[#00f5d4] shadow-[inset_0_0_10px_rgba(0,245,212,0.05)] border border-[#00f5d4]/20' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Hardware Monitor (Bottom Sidebar) */}
      <div className="mt-auto p-4 bg-white/[0.01] border border-white/[0.03] rounded-[5px]">
        <div className="flex items-center justify-between mb-4">
           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">HARDWARE</span>
           <Cpu size={12} className="text-[#00f5d4]" />
        </div>
        <div className="h-12 w-full mb-4 relative overflow-hidden bg-black/40 rounded-[3px] border border-white/[0.02]">
           {/* Mock Load Graph */}
           <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 20">
             <path d="M0,10 Q25,2 50,15 T100,8" fill="none" stroke="#00f5d4" strokeWidth="1" opacity="0.6" />
           </svg>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
             <p className="text-[8px] font-black text-slate-600 uppercase">LOAD</p>
             <p className="text-[10px] font-bold text-white uppercase">20%</p>
           </div>
           <div>
             <p className="text-[8px] font-black text-slate-600 uppercase">VRAM</p>
             <p className="text-[10px] font-bold text-white uppercase">24GB</p>
           </div>
        </div>
      </div>
    </aside>
  );
};





import React, { useState } from 'react';
import { GlassCard } from '../components/GlassCard';
import { INITIAL_FILES } from '../constants';
import { IndexedFile } from '../types';
import { FileText, Search, Plus, Trash2, Database, BrainCircuit, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const [files, setFiles] = useState<IndexedFile[]>(INITIAL_FILES);
  const [indexingId, setIndexingId] = useState<string | null>(null);

  const startIndexing = (id: string) => {
    setIndexingId(id);
    setTimeout(() => {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, indexed: true, chunks: Math.floor(Math.random() * 200) + 50 } : f));
      setIndexingId(null);
    }, 2500);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Neural Brain Context</h2>
          <p className="text-slate-400">Local RAG indexing for zero-leakage enterprise knowledge.</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg neon-border">
          <Plus size={18} />
          <span>Ingest Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <GlassCard className="lg:col-span-3">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search local knowledge vectors..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-white/5">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-400 font-medium">
                <tr>
                  <th className="px-4 py-3">Source Name</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Vector Chunks</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 flex items-center gap-3">
                      <FileText size={18} className="text-purple-400" />
                      <span className="text-slate-200 font-medium">{file.name}</span>
                    </td>
                    <td className="px-4 py-4 text-slate-400">{file.size}</td>
                    <td className="px-4 py-4 text-slate-400 font-mono">{file.chunks}</td>
                    <td className="px-4 py-4">
                      {indexingId === file.id ? (
                        <span className="flex items-center gap-1.5 text-purple-400 text-xs font-medium">
                          <Loader2 size={14} className="animate-spin" />
                          Vectorizing...
                        </span>
                      ) : file.indexed ? (
                        <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                          <CheckCircle2 size={14} />
                          Active
                        </span>
                      ) : (
                        <button 
                          onClick={() => startIndexing(file.id)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-purple-400 text-xs font-medium transition-colors"
                        >
                          <BrainCircuit size={14} />
                          Index Now
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => removeFile(file.id)}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard title="Vector Stats" icon={<Database size={16}/>}>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Total Vectors</span>
                  <span className="text-slate-200 font-mono">
                    {files.reduce((acc, f) => acc + f.chunks, 0).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-purple-500 h-1.5 rounded-full w-3/4 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Retrieval Speed</span>
                  <span className="text-slate-200 font-mono">14ms</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full w-1/4 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="RAG Strategy" icon={<ShieldAlert size={16}/>}>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-400 rounded-full" />
                <span>Nomic-Embed-Text (v1.5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-400 rounded-full" />
                <span>Top-K: 5 most relevant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-purple-400 rounded-full" />
                <span>Chunk Size: 512 tokens</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};




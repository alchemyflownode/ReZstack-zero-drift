// src/components/FoundationBuilder.tsx
import React, { useState } from 'react';
import { Lock, Unlock, Plus, X, Zap, Shield, Palette } from 'lucide-react';

export interface Foundation {
  intent: { what: string; why?: string; context?: string };
  taste: { avoid: string[]; prefer: string[]; maxComplexity: number; maxLines: number; architecturalSilence: boolean };
  physics: { tier: 1|2|3; laws: string[]; semanticNaming: boolean; framework: string };
  locked: boolean;
}

interface FoundationBuilderProps {
  foundation: Foundation;
  onChange: (foundation: Foundation) => void;
  onLock: () => void;
  onUnlock: () => void;
}

export const FoundationBuilder: React.FC<FoundationBuilderProps> = ({
  foundation,
  onChange,
  onLock,
  onUnlock,
}) => {
  const [avoidInput, setAvoidInput] = useState('');
  const [preferInput, setPreferInput] = useState('');
  const [expanded, setExpanded] = useState(true);

  const physicsLaws = [
    { id: 'react-only', label: 'React Only', icon: '??' },
    { id: 'dark-mode', label: 'Dark Mode', icon: '??' },
    { id: 'no-any', label: 'No Any', icon: '??' },
    { id: 'semantic-naming', label: 'Semantic Names', icon: '??' },
    { id: 'no-class', label: 'No Classes', icon: '??' },
    { id: 'pure-functions', label: 'Pure Functions', icon: '?' },
  ];

  const addAvoid = () => {
    if (avoidInput.trim() && !foundation.taste.avoid.includes(avoidInput.trim())) {
      onChange({
        ...foundation,
        taste: { ...foundation.taste, avoid: [...foundation.taste.avoid, avoidInput.trim()] },
      });
      setAvoidInput('');
    }
  };

  const removeAvoid = (item: string) => {
    onChange({
      ...foundation,
      taste: { ...foundation.taste, avoid: foundation.taste.avoid.filter(a => a !== item) },
    });
  };

  const addPrefer = () => {
    if (preferInput.trim() && !foundation.taste.prefer.includes(preferInput.trim())) {
      onChange({
        ...foundation,
        taste: { ...foundation.taste, prefer: [...foundation.taste.prefer, preferInput.trim()] },
      });
      setPreferInput('');
    }
  };

  const removePrefer = (item: string) => {
    onChange({
      ...foundation,
      taste: { ...foundation.taste, prefer: foundation.taste.prefer.filter(p => p !== item) },
    });
  };

  const toggleLaw = (law: string) => {
    const laws = foundation.physics.laws.includes(law)
      ? foundation.physics.laws.filter(l => l !== law)
      : [...foundation.physics.laws, law];
    onChange({ ...foundation, physics: { ...foundation.physics, laws } });
  };

  return (
    <div className={`p-4 rounded-xl border ${foundation.locked ? 'border-blue-500/40 bg-blue-500/5' : 'border-purple-500/20 bg-[#12121a]'}`}>
      <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-xl">??</span>
          <span>Foundation</span>
          {foundation.locked && <Lock size={14} className="text-blue-400" />}
        </div>
        <span className={`text-xs px-2 py-1 rounded ${foundation.locked ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
          {foundation.locked ? 'LOCKED' : 'EDITING'}
        </span>
      </div>

      {expanded && (
        <div className="space-y-4">
          {/* Avoid Section */}
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <Palette size={12} /> ? Avoid
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {foundation.taste.avoid.map(item => (
                <span key={item} className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/15 text-red-400 border border-red-500/30 rounded text-xs font-mono">
                  {item}
                  {!foundation.locked && (
                    <button onClick={() => removeAvoid(item)} className="opacity-70 hover:opacity-100">
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {!foundation.locked && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={avoidInput}
                  onChange={e => setAvoidInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addAvoid()}
                  placeholder="Add to avoid..."
                  className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                />
                <button onClick={addAvoid} className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30">
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Prefer Section */}
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <Shield size={12} /> ? Prefer
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {foundation.taste.prefer.map(item => (
                <span key={item} className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/15 text-green-400 border border-green-500/30 rounded text-xs font-mono">
                  {item}
                  {!foundation.locked && (
                    <button onClick={() => removePrefer(item)} className="opacity-70 hover:opacity-100">
                      <X size={12} />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {!foundation.locked && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={preferInput}
                  onChange={e => setPreferInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addPrefer()}
                  placeholder="Add preference..."
                  className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                />
                <button onClick={addPrefer} className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30">
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Physics Laws */}
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <Zap size={12} /> Physics Laws
            </div>
            <div className="grid grid-cols-2 gap-2">
              {physicsLaws.map(law => (
                <button
                  key={law.id}
                  onClick={() => !foundation.locked && toggleLaw(law.id)}
                  disabled={foundation.locked}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                    foundation.physics.laws.includes(law.id)
                      ? 'bg-blue-500/15 border border-blue-500/40 text-blue-400'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                  } ${foundation.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span>{law.icon}</span>
                  <span>{law.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Lock/Unlock */}
          <button
            onClick={foundation.locked ? onUnlock : onLock}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              foundation.locked
                ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400 hover:bg-amber-500/25'
                : 'bg-blue-500/15 border border-blue-500/40 text-blue-400 hover:bg-blue-500/25'
            }`}
          >
            {foundation.locked ? <Unlock size={16} /> : <Lock size={16} />}
            {foundation.locked ? 'Unlock Foundation' : 'Lock Foundation'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FoundationBuilder;

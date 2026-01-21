// src/components/WelcomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { Loader, Cpu, Zap, AlertTriangle } from 'lucide-react';
import { gpuAnalyzer, SystemProfile } from '../services/gpu-analyzer';

export const WelcomeScreen: React.FC<{ onComplete: (p: SystemProfile) => void }> = ({ onComplete }) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [profile, setProfile] = useState<SystemProfile | null>(null);

  useEffect(() => {
    gpuAnalyzer.analyze().then(setProfile).finally(() => setAnalyzing(false));
  }, []);

  if (analyzing) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Analyzing Your System</h2>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Analysis Failed</h2>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-500 text-white rounded-lg">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Welcome to RezStack</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800/50 rounded p-4">
              <div className="text-sm text-gray-400">GPU</div>
              <div className="text-white font-medium">{profile.gpu.name} ({profile.gpu.vramGB}GB)</div>
            </div>
            <div className="bg-gray-800/50 rounded p-4">
              <div className="text-sm text-gray-400">Ollama</div>
              <div className="text-white font-medium">{profile.ollama.modelsInstalled.length} models</div>
            </div>
          </div>
          {profile.recommendations.warnings.map((w, i) => (
            <div key={i} className="text-sm text-yellow-200 bg-yellow-500/10 border border-yellow-500/30 rounded p-2 mb-2">{w}</div>
          ))}
        </div>
        <button onClick={() => onComplete(profile)} className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
          <Zap className="w-5 h-5" />Start Coding
        </button>
      </div>
    </div>
  );
};

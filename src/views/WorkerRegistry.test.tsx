import React from "react";
import { Cpu } from "lucide-react";

export const WorkerRegistry = () => {
  return (
    <div className="p-6 bg-[#09090b] min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">Worker Registry Test</h1>
        <div className="bg-gray-900/50 border border-purple-500/30 rounded-xl p-8 text-center">
          <Cpu size={48} className="mx-auto mb-4 text-purple-400" />
          <p className="text-gray-300">If you can see this, React is working!</p>
          <p className="text-sm text-gray-500 mt-2">The issue is with the worker-registry import.</p>
        </div>
      </div>
    </div>
  );
};

export default WorkerRegistry;

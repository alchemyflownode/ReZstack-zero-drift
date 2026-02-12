import React, { useState, useEffect } from "react";
import { workerRegistry, WorkerInfo } from "../services/worker-registry";
import { 
  Cpu, 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw 
} from "lucide-react";

export const WorkerRegistry = () => {
  console.log('🔧 WorkerRegistry mounting...');
  
  const [workers, setWorkers] = useState<WorkerInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('📦 WorkerRegistry useEffect running');
    
    try {
      // Check if workerRegistry exists
      if (!workerRegistry) {
        throw new Error('workerRegistry is undefined');
      }
      console.log('✅ workerRegistry loaded:', workerRegistry);
      
      // Check if getWorkers method exists
      if (typeof workerRegistry.getWorkers !== 'function') {
        throw new Error('workerRegistry.getWorkers is not a function');
      }
      
      // Subscribe to worker updates
      const unsubscribe = workerRegistry.subscribe((updatedWorkers) => {
        console.log('👷 Workers updated:', updatedWorkers);
        setWorkers(updatedWorkers);
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => {
        console.log('🧹 Cleaning up WorkerRegistry');
        unsubscribe();
      };
    } catch (err) {
      console.error('❌ Worker registry error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load worker registry');
      setLoading(false);
    }
  }, []);

  // If error, show error message
  if (error) {
    console.log('⚠️ Showing error state:', error);
    return (
      <div className="flex items-center justify-center h-screen bg-[#09090b]">
        <div className="text-center max-w-md p-8 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertTriangle size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold text-white mb-2">Worker Registry Error</h2>
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // If loading, show loading spinner
  if (loading) {
    console.log('⏳ Showing loading state');
    return (
      <div className="flex items-center justify-center h-screen bg-[#09090b]">
        <div className="text-center">
          <Cpu size={48} className="mx-auto mb-4 text-purple-500 animate-pulse" />
          <p className="text-gray-400">Loading worker registry...</p>
        </div>
      </div>
    );
  }

  // If no workers, show empty state
  if (!workers || workers.length === 0) {
    console.log('📭 No workers found');
    return (
      <div className="flex items-center justify-center h-screen bg-[#09090b]">
        <div className="text-center max-w-md p-8 bg-gray-900/50 border border-gray-800 rounded-xl">
          <Cpu size={48} className="mx-auto mb-4 text-gray-600" />
          <h2 className="text-xl font-bold text-white mb-2">No Workers Found</h2>
          <p className="text-gray-400 text-sm mb-4">
            The worker registry is empty. Initializing default workers...
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show workers!
  console.log(`✅ Rendering ${workers.length} workers`);
  const stats = workerRegistry.getStats();

  return (
    <div className="p-6 space-y-6 bg-[#09090b] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Worker Registry</h1>
          <p className="text-sm text-gray-400">
            Sovereign AI workers and their current status
          </p>
        </div>
        <button
          onClick={() => {
            console.log('🔄 Resetting workers');
            workerRegistry.resetAllWorkers();
          }}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <RefreshCw size={14} />
          Reset All Workers
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Total Workers</div>
          <div className="text-2xl font-bold text-white">{stats.totalWorkers}</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Active Workers</div>
          <div className="text-2xl font-bold text-blue-400">{stats.activeWorkers}</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Total Tasks</div>
          <div className="text-2xl font-bold text-white">{stats.totalTasks}</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-green-400">{stats.successRate.toFixed(1)}%</div>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((worker) => (
          <div
            key={worker.id}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 hover:border-purple-500/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 flex items-center justify-center">
                  <Cpu size={16} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{worker.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block ${
                    worker.type === 'constitutional' ? 'bg-purple-500/20 text-purple-400' :
                    worker.type === 'security' ? 'bg-red-500/20 text-red-400' :
                    worker.type === 'learning' ? 'bg-green-500/20 text-green-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {worker.type}
                  </span>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 ${
                worker.status === 'idle' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' :
                worker.status === 'busy' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                worker.status === 'error' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                'bg-gray-800/50 text-gray-600 border-gray-700'
              }`}>
                {worker.status === 'idle' && <Activity size={12} />}
                {worker.status === 'busy' && <Cpu size={12} className="animate-pulse" />}
                {worker.status === 'error' && <AlertTriangle size={12} />}
                {worker.status === 'offline' && <XCircle size={12} />}
                {worker.status}
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="text-xs text-gray-500">Capabilities:</div>
              <div className="flex flex-wrap gap-1">
                {worker.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-2 py-0.5 bg-gray-800 rounded-full text-gray-400"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {worker.currentTask && (
              <div className="text-xs bg-gray-800/50 rounded-lg p-2 mb-2">
                <span className="text-gray-500">Current task:</span>
                <span className="text-purple-400 ml-2">{worker.currentTask}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 pt-2 border-t border-gray-800">
              <span>Tasks: {worker.performance.tasksCompleted}</span>
              <span>Success: {worker.performance.successRate.toFixed(1)}%</span>
              <span>Last active: {new Date(worker.lastActive).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkerRegistry;

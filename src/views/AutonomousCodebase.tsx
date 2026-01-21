import React, { useState, useEffect } from 'react';
import { 
  Brain, Cpu, Shield, GitBranch, RefreshCw, 
  CheckCircle, AlertTriangle, Clock, BarChart3,
  Zap, Database, Code, TestTube, Package,
  Play, RotateCcw
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { autonomousCodebaseManager } from '../services/autonomous-codebase-service';
import type { 
  CodebaseDiagnosis, 
  AutonomousAction, 
  CodebaseMetrics 
} from '../services/autonomous-codebase-service';

export const AutonomousCodebase: React.FC = () => {
  const [diagnoses, setDiagnoses] = useState<CodebaseDiagnosis[]>([]);
  const [actions, setActions] = useState<AutonomousAction[]>([]);
  const [metrics, setMetrics] = useState<CodebaseMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  
  const loadInitialDiagnoses = async () => {
    setIsAnalyzing(true);
    try {
      const newDiagnoses = await autonomousCodebaseManager.analyzeCodebase('.');
      setDiagnoses(newDiagnoses);
      const generatedActions = autonomousCodebaseManager.generateAutonomousActions(newDiagnoses);
      setActions(generatedActions);
      const codebaseMetrics = await autonomousCodebaseManager.getCodebaseMetrics('.');
      setMetrics(codebaseMetrics);
      setExecutionLogs(prev => [...prev, `[Î”â‚€] Initial analysis complete: ${newDiagnoses.length} diagnoses`]);
    } catch (error: any) {
      setExecutionLogs(prev => [...prev, `[âœ—] Analysis error: ${error.message}`]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    loadInitialDiagnoses();
  }, []);
  
  const executeAction = async (action: AutonomousAction) => {
    setIsExecuting(true);
    setSelectedAction(action.id);
    try {
      const result = await autonomousCodebaseManager.executeAutonomousAction(action);
      setExecutionLogs(prev => [
        ...prev,
        `[Î”â‚€] === Starting execution: ${action.type} ===`,
        ...result.logs,
        `[Î”â‚€] === Execution ${result.success ? 'completed' : 'failed'} ===`
      ]);
      if (result.success) setActions(prev => prev.filter(a => a.id !== action.id));
    } catch (error: any) {
      setExecutionLogs(prev => [...prev, `[âœ—] Execution error: ${error.message}`]);
    } finally {
      setIsExecuting(false);
      setSelectedAction(null);
    }
  };

  const executeBatch = async () => {
    setIsExecuting(true);
    const batchResult = await autonomousCodebaseManager.executeActionBatch(actions);
    setExecutionLogs(prev => [
      ...prev,
      `[Î”â‚€] === Batch execution summary ===`,
      `Completed: ${batchResult.completed.length} actions`,
      `Failed: ${batchResult.failed.length} actions`
    ]);
    setActions(prev => prev.filter(a => 
      !batchResult.completed.some(completed => completed.id === a.id)
    ));
    setIsExecuting(false);
  };

  const getSeverityColor = (severity: CodebaseDiagnosis['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-400/10';
      case 'high': return 'text-orange-400 bg-orange-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-blue-400 bg-blue-400/10';
    }
  };

  const getActionIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'refactor': <Code className="w-5 h-5" />,
      'optimize': <Zap className="w-5 h-5" />,
      'security-scan': <Shield className="w-5 h-5" />,
      'dependency-update': <Package className="w-5 h-5" />,
      'test-generation': <TestTube className="w-5 h-5" />,
      'documentation': <Database className="w-5 h-5" />,
      'architecture-review': <GitBranch className="w-5 h-5" />
    };
    return icons[type] || <Brain className="w-5 h-5" />;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            Autonomous Codebase
          </h1>
          <p className="text-slate-400">
            Î”â‚€-deterministic codebase evolution with AI orchestration
          </p>
        </div>
        <button
          onClick={loadInitialDiagnoses}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
        >
          {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {isAnalyzing ? 'Analyzing...' : 'Re-Analyze'}
        </button>
      </div>
      
      {/* Metrics Overview */}
      {metrics && (
        <GlassCard>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-slate-400 mb-2">Maintainability</div>
              <div className="text-2xl font-bold text-emerald-400">{metrics.quality.maintainability}/100</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-slate-400 mb-2">Test Coverage</div>
              <div className="text-2xl font-bold text-blue-400">{metrics.quality.testCoverage}%</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-slate-400 mb-2">Vulnerabilities</div>
              <div className="text-2xl font-bold text-red-400">{metrics.dependencies.vulnerable}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-sm text-slate-400 mb-2">Code Duplication</div>
              <div className="text-2xl font-bold text-yellow-400">{metrics.quality.duplication}%</div>
            </div>
          </div>
        </GlassCard>
      )}
      
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column: Actions & Diagnoses */}
        <div className="col-span-2 space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-purple-400" />
                Autonomous Actions Queue
                <span className="text-sm px-2 py-1 bg-white/10 rounded">{actions.length} pending</span>
              </h2>
              <button
                onClick={executeBatch}
                disabled={isExecuting || actions.length === 0}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              >
                <Play className="w-4 h-4" /> Execute All ({actions.length})
              </button>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {actions.map((action) => (
                <div 
                  key={action.id}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedAction === action.id ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${action.riskLevel === 'high' ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                        {getActionIcon(action.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{action.type}</h3>
                          <span className={`text-xs px-2 py-1 rounded ${action.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {action.riskLevel} risk
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 mt-1">{action.description}</p>
                        <p className="text-xs text-slate-500 mt-2">Target: {action.target}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => executeAction(action)}
                      disabled={isExecuting}
                      className={`px-3 py-1.5 text-sm rounded flex items-center gap-2 ${
                        action.requiresApproval ? 'bg-purple-600/20 text-purple-400' : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:opacity-90'
                      }`}
                    >
                      {action.requiresApproval ? 'Review' : 'Execute'}
                    </button>
                  </div>
                </div>
              ))}
              {actions.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No pending autonomous actions.</p>
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Codebase Diagnoses
            </h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {diagnoses.map((diagnosis, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${getSeverityColor(diagnosis.severity)}`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{diagnosis.issue}</h4>
                        <p className="text-sm text-slate-400">{diagnosis.component}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Conf: {(diagnosis.confidence * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mt-2">{diagnosis.suggestion}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
        
        {/* Right Column: Logs & Status */}
        <div className="space-y-6">
          <GlassCard className="h-full flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Execution Logs
            </h2>
            <div className="h-[400px] overflow-y-auto font-mono text-xs bg-black/30 rounded-lg p-3 mb-4 flex-1">
              {executionLogs.map((log, i) => (
                <div key={i} className={`mb-1 ${log.includes('[âœ“]') ? 'text-emerald-400' : log.includes('[âœ—]') ? 'text-red-400' : 'text-slate-400'}`}>
                  {log}
                </div>
              ))}
              {executionLogs.length === 0 && <div className="text-slate-500 text-center py-8">No logs yet</div>}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Î”â‚€ Deterministic Mode: Active</span>
              {isExecuting && <span className="animate-pulse text-emerald-400">Running...</span>}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};



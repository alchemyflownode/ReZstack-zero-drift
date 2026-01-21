// src/components/RezTools.tsx - COMPLETE DEBUGGING TOOLKIT
import React, { useState, useEffect } from 'react';
import { 
  Zap, RefreshCw, Trash2, Bug, Wrench, Cpu, MemoryStick, 
  Thermometer, Activity, Shield, Download, Upload, 
  Play, StopCircle, Terminal, Code, Database, 
  Settings, HelpCircle, AlertTriangle, CheckCircle,
  ChevronDown, ChevronRight, FolderOpen, FileCode,
  GitBranch, Package, Server, Globe, Wifi, WifiOff,
  X, Maximize2, Minimize2, AlertOctagon, FileText,
  Copy, ExternalLink, RotateCcw, Filter
} from 'lucide-react';

interface RezToolsProps {
  onClose?: () => void;
  onRestart?: () => void;
  onClearCache?: () => void;
  isOpen?: boolean;
}

export const RezTools: React.FC<RezToolsProps> = ({ 
  onClose, 
  onRestart, 
  onClearCache,
  isOpen = true 
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'debug' | 'system' | 'network'>('quick');
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [gpuTemp, setGpuTemp] = useState(65);
  const [vramUsage, setVramUsage] = useState(45);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[00:00:00] RezTools initialized',
    '[00:00:01] Ready for debugging commands'
  ]);
  const [isRunningCommands, setIsRunningCommands] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  // Check services on mount
  useEffect(() => {
    checkServices();
    
    // Simulate GPU updates
    const gpuInterval = setInterval(() => {
      setGpuTemp(prev => {
        const change = Math.random() * 2 - 1;
        return Math.max(55, Math.min(75, prev + change));
      });
      setVramUsage(prev => {
        const change = Math.random() * 8 - 4;
        return Math.max(25, Math.min(80, prev + change));
      });
    }, 3000);

    return () => clearInterval(gpuInterval);
  }, []);

  const checkServices = async () => {
    addLog('Checking services...');
    
    // Check Ollama
    try {
      const response = await fetch('http://localhost:11434/api/tags', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setOllamaStatus('online');
        addLog('? Ollama: Online');
      } else {
        setOllamaStatus('offline');
        addLog('? Ollama: Offline (HTTP error)');
      }
    } catch {
      setOllamaStatus('offline');
      addLog('? Ollama: Offline (Connection failed)');
    }

    // Check dev server
    try {
      const response = await fetch('http://localhost:3000', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      setServerStatus('online');
      addLog('? Dev Server: Online');
    } catch {
      setServerStatus('offline');
      addLog('? Dev Server: Offline');
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setConsoleLogs(prev => [...prev.slice(-19), `[${timestamp}] ${message}`]);
  };

  const executeQuickFix = async (fixType: string) => {
    if (isRunningCommands) return;
    
    setIsRunningCommands(true);
    addLog(`? Executing: ${fixType}`);
    
    switch (fixType) {
      case 'cache':
        addLog('?? Clearing Vite cache...');
        await simulateDelay(800);
        addLog('?? Clearing npm cache...');
        await simulateDelay(800);
        addLog('? Cache cleared successfully');
        onClearCache?.();
        break;
        
      case 'restart':
        addLog('?? Restarting development server...');
        await simulateDelay(1200);
        addLog('? Server restart initiated');
        onRestart?.();
        break;
        
      case 'deps':
        addLog('?? Reinstalling dependencies...');
        await simulateDelay(1500);
        addLog('? Dependencies reinstalled');
        break;
        
      case 'build':
        addLog('?? Rebuilding project...');
        await simulateDelay(1800);
        addLog('? Build complete');
        break;
        
      case 'kill':
        addLog('?? Killing all processes...');
        await simulateDelay(600);
        addLog('? Processes terminated');
        break;
        
      case 'check':
        addLog('?? Running system check...');
        await simulateDelay(1000);
        addLog('? System check completed');
        checkServices();
        break;
    }
    
    setIsRunningCommands(false);
  };

  const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runDebugCommand = async (command: string) => {
    if (!command.trim() || isRunningCommands) return;
    
    addLog(`$ ${command}`);
    setIsRunningCommands(true);
    setCommandInput('');
    
    // Simulate command execution
    await simulateDelay(800);
    
    // Mock responses for common commands
    const responses: Record<string, string[]> = {
      'npm run dev': ['Starting development server...', 'Server running on http://localhost:3000'],
      'npm run build': ['Building for production...', 'Build complete. Ready for deployment.'],
      'npm run lint': ['Running linter...', 'No issues found.'],
      'npm test': ['Running tests...', 'All tests passed.'],
      'ollama serve': ['Starting Ollama server...', 'Ollama running on port 11434'],
      'ollama list': ['Fetching models...', 'Models: llama3.2, mistral, deepseek-coder'],
      'clear': ['Clearing console...'],
      'help': ['Available commands:', '• npm run dev - Start server', '• npm run build - Build project', '• clear - Clear console', '• check - Check services'],
      'check': ['Checking services...', 'Dev Server: Online', 'Ollama: Online']
    };
    
    const response = responses[command.toLowerCase()] || ['Command executed'];
    
    response.forEach((msg, i) => {
      setTimeout(() => addLog(msg), i * 300);
    });
    
    await simulateDelay(response.length * 350);
    setIsRunningCommands(false);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runDebugCommand(commandInput);
  };

  const copyLogs = () => {
    navigator.clipboard.writeText(consoleLogs.join('\n'));
    addLog('?? Console logs copied to clipboard');
  };

  const clearLogs = () => {
    setConsoleLogs(['[Console cleared]']);
    addLog('?? Console cleared');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'offline': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle size={14} className="text-green-400" />;
      case 'offline': return <AlertOctagon size={14} className="text-red-400" />;
      default: return <Activity size={14} className="text-yellow-400 animate-pulse" />;
    }
  };

  // Quick fixes data
  const quickFixes = [
    { id: 'cache', label: 'Clear Cache', icon: <Trash2 size={16} />, color: 'bg-red-500/20 text-red-400' },
    { id: 'restart', label: 'Restart Server', icon: <RefreshCw size={16} />, color: 'bg-blue-500/20 text-blue-400' },
    { id: 'deps', label: 'Reinstall Deps', icon: <Package size={16} />, color: 'bg-purple-500/20 text-purple-400' },
    { id: 'build', label: 'Rebuild', icon: <Code size={16} />, color: 'bg-green-500/20 text-green-400' },
    { id: 'kill', label: 'Kill Processes', icon: <StopCircle size={16} />, color: 'bg-orange-500/20 text-orange-400' },
    { id: 'check', label: 'System Check', icon: <Shield size={16} />, color: 'bg-cyan-500/20 text-cyan-400' },
  ];

  // Debug commands
  const debugCommands = [
    { command: 'npm run dev', description: 'Start development server' },
    { command: 'npm run build', description: 'Build for production' },
    { command: 'npm run lint', description: 'Run linter' },
    { command: 'npm test', description: 'Run tests' },
    { command: 'ollama serve', description: 'Start Ollama' },
    { command: 'ollama list', description: 'List models' },
    { command: 'clear', description: 'Clear console' },
    { command: 'help', description: 'Show help' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`bg-[#0d0d14] border border-[#1e1e2e] rounded-xl w-full max-w-5xl overflow-hidden flex flex-col transition-all duration-300 ${
        isMinimized ? 'max-h-20' : 'max-h-[90vh]'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d0d14] to-[#1a1a2e] border-b border-[#1e1e2e] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#4f46e5] flex items-center justify-center">
              <Wrench size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">RezTools</h2>
              <p className="text-sm text-[#9ca3af]">Development & Debugging Toolkit</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* System Status Badges */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${serverStatus === 'online' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {getStatusIcon(serverStatus)}
                <span className={`text-xs font-medium ${getStatusColor(serverStatus)}`}>
                  Dev Server
                </span>
              </div>
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${ollamaStatus === 'online' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {getStatusIcon(ollamaStatus)}
                <span className={`text-xs font-medium ${getStatusColor(ollamaStatus)}`}>
                  Ollama
                </span>
              </div>
            </div>
            
            {/* GPU Status */}
            <div className="flex items-center gap-2 px-2 py-1 bg-[#1e1e2e] rounded-md">
              <Cpu size={14} className="text-[#8b5cf6]" />
              <span className="text-xs text-[#9ca3af]">{gpuTemp}°C</span>
              <span className="text-xs text-[#9ca3af]">|</span>
              <MemoryStick size={14} className="text-[#8b5cf6]" />
              <span className="text-xs text-[#9ca3af]">{vramUsage}%</span>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-[#1e1e2e] rounded-lg transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 size={16} className="text-[#9ca3af]" /> : <Minimize2 size={16} className="text-[#9ca3af]" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#1e1e2e] rounded-lg transition-colors"
                title="Close"
              >
                <X size={16} className="text-[#9ca3af]" />
              </button>
            </div>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Tabs */}
            <div className="border-b border-[#1e1e2e] px-4 flex gap-1">
              {(['quick', 'debug', 'system', 'network'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    activeTab === tab
                      ? 'text-white'
                      : 'text-[#9ca3af] hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#8b5cf6] to-[#4f46e5]" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden p-4">
              {/* QUICK FIXES TAB */}
              {activeTab === 'quick' && (
                <div className="h-full flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-white mb-3">One-Click Fixes</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {quickFixes.map(fix => (
                        <button
                          key={fix.id}
                          onClick={() => executeQuickFix(fix.id)}
                          disabled={isRunningCommands}
                          className={`flex flex-col items-center justify-center p-4 rounded-lg border border-[#1e1e2e] hover:border-[#374151] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${fix.color}`}
                        >
                          <div className="mb-2">{fix.icon}</div>
                          <span className="text-xs font-medium">{fix.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="mt-4 p-4 bg-[#1e1e2e] rounded-lg border border-[#374151]">
                    <h3 className="text-sm font-semibold text-white mb-3">System Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-[#9ca3af]">GPU Temperature</div>
                        <div className="flex items-center gap-2">
                          <Thermometer size={14} className="text-[#ef4444]" />
                          <span className="text-sm font-semibold text-white">{gpuTemp}°C</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-[#9ca3af]">VRAM Usage</div>
                        <div className="flex items-center gap-2">
                          <MemoryStick size={14} className="text-[#8b5cf6]" />
                          <span className="text-sm font-semibold text-white">{vramUsage}%</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-[#9ca3af]">Dev Server</div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(serverStatus)}
                          <span className={`text-sm font-semibold ${getStatusColor(serverStatus)}`}>
                            {serverStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-[#9ca3af]">Ollama</div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ollamaStatus)}
                          <span className={`text-sm font-semibold ${getStatusColor(ollamaStatus)}`}>
                            {ollamaStatus.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DEBUG TAB */}
              {activeTab === 'debug' && (
                <div className="h-full flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Debug Console</h3>
                    
                    {/* Console Output */}
                    <div className="bg-black/50 rounded-lg p-3 mb-3 h-48 overflow-y-auto font-mono text-xs">
                      {consoleLogs.map((log, idx) => (
                        <div 
                          key={idx} 
                          className={`py-1 ${log.includes('?') ? 'text-green-400' : log.includes('?') ? 'text-red-400' : log.includes('?') ? 'text-yellow-400' : 'text-[#9ca3af]'}`}
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                    
                    {/* Console Controls */}
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={copyLogs}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e2e] text-[#9ca3af] text-xs rounded hover:bg-[#374151] transition-colors"
                      >
                        <Copy size={12} />
                        Copy Logs
                      </button>
                      <button
                        onClick={clearLogs}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e2e] text-[#9ca3af] text-xs rounded hover:bg-[#374151] transition-colors"
                      >
                        <Trash2 size={12} />
                        Clear
                      </button>
                    </div>
                    
                    {/* Command Input */}
                    <form onSubmit={handleCommandSubmit} className="mb-4">
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Terminal size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9ca3af]" />
                          <input
                            type="text"
                            value={commandInput}
                            onChange={(e) => setCommandInput(e.target.value)}
                            placeholder="Enter debug command..."
                            className="w-full bg-[#1e1e2e] text-white text-sm pl-10 pr-4 py-2 rounded-lg border border-[#374151] focus:outline-none focus:border-[#8b5cf6]"
                            disabled={isRunningCommands}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isRunningCommands || !commandInput.trim()}
                          className="px-4 py-2 bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6] text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isRunningCommands ? 'Running...' : 'Execute'}
                        </button>
                      </div>
                    </form>
                    
                    {/* Quick Commands */}
                    <div>
                      <h4 className="text-xs text-[#9ca3af] mb-2">Quick Commands</h4>
                      <div className="flex flex-wrap gap-2">
                        {debugCommands.map((cmd, idx) => (
                          <button
                            key={idx}
                            onClick={() => runDebugCommand(cmd.command)}
                            disabled={isRunningCommands}
                            className="px-3 py-1.5 bg-[#1e1e2e] text-[#9ca3af] text-xs rounded hover:bg-[#374151] transition-colors disabled:opacity-50"
                          >
                            {cmd.command}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SYSTEM TAB */}
              {activeTab === 'system' && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-4">System Diagnostics</h3>
                  <div className="space-y-4">
                    {/* Performance Metrics */}
                    <div className="bg-[#1e1e2e] rounded-lg p-4 border border-[#374151]">
                      <h4 className="text-xs font-semibold text-white mb-3">Performance</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs text-[#9ca3af] mb-1">
                            <span>CPU Usage</span>
                            <span>42%</span>
                          </div>
                          <div className="h-1.5 bg-[#0d0d14] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: '42%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-[#9ca3af] mb-1">
                            <span>Memory</span>
                            <span>68%</span>
                          </div>
                          <div className="h-1.5 bg-[#0d0d14] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '68%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-[#9ca3af] mb-1">
                            <span>GPU VRAM</span>
                            <span>{vramUsage}%</span>
                          </div>
                          <div className="h-1.5 bg-[#0d0d14] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6]" style={{ width: `${vramUsage}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services Status */}
                    <div className="bg-[#1e1e2e] rounded-lg p-4 border border-[#374151]">
                      <h4 className="text-xs font-semibold text-white mb-3">Services</h4>
                      <div className="space-y-2">
                        {[
                          { name: 'Development Server', status: serverStatus, port: 3000 },
                          { name: 'Ollama API', status: ollamaStatus, port: 11434 },
                          { name: 'Vite HMR', status: 'online', port: 24678 },
                          { name: 'React DevTools', status: 'online', port: 'N/A' }
                        ].map((service, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1.5">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(service.status)}
                              <span className="text-sm text-white">{service.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-[#9ca3af]">Port: {service.port}</span>
                              <span className={`text-xs font-medium ${getStatusColor(service.status)}`}>
                                {service.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => executeQuickFix('check')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1e1e2e] text-white text-sm rounded-lg border border-[#374151] hover:bg-[#374151]"
                      >
                        <RefreshCw size={14} />
                        Refresh Status
                      </button>
                      <button
                        onClick={() => window.open('http://localhost:3000', '_blank')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6] text-white text-sm rounded-lg hover:opacity-90"
                      >
                        <ExternalLink size={14} />
                        Open App
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NETWORK TAB */}
              {activeTab === 'network' && (
                <div>
                  <h3 className="text-sm font-semibold text-white mb-4">Network Diagnostics</h3>
                  <div className="space-y-4">
                    {/* Connection Tests */}
                    <div className="bg-[#1e1e2e] rounded-lg p-4 border border-[#374151]">
                      <h4 className="text-xs font-semibold text-white mb-3">Connection Tests</h4>
                      <div className="space-y-3">
                        {[
                          { url: 'http://localhost:3000', name: 'Dev Server' },
                          { url: 'http://localhost:11434', name: 'Ollama API' },
                          { url: 'https://api.github.com', name: 'GitHub API' },
                          { url: 'https://google.com', name: 'Internet' }
                        ].map((test, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Globe size={14} className="text-[#9ca3af]" />
                              <span className="text-sm text-white">{test.name}</span>
                            </div>
                            <button
                              onClick={async () => {
                                addLog(`Testing connection to ${test.url}...`);
                                try {
                                  const response = await fetch(test.url, { mode: 'no-cors' });
                                  addLog(`? ${test.name}: Reachable`);
                                } catch {
                                  addLog(`? ${test.name}: Unreachable`);
                                }
                              }}
                              className="px-3 py-1 text-xs bg-[#0d0d14] text-[#9ca3af] rounded border border-[#374151] hover:bg-[#374151]"
                            >
                              Test
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Network Info */}
                    <div className="bg-[#1e1e2e] rounded-lg p-4 border border-[#374151]">
                      <h4 className="text-xs font-semibold text-white mb-3">Network Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#9ca3af]">Host</span>
                          <span className="text-white">localhost</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#9ca3af]">Ports Open</span>
                          <span className="text-white">3000, 11434</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#9ca3af]">WebSocket</span>
                          <span className="text-green-400">Connected</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#9ca3af]">HMR</span>
                          <span className="text-green-400">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#1e1e2e] p-3 flex justify-between items-center">
              <div className="text-xs text-[#9ca3af]">
                {isRunningCommands ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#8b5cf6] rounded-full animate-pulse" />
                    <span>Running commands...</span>
                  </div>
                ) : (
                  'Ready for commands'
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.open('http://localhost:3000', '_blank')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-[#1e1e2e] text-[#9ca3af] rounded hover:bg-[#374151]"
                >
                  <ExternalLink size={12} />
                  Open App
                </button>
                <button
                  onClick={() => location.reload()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6] text-white rounded hover:opacity-90"
                >
                  <RotateCcw size={12} />
                  Reload Page
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

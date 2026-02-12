import React, { useState, useEffect } from 'react';
import { 
  Code, 
  File, 
  Folder, 
  Terminal, 
  Settings, 
  ChevronRight, 
  ChevronDown,
  Play,
  Save,
  RefreshCw,
  Cpu,
  Shield,
  Zap,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import { useMultimodalStore } from '../stores/multimodal-store';
import TerminalPanel from '../components/Terminal/TerminalPanel';

interface GenerativeIDEProps {
  initialFile?: string;
  initialContent?: string;
  availableModels?: string[];
}

const GenerativeIDE: React.FC<GenerativeIDEProps> = ({ 
  initialFile = 'untitled.ts',
  initialContent = '',
  availableModels = []
}) => {
  const [activeFile, setActiveFile] = useState(initialFile);
  const [fileContent, setFileContent] = useState(initialContent);
  const [selectedModel, setSelectedModel] = useState('llama3.2:1b');
  const [isGenerating, setIsGenerating] = useState(false);
  const [terminalPath, setTerminalPath] = useState('.');
  const [showTerminal, setShowTerminal] = useState(true);
  const [ollamaModels, setOllamaModels] = useState<string[]>([]);
  const [isOllamaConnected, setIsOllamaConnected] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState('.');
  const [showFileTree, setShowFileTree] = useState(true);
  const workspace = "G:\\okiru\\app builder";

  // Fetch Ollama models
  useEffect(() => {
    const fetchOllamaModels = async () => {
      try {
        const response = await fetch('http://localhost:11434/api/tags');
        const data = await response.json();
        const models = data.models?.map((m: any) => m.name) || [];
        setOllamaModels(models);
        setIsOllamaConnected(true);
        if (models.length > 0) {
          setSelectedModel(models[0]);
          console.log(`✅ Connected to ${models.length} Ollama models`);
        }
      } catch (error) {
        console.error('❌ Ollama connection failed');
        setIsOllamaConnected(false);
      }
    };
    fetchOllamaModels();
  }, []);

  // Fetch files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://localhost:8002/api/jarvis/file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'list',
            path: currentPath,
            workspace: workspace
          })
        });
        const data = await response.json();
        if (data.status === 'success') {
          setFiles(data.items || []);
        }
      } catch (error) {
        console.error('Failed to fetch files:', error);
      }
    };
    fetchFiles();
  }, [currentPath, workspace]);

  // Generate code with Ollama
  const generateCode = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          prompt: `Generate code for: ${prompt}`,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9
          }
        })
      });
      const data = await response.json();
      setFileContent(data.response || '// Generation failed');
    } catch (error) {
      console.error('Generation failed:', error);
      setFileContent('// Error: Could not connect to Ollama');
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-fix code - WITH CORRECT REGEX SYNTAX
  const autoFixCode = (code: string, language: string): { fixed: string; fixes: string[] } => {
    let fixed = code;
    const fixes: string[] = [];
    
    // Fix 1: Replace var with let/const
    if (fixed.includes('var ')) {
      fixed = fixed.replace(/var /g, 'let ');
      fixes.push('Replaced var with let');
    }
    
    // Fix 2: Add missing semicolons
    if (!fixed.includes(';')) {
      fixed = fixed.replace(/\n/g, ';\n');
      fixes.push('Added missing semicolons');
    }
    
    // Fix 3: Fix equality operators
    if (fixed.includes('== ')) {
      fixed = fixed.replace(/== /g, '=== ');
      fixes.push('Replaced == with ===');
    }
    
    // Fix 4: Add braces to single-line if statements
    if (fixed.match(/if\s*\(.*\)\s*\n\s*[^{].*;/)) {
      fixed = fixed.replace(/if\s*\((.*)\)\s*\n\s*([^{].*;)/g, 'if ($1) {\n    $2\n  }');
      fixes.push('Added braces to if statements');
    }
    
    // Fix 5: Replace cloneDeep with structuredClone
    if (fixed.includes('cloneDeep')) {
      fixed = fixed.replace(/cloneDeep\(/g, 'structuredClone(');
      // ✅ CORRECT SYNTAX - ONE /g FLAG, NOT TWO
      fixed = fixed.replace(/import {.*cloneDeep.*} from 'lodash';/g, '');
      fixes.push('Replaced cloneDeep with structuredClone');
    }
    
    return { fixed, fixes };
  };

  // Handle fix button click
  const handleFixCode = () => {
    const { fixed, fixes } = autoFixCode(fileContent, 'typescript');
    setFileContent(fixed);
    console.log('Applied fixes:', fixes);
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="h-14 border-b border-gray-800 bg-[#09090b]/90 backdrop-blur-md flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Code className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-bold text-sm">SOVEREIGN <span className="text-purple-500">GENERATIVE IDE</span></h1>
          
          {/* Ollama Status */}
          <div className="flex items-center gap-2 ml-4 px-3 py-1.5 bg-[#1a1a1a] border border-purple-500/30 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${isOllamaConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-gray-400">Ollama</span>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-xs text-purple-300 border-none outline-none font-mono"
              disabled={!isOllamaConnected}
            >
              {ollamaModels.map((model) => (
                <option key={model} value={model} className="bg-[#1a1a1a]">
                  {model}
                </option>
              ))}
            </select>
            <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded-full text-purple-300">
              {ollamaModels.length} models
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFileTree(!showFileTree)}
            className="px-3 py-1.5 rounded-lg text-xs bg-[#1a1a1a] text-gray-300 hover:bg-purple-500/20 transition-colors"
          >
            <Folder className="w-3.5 h-3.5 inline mr-1" />
            {showFileTree ? 'Hide' : 'Show'} Files
          </button>
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
              showTerminal ? 'bg-purple-500/20 text-purple-300' : 'bg-[#1a1a1a] text-gray-400'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Terminal
          </button>
          <button
            onClick={handleFixCode}
            className="px-3 py-1.5 rounded-lg text-xs bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5" />
            Auto-Fix
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        {showFileTree && (
          <div className="w-64 border-r border-gray-800 bg-[#0a0a0a] overflow-y-auto">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-mono text-gray-400">EXPLORER</h3>
                <span className="text-[10px] text-gray-600">{workspace.split('\\').pop()}</span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-300 hover:bg-white/5 rounded cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-gray-600" />
                  <Folder className="w-3.5 h-3.5 text-yellow-500/70" />
                  <span>src</span>
                </div>
                {files.filter(f => f.type === 'directory').map((dir, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-300 hover:bg-white/5 rounded cursor-pointer ml-4">
                    <ChevronRight className="w-3 h-3 text-gray-600" />
                    <Folder className="w-3.5 h-3.5 text-yellow-500/70" />
                    <span>{dir.name}</span>
                  </div>
                ))}
                {files.filter(f => f.type === 'file').slice(0, 10).map((file, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-300 hover:bg-white/5 rounded cursor-pointer ml-4">
                    <File className="w-3.5 h-3.5 text-blue-400/70" />
                    <span>{file.name}</span>
                    <span className="text-[9px] text-gray-600 ml-auto">
                      {file.size < 1024 ? `${file.size}B` : `${(file.size/1024).toFixed(0)}KB`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-auto">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg h-full">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono text-gray-300">{activeFile}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 text-gray-500 hover:text-white rounded">
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <textarea
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                className="w-full h-[calc(100%-40px)] p-4 bg-transparent font-mono text-sm text-gray-300 outline-none resize-none"
                placeholder="// Start coding or generate with AI..."
              />
            </div>
          </div>

          {/* AI Generation Input */}
          <div className="px-4 pb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Describe what code to generate..."
                className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                    generateCode((e.target as HTMLInputElement).value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input[placeholder*="Describe what code"]') as HTMLInputElement;
                  if (input?.value) {
                    generateCode(input.value);
                    input.value = '';
                  }
                }}
                disabled={isGenerating}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Terminal */}
      {showTerminal && (
        <div className="fixed bottom-4 right-4 w-[600px] z-50 shadow-2xl border border-purple-500/30 rounded-xl overflow-hidden">
          <TerminalPanel 
            workspace={workspace}
            currentPath={terminalPath}
            onPathChange={setTerminalPath}
          />
        </div>
      )}
    </div>
  );
};

export default GenerativeIDE;

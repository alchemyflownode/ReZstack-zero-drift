// ============================================================================
// src/views/SovereignIDE.tsx - THE COMPLETE CONSTITUTIONAL IDE
// ============================================================================

import React, { useState } from 'react';
import { FileExplorer } from '@/components/FileExplorer';
import { CodeEditor } from '@/components/CodeEditor';
import { ChatView } from './ChatView';
import { Terminal, PanelLeft, PanelBottom, PanelRight, Activity, Shield, Scale } from 'lucide-react';

export const SovereignIDE: React.FC = () => {
  const [layout, setLayout] = useState<'default' | 'chat-right' | 'terminal-bottom'>('default');
  const [currentFile, setCurrentFile] = useState<string>('/src/App.tsx');
  const [fileContent, setFileContent] = useState<string>('// Select a file to edit');
  const [showExplorer, setShowExplorer] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);

  // Mock file content
  const getFileContent = (path: string) => {
    if (path.includes('App.tsx')) {
      return `import React from 'react';
import { ChatView } from './views/ChatView';

const App = () => {
  return <ChatView />;
};

export default App;`;
    }
    return '// File not loaded';
  };

  return (
    <div className="h-screen flex flex-col bg-[#09090b] text-white">
      {/* Menu Bar */}
      <div className="h-8 bg-gray-950 border-b border-gray-800 flex items-center px-4 text-xs">
        <div className="flex items-center gap-4">
          <span className="font-bold text-purple-400">SOVEREIGN IDE</span>
          <span className="text-gray-600">File</span>
          <span className="text-gray-600">Edit</span>
          <span className="text-gray-600">Selection</span>
          <span className="text-gray-600">View</span>
          <span className="text-gray-600">Go</span>
          <span className="text-purple-400">Terminal</span>
          <span className="text-gray-600">Help</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-gray-500">CONSTITUTIONAL</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex">
        {/* File Explorer */}
        {showExplorer && (
          <div className="w-64 border-r border-gray-800">
            <FileExplorer 
              root="G:/okiru/app builder/RezStackFinal2/RezStackFinal"
              onFileSelect={(path) => {
                setCurrentFile(path);
                setFileContent(getFileContent(path));
              }}
            />
          </div>
        )}

        {/* Editor + Chat */}
        <div className="flex-1 flex flex-col">
          {/* Editor */}
          <div className="flex-1">
            <CodeEditor
              path={currentFile}
              content={fileContent}
              language={currentFile.split('.').pop() || 'typescript'}
              onChange={setFileContent}
            />
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className="h-64 border-t border-gray-800">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-mono text-gray-300">JARVIS@constitutional:~$</span>
                  </div>
                  <button onClick={() => setShowTerminal(false)} className="text-gray-600 hover:text-white">
                    ×
                  </button>
                </div>
                <div className="flex-1 bg-gray-950/50 p-3 font-mono text-xs overflow-y-auto">
                  <div className="text-purple-400">╔════════════════════════════════════════╗</div>
                  <div className="text-purple-400">║     JARVIS APP ENHANCER v3.1          ║</div>
                  <div className="text-purple-400 mb-3">╚════════════════════════════════════════╝</div>
                  <div className="text-gray-400 mb-1">$ scan .</div>
                  <div className="text-emerald-400 mb-2">✅ Scan complete: 112 files, 65 fixable issues</div>
                  <div className="text-gray-400 mb-1">$ fix</div>
                  <div className="text-emerald-400">✅ Fixed 65 issues • Backups created • Ready</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Constitutional Council Panel */}
        <div className="w-64 border-l border-gray-800 p-4 bg-gray-950/30">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              CONSTITUTIONAL COUNCIL
            </h3>
          </div>
          
          <div className="space-y-3">
            {[
              { name: 'phi4:latest', role: 'Chief Justice', color: 'purple' },
              { name: 'qwen2.5-coder:7b', role: 'Lead Architect', color: 'blue' },
              { name: 'deepseek-coder:latest', role: 'Bytecode Specialist', color: 'emerald' },
              { name: 'glm4:latest', role: 'Constitutional Scholar', color: 'amber' },
              { name: 'llama3.2:latest', role: 'Balanced Advisor', color: 'gray' }
            ].map((justice, i) => (
              <div key={i} className="p-2 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 bg-${justice.color}-500 rounded-full animate-pulse`} />
                  <span className="text-xs font-medium">{justice.name.split(':')[0]}</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">{justice.role}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-2 text-xs text-purple-400 mb-2">
              <Shield className="w-3 h-3" />
              <span>Zero-Drift Engine</span>
            </div>
            <div className="text-[10px] text-gray-400">
              • 65 fixable issues detected
              • 32 auto-fixable
              • 189 constitutional features
            </div>
            <button className="w-full mt-3 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-xs font-medium">
              🔧 Auto-Enhance
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-gray-950 border-t border-gray-800 flex items-center px-4 text-[10px] text-gray-600">
        <div className="flex items-center gap-4">
          <span>✨ Sovereign IDE</span>
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            7/8 services
          </span>
          <span className="flex items-center gap-1">
            <Scale className="w-3 h-3 text-purple-400" />
            Constitutional
          </span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <span>Ln 12, Col 24</span>
          <span>UTF-8</span>
          <span>TypeScript React</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            JARVIS Ready
          </span>
        </div>
      </div>
    </div>
  );
};
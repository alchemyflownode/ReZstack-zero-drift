// ============================================================================
// src/components/CodeEditor.tsx - VS CODE STYLE EDITOR
// ============================================================================

import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  path: string;
  content: string;
  language: string;
  onChange: (content: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ path, content, language, onChange }) => {
  const editorRef = useRef<any>(null);

  const getLanguage = (path: string) => {
    if (path.endsWith('.tsx')) return 'typescript';
    if (path.endsWith('.ts')) return 'typescript';
    if (path.endsWith('.jsx')) return 'javascript';
    if (path.endsWith('.js')) return 'javascript';
    if (path.endsWith('.py')) return 'python';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.md')) return 'markdown';
    if (path.endsWith('.bat')) return 'bat';
    if (path.endsWith('.ps1')) return 'powershell';
    return 'plaintext';
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{path.split('/').pop()}</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">
            {getLanguage(path)}
          </span>
          {path.includes('constitutional') && (
            <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
              ⚖️ CONSTITUTIONAL
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 rounded">
            💾 Save
          </button>
          <button className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-700 rounded">
            🔍 Scan
          </button>
        </div>
      </div>
      
      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={getLanguage(path)}
          language={getLanguage(path)}
          value={content}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'JetBrains Mono, monospace',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            renderWhitespace: 'selection',
            contextmenu: true,
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
          }}
        />
      </div>
      
      {/* Editor Footer */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-gray-900 border-t border-gray-800 text-[10px] text-gray-600">
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            JARVIS Ready
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>✨ 65 issues</span>
          <span>⚡ 32 fixable</span>
        </div>
      </div>
    </div>
  );
};
// ============================================================================
// src/components/FileExplorer.tsx - VS CODE STYLE FILE TREE
// ============================================================================

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, File, Folder, GitBranch, Search } from 'lucide-react';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
  extension?: string;
}

export const FileExplorer: React.FC<{ root: string; onFileSelect: (path: string) => void }> = ({ 
  root, 
  onFileSelect 
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock file tree - replace with actual FS API
  const fileTree: FileNode[] = [
    {
      name: 'src',
      path: '/src',
      type: 'directory',
      children: [
        { name: 'App.tsx', path: '/src/App.tsx', type: 'file', extension: 'tsx' },
        { name: 'main.tsx', path: '/src/main.tsx', type: 'file', extension: 'tsx' },
        { 
          name: 'views', 
          path: '/src/views', 
          type: 'directory',
          children: [
            { name: 'ChatView.tsx', path: '/src/views/ChatView.tsx', type: 'file', extension: 'tsx' },
            { name: 'GenerativeIDE.tsx', path: '/src/views/GenerativeIDE.tsx', type: 'file', extension: 'tsx' }
          ]
        },
        {
          name: 'components',
          path: '/src/components',
          type: 'directory',
          children: [
            { name: 'SovereignMessage.tsx', path: '/src/components/SovereignMessage.tsx', type: 'file', extension: 'tsx' }
          ]
        },
        {
          name: 'services',
          path: '/src/services',
          type: 'directory',
          children: [
            { name: 'jarvis_app_enhancer.py', path: '/src/services/jarvis_app_enhancer.py', type: 'file', extension: 'py' },
            { name: 'constitutional_council.py', path: '/src/services/constitutional_council.py', type: 'file', extension: 'py' }
          ]
        }
      ]
    },
    { name: 'package.json', path: '/package.json', type: 'file', extension: 'json' },
    { name: 'README.md', path: '/README.md', type: 'file', extension: 'md' },
    { name: 'SOVEREIGN.bat', path: '/SOVEREIGN.bat', type: 'file', extension: 'bat' }
  ];

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const getFileIcon = (extension: string) => {
    switch(extension) {
      case 'tsx': return '⚛️';
      case 'py': return '🐍';
      case 'json': return '📋';
      case 'md': return '📝';
      case 'bat': return '⚙️';
      default: return '📄';
    }
  };

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    
    return (
      <div key={node.path}>
        <div
          className="flex items-center gap-1 px-2 py-1 hover:bg-gray-800/50 rounded cursor-pointer text-xs"
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'directory') {
              toggleFolder(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
        >
          {node.type === 'directory' ? (
            <>
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              <Folder className="w-4 h-4 text-blue-400" />
            </>
          ) : (
            <>
              <span className="w-3 h-3" />
              <span className="w-4 h-4 text-center">{getFileIcon(node.extension || '')}</span>
            </>
          )}
          <span className="text-gray-300">{node.name}</span>
          {node.extension === 'tsx' && (
            <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">React</span>
          )}
          {node.extension === 'py' && node.name.includes('constitutional') && (
            <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">⚖️</span>
          )}
        </div>
        
        {node.type === 'directory' && isExpanded && node.children?.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-950/50 border-r border-gray-800">
      {/* Explorer Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Folder className="w-4 h-4" />
            EXPLORER
          </h3>
          <GitBranch className="w-4 h-4 text-purple-400" />
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-600" />
          <input
            type="text"
            placeholder="Search files..."
            className="w-full bg-gray-900 border border-gray-800 rounded pl-7 pr-3 py-1.5 text-xs focus:outline-none focus:border-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="text-[10px] text-gray-600 px-2 py-1">WORKSPACE: {root}</div>
        {fileTree.map(node => renderNode(node))}
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-gray-800 text-[10px] text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span>JARVIS Enhancer Ready</span>
        </div>
      </div>
    </div>
  );
};
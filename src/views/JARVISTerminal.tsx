import React, { useState } from 'react';
import { Terminal, Send } from 'lucide-react';

interface JARVISTerminalProps {
  workspace: string;
  currentPath: string;
  onPathChange: (path: string) => void;
}

const JARVISTerminal: React.FC<JARVISTerminalProps> = ({ workspace, currentPath, onPathChange }) => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([
    '╔════════════════════════════════════════╗',
    '║     SOVEREIGN TERMINAL v3.5           ║',
    '║     ✅ CAT COMMAND ENABLED            ║',
    '║     Connected to: ' + workspace.split('\\').pop(),
    '╚════════════════════════════════════════╝',
    '',
    '🦊 Type "ls" - list files',
    '🦊 Type "cd <dir>" - change directory',
    '🦊 Type "cat <file>" - VIEW FILE CONTENTS',
    '🦊 Type "scan" - find issues',
    '🦊 Type "fix" - auto-heal',
    ''
  ]);

  const executeCommand = async () => {
    if (!command.trim()) return;
    
    const fullCmd = command.trim();
    const args = fullCmd.split(' ');
    const baseCmd = args[0].toLowerCase();
    
    setOutput(prev => [...prev, `🦊 JARVIS@${workspace.split('\\').pop()}:${currentPath === '.' ? '~' : currentPath}$ ${fullCmd}`]);
    setCommand('');

    try {
      // ===== LS COMMAND =====
      if (baseCmd === 'ls' || baseCmd === 'dir') {
        setOutput(prev => [...prev, '📁 Reading directory...']);
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
          const dirs = data.items.filter((i: any) => i.type === 'directory');
          const files = data.items.filter((i: any) => i.type === 'file');
          
          setOutput(prev => [...prev, `📂 ${data.path}/ - ${data.count} items`]);
          dirs.forEach((d: any) => setOutput(prev => [...prev, `  📁 ${d.name}/`]));
          files.forEach((f: any) => {
            const size = f.size < 1024 ? `${f.size}B` :
                        f.size < 1048576 ? `${(f.size/1024).toFixed(1)}KB` :
                        `${(f.size/1048576).toFixed(1)}MB`;
            setOutput(prev => [...prev, `  📄 ${f.name} (${size})`]);
          });
          setOutput(prev => [...prev, '']);
        }
      }
      
      // ===== CD COMMAND =====
      else if (baseCmd === 'cd') {
        const target = args[1] || '.';
        if (target === '..') {
          const parent = currentPath === '.' ? '.' : 
            currentPath.split('/').filter(Boolean).slice(0, -1).join('/');
          onPathChange(parent || '.');
          setOutput(prev => [...prev, `📂 ${parent || '~'}`]);
        } else if (target === '~' || target === '/') {
          onPathChange('.');
          setOutput(prev => [...prev, '📂 ~']);
        } else {
          const newPath = currentPath === '.' ? target : `${currentPath}/${target}`;
          onPathChange(newPath);
          setOutput(prev => [...prev, `📂 ${newPath}`]);
        }
      }
      
      // ===== PWD COMMAND =====
      else if (baseCmd === 'pwd') {
        setOutput(prev => [...prev, `📂 ${currentPath === '.' ? '~' : currentPath}`]);
      }
      
      // ===== CAT COMMAND - THIS IS FIXED AND WORKING =====
      else if (baseCmd === 'cat' || baseCmd === 'type' || baseCmd === 'view') {
        const filename = args[1];
        if (!filename) {
          setOutput(prev => [...prev, '❌ Usage: cat <filename>', '']);
        } else {
          setOutput(prev => [...prev, `📄 Reading ${filename}...`, '']);
          
          const response = await fetch('http://localhost:8002/api/jarvis/file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              action: 'read',
              path: currentPath,
              filename: filename,
              workspace: workspace
            })
          });
          
          const data = await response.json();
          
          if (data.status === 'success') {
            const lines = data.content.split('\n');
            setOutput(prev => [...prev, 
              '╔════════════════════════════════════════╗',
              `║ File: ${filename}`,
              `║ Path: ${data.path || currentPath}`,
              `║ Size: ${data.size} bytes • ${data.lines} lines`,
              '╚════════════════════════════════════════╝',
              ''
            ]);
            
            // Show lines with line numbers
            lines.slice(0, 50).forEach((line: string, i: number) => {
              const lineNum = (i + 1).toString().padStart(4, ' ');
              setOutput(prev => [...prev, `${lineNum} │ ${line}`]);
            });
            
            if (lines.length > 50) {
              setOutput(prev => [...prev, `... and ${lines.length - 50} more lines`]);
            }
            setOutput(prev => [...prev, '']);
          } else {
            setOutput(prev => [...prev, `❌ ${data.message || 'File not found'}`, '']);
          }
        }
      }
      
      // ===== SCAN COMMAND =====
      else if (baseCmd === 'scan') {
        setOutput(prev => [...prev, '🔍 Scanning for issues...', '']);
        const response = await fetch('http://localhost:8002/api/jarvis/enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            command: 'scan',
            workspace: workspace,
            path: currentPath
          })
        });
        const data = await response.json();
        setOutput(prev => [...prev, 
          `✅ Scan complete: ${data.files_scanned} files`,
          `   Issues: ${data.issues_found}`,
          `   Critical: ${data.critical || 0}`,
          `   High: ${data.high || 0}`,
          `   Medium: ${data.medium || 0}`,
          `   Low: ${data.low || 0}`,
          `   Fixable: ${data.fixable}`,
          ''
        ]);
      }
      
      // ===== FIX COMMAND =====
      else if (baseCmd === 'fix') {
        setOutput(prev => [...prev, '🔧 Fixing issues...', '']);
        const response = await fetch('http://localhost:8002/api/jarvis/enhance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            command: 'fix',
            workspace: workspace,
            path: currentPath
          })
        });
        const data = await response.json();
        setOutput(prev => [...prev, 
          `✅ Fixed ${data.issues_fixed} issues!`,
          `   Failed: ${data.failed}`,
          `   Backups: ${data.backup_created ? 'Created' : 'None'}`,
          ''
        ]);
      }
      
      // ===== CLEAR COMMAND =====
      else if (baseCmd === 'clear' || baseCmd === 'cls') {
        setOutput([]);
      }
      
      // ===== HELP COMMAND =====
      else if (baseCmd === 'help' || baseCmd === '?') {
        setOutput(prev => [...prev, 
          '',
          '╔════════════════════════════════════════╗',
          '║     SOVEREIGN TERMINAL COMMANDS       ║',
          '╚════════════════════════════════════════╝',
          '',
          '📁 FILESYSTEM:',
          '  ls              - List files in current directory',
          '  cd <dir>        - Change directory (.., ~, or path)',
          '  pwd             - Show current directory path',
          '  cat <file>      - ✅ VIEW FILE CONTENTS (WORKING)',
          '  type <file>     - Same as cat',
          '  view <file>     - Same as cat',
          '',
          '🔧 JARVIS:',
          '  scan            - Scan for security issues',
          '  fix             - Auto-fix fixable issues',
          '',
          '⚡ GENERAL:',
          '  clear, cls      - Clear terminal screen',
          '  help, ?         - Show this help message',
          '',
          '✨ CAT COMMAND IS NOW ENABLED! Try: cat complete-test.js',
          ''
        ]);
      }
      
      else {
        setOutput(prev => [...prev, `❌ Unknown command: ${baseCmd}`, '']);
      }
    } catch (error) {
      setOutput(prev => [...prev, '❌ Error: ' + (error.message || 'Command failed'), '']);
    }
  };

  return (
    <div className="mt-4 border border-purple-500/30 rounded-xl overflow-hidden bg-gray-950 shadow-lg">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-purple-900/30 to-gray-900 border-b border-purple-500/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-mono text-purple-300 font-bold">
            🦊 JARVIS@{workspace.split('\\').pop()}:{currentPath === '.' ? '~' : currentPath}$
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-gray-400">ONLINE</span>
          </span>
          <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded-full text-purple-300 border border-purple-500/30">
            CAT READY
          </span>
        </div>
      </div>
      
      {/* Terminal Output */}
      <div className="h-64 overflow-y-auto p-3 font-mono text-xs bg-gray-950/90">
        {output.map((line, i) => {
          if (line.includes('🦊')) 
            return <div key={i} className="text-purple-400 whitespace-pre-wrap font-medium">{line}</div>;
          if (line.includes('✅')) 
            return <div key={i} className="text-emerald-400 whitespace-pre-wrap">{line}</div>;
          if (line.includes('❌')) 
            return <div key={i} className="text-red-400 whitespace-pre-wrap">{line}</div>;
          if (line.includes('📁') || line.includes('📂')) 
            return <div key={i} className="text-blue-400 whitespace-pre-wrap">{line}</div>;
          if (line.includes('📄')) 
            return <div key={i} className="text-yellow-400 whitespace-pre-wrap">{line}</div>;
          if (line.includes('╔') || line.includes('║') || line.includes('╚')) 
            return <div key={i} className="text-purple-500 whitespace-pre-wrap">{line}</div>;
          if (line.match(/^\s*\d+\s*│/)) 
            return <div key={i} className="text-gray-300 whitespace-pre-wrap font-mono">{line}</div>;
          return <div key={i} className="text-gray-300 whitespace-pre-wrap">{line}</div>;
        })}
      </div>
      
      {/* Terminal Input */}
      <div className="flex items-center px-3 py-2 bg-gray-900/80 border-t border-purple-500/30">
        <span className="text-purple-400 mr-2 text-xs font-bold">🦊</span>
        <span className="text-purple-400 mr-2 text-xs">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
          placeholder="cat complete-test.js"
          className="flex-1 bg-transparent border-none outline-none text-xs text-gray-200 placeholder-gray-600 font-mono"
          autoFocus
        />
        <button 
          onClick={executeCommand} 
          className="ml-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
        >
          <Send className="w-3 h-3" />
          Run
        </button>
      </div>
    </div>
  );
};

export default JARVISTerminal;

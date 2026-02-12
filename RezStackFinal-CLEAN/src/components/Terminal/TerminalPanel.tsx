import React, { useState } from 'react';
import { Terminal, Send } from 'lucide-react';

export const TerminalPanel = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([
    'Sovereign Terminal v3.1',
    'Type "help" for commands',
    ''
  ]);

  const executeCommand = () => {
    if (!command.trim()) return;
    setOutput(prev => [...prev, `$ ${command}`, 'Command received', '']);
    setCommand('');
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-gray-900 border border-purple-500/30 rounded-xl overflow-hidden">
      <div className="bg-purple-900/20 px-4 py-2 border-b border-purple-500/30">
        <span className="text-xs font-mono text-purple-400">🦊 JARVIS Terminal</span>
      </div>
      <div className="h-48 overflow-y-auto p-3 font-mono text-xs bg-gray-950">
        {output.map((line, i) => (
          <div key={i} className="text-gray-300">{line}</div>
        ))}
      </div>
      <div className="flex p-2 bg-gray-900/50 border-t border-purple-500/30">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
          className="flex-1 bg-transparent border-none outline-none text-xs text-gray-300 font-mono"
          placeholder="Enter command..."
        />
        <button onClick={executeCommand} className="ml-2 p-1 bg-purple-600 rounded">
          <Send size={12} />
        </button>
      </div>
    </div>
  );
};

export default TerminalPanel;

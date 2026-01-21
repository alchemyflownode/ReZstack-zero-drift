// src/components/Terminal/TerminalOutput.tsx
import React, { useEffect, useRef } from "react";
import { Copy, Trash2, Download } from "lucide-react";
import { useTerminalStore } from "../../stores/terminal-store";

export const TerminalOutput: React.FC = () => {
  const { terminalMessages, clearTerminal, autoScroll } = useTerminalStore();
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalMessages, autoScroll]);

  const copyToClipboard = () => {
    const text = terminalMessages.map((msg) => msg.text).join("\n");
    navigator.clipboard.writeText(text);
  };

  const exportAsFile = () => {
    const text = terminalMessages.map((msg) => msg.text).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `terminal-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 border-t border-gray-800">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-3 text-sm font-mono text-gray-400">RezStack Terminal</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-200"
            title="Copy terminal output"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={exportAsFile}
            className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-200"
            title="Export as file"
          >
            <Download size={16} />
          </button>
          <button
            onClick={clearTerminal}
            className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-200"
            title="Clear terminal"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm"
      >
        {terminalMessages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-1 whitespace-pre-wrap break-words ${
              msg.type === "command"
                ? "text-purple-400"
                : msg.type === "error"
                ? "text-red-400"
                : msg.type === "success"
                ? "text-green-400"
                : "text-gray-300"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Terminal Footer */}
      <div className="px-4 py-2 bg-gray-900 border-t border-gray-800 text-xs text-gray-500">
        {terminalMessages.length} lines • Ready
      </div>
    </div>
  );
};

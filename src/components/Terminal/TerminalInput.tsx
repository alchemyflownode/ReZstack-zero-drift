// src/components/Terminal/TerminalInput.tsx
import React, { useState, useRef, useEffect } from "react";
import { Send, History, Square } from "lucide-react";
import { useTerminalStore } from "../../stores/terminal-store";

interface Props {
  onCommandExecuted?: (command: string) => void;
}

export const TerminalInput: React.FC<Props> = ({ onCommandExecuted }) => {
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showHistory, setShowHistory] = useState(false);
  const { executeCommand, stopCommand, isExecuting, commandHistory, getHistoryByQuery } =
    useTerminalStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl+C to stop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && isExecuting) {
        e.preventDefault();
        stopCommand();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExecuting, stopCommand]);

  const handleExecute = async () => {
    if (!input.trim() || isExecuting) return;

    await executeCommand(input);
    setInput("");
    setHistoryIndex(-1);
    onCommandExecuted?.(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleExecute();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const index = historyIndex + 1;
      if (index < commandHistory.length) {
        setHistoryIndex(index);
        setInput(commandHistory[index].command);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const index = historyIndex - 1;
        setHistoryIndex(index);
        setInput(commandHistory[index].command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Basic autocomplete - could be enhanced
      const suggestions = getHistoryByQuery(input);
      if (suggestions.length > 0) {
        setInput(suggestions[0].command);
      }
    }
  };

  const filteredHistory = input.trim()
    ? getHistoryByQuery(input).slice(0, 5)
    : commandHistory.slice(0, 5);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 px-4 py-3 bg-gray-900 border-t border-gray-800">
        <span className="text-purple-400 font-mono text-sm">$</span>
        <span className="text-gray-400 font-mono text-sm">rezonic</span>

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setHistoryIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 100)}
            placeholder="review . --fix | status | ask 'your question'"
            className="w-full bg-transparent text-gray-100 font-mono text-sm outline-none placeholder-gray-600"
            disabled={isExecuting}
          />

          {/* History Dropdown */}
          {showHistory && filteredHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
              {filteredHistory.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setInput(item.command);
                    setShowHistory(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-700 text-gray-300 text-sm font-mono border-b border-gray-700 last:border-b-0"
                >
                  {item.command}
                  <span className="text-gray-500 text-xs ml-2">
                    {(item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : "")}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-gray-200"
          title="Command history"
          disabled={isExecuting}
        >
          <History size={16} />
        </button>

        {isExecuting && (
          <button
            onClick={stopCommand}
            className="p-2 hover:bg-red-600/30 rounded text-red-400 hover:text-red-300 animate-pulse"
            title="Stop command (Ctrl+C)"
          >
            <Square size={16} fill="currentColor" />
          </button>
        )}

        <button
          onClick={handleExecute}
          disabled={isExecuting || !input.trim()}
          className="p-2 hover:bg-purple-600/30 rounded text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Execute command (Enter)"
        >
          {isExecuting ? (
            <div className="animate-spin">
              <Send size={16} />
            </div>
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>

      {/* Helper Text */}
      <div className="px-4 py-1 bg-gray-950 text-xs text-gray-500 border-t border-gray-800">
        ðŸ’¡ Tip: Press â†‘/â†“ for history, Tab for autocomplete
      </div>
    </div>
  );
};



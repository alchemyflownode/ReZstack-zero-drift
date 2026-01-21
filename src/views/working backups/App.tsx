import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  Brain,
  MessageSquare,
  Bot,
  User,
  Send,
  Settings,
  Sparkles,
  Code,
  ImageIcon,
  Cpu,
  CheckCircle,
  XCircle,
  RefreshCw,
  Monitor,
  Globe,
  FolderOpen,
  Download,
} from "lucide-react";
import { useMultimodalStore } from "./stores/multimodal-store";
import { DependencyHealthPanel } from "./components/DependencyHealthPanel";
import { TerminalPanel } from "./components/Terminal/TerminalPanel";
import { useElectron } from "./hooks/useElectron";
import { Dashboard } from "./views/Dashboard";
import { Orchestrator } from "./views/Orchestrator";
import { RezonicCanvas } from "./views/RezonicCanvas";
import { AutonomousCodebase } from "./views/AutonomousCodebase";
import { KnowledgeBase } from "./views/KnowledgeBase";
import { WorkerRegistry } from "./views/WorkerRegistry";
import { GenerativeIDE } from "./views/GenerativeIDE";
import "./index.css";

// Chat View Component
function ChatView() {
  const {
    messages,
    sendMessage,
    availableModels,
    selectedModel,
    setSelectedModel,
    ollamaStatus,
    checkOllamaConnection,
    loadModels,
    clearMessages,
    isGenerating,
  } = useMultimodalStore();

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Electron integration
  const { isElectron, electron } = useElectron();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    const initialize = async () => {
      await checkOllamaConnection();
      await loadModels();

      if (isElectron) {
        console.log("?? Running in Electron");
      }
    };
    initialize();
  }, [isElectron]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isGenerating) return;
    await sendMessage(inputText);
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Desktop-exclusive: Select project folder
  const handleSelectFolder = async () => {
    if (!electron) return;
    const folder = await electron.openFolder();
    if (folder) {
      setSelectedFolder(folder);
      setInputText(`Analyze the codebase at: ${folder}\n\n`);
    }
  };

  // Desktop-exclusive: Save chat history
  const handleSaveChat = async () => {
    if (!electron) return;
    const chatContent = messages
      .map((m) => `[${m.isUser ? "You" : m.model}]: ${m.content}`)
      .join("\n\n");

    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const filename = `chat-${timestamp}.txt`;

    const savedPath = await electron.saveFile(chatContent);
    if (savedPath) {
      alert(`Chat saved to: ${savedPath}`);
    }
  };

  const quickActions = [
    { icon: <Sparkles size={16} />, label: "Creative", prompt: "Write a short story about" },
    { icon: <Code size={16} />, label: "Code", prompt: "Write a Python function that" },
    { icon: <ImageIcon size={16} />, label: "Explain", prompt: "Explain how" },
    { icon: <Brain size={16} />, label: "Brainstorm", prompt: "Give me ideas for" },
  ];

  if (isElectron) {
    quickActions.push({
      icon: <FolderOpen size={16} />,
      label: "Analyze Folder",
      prompt: "Analyze the codebase structure of",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/90 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="text-purple-500" size={28} />
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold">RezStack AI</h1>
                  {isElectron ? (
                    <span className="px-2 py-0.5 text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full flex items-center">
                      <Monitor size={12} className="mr-1" />
                      Desktop
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs bg-green-600/20 text-green-400 border border-green-500/30 rounded-full flex items-center">
                      <Globe size={12} className="mr-1" />
                      Web
                    </span>
                  )}
                </div>
                <div className="flex items-center text-xs">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      ollamaStatus.isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                    }`}
                  ></div>
                  <span className={ollamaStatus.isConnected ? "text-green-400" : "text-red-400"}>
                    {ollamaStatus.isChecking
                      ? "Checking..."
                      : ollamaStatus.isConnected
                      ? "Ollama Connected"
                      : "Ollama Disconnected"}
                  </span>
                  <span className="mx-2">•</span>
                  <span className="text-gray-400">{availableModels.length} models</span>
                  {selectedFolder && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="text-purple-400 truncate max-w-xs" title={selectedFolder}>
                        ?? {selectedFolder.split(/[/\\]/).pop()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {isElectron && (
                <>
                  <button
                    onClick={handleSelectFolder}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center space-x-2"
                    title="Select project folder"
                  >
                    <FolderOpen size={18} />
                    <span className="text-sm">Open Folder</span>
                  </button>
                  <button
                    onClick={handleSaveChat}
                    disabled={messages.length === 0}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
                    title="Save chat history"
                  >
                    <Download size={18} />
                  </button>
                </>
              )}

              <button
                onClick={checkOllamaConnection}
                disabled={ollamaStatus.isChecking}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 flex items-center"
                title="Recheck connection"
              >
                <RefreshCw size={18} className={ollamaStatus.isChecking ? "animate-spin" : ""} />
              </button>
              <button
                onClick={clearMessages}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                title="Clear chat"
              >
                <Settings size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="container mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-1/4 space-y-6">
          {isElectron && (
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl border border-blue-500/30 p-4">
              <h3 className="font-semibold mb-2 flex items-center text-blue-400">
                <Monitor size={18} className="mr-2" />
                Desktop Mode
              </h3>
              <div className="text-xs space-y-1 text-gray-400">
                <div>
                  Platform: <span className="text-gray-300">{electron?.platform}</span>
                </div>
                <div>
                  Electron: <span className="text-gray-300">{electron?.version.electron}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-500/20">
                <div className="text-xs text-green-400 flex items-center">
                  <CheckCircle size={14} className="mr-1" />
                  File System Access Enabled
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(action.prompt + " ")}
                  className="w-full text-left p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 transition-colors flex items-center"
                >
                  <span className="mr-3">{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Cpu size={18} className="mr-2" />
              AI Models ({availableModels.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableModels.map((model) => (
                <button
                  key={model}
                  onClick={() => setSelectedModel(model)}
                  disabled={isGenerating}
                  className={`w-full text-left p-3 rounded-lg transition-colors disabled:opacity-50 ${
                    selectedModel === model
                      ? "bg-purple-600/30 border border-purple-500/30"
                      : "bg-gray-800/50 hover:bg-gray-700/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bot size={16} className="mr-3" />
                      <span className="truncate text-sm">{model}</span>
                    </div>
                    {selectedModel === model && <CheckCircle size={14} className="text-green-400" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <DependencyHealthPanel />
        </aside>

        {/* Main Chat Area */}
        <main className="lg:w-3/4 flex-1 flex flex-col">
          <div className="flex-1 bg-gray-900/30 rounded-xl border border-gray-800 p-6 mb-6 overflow-y-auto max-h-[65vh]">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-medium mb-2">Start a Conversation</h3>
                <p>Select a model and type your first message</p>
                {isElectron && (
                  <div className="mt-4 text-sm text-blue-400">
                    ?? Try clicking "Open Folder" to analyze a codebase
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                        msg.isUser
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                          : msg.thinking
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white animate-pulse"
                          : msg.model === "error"
                          ? "bg-gradient-to-r from-red-600 to-orange-600 text-white"
                          : "bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 border border-gray-700 rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            msg.isUser
                              ? "bg-blue-500"
                              : msg.thinking
                              ? "bg-purple-500"
                              : msg.model === "error"
                              ? "bg-red-500"
                              : "bg-purple-600"
                          }`}
                        >
                          {msg.isUser ? (
                            <User size={16} />
                          ) : msg.thinking ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : msg.model === "error" ? (
                            <XCircle size={16} />
                          ) : (
                            <Bot size={16} />
                          )}
                        </div>
                        <div>
                          <span className="font-medium">
                            {msg.isUser
                              ? "You"
                              : msg.thinking
                              ? "Thinking..."
                              : msg.model === "error"
                              ? "Error"
                              : "AI"}
                          </span>
                          {msg.model && !msg.isUser && !msg.thinking && msg.model !== "error" && (
                            <span className="text-xs ml-2 opacity-70">({msg.model})</span>
                          )}
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message... (Shift+Enter for new line)"
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none min-h-[80px]"
                  rows={3}
                  disabled={isGenerating || !ollamaStatus.isConnected}
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-500">
                  {isGenerating ? "AI is thinking..." : "Press Enter to send"}
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={isGenerating || !inputText.trim() || !ollamaStatus.isConnected}
                className="self-end px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send size={18} className="mr-2" />
                    Send
                  </>
                )}
              </button>
            </div>
            <div className="mt-4 text-xs text-gray-500 flex justify-between">
              <span>
                {ollamaStatus.isConnected
                  ? `? Connected to Ollama v${ollamaStatus.version}`
                  : "? Ollama not connected"}
              </span>
              <span>
                Model: <span className="text-purple-400">{selectedModel}</span>
              </span>
            </div>
          </div>
        </main>
      </div>

      <footer className="mt-8 border-t border-gray-800 py-4 text-center text-gray-500 text-sm">
        <p>
          100% Local • No Data Collection • Powered by Ollama • Your Privacy Matters
          {isElectron && <span className="ml-2 text-blue-400">• Running in Desktop Mode</span>}
        </p>
      </footer>

      <TerminalPanel />
    </div>
  );
}

// Main App with Routing
function App() {
  const { availableModels } = useMultimodalStore();
  
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="/chat" element={<ChatView />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/orchestrator" element={<Orchestrator />} />
      <Route path="/canvas" element={<RezonicCanvas />} />
      <Route path="/codebase" element={<AutonomousCodebase />} />
      <Route path="/knowledge" element={<KnowledgeBase />} />
      <Route path="/workers" element={<WorkerRegistry />} />
      <Route path="/ide" element={<GenerativeIDE availableModels={availableModels} />} />
    </Routes>
  );
}

export default App;

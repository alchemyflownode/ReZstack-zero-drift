import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MultimodalStoreProvider } from './stores/multimodal-store';

// ===== ALL RESTORED VIEWS =====
import GenerativeIDE from './views/GenerativeIDE';
import ChatView from './views/ChatView';
import Dashboard from './views/Dashboard';
import Orchestrator from './views/Orchestrator';
import WorkerRegistry from './views/WorkerRegistry';
import KnowledgeBase from './views/KnowledgeBase';
import AutonomousCodebase from './views/AutonomousCodebase';
import RezonicCanvas from './views/RezonicCanvas';
import JARVISTerminal from './views/JARVISTerminal';

// ===== UI COMPONENTS =====
import TerminalPanel from './components/Terminal/TerminalPanel';
import { GlassCard } from './components/ui/GlassCard';
import { Sidebar } from './components/ui/Sidebar';
import { ModelSelector } from './components/ui/ModelSelector';
import { RoutingDisplay } from './components/ui/RoutingDisplay';

const AppContent: React.FC = () => {
  const [terminalPath, setTerminalPath] = React.useState('.');
  const workspace = "G:\\okiru\\app builder";

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Routes>
        {/* DEFAULT TO GENERATIVE IDE */}
        <Route path="/" element={<Navigate to="/ide" replace />} />
        <Route path="/ide" element={<GenerativeIDE />} />
        <Route path="/chat" element={<ChatView />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orchestrator" element={<Orchestrator />} />
        <Route path="/workers" element={<WorkerRegistry />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/codebase" element={<AutonomousCodebase />} />
        <Route path="/canvas" element={<RezonicCanvas />} />
        <Route path="/terminal" element={<JARVISTerminal 
          workspace={workspace}
          currentPath={terminalPath}
          onPathChange={setTerminalPath}
        />} />
      </Routes>
      
      {/* FLOATING TERMINAL - AVAILABLE EVERYWHERE */}
      <TerminalPanel 
        workspace={workspace}
        currentPath={terminalPath}
        onPathChange={setTerminalPath}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MultimodalStoreProvider>
        <AppContent />
      </MultimodalStoreProvider>
    </BrowserRouter>
  );
};

export default App;


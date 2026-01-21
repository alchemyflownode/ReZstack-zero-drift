import { Routes, Route, Navigate } from "react-router-dom";
import { ChatView } from "./views/ChatView";  // Changed to named import with curly braces
import { Dashboard } from "./views/Dashboard";
import { Orchestrator } from "./views/Orchestrator";
import { RezonicCanvas } from "./views/RezonicCanvas";
import { AutonomousCodebase } from "./views/AutonomousCodebase";
import { KnowledgeBase } from "./views/KnowledgeBase";
import { WorkerRegistry } from "./views/WorkerRegistry";
import { GenerativeIDE } from "./views/GenerativeIDE";
import { useMultimodalStore } from "./stores/multimodal-store";
import "./index.css";

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

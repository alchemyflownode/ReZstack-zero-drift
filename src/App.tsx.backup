import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatView from './views/ChatView';
import { GenerativeIDE } from './views/GenerativeIDE';
import { Orchestrator } from './views/Orchestrator';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="/chat" element={<ChatView />} />
      <Route path="/ide" element={<GenerativeIDE />} />
      <Route path="/orchestrator" element={<Orchestrator />} />
    </Routes>
  );
};

export default App;

// View exports - Use named imports
export { Dashboard } from './Dashboard';
export { Orchestrator } from './Orchestrator';
export { KnowledgeBase } from './KnowledgeBase';
import GenerativeIDE from './GenerativeIDE';
export { WorkerRegistry } from './WorkerRegistry';
export { RezonicCanvas } from './RezonicCanvas';
export { AutonomousCodebase } from './AutonomousCodebase';
import Home from './Home';
import TestPage from './TestPage';

// Named exports
export {
  Dashboard,
  Orchestrator, 
  KnowledgeBase,
  GenerativeIDE,
  WorkerRegistry,
  RezonicCanvas,
  AutonomousCodebase,
  Home,
  TestPage
};

// Default export for compatibility
const views = {
  Dashboard,
  Orchestrator,
  KnowledgeBase,
  GenerativeIDE,
  WorkerRegistry,
  RezonicCanvas,
  AutonomousCodebase,
  Home,
  TestPage
};

export default views;


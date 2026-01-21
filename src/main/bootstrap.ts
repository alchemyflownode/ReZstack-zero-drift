// src/main/bootstrap.ts
import { SovereignOrchestrator } from './sovreign-orchestrator';

async function bootstrap() {
  // ... existing code ...
  
  const mainWindow = new BrowserWindow({ /* ... */ });
  
  // Initialize Sovereign Orchestrator
  const sovereign = new SovereignOrchestrator(mainWindow);
  sovereign.setupIPC();
  
  // Start monitoring when window is ready
  mainWindow.on('ready-to-show', () => {
    sovereign.startMonitoring();
  });
  
  // ... rest of bootstrap ...
}

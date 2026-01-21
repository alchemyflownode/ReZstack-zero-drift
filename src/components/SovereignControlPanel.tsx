// G:\okiru\app builder\RezStackFinal\src\components\SovereignControlPanel.tsx
import React, { useState, useEffect } from 'react';
import { SovereignBridgeClient } from '../api/sovereignBridge';

export const SovereignControlPanel: React.FC = () => {
  const [hardwareStatus, setHardwareStatus] = useState<any>(null);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [sovereigntyScore, setSovereigntyScore] = useState(0);
  
  useEffect(() => {
    // Fetch hardware status on mount
    fetchHardwareStatus();
    
    // Listen for sovereign events from chat
    window.addEventListener('sovereign-log', handleSovereignLog);
    window.addEventListener('execution-update', handleExecutionUpdate);
    
    return () => {
      window.removeEventListener('sovereign-log', handleSovereignLog);
      window.removeEventListener('execution-update', handleExecutionUpdate);
    };
  }, []);
  
  const fetchHardwareStatus = async () => {
    try {
      const status = await fetch('http://localhost:8001/hardware/status').then(r => r.json());
      setHardwareStatus(status);
      
      // Calculate overall sovereignty score
      const scores = [status.gpu_control.score, status.memory_sovereignty.score];
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      setSovereigntyScore(avgScore);
      
    } catch (error) {
      console.error('Failed to fetch hardware status:', error);
    }
  };
  
  const handleSovereignLog = (event: CustomEvent) => {
    // Update chat or show notification
    console.log('Sovereign Log:', event.detail);
  };
  
  const handleExecutionUpdate = (event: CustomEvent) => {
    // Update 3D visualization
    updateVisualization(event.detail);
  };
  
  const compileAndExecute = async (sceBytecode: any) => {
    try {
      // Step 1: Compile with sovereignty
      const result = await SovereignBridgeClient.compileToSovereign(sceBytecode);
      
      // Step 2: Stream execution
      const eventSource = await SovereignBridgeClient.executeSovereignPlan(result.plan_hash);
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Update progress bar
        if (data.progress) {
          setExecutionProgress(data.progress * 100);
        }
        
        // Update 3D visualization
        if (data.type === 'KERNEL_VISUALIZATION') {
          updateKernelVisualization(data);
        }
      };
      
    } catch (error) {
      console.error('Execution failed:', error);
    }
  };
  
  const updateVisualization = (data: any) => {
    // Update your IDE's WebGL/Three.js visualization
    // This would connect to your existing 3D view
  };
  
  const updateKernelVisualization = (kernelData: any) => {
    // Visualize kernel execution in 3D
  };
  
  return (
    <div className="sovereign-control-panel">
      {/* Sovereignty Score Gauge */}
      <div className="sovereignty-gauge">
        <div className="gauge-label">SOVEREIGNTY SCORE</div>
        <div className="gauge-value">
          {(sovereigntyScore * 100).toFixed(1)}%
        </div>
        <div className="gauge-bar">
          <div 
            className="gauge-fill"
            style={{ width: `${sovereigntyScore * 100}%` }}
          />
        </div>
      </div>
      
      {/* Hardware Status */}
      {hardwareStatus && (
        <div className="hardware-status">
          <h3>🖥️ Hardware Sovereignty</h3>
          <div className="status-grid">
            <div className="status-item">
              <span className="label">GPU Control</span>
              <span className={`value ${hardwareStatus.gpu_control.controlled ? 'good' : 'bad'}`}>
                {hardwareStatus.gpu_control.controlled ? '✅' : '❌'}
              </span>
            </div>
            <div className="status-item">
              <span className="label">Memory</span>
              <span className="value">
                {hardwareStatus.memory_sovereignty.score * 100}%
              </span>
            </div>
            <div className="status-item">
              <span className="label">Thermal Headroom</span>
              <span className="value">
                {hardwareStatus.thermal_headroom}°C
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Execution Control */}
      <div className="execution-control">
        <h3>⚡ Execution Pipeline</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${executionProgress}%` }}
          />
        </div>
        <div className="control-buttons">
          <button onClick={() => compileAndExecute(currentSCE)}>
            Compile with Sovereignty
          </button>
          <button onClick={() => executeViaComfyUI(currentPlanHash)}>
            Execute via ComfyUI
          </button>
        </div>
      </div>
      
      {/* 3D Visualization Container */}
      <div className="visualization-container">
        <canvas id="sovereign-visualization" />
      </div>
    </div>
  );
};

// Add to your styles
const styles = `
.sovereign-control-panel {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 20px;
  font-family: 'JetBrains Mono', monospace;
}

.sovereignty-gauge {
  background: #1e293b;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.gauge-label {
  color: #94a3b8;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.gauge-value {
  color: #60a5fa;
  font-size: 2rem;
  font-weight: bold;
  margin: 10px 0;
}

.gauge-bar {
  height: 8px;
  background: #334155;
  border-radius: 4px;
  overflow: hidden;
}

.gauge-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  transition: width 0.5s ease;
}

.hardware-status {
  background: #1e293b;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 10px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #0f172a;
  border-radius: 4px;
}

.status-item .label {
  color: #cbd5e1;
  font-size: 0.875rem;
}

.status-item .value {
  font-weight: bold;
}

.status-item .value.good {
  color: #10b981;
}

.status-item .value.bad {
  color: #ef4444;
}

.execution-control {
  background: #1e293b;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.progress-bar {
  height: 6px;
  background: #334155;
  border-radius: 3px;
  margin: 15px 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #ec4899);
  transition: width 0.3s ease;
}

.control-buttons {
  display: flex;
  gap: 10px;
}

.control-buttons button {
  flex: 1;
  padding: 10px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-weight: bold;
}

.control-buttons button:hover {
  background: #2563eb;
}

.visualization-container {
  height: 300px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 6px;
  overflow: hidden;
}

.visualization-container canvas {
  width: 100%;
  height: 100%;
}
`;
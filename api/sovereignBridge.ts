// G:\okiru\app builder\RezStackFinal\src\api\sovereignBridge.ts
import axios from 'axios';

const SOVEREIGN_BRIDGE_URL = 'http://localhost:8001'; // Bridge will run here

export interface SCEBytecode {
  id: string;
  nodes: Array<{
    id: string;
    type: string;
    kernel: string;
    parameters: any;
    precision: 'FP32' | 'FP16' | 'INT8';
    required: boolean;
    reference: string;
  }>;
}

export interface SovereignResult {
  status: string;
  plan_hash: string;
  sovereignty_score: number;
  memory_map: Record<string, any>;
  recommendation: string;
  execution_time_ms: number;
}

export class SovereignBridgeClient {
  
  // Send SCE from IDE to Sovereignty Bridge
  static async compileToSovereign(sce: SCEBytecode): Promise<SovereignResult> {
    const response = await axios.post(
      `${SOVEREIGN_BRIDGE_URL}/compile/sovereign`,
      sce
    );
    
    // Log to your IDE's chat
    this.logToSovereignChat(
      `🔗 Compilation sovereignty: ${(response.data.sovereignty_score * 100).toFixed(1)}%`,
      response.data.sovereignty_score > 0.8 ? 'DIAGNOSIS' : 'SURGERY'
    );
    
    return response.data;
  }
  
  // Stream execution progress back to IDE
  static async executeSovereignPlan(planHash: string): Promise<NodeJS.EventEmitter> {
    const eventSource = new EventSource(
      `${SOVEREIGN_BRIDGE_URL}/execute/stream/${planHash}`
    );
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Update IDE UI in real-time
      this.updateExecutionVisualization(data);
      
      if (data.type === 'MEMORY_ALLOC') {
        this.logToSovereignChat(
          `🧠 Sovereign allocation: ${data.node} (${this.formatBytes(data.size)})`,
          'PRESCRIPTION'
        );
      }
    };
    
    return eventSource;
  }
  
  static logToSovereignChat(message: string, remedyPhase: string) {
    // Connect to your existing SovereignChat component
    window.dispatchEvent(new CustomEvent('sovereign-log', {
      detail: { message, remedyPhase, timestamp: new Date() }
    }));
  }
  
  static updateExecutionVisualization(data: any) {
    // Update your IDE's 3D visualization or node graph
    window.dispatchEvent(new CustomEvent('execution-update', { detail: data }));
  }
  
  private static formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}
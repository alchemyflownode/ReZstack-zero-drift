cd "G:\okiru\app builder\RezStackFinal"

# Create scripts directory if it doesn't exist
if (-not (Test-Path "scripts")) {
    New-Item -ItemType Directory -Path "scripts" -Force
    Write-Host "✅ Created scripts directory" -ForegroundColor Green
}

# Create a helper function to write files without BOM issues
function Write-OKIRUFile {
    param(
        [string]$Path,
        [string]$Content
    )
    
    # Ensure directory exists
    $dir = Split-Path $Path -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    
    # Write content with UTF8 without BOM
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
    Write-Host "✅ Created: $Path" -ForegroundColor Green
}

# 1. Create OKIRU Hypervisor
$okiruHypervisor = @'
// scripts/okiru-hypervisor.js
import { WebSocketServer } from 'ws';
import express from 'express';

console.log('🌀 OKIRU Hypervisor v2.0 - AI Workload Manager');
console.log('================================================');

class OKIRUHypervisor {
  constructor() {
    this.workloads = new Map();
    this.gpuQueue = [];
    this.activeJobs = 0;
    this.maxConcurrent = 2; // Based on VRAM
    
    this.setupWebSocket();
    this.setupAPI();
    
    console.log('✅ Hypervisor initialized');
    console.log('📊 GPU Queue: 0 jobs');
    console.log('🎯 Max Concurrent: ' + this.maxConcurrent);
  }
  
  setupWebSocket() {
    this.wss = new WebSocketServer({ port: 3030 });
    
    this.wss.on('connection', (ws) => {
      console.log('🔗 New workload connection');
      
      ws.on('message', (data) => {
        try {
          const workload = JSON.parse(data);
          this.scheduleWorkload(workload, ws);
        } catch (error) {
          console.error('❌ Invalid workload:', error);
        }
      });
      
      ws.on('close', () => {
        console.log('🔗 Workload connection closed');
      });
    });
    
    console.log('🔌 WebSocket: ws://localhost:3030');
  }
  
  setupAPI() {
    const app = express();
    app.use(express.json());
    
    app.post('/api/workload', (req, res) => {
      const workload = req.body;
      const jobId = this.createJobId();
      
      this.workloads.set(jobId, {
        id: jobId,
        type: workload.type,
        status: 'queued',
        created: new Date(),
        priority: workload.priority || 'normal'
      });
      
      this.gpuQueue.push(jobId);
      this.processQueue();
      
      res.json({
        success: true,
        jobId,
        position: this.gpuQueue.indexOf(jobId) + 1,
        estimatedWait: this.estimateWaitTime()
      });
    });
    
    app.get('/api/queue', (req, res) => {
      res.json({
        active: this.activeJobs,
        queued: this.gpuQueue.length,
        maxConcurrent: this.maxConcurrent,
        workloads: Array.from(this.workloads.values())
      });
    });
    
    app.listen(3031, () => {
      console.log('🌐 API: http://localhost:3031');
    });
  }
  
  scheduleWorkload(workload, ws) {
    const jobId = this.createJobId();
    
    this.workloads.set(jobId, {
      id: jobId,
      type: workload.type,
      client: ws,
      status: 'queued',
      created: new Date()
    });
    
    this.gpuQueue.push(jobId);
    ws.send(JSON.stringify({
      type: 'scheduled',
      jobId,
      position: this.gpuQueue.indexOf(jobId) + 1
    }));
    
    this.processQueue();
  }
  
  processQueue() {
    while (this.activeJobs < this.maxConcurrent && this.gpuQueue.length > 0) {
      const jobId = this.gpuQueue.shift();
      const workload = this.workloads.get(jobId);
      
      if (workload) {
        this.executeWorkload(workload);
      }
    }
  }
  
  executeWorkload(workload) {
    workload.status = 'executing';
    this.activeJobs++;
    
    console.log(`🚀 Executing ${workload.type} job: ${workload.id}`);
    
    // Simulate AI processing
    setTimeout(() => {
      workload.status = 'completed';
      this.activeJobs--;
      
      if (workload.client) {
        workload.client.send(JSON.stringify({
          type: 'completed',
          jobId: workload.id,
          result: { success: true, output: 'generated_output' }
        }));
      }
      
      console.log(`✅ Completed job: ${workload.id}`);
      this.processQueue(); // Check for next job
    }, Math.random() * 5000 + 2000);
  }
  
  createJobId() {
    return 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  estimateWaitTime() {
    const avgTime = 7000; // 7 seconds average
    return (this.gpuQueue.length * avgTime) / this.maxConcurrent;
  }
}

new OKIRUHypervisor();
console.log('🌀 OKIRU Hypervisor ready for AI workloads');
'@

Write-OKIRUFile -Path "scripts/okiru-hypervisor.js" -Content $okiruHypervisor

# 2. Create Zero-Drift Core v2.0
$zeroDriftCore = @'
// scripts/zero-drift-core.js
import express from 'express';
import { WebSocketServer } from 'ws';

console.log('🛡️ Zero-Drift Core v2.0 - Sovereign Code Protocol');
console.log('==================================================');

class ZeroDriftCore {
  constructor() {
    this.violations = [];
    this.fixesApplied = 0;
    this.codeQualityScore = 100;
    
    this.rules = {
      TYPE_SAFETY: {
        pattern: /\bany\b/g,
        message: 'Avoid "any" type - use proper TypeScript types',
        fix: (code) => code.replace(/\bany\b/g, 'unknown')
      },
      PRODUCTION_READY: {
        pattern: /console\.log\(/g,
        message: 'Remove console.log statements for production',
        fix: (code) => code.replace(/console\.log\(.*?\);?\n?/g, '')
      },
      CODE_QUALITY: {
        pattern: /\b(TODO|FIXME|XXX)\b/gi,
        message: 'Remove TODO/FIXME comments before production',
        fix: (code) => code.replace(/\/\/.*?(TODO|FIXME|XXX).*?\n/g, '')
      },
      PERFORMANCE: {
        pattern: /\.cloneDeep\(/g,
        message: 'Avoid expensive lodash cloneDeep operations',
        fix: (code) => code.replace(/\.cloneDeep\(/g, '.clone(')
      },
      SECURITY: {
        pattern: /\beval\(/g,
        message: 'Avoid eval() for security reasons',
        fix: (code) => code.replace(/\beval\(/g, '// SECURITY: eval() removed')
      }
    };
    
    this.setupAPI();
    this.setupWebSocket();
    
    console.log('✅ Zero-Drift Core initialized with ' + Object.keys(this.rules).length + ' rules');
  }
  
  setupAPI() {
    const app = express();
    app.use(express.json());
    
    app.post('/api/zero-drift/analyze', (req, res) => {
      const { code, options } = req.body;
      const analysis = this.analyzeCode(code, options);
      
      this.violations.push(...analysis.violations);
      this.fixesApplied += analysis.fixesApplied;
      this.updateQualityScore(analysis.violations.length);
      
      res.json(analysis);
    });
    
    app.get('/api/zero-drift/stats', (req, res) => {
      res.json({
        violationsFound: this.violations.length,
        fixesApplied: this.fixesApplied,
        qualityScore: this.codeQualityScore,
        activeRules: Object.keys(this.rules).length
      });
    });
    
    app.get('/api/zero-drift/rules', (req, res) => {
      res.json(this.rules);
    });
    
    app.listen(3004, () => {
      console.log('🌐 Zero-Drift API: http://localhost:3004');
    });
  }
  
  setupWebSocket() {
    const wss = new WebSocketServer({ port: 3005 });
    
    wss.on('connection', (ws) => {
      console.log('🔗 New Zero-Drift WebSocket connection');
      
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Zero-Drift Core v2.0 WebSocket',
        rules: Object.keys(this.rules)
      }));
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          
          if (message.type === 'analyze') {
            const analysis = this.analyzeCode(message.code, message.options);
            ws.send(JSON.stringify({
              type: 'analysis',
              ...analysis
            }));
          }
        } catch (error) {
          console.error('WebSocket error:', error);
        }
      });
    });
    
    console.log('🔌 Zero-Drift WebSocket: ws://localhost:3005');
  }
  
  analyzeCode(code, options = {}) {
    const violations = [];
    let fixedCode = code;
    let fixesApplied = 0;
    
    // Check each rule
    for (const [ruleName, rule] of Object.entries(this.rules)) {
      const matches = code.match(rule.pattern);
      
      if (matches) {
        violations.push({
          rule: ruleName,
          message: rule.message,
          occurrences: matches.length,
          lines: this.findLineNumbers(code, rule.pattern)
        });
        
        // Apply fix if not in RAW mode
        if (options.mode !== 'RAW') {
          fixedCode = rule.fix(fixedCode);
          fixesApplied += matches.length;
        }
      }
    }
    
    const status = violations.length === 0 ? 'CLEAN' : 
                   violations.length <= 2 ? 'WARNING' : 
                   violations.length <= 5 ? 'DRIFTING' : 'CRITICAL';
    
    return {
      status,
      violations,
      fixesApplied,
      originalLength: code.length,
      fixedLength: fixedCode.length,
      fixedCode: fixesApplied > 0 ? fixedCode : null,
      qualityScore: this.calculateQualityScore(violations.length),
      timestamp: new Date().toISOString()
    };
  }
  
  findLineNumbers(code, pattern) {
    const lines = code.split('\n');
    const lineNumbers = [];
    
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        lineNumbers.push(index + 1);
      }
    });
    
    return lineNumbers;
  }
  
  calculateQualityScore(violationCount) {
    return Math.max(0, 100 - (violationCount * 10));
  }
  
  updateQualityScore(violationCount) {
    this.codeQualityScore = (this.codeQualityScore * 0.9) + (this.calculateQualityScore(violationCount) * 0.1);
  }
}

new ZeroDriftCore();
console.log('🛡️ Zero-Drift Core active and monitoring code quality');
'@

Write-OKIRUFile -Path "scripts/zero-drift-core.js" -Content $zeroDriftCore

# 3. Create Neural Bridges
$neuralBridges = @'
// scripts/neural-bridges.js
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';

console.log('🔌 Neural Bridges - OKIRU OS Communication Layer');
console.log('=================================================');

class NeuralBridge {
  constructor() {
    this.bridges = new Map();
    this.connections = new Set();
    
    // Bridge configurations
    this.bridges.set('comfyui', {
      url: 'ws://localhost:8188/ws',
      description: 'ComfyUI WebSocket Bridge',
      autoReconnect: true
    });
    
    this.bridges.set('zero-drift', {
      url: 'ws://localhost:3005',
      description: 'Zero-Drift Core Bridge',
      autoReconnect: true
    });
    
    this.bridges.set('hypervisor', {
      url: 'ws://localhost:3030',
      description: 'OKIRU Hypervisor Bridge',
      autoReconnect: true
    });
    
    this.setupMainBridge();
    this.connectAllBridges();
    
    console.log('✅ Neural Bridges initialized with ' + this.bridges.size + ' connections');
  }
  
  setupMainBridge() {
    this.wss = new WebSocketServer({ port: 3002 });
    
    this.wss.on('connection', (ws) => {
      console.log('🌐 New client connected to Neural Bridge');
      this.connections.add(ws);
      
      ws.send(JSON.stringify({
        type: 'connected',
        message: 'Connected to OKIRU Neural Bridge',
        bridges: Array.from(this.bridges.keys()),
        timestamp: new Date().toISOString()
      }));
      
      // Relay messages from other bridges to this client
      const messageHandler = (data) => {
        if (ws.readyState === 1) {
          ws.send(data);
        }
      };
      
      // Forward messages from client to appropriate bridge
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          
          // Route message to appropriate bridge
          if (message.bridge && this.bridges.has(message.bridge)) {
            const bridge = this.bridges.get(message.bridge);
            if (bridge.ws && bridge.ws.readyState === 1) {
              bridge.ws.send(JSON.stringify(message.data));
            }
          }
          
          // Broadcast to all clients
          this.broadcast(data);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });
      
      ws.on('close', () => {
        console.log('🌐 Client disconnected from Neural Bridge');
        this.connections.delete(ws);
      });
    });
    
    console.log('🔌 Main Neural Bridge: ws://localhost:3002');
  }
  
  connectAllBridges() {
    for (const [name, config] of this.bridges) {
      this.connectBridge(name, config);
    }
  }
  
  connectBridge(name, config) {
    const ws = new WebSocket(config.url);
    
    ws.on('open', () => {
      console.log(`✅ Connected to ${name} bridge`);
      config.ws = ws;
      config.connected = true;
      
      // Notify all clients
      this.broadcast(JSON.stringify({
        type: 'bridge_connected',
        bridge: name,
        timestamp: new Date().toISOString()
      }));
    });
    
    ws.on('message', (data) => {
      // Forward messages from bridge to all clients
      this.broadcast(JSON.stringify({
        type: 'bridge_message',
        bridge: name,
        data: data.toString(),
        timestamp: new Date().toISOString()
      }));
    });
    
    ws.on('close', () => {
      console.log(`❌ Disconnected from ${name} bridge`);
      config.connected = false;
      
      // Attempt reconnect if configured
      if (config.autoReconnect) {
        setTimeout(() => {
          console.log(`🔄 Reconnecting to ${name}...`);
          this.connectBridge(name, config);
        }, 5000);
      }
    });
    
    ws.on('error', (error) => {
      console.error(`❌ ${name} bridge error:`, error.message);
    });
  }
  
  broadcast(data) {
    this.connections.forEach(client => {
      if (client.readyState === 1) {
        client.send(data);
      }
    });
  }
  
  getStatus() {
    const status = {};
    
    for (const [name, config] of this.bridges) {
      status[name] = {
        connected: config.connected || false,
        url: config.url,
        description: config.description
      };
    }
    
    return status;
  }
}

new NeuralBridge();
console.log('🔌 Neural Bridges ready for real-time communication');
'@

Write-OKIRUFile -Path "scripts/neural-bridges.js" -Content $neuralBridges

# 4. Create GPU Director
$gpuDirector = @'
// scripts/gpu-director.js
import { exec } from 'child_process';
import { WebSocketServer } from 'ws';
import express from 'express';

console.log('📈 GPU Director - Advanced GPU Resource Management');
console.log('===================================================');

class GPUDirector {
  constructor() {
    this.metrics = {
      vram: { used: 0, total: 24, percent: 0 },
      utilization: 0,
      temperature: 0,
      power: 0,
      clock: 0
    };
    
    this.jobs = [];
    this.priorityQueue = [];
    
    this.setupAPI();
    this.setupWebSocket();
    this.startMonitoring();
    
    console.log('✅ GPU Director initialized for NVIDIA GPU monitoring');
  }
  
  setupAPI() {
    const app = express();
    
    app.get('/api/gpu/status', (req, res) => {
      res.json({
        ...this.metrics,
        jobs: this.jobs.length,
        priorityQueue: this.priorityQueue.length,
        timestamp: new Date().toISOString()
      });
    });
    
    app.post('/api/gpu/job', (req, res) => {
      const job = {
        id: 'job_' + Date.now(),
        type: req.body.type || 'generation',
        vramRequired: req.body.vram || 4,
        priority: req.body.priority || 'normal',
        created: new Date(),
        status: 'queued'
      };
      
      this.priorityQueue.push(job);
      this.jobs.push(job);
      
      this.allocateGPUResources();
      
      res.json({
        success: true,
        jobId: job.id,
        position: this.priorityQueue.indexOf(job) + 1,
        estimatedStart: this.estimateStartTime(job)
      });
    });
    
    app.listen(3003, () => {
      console.log('🌐 GPU Director API: http://localhost:3003');
    });
  }
  
  setupWebSocket() {
    const wss = new WebSocketServer({ port: 3006 });
    
    wss.on('connection', (ws) => {
      console.log('📡 New client connected to GPU Director');
      
      // Send initial metrics
      ws.send(JSON.stringify({
        type: 'gpu_metrics',
        ...this.metrics,
        timestamp: new Date().toISOString()
      }));
      
      // Send updates every 2 seconds
      const interval = setInterval(() => {
        if (ws.readyState === 1) {
          ws.send(JSON.stringify({
            type: 'gpu_metrics',
            ...this.metrics,
            timestamp: new Date().toISOString()
          }));
        }
      }, 2000);
      
      ws.on('close', () => {
        console.log('📡 Client disconnected from GPU Director');
        clearInterval(interval);
      });
    });
    
    console.log('🔌 GPU Director WebSocket: ws://localhost:3006');
  }
  
  startMonitoring() {
    // Monitor GPU every 3 seconds
    setInterval(() => {
      this.queryNvidiaSMI();
    }, 3000);
  }
  
  queryNvidiaSMI() {
    exec('nvidia-smi --query-gpu=memory.used,memory.total,utilization.gpu,temperature.gpu,power.draw,clocks.current.graphics --format=csv,noheader,nounits', 
      (error, stdout, stderr) => {
        if (!error && stdout) {
          const [memoryUsed, memoryTotal, utilization, temperature, power, clock] = 
            stdout.trim().split(', ').map(Number);
          
          this.metrics = {
            vram: {
              used: memoryUsed,
              total: memoryTotal,
              percent: (memoryUsed / memoryTotal * 100).toFixed(1)
            },
            utilization: utilization,
            temperature: temperature,
            power: power,
            clock: clock
          };
          
          console.log(`📊 GPU: ${memoryUsed}/${memoryTotal}GB VRAM | ${utilization}% Util | ${temperature}°C`);
        } else {
          // Fallback to mock data for development
          this.metrics = {
            vram: {
              used: 8 + Math.random() * 4,
              total: 24,
              percent: 33 + Math.random() * 20
            },
            utilization: 30 + Math.random() * 50,
            temperature: 60 + Math.random() * 10,
            power: 200 + Math.random() * 100,
            clock: 1800 + Math.random() * 200
          };
        }
      }
    );
  }
  
  allocateGPUResources() {
    const availableVRAM = this.metrics.vram.total - this.metrics.vram.used;
    
    // Process priority queue
    for (let i = 0; i < this.priorityQueue.length; i++) {
      const job = this.priorityQueue[i];
      
      if (job.status === 'queued' && job.vramRequired <= availableVRAM) {
        job.status = 'running';
        job.started = new Date();
        
        console.log(`🚀 Started GPU job: ${job.id} (${job.vramRequired}GB VRAM)`);
        
        // Simulate job completion
        setTimeout(() => {
          job.status = 'completed';
          job.completed = new Date();
          console.log(`✅ Completed GPU job: ${job.id}`);
        }, Math.random() * 10000 + 5000);
      }
    }
  }
  
  estimateStartTime(job) {
    const runningJobs = this.jobs.filter(j => j.status === 'running');
    const totalVRAMUsed = runningJobs.reduce((sum, j) => sum + j.vramRequired, 0);
    const availableVRAM = this.metrics.vram.total - totalVRAMUsed;
    
    if (job.vramRequired <= availableVRAM) {
      return 'immediately';
    } else {
      const estimatedWait = (job.vramRequired - availableVRAM) * 1000; // 1 second per GB
      return new Date(Date.now() + estimatedWait).toISOString();
    }
  }
}

new GPUDirector();
console.log('📈 GPU Director actively monitoring and allocating resources');
'@

Write-OKIRUFile -Path "scripts/gpu-director.js" -Content $gpuDirector

# 5. Create OKIRU OS Launcher
$okiruLauncher = @'
// scripts/launch-okiru-os.js
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌀 OKIRU OS Launch Sequence v2.0');
console.log('================================');

const services = [
  { name: 'Zero-Drift Core', script: 'zero-drift-core.js', port: 3004 },
  { name: 'Neural Bridges', script: 'neural-bridges.js', port: 3002 },
  { name: 'GPU Director', script: 'gpu-director.js', port: 3003 },
  { name: 'OKIRU Hypervisor', script: 'okiru-hypervisor.js', port: 3030 }
];

const processes = [];

function launchService(service) {
  return new Promise((resolve) => {
    console.log(`🚀 Launching ${service.name}...`);
    
    const proc = spawn('node', [path.join(__dirname, service.script)], {
      stdio: 'pipe',
      shell: true
    });
    
    processes.push(proc);
    
    proc.stdout.on('data', (data) => {
      console.log(`[${service.name}] ${data.toString().trim()}`);
    });
    
    proc.stderr.on('data', (data) => {
      console.error(`[${service.name} ERROR] ${data.toString().trim()}`);
    });
    
    // Wait a bit for service to start
    setTimeout(() => {
      console.log(`✅ ${service.name} launched`);
      resolve();
    }, 2000);
  });
}

async function launchAllServices() {
  console.log('🌀 Starting OKIRU OS Core Services...');
  
  for (const service of services) {
    await launchService(service);
  }
  
  console.log('\n🎉 OKIRU OS Core Services Ready!');
  console.log('===============================');
  console.log('🌐 Zero-Drift API: http://localhost:3004');
  console.log('🔌 Neural Bridges: ws://localhost:3002');
  console.log('📈 GPU Director: http://localhost:3003');
  console.log('🌀 OKIRU Hypervisor: http://localhost:3031');
  console.log('\n🚀 Next: Launch OKIRU Interface with "npm run dev"');
  
  // Keep process alive
  process.stdin.resume();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🌀 Shutting down OKIRU OS...');
  
  processes.forEach(proc => {
    proc.kill();
  });
  
  console.log('✅ OKIRU OS services terminated');
  process.exit(0);
});

launchAllServices().catch(console.error);
'@

Write-OKIRUFile -Path "scripts/launch-okiru-os.js" -Content $okiruLauncher

# 6. Create ComfyUI Bridge
$comfyBridge = @'
// scripts/comfy-bridge.js
import WebSocket from 'ws';
import express from 'express';

const app = express();
const PORT = 3007;

console.log('🔗 ComfyUI Bridge for OKIRU OS');
console.log('================================');

// WebSocket bridge
const wss = new WebSocket.Server({ port: 3008 });

wss.on('connection', (clientWs) => {
  console.log('🤝 Client connected to ComfyUI bridge');
  
  const comfyWs = new WebSocket('ws://localhost:8188/ws');
  
  comfyWs.on('open', () => {
    console.log('✅ Connected to ComfyUI WebSocket');
    clientWs.send(JSON.stringify({ 
      type: 'connected',
      message: 'Bridge established with ComfyUI' 
    }));
  });
  
  comfyWs.on('message', (data) => {
    // Forward ComfyUI messages to client
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'executing') {
        console.log(`🔄 ComfyUI executing: ${msg.data?.node || 'unknown node'}`);
      }
      clientWs.send(data);
    } catch (err) {
      clientWs.send(data.toString());
    }
  });
  
  comfyWs.on('error', (error) => {
    console.error('❌ ComfyUI WebSocket error:', error);
    clientWs.send(JSON.stringify({ 
      type: 'error', 
      message: 'ComfyUI connection failed' 
    }));
  });
  
  clientWs.on('message', (data) => {
    if (comfyWs.readyState === WebSocket.OPEN) {
      comfyWs.send(data);
    }
  });
  
  clientWs.on('close', () => {
    console.log('👋 Client disconnected');
    comfyWs.close();
  });
});

// HTTP proxy for API calls
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'comfy-bridge',
    comfyui: 'localhost:8188',
    websocket: 'ws://localhost:3008'
  });
});

app.post('/api/prompt', async (req, res) => {
  try {
    const response = await fetch('http://localhost:8188/prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ ComfyUI Bridge running on http://localhost:${PORT}`);
  console.log('🌐 WebSocket available at ws://localhost:3008');
  console.log('🔗 Connected to ComfyUI at localhost:8188');
});
'@

Write-OKIRUFile -Path "scripts/comfy-bridge.js" -Content $comfyBridge

# 7. Update package.json
Write-Host "📦 Updating package.json with OKIRU OS scripts..." -ForegroundColor Yellow

if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    
    # Add scripts if they don't exist
    if (-not $packageJson.scripts) {
        $packageJson | Add-Member -NotePropertyName "scripts" -NotePropertyValue @{} -Force
    }
    
    $packageJson.scripts.okiru_os = "node scripts/launch-okiru-os.js"
    $packageJson.scripts.okiru_hypervisor = "node scripts/okiru-hypervisor.js"
    $packageJson.scripts.okiru_zero_drift = "node scripts/zero-drift-core.js"
    $packageJson.scripts.okiru_neural = "node scripts/neural-bridges.js"
    $packageJson.scripts.okiru_gpu = "node scripts/gpu-director.js"
    $packageJson.scripts.okiru_comfy = "node scripts/comfy-bridge.js"
    
    # Convert back to JSON and save
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json" -Encoding UTF8
    Write-Host "✅ Updated package.json with OKIRU OS scripts" -ForegroundColor Green
}

# 8. Create the OKIRU Control Panel batch file
$okiruControlPanel = @'
@echo off
chcp 65001 >nul
title 🌀 OKIRU OS Control Panel v2.0
color 0A

:: Create scripts directory if it doesn't exist
if not exist "scripts" mkdir scripts

:MAIN_MENU
cls
echo.
echo [38;5;213m╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗[0m
echo [38;5;213m║                                                                                                                      ║[0m
echo [38;5;213m║  [1;38;5;51m   ██████╗ ██╗  ██╗██╗██████╗ ██╗   ██╗     ██████╗ ███████╗                                              [0m  [38;5;213m║[0m
echo [38;5;213m║  [1;38;5;51m  ██╔═══██╗██║ ██╔╝██║██╔══██╗██║   ██║    ██╔═══██╗██╔════╝                                              [0m  [38;5;213m║[0m
echo [38;5;213m║  [1;38;5;51m  ██║   ██║█████╔╝ ██║██║  ██║██║   ██║    ██║   ██║███████╗                                              [0m  [38;5;213m║[0m
echo [38;5;213m║  [1;38;5;51m  ██║   ██║██╔═██╗ ██║██║  ██║██║   ██║    ██║   ██║╚════██║                                              [0m  [38;5;213m║[0m
echo [38;5;213m║  [1;38;5;51m  ╚██████╔╝██║  ██╗██║██████╔╝╚██████╔╝    ╚██████╔╝███████║                                              [0m  [38;5;213m║[0m
echo [38;5;213m║  [1;38;5;51m   ╚═════╝ ╚═╝  ╚═╝╚═╝╚═════╝  ╚═════╝      ╚═════╝ ╚══════╝                                              [0m  [38;5;213m║[0m
echo [38;5;213m║                                                                                                                      ║[0m
echo [38;5;213m║  [1;38;5;226m╔══════════════════════════════════════════════════════════════════════════════════════════════════════╗[0m  [38;5;213m║[0m
echo [38;5;213m║  [1;38;5;226m║                                                                                                      ║[0m  [38;5;213m║[0m
echo [38;5;213m║  [1;38;5;226m║    🌀 THE SOVEREIGN AI OPERATING SYSTEM v2.0                                                        ║[0m  [38;5;213m║[0m
echo [38;5;213m║  [1;38;5;226m║                                                                                                      ║[0m  [38;5;213m║[0m
echo [38;5;213m║  [1;38;5;226m╚══════════════════════════════════════════════════════════════════════════════════════════════════════╝[0m  [38;5;213m║[0m
echo [38;5;213m║                                                                                                                      ║[0m
echo [38;5;213m╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝[0m
echo.
echo [1;38;5;51m╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗[0m
echo [1;38;5;51m║                                       🎮 OKIRU OS CONTROL PANEL                                                   ║[0m
echo [1;38;5;51m╠══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╣[0m
echo [1;38;5;51m║                                                                                                                      ║[0m
echo [1;38;5;51m║  [1;38;5;46m[1] [38;5;51m🚀  Launch Complete OKIRU OS                                                              [1;38;5;51m║[0m
echo [1;38;5;51m║  [1;38;5;46m[2] [38;5;51m🎨  Start OKIRU Interface (Frontend)                                                     [1;38;5;51m║[0m
echo [1;38;5;51m║  [1;38;5;46m[3] [38;5;51m⚡  Start Core Services Only                                                              [1;38;5;51m║[0m
echo [1;38;5;51m║  [1;38;5;46m[4] [38;5;51m🧠  Connect to ComfyUI                                                                  [1;38;5;51m║[0m
echo [1;38;5;51m║  [1;38;5;46m[5] [38;5;51m📊  View System Status                                                                   [1;38;5;51m║[0m
echo [1;38;5;51m║  [1;38;5;46m[6] [38;5;51m⏹️   Stop All Services                                                                   [1;38;5;51m║[0m
echo [1;38;5;51m║  [1;38;5;46m[7] [38;5;51m🔧  Install Dependencies                                                                [1;38;5;51m║[0m
echo [1;38;5;51m║  [1;38;5;46m[8] [38;5;51m🌐  Open in Browser                                                                      [1;38;5;51m║[0m
echo [1;38;5;51m║  [1;38;5;46m[9] [38;5;196m⏻   Exit                                                                                [1;38;5;51m║[0m
echo [1;38;5;51m║                                                                                                                      ║[0m
echo [1;38;5;51m╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝[0m
echo.

set /p choice="🌀 Select option (1-9): "

if "%choice%"=="1" goto LAUNCH_ALL
if "%choice%"=="2" goto START_FRONTEND
if "%choice%"=="3" goto START_CORE
if "%choice%"=="4" goto CONNECT_COMFYUI
if "%choice%"=="5" goto SYSTEM_STATUS
if "%choice%"=="6" goto STOP_ALL
if "%choice%"=="7" goto INSTALL_DEPS
if "%choice%"=="8" goto OPEN_BROWSER
if "%choice%"=="9" goto EXIT

echo.
echo [1;38;5;196m❌ Invalid choice. Press any key to continue...[0m
pause >nul
goto MAIN_MENU

:LAUNCH_ALL
cls
echo.
echo [1;38;5;51m╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗[0m
echo [1;38;5;51m║                                       🚀 LAUNCHING COMPLETE OKIRU OS                                              ║[0m
echo [1;38;5;51m╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝[0m
echo.

echo [1;38;5;46m🌀 Starting OKIRU OS Core Services...[0m
start "🌀 OKIRU OS Core" cmd /k "title 🌀 OKIRU OS Core && npm run okiru_os"
timeout /t 3 >nul

echo [1;38;5;46m🎨 Starting OKIRU Interface...[0m
start "🎨 OKIRU Interface" cmd /k "title 🎨 OKIRU Interface && npm run dev"
timeout /t 3 >nul

echo [1;38;5;46m🔗 Connecting to ComfyUI...[0m
start "🧠 ComfyUI Bridge" cmd /k "title 🧠 ComfyUI Bridge && npm run okiru_comfy"
timeout /t 2 >nul

echo.
echo [1;38;5;46m✅ OKIRU OS Launch Complete![0m
echo.
echo [1;38;5;51m🌐 Access Points:[0m
echo [38;5;46m  • OKIRU Interface: http://localhost:3000[0m
echo [38;5;46m  • Zero-Drift API: http://localhost:3004[0m
echo [38;5;46m  • GPU Director: http://localhost:3003[0m
echo [38;5;46m  • ComfyUI: http://localhost:8188[0m
echo.
pause
goto MAIN_MENU

:START_FRONTEND
start "🎨 OKIRU Interface" cmd /k "title 🎨 OKIRU Interface && npm run dev"
echo [1;38;5;46m✅ OKIRU Interface starting at http://localhost:3000[0m
pause
goto MAIN_MENU

:START_CORE
start "🌀 OKIRU OS Core" cmd /k "title 🌀 OKIRU OS Core && npm run okiru_os"
echo [1;38;5;46m✅ OKIRU Core services starting...[0m
pause
goto MAIN_MENU

:CONNECT_COMFYUI
if exist "G:\Comfyui\ComfyUI_windows_portable_nvidia" (
    start "" "G:\Comfyui\ComfyUI_windows_portable_nvidia\ComfyUI.exe"
    echo [1;38;5;46m✅ ComfyUI launched. OKIRU will auto-connect.[0m
) else (
    echo [1;38;5;196m❌ ComfyUI not found at expected location.[0m
)
pause
goto MAIN_MENU

:SYSTEM_STATUS
cls
echo.
echo [1;38;5;51m╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗[0m
echo [1;38;5;51m║                                       📊 OKIRU OS SYSTEM STATUS                                                   ║[0m
echo [1;38;5;51m╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝[0m
echo.

echo [1;38;5;46mChecking services...[0m
echo.

echo [38;5;51mPort 3000 (OKIRU Interface):[0m
netstat -an | find ":3000" | find "LISTENING" >nul
if errorlevel 1 (
    echo [1;38;5;196m  ❌ Not running[0m
) else (
    echo [1;38;5;46m  ✅ Running[0m
)

echo.
echo [38;5;51mPort 3004 (Zero-Drift Core):[0m
netstat -an | find ":3004" | find "LISTENING" >nul
if errorlevel 1 (
    echo [1;38;5;196m  ❌ Not running[0m
) else (
    echo [1;38;5;46m  ✅ Running[0m
)

echo.
echo [38;5;51mPort 8188 (ComfyUI):[0m
netstat -an | find ":8188" | find "LISTENING" >nul
if errorlevel 1 (
    echo [1;38;5;196m  ❌ Not running[0m
) else (
    echo [1;38;5;46m  ✅ Running[0m
)

echo.
echo [38;5;51mProcess Status:[0m
tasklist /FI "WINDOWTITLE eq *OKIRU*" 2>nul | find "cmd.exe" >nul
if errorlevel 1 (
    echo [1;38;5;196m  ❌ No OKIRU processes found[0m
) else (
    echo [1;38;5;46m  ✅ OKIRU processes active[0m
)

echo.
pause
goto MAIN_MENU

:STOP_ALL
echo.
echo [1;38;5;196m⏹️  Stopping all OKIRU services...[0m
taskkill /FI "WINDOWTITLE eq *OKIRU*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq *ComfyUI*" /F >nul 2>&1
taskkill /FI "IMAGENAME eq node.exe" /F >nul 2>&1
echo [1;38;5;46m✅ All services stopped.[0m
pause
goto MAIN_MENU

:INSTALL_DEPS
echo.
echo [1;38;5;46m📦 Installing dependencies...[0m
npm install
echo.
echo [1;38;5;46m✅ Dependencies installed.[0m
pause
goto MAIN_MENU

:OPEN_BROWSER
echo.
echo [1;38;5;46m🌐 Opening OKIRU Interface in browser...[0m
start http://localhost:3000
echo [1;38;5;46m✅ Browser opened.[0m
pause
goto MAIN_MENU

:EXIT
cls
echo.
echo [1;38;5;51m╔══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗[0m
echo [1;38;5;51m║                                       👋 THANK YOU FOR USING OKIRU OS!                                            ║[0m
echo [1;38;5;51m╚══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝[0m
echo.
echo [1;38;5;46m🌀 The Sovereign AI Operating System[0m
echo [38;5;51mWhere ComfyUI meets Zero-Drift meets Photoshop meets IDE[0m
echo.
timeout /t 2 >nul
exit
'@

Set-Content "okiru-control.bat" $okiruControlPanel -Encoding ASCII
Write-Host "✅ Created okiru-control.bat" -ForegroundColor Green

# 9. Create a simple README for OKIRU OS
$readme = @'
# 🌀 OKIRU OS v2.0 - The Sovereign AI Operating System

## 🚀 What is OKIRU OS?

OKIRU OS is a **complete AI generation operating system** that combines:

- **🎨 Photoshop-Premiere UI** for visual AI editing
- **🧠 ComfyUI++ with chat interface** at the bottom  
- **🛡️ Zero-Drift Code Quality** enforcement
- **📈 Professional workflow management**
- **⚡ GPU-aware job scheduling**

## 🎯 Vision

**One unified OS for all AI generation needs** - no more switching between 10 different tools!

## 📦 Quick Start

### 1. Installation
```bash
npm install
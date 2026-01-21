cd "G:\okiru\app builder\RezStackFinal"

# 1. Create ComfyUI Bridge Script
$comfyBridge = @'
// scripts/comfy-bridge.js
import WebSocket from 'ws';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = 3002;

console.log('🔗 ComfyUI Bridge starting...');
console.log('Connecting to ComfyUI at ws://localhost:8188/ws');

// WebSocket bridge
const wss = new WebSocket.Server({ port: 3003 });

wss.on('connection', (clientWs) => {
  console.log('🤝 Client connected to bridge');
  
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
app.use('/api/comfy', createProxyMiddleware({
  target: 'http://localhost:8188',
  changeOrigin: true,
  pathRewrite: { '^/api/comfy': '' },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`📤 ${req.method} ${req.path} -> ComfyUI`);
  }
}));

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'comfy-bridge',
    comfyui: 'localhost:8188',
    websocket: 'ws://localhost:3003'
  });
});

app.listen(PORT, () => {
  console.log(`✅ ComfyUI Bridge running on http://localhost:${PORT}`);
  console.log('🌐 WebSocket available at ws://localhost:3003');
  console.log('🔗 API proxy: http://localhost:3002/api/comfy -> http://localhost:8188');
});
'@

Set-Content "scripts/comfy-bridge.js" $comfyBridge -Encoding UTF8

# 2. Create GPU Monitor
$gpuMonitor = @'
// scripts/gpu-monitor.js
import os from 'os';
import { exec } from 'child_process';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3004 });

console.log('📈 GPU Performance Monitor starting...');

function getGPUMetrics() {
  return new Promise((resolve) => {
    // Try to get NVIDIA-SMI data
    exec('nvidia-smi --query-gpu=memory.used,memory.total,utilization.gpu,temperature.gpu --format=csv,noheader,nounits', 
      (error, stdout, stderr) => {
        if (!error && stdout) {
          const [memoryUsed, memoryTotal, gpuUtil, temp] = stdout.trim().split(', ').map(Number);
          resolve({
            vram: { used: memoryUsed, total: memoryTotal, percent: (memoryUsed / memoryTotal * 100).toFixed(1) },
            utilization: gpuUtil,
            temperature: temp,
            timestamp: new Date().toISOString()
          });
        } else {
          // Fallback to mock data
          resolve({
            vram: { used: 8, total: 24, percent: 33.3 },
            utilization: Math.floor(Math.random() * 100),
            temperature: 65 + Math.floor(Math.random() * 10),
            timestamp: new Date().toISOString(),
            mock: true
          });
        }
      }
    );
  });
}

function getSystemMetrics() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  
  return {
    memory: {
      total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      free: (freeMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
      percent: ((usedMem / totalMem) * 100).toFixed(1)
    },
    cpu: {
      load: os.loadavg()[0].toFixed(2),
      cores: os.cpus().length
    },
    uptime: os.uptime()
  };
}

// Broadcast metrics to all connected clients
wss.on('connection', (ws) => {
  console.log('📡 Client connected to GPU monitor');
  
  const interval = setInterval(async () => {
    try {
      const gpuMetrics = await getGPUMetrics();
      const systemMetrics = getSystemMetrics();
      
      ws.send(JSON.stringify({
        type: 'metrics',
        gpu: gpuMetrics,
        system: systemMetrics,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error getting metrics:', error);
    }
  }, 2000);
  
  ws.on('close', () => {
    console.log('📡 Client disconnected from GPU monitor');
    clearInterval(interval);
  });
});

console.log('✅ GPU Monitor running on ws://localhost:3004');
console.log('📊 Sending metrics every 2 seconds');
'@

Set-Content "scripts/gpu-monitor.js" $gpuMonitor -Encoding UTF8

# 3. Create WebSocket Bridge
$wsBridge = @'
// scripts/websocket-bridge.js
import { WebSocketServer } from 'ws';
import express from 'express';

const app = express();
const PORT = 3005;

console.log('🔌 WebSocket Bridge starting...');

const wss = new WebSocketServer({ port: 3006 });
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('🔗 New WebSocket connection');
  clients.add(ws);
  
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Connected to RezStack WebSocket Bridge',
    services: ['comfyui', 'zero-drift', 'gpu-monitor', 'chat'],
    timestamp: new Date().toISOString()
  }));
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      console.log(`📨 Received: ${message.type}`);
      
      // Broadcast to all clients (except sender)
      clients.forEach(client => {
        if (client !== ws && client.readyState === 1) {
          client.send(JSON.stringify({
            ...message,
            forwarded: true,
            timestamp: new Date().toISOString()
          }));
        }
      });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  ws.on('close', () => {
    console.log('🔗 WebSocket disconnected');
    clients.delete(ws);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// REST endpoint for non-WebSocket clients
app.use(express.json());
app.post('/api/broadcast', (req, res) => {
  const message = req.body;
  
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({
        ...message,
        from: 'http',
        timestamp: new Date().toISOString()
      }));
    }
  });
  
  res.json({ success: true, clients: clients.size });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'websocket-bridge',
    clients: clients.size,
    port: 3006,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ WebSocket Bridge HTTP server on http://localhost:${PORT}`);
  console.log('🔗 WebSocket available at ws://localhost:3006');
  console.log(`📡 Connected clients: ${clients.size}`);
});
'@

Set-Content "scripts/websocket-bridge.js" $wsBridge -Encoding UTF8

# 4. Create package.json updates for scripts
$packageJson = Get-Content "package.json" | ConvertFrom-Json

# Add script commands
$packageJson.scripts.comfy_bridge = "node scripts/comfy-bridge.js"
$packageJson.scripts.gpu_monitor = "node scripts/gpu-monitor.js"
$packageJson.scripts.ws_bridge = "node scripts/websocket-bridge.js"
$packageJson.scripts.launch_all = "node scripts/launch-all.js"

ConvertTo-Json $packageJson -Depth 10 | Set-Content "package.json"

Write-Host "🎉 FAANG-GRADE CONTROL PANEL COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "🚀 Features Added:" -ForegroundColor Cyan
Write-Host "• Animated typing effects & spinners" -ForegroundColor White
Write-Host "• Rainbow-colored ASCII art" -ForegroundColor White
Write-Host "• Real-time service dashboard" -ForegroundColor White
Write-Host "• GPU/VRAM monitoring" -ForegroundColor White
Write-Host "• ComfyUI integration bridge" -ForegroundColor White
Write-Host "• WebSocket real-time bridge" -ForegroundColor White
Write-Host "• Professional service management" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🎯 Market Positioning:" -ForegroundColor Green
Write-Host "• ComfyUI users finally get their IDE" -ForegroundColor White
Write-Host "• Photoshop + Premiere UI for AI generation" -ForegroundColor White
Write-Host "• Zero-Drift chat BOTTOM of ComfyUI (game-changer!)" -ForegroundColor White
Write-Host "• Professional workflow management" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "🔥 Launch Command:" -ForegroundColor Yellow
Write-Host "rezstack-control.bat" -ForegroundColor White
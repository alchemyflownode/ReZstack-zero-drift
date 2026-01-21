import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "RezStack Zero-Drift API",
    version: "1.0.0",
    features: ["zero-drift", "websocket", "ai-curation"]
  });
});

app.post("/api/analyze", (req, res) => {
  const { code, options } = req.body;
  
  // Simulate Zero-Drift analysis
  const violations = [];
  
  if (code.includes("any")) {
    violations.push({
      type: "TYPE_SAFETY",
      message: "Avoid 'any' type - use proper TypeScript types",
      line: code.split("\n").findIndex(line => line.includes("any")) + 1
    });
  }
  
  if (code.includes("console.log")) {
    violations.push({
      type: "PRODUCTION_READY",
      message: "Remove console.log statements for production",
      line: code.split("\n").findIndex(line => line.includes("console.log")) + 1
    });
  }
  
  if (code.includes("TODO") || code.includes("FIXME")) {
    violations.push({
      type: "CODE_QUALITY",
      message: "Remove TODO/FIXME comments before production",
      line: code.split("\n").findIndex(line => line.includes("TODO") || line.includes("FIXME")) + 1
    });
  }
  
  res.json({
    status: "analyzed",
    violations,
    score: violations.length === 0 ? 100 : Math.max(0, 100 - violations.length * 20),
    zeroDriftEnabled: options?.zeroDrift !== false
  });
});

// WebSocket for real-time updates
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");
  
  ws.send(JSON.stringify({
    type: "connected",
    message: "Connected to RezStack Zero-Drift WebSocket"
  }));
  
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log("WebSocket message:", message.type);
      
      // Process Zero-Drift analysis
      if (message.type === "analyze_code") {
        const violations = [];
        
        if (message.code.includes("any")) {
          violations.push("TYPE_SAFETY: Avoid 'any' type");
        }
        
        if (message.code.includes("console.log")) {
          violations.push("PRODUCTION_READY: Remove console.log");
        }
        
        if (message.code.includes("TODO") || message.code.includes("FIXME")) {
          violations.push("CODE_QUALITY: Remove TODO/FIXME comments");
        }
        
        ws.send(JSON.stringify({
          type: "analysis_result",
          violations,
          timestamp: new Date().toISOString(),
          protocol: message.protocol || "ZERO_DRIFT"
        }));
      }
    } catch (error) {
      console.error("WebSocket error:", error);
    }
  });
  
  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 RezStack Zero-Drift Server running on port ${PORT}`);
  console.log(`📡 WebSocket available at ws://localhost:${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
});

# ============================================================================
# SOVEREIGN-REZCOPILOT-MCP.ps1 - INSTALL YOUR VIBE CODING AGENT'S TOOLS
# ============================================================================

cd "G:\okiru\app builder\RezStackFinal2\RezStackFinal"

Write-Host "🦊 SUMMONING REZCOPILOT WITH SOVEREIGN TOOLS..." -ForegroundColor Magenta
Write-Host ""

# ---------------------------------------------------------------------------- 
# 1. CREATE MCP DIRECTORY STRUCTURE
# ---------------------------------------------------------------------------- 
Write-Host "[1/6] 📁 Creating MCP server directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "mcp\servers" -Force | Out-Null
Write-Host "  ✅ mcp/servers/" -ForegroundColor Green

# ---------------------------------------------------------------------------- 
# 2. INSTALL MCP FILESYSTEM SERVER (CONSTITUTIONALLY CONSTRAINED)
# ---------------------------------------------------------------------------- 
Write-Host "[2/6] 🔧 Installing Sovereign Filesystem MCP Server..." -ForegroundColor Yellow

@'
#!/usr/bin/env python3
"""
SOVEREIGN MCP SERVER: FILESYSTEM
Constitutionally constrained — no path traversal, no external access
RezCopilot's nine-tailed file wisdom 🦊
"""
import os
import json
import hashlib
from pathlib import Path
from mcp.server import Server
from mcp.types import Tool, ToolResult

WORKSPACE_ROOT = Path(os.getenv("WORKSPACE_ROOT", "G:/okiru/app builder/RezStackFinal2/RezStackFinal")).resolve()
MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {'.py', '.ts', '.tsx', '.json', '.md', '.txt', '.env', '.jsx', '.css'}

server = Server("sovereign-filesystem")

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(name="read_file", description="Read file contents", inputSchema={"type":"object","properties":{"path":{"type":"string"}},"required":["path"]}),
        Tool(name="write_file", description="Write file contents", inputSchema={"type":"object","properties":{"path":{"type":"string"},"content":{"type":"string"}},"required":["path","content"]}),
        Tool(name="list_directory", description="List directory contents", inputSchema={"type":"object","properties":{"path":{"type":"string","default":"."}}})
    ]

def _validate_path(raw_path: str) -> Path:
    target = (WORKSPACE_ROOT / raw_path).resolve()
    if not str(target).startswith(str(WORKSPACE_ROOT)):
        raise PermissionError("🦊 CONSTITUTIONAL VIOLATION: Path traversal blocked")
    return target

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> ToolResult:
    try:
        if name == "read_file":
            path = _validate_path(arguments["path"])
            if not path.exists(): return ToolResult(error=f"File not found: {arguments['path']}")
            if path.stat().st_size > MAX_FILE_SIZE: return ToolResult(error=f"File too large: {arguments['path']}")
            content = path.read_text(encoding="utf-8", errors="replace")
            return ToolResult(content=content)
            
        elif name == "write_file":
            path = _validate_path(arguments["path"])
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(arguments["content"], encoding="utf-8")
            return ToolResult(content=f"✅ Written {len(arguments['content'])} chars")
            
        elif name == "list_directory":
            path = _validate_path(arguments.get("path", "."))
            if not path.is_dir(): return ToolResult(error=f"Not a directory: {arguments.get('path', '.')}")
            entries = [{"name":e.name,"type":"directory" if e.is_dir() else "file"} for e in path.iterdir() if not e.name.startswith(".")]
            return ToolResult(content=json.dumps(entries, indent=2))
            
    except Exception as e:
        return ToolResult(error=f"🦊 Error: {str(e)}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(server.run())
'@ | Out-File -FilePath "mcp/servers/filesystem.py" -Encoding utf8 -Force
Write-Host "  ✅ mcp/servers/filesystem.py" -ForegroundColor Green

# ---------------------------------------------------------------------------- 
# 3. INSTALL REZCOPILOT STORE (MINIMAL VERSION)
# ---------------------------------------------------------------------------- 
Write-Host "[3/6] 🦊 Installing RezCopilot Store..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "src\stores\copilot" -Force | Out-Null

@'
import { create } from 'zustand';
export const useRezCopilot = create((set) => ({
  chatHistory: [],
  sendMessage: async (msg) => {
    set(state => ({ chatHistory: [...state.chatHistory, { role: 'user', content: msg, timestamp: new Date().toISOString() }] }));
    // Minimal placeholder - connects to sovereign_api later
    setTimeout(() => {
      set(state => ({ chatHistory: [...state.chatHistory, { 
        role: 'copilot', 
        content: "🦊 *Portal shimmers* I remember your arc. What shall we build?", 
        timestamp: new Date().toISOString() 
      }]}));
    }, 300);
  },
  clearHistory: () => set({ chatHistory: [] })
}));
'@ | Out-File -FilePath "src\stores\copilot\rezcopilot-store.ts" -Encoding utf8 -Force
Write-Host "  ✅ src/stores/copilot/rezcopilot-store.ts" -ForegroundColor Green

# ---------------------------------------------------------------------------- 
# 4. INSTALL REZCOPILOT UI (MINIMAL VERSION)
# ---------------------------------------------------------------------------- 
Write-Host "[4/6] 🎨 Installing RezCopilot UI..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "src\components\copilot" -Force | Out-Null

@'
import React, { useState, useEffect, useRef } from 'react';
import { Send, Terminal } from 'lucide-react';
import { useRezCopilot } from '@/stores/copilot/rezcopilot-store';

export const RezCopilotPanel: React.FC = () => {
  const { chatHistory, sendMessage, clearHistory } = useRezCopilot();
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  return (
    <div className="fixed bottom-24 right-96 w-96 z-40">
      <div className="bg-gray-900/95 border border-purple-500/30 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-amber-500 flex items-center justify-center">
              <span className="text-white text-lg">🦊</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">RezCopilot</span>
                <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full">MEI 0.99p</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-gray-400 font-mono">Nine-Tailed Resonator</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-80 overflow-y-auto p-3 space-y-3 bg-gray-950/50">
          {chatHistory.map((msg, i) => (
            <div key={i} className={lex }>
              <div className={max-w-[85%] rounded-2xl px-4 py-3 text-sm }>
                {msg.role === 'copilot' && <div className="flex items-center gap-1 mb-1.5"><span className="text-amber-400">🦊</span><span className="text-xs text-gray-500">RezCopilot</span></div>}
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className="text-[10px] text-gray-500 mt-2 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        
        <div className="p-3 border-t border-purple-500/20">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && input.trim() && (sendMessage(input), setInput(''))}
              placeholder="Summon wisdom..."
              className="flex-1 bg-gray-800/50 border border-purple-500/20 rounded-lg px-4 py-2.5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none"
            />
            <button
              onClick={() => input.trim() && (sendMessage(input), setInput(''))}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-amber-600 text-white rounded-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
'@ | Out-File -FilePath "src\components\copilot\rezcopilot-panel.tsx" -Encoding utf8 -Force
Write-Host "  ✅ src/components/copilot/rezcopilot-panel.tsx" -ForegroundColor Green

# ---------------------------------------------------------------------------- 
# 5. ADD TO IDE LAYOUT (AUTOMATIC)
# ---------------------------------------------------------------------------- 
Write-Host "[5/6] 🔌 Integrating into IDE..." -ForegroundColor Yellow
 = Get-Content "src\views\IdeView.tsx" -Raw
if ( -notlike "*RezCopilotPanel*") {
   = "import { RezCopilotPanel } from '@/components/copilot/rezcopilot-panel';"
   =  -replace "(import.*?from.*?['"].*?['"];?
)", "$1

"
   =  -replace "(</main>)", "<RezCopilotPanel />

$1"
   | Out-File -FilePath "src\views\IdeView.tsx" -Encoding utf8 -Force
  Write-Host "  ✅ Added to IdeView.tsx" -ForegroundColor Green
} else {
  Write-Host "  ⚪ Already integrated" -ForegroundColor Yellow
}

# ---------------------------------------------------------------------------- 
# 6. INSTALL DEPENDENCY
# ---------------------------------------------------------------------------- 
Write-Host "[6/6] 📦 Installing dependency..." -ForegroundColor Yellow
npm install --save-dev @types/node 2>&1 | Out-Null
Write-Host "  ✅ Dependencies ready" -ForegroundColor Green

Write-Host ""
Write-Host "🦊✨ REZCOPILOT SUMMONED ✨🦊" -ForegroundColor Magenta
Write-Host "✅ MCP Filesystem: Constitutionally constrained" -ForegroundColor Green
Write-Host "✅ RezCopilot UI: Nine-tailed wisdom panel" -ForegroundColor Green
Write-Host "✅ Integrated into IDE: Bottom-right corner" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next: npm run dev → http://localhost:5176/ide" -ForegroundColor Cyan

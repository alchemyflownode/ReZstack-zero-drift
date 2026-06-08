# 🏛️ SOVEREIGN AI - ACTIVE FILES MANIFEST

## ✅ ACTIVE - DO NOT ARCHIVE (These are WORKING)

### Views (11 files)
- `src/views/GenerativeIDE.tsx` - Main IDE
- `src/views/ChatView.tsx` - Chat interface
- `src/views/JARVISTerminal.tsx` - Full terminal with cat/scan/fix
- `src/views/Dashboard.tsx` - System dashboard
- `src/views/Orchestrator.tsx` - AI orchestrator
- `src/views/WorkerRegistry.tsx` - Worker management
- `src/views/KnowledgeBase.tsx` - Knowledge base
- `src/views/AutonomousCodebase.tsx` - Code management
- `src/views/RezonicCanvas.tsx` - Visual canvas
- `src/views/RezonicStudio.tsx` - Studio interface
- `src/views/GenerativeIDE-NEW.tsx` - New IDE version

### Components (8+ files)
- `src/components/Terminal/TerminalPanel.tsx` - Floating terminal
- `src/components/SovereignCommandPalette.tsx` - Command palette
- `src/components/ui/GlassCard.tsx` - UI card component
- `src/components/ui/Sidebar.tsx` - Navigation sidebar
- `src/components/ui/ModelSelector.tsx` - Model selection dropdown
- `src/components/ui/RoutingDisplay.tsx` - Routing information
- `src/components/ui/OllamaStatus.tsx` - Ollama connection status
- `src/components/ui/DependencyHealthPanel.tsx` - System health

### Stores (2 files)
- `src/stores/multimodal-store.tsx` - Main state management
- `src/stores/terminal-store.ts` - Terminal state

### Services (4 files)
- `src/sovereign-jarvis/main.py` - JARVIS API (port 8002)
- `src/constitutional_bridge/main.py` - Constitutional Bridge (port 8001)
- `src/services/constitutional_council.py` - Constitutional Council
- `src/services/rtx3060_optimizer.py` - GPU optimization

### Config (8 files)
- `package.json` - Dependencies
- `vite.config.ts` - Vite config
- `tsconfig.json` - TypeScript config
- `tsconfig.node.json` - Node TypeScript config
- `index.html` - HTML entry
- `tailwind.config.js` - Tailwind config
- `postcss.config.js` - PostCSS config
- `.gitignore` - Git ignore

### Launchers (2 files)
- `SOVEREIGN-MASTER.bat` - Master launcher
- `SOVEREIGN-CLEAN.bat` - Clean launcher

**TOTAL ACTIVE: ~35 files**

---

## 📦 SAFE TO ARCHIVE - ONLY THESE

### Backups & Generated
- `*.backup`, `*.bak`, `*.old`
- `*.js.map`, `*.d.ts`
- `dist/`, `node_modules/.cache/`
- `package-lock.json` (can be regenerated)

### Test Files
- `test-*.ts`, `test-*.js`, `test-*.mjs`
- `__tests__/` directory
- `*.test.ts`, `*.spec.ts`

### Unused Experiments
- `rezonic-swarm/` (unless actively used)
- `agents/` (unless actively used)
- `jarvis/` (we use `sovereign-jarvis/`)
- `mcp/` (Model Context Protocol - not active)

### Old Launchers (after confirming master launcher works)
- Any `.bat` files except the 2 active ones
- Any `.ps1` files except essential ones

---

## ⚠️ GOLDEN RULE
**IF IT'S IMPORTED IN APP.TSX OR USED BY A COMPONENT, DO NOT ARCHIVE IT!**

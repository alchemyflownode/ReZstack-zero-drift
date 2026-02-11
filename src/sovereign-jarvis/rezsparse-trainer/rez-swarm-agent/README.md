# rez-swarm-agent
Sovereign AI Runtime for Claude Code + Local Models

## 🎯 Philosophy
User-owned AI that is:
- **Deterministic**: Same input → same output
- **Constrained**: All actions pass through constitutional policy
- **Sovereign**: No cloud dependencies, no telemetry
- **Agentic**: Full tool use via Claude Code interface

## 🚀 Quick Start
1. Install Ollama: https://ollama.ai/
2. Clone this repo
3. Run: `python rez-swarm.py`
4. Use: `claude --model qwen3-coder`

## ⚙️ How It Works
- Claude Code CLI → Your local machine (not Anthropic servers)
- All requests pass through `constitutional_model.pt`
- Actions are checked against policy rules
- All artifacts stored in local `memorez/` with audit trails

## 🔧 Core Components
- `constitutional_model.pt`: Neural policy engine
- `ollama_constitutional_enhanced.py`: Model router with constraints
- `verify_system.py`: Determinism validation
- `memorez/`: Local memory with fragmentation awareness
- `quarantine/`: Untrusted artifact isolation

## 🛡️ Security & Privacy
- Zero network calls unless explicitly allowed
- All model outputs validated against constitutional rules
- Hardware fingerprints used for entropy verification
- Complete audit trail of all agent actions

## 📚 Example Policies
1. **File Safety**: "Only edit .py files in /src"
2. **Network Safety**: "No unauthorized HTTP requests"
3. **Command Safety**: "Never use rm -rf without backup"
4. **Data Safety**: "No PII extraction without consent"

## 🎮 Use Cases
- Autonomous coding assistant (local only)
- Document analysis with privacy guarantees
- Research in air-gapped environments
- Regulated industry automation

---
**This isn't just software. It's a statement: AI can be sovereign.**

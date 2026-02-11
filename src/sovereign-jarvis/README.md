# 🤖 Sovereign JARVIS

> *Not magic — Constitutional Partnership*

A deterministic, Git-native AI co-pilot that operates within strict constitutional boundaries. No cloud dependencies. No surveillance. No surprises.

## 🎯 What is Sovereign JARVIS?

JARVIS wasn't magic. He was **a protocol** — a system that:
- ✅ Anticipated needs within bounded domains
- ✅ Executed with precision
- ✅ Respected sovereignty (never overrode decisions)

**Sovereign JARVIS** rebuilds that protocol for the real world:

| Hollywood JARVIS | Sovereign Reality |
|------------------|-------------------|
| *"I've analyzed the suit's telemetry..."* | → Git-tracked sensor logs + deterministic analysis |
| *"Running diagnostics..."* | → Predefined validation rules on commit hooks |
| *"Shall I deploy countermeasures?"* | → Constitutional refusal: *"Requires explicit approval per Rule DEF-001"* |
| *"I've taken the liberty..."* | → **Never happens** — all actions require approval or pre-authorization |
| *"Memory core intact"* | → Git history = perfect, versioned memory |

## 🏗️ Architecture

```
~/.sovereign-jarvis/
├── constitution/
│   ├── rules.py              # Hard constraints (no network, temp=0, domain limits)
│   └── authorizations/       # Pre-approved actions
├── memory/
│   ├── git/                  # Your entire knowledge base
│   └── context.db            # SQLite index of Git commits
├── agents/
│   ├── researcher.py         # Scans Git for TODOs/docs gaps → proposes tasks
│   ├── executor.py           # Executes pre-authorized tasks → commits code
│   └── auditor.py            # Runs on commit → verifies constitutional compliance
├── audit.log                 # Append-only log of all actions
└── jarvis.py                 # CLI interface
```

## 🚀 Quick Start (5 Minutes)

### 1. Install

```bash
# Clone the repository
git clone https://github.com/yourname/sovereign-jarvis.git
cd sovereign-jarvis

# Run installer
./install.sh

# Restart your terminal or source your shell config
source ~/.bashrc  # or ~/.zshrc
```

### 2. Initialize in Your Project

```bash
cd ~/projects/my-app
jarvis init
```

### 3. Experience the Magic

```bash
# Add a TODO to your code
echo "# TODO: Add input validation" >> src/auth.py
git commit -am "chore: mark validation todo"

# Ask JARVIS for status
jarvis status

# Scan for opportunities
jarvis scan

# Execute a proposed task
jarvis execute todo_abc123_87

# Watch it commit real code
git log --oneline -3
```

## 📋 Commands

| Command | Description |
|---------|-------------|
| `jarvis init` | Initialize JARVIS in current repository |
| `jarvis status` | Show system status and context |
| `jarvis scan` | Find improvement opportunities |
| `jarvis execute <task-id>` | Execute a specific task |
| `jarvis audit` | Run constitutional compliance audit |
| `jarvis constitution` | Display constitutional rules |
| `jarvis config <key> [value]` | View or update configuration |

## ⚖️ The Constitution

The constitution defines hard boundaries. It is:
- **Immutable during execution** — loaded once at startup
- **Version-controlled** — changes require explicit commits
- **Transparent** — all rules are inspectable

### Domain Boundaries

JARVIS can only operate within these domains:
- ✅ `code_implementation` — Write/fix code in tracked repos
- ✅ `documentation` — Update docs matching code changes
- ✅ `dependency_management` — CVE patches only
- ✅ `test_automation` — Add tests for existing functionality

### Hard Refusals

These actions are **never** performed:
- ❌ Delete files (requires `--force`)
- ❌ External network calls (localhost only)
- ❌ Modify core business logic without approval
- ❌ Access personal directories without opt-in
- ❌ Execute financial transactions
- ❌ Read/modify password files

### Pre-Authorized Automations

These run without approval:
- 🟢 Lint fixes (ESLint, Prettier, Black)
- 🟢 CVE patches (<0.1% code churn)
- 🟢 Test generation stubs
- 🟢 Import sorting

## 🔒 Security & Privacy

- **No cloud dependencies** — Everything runs locally
- **No telemetry** — No data leaves your machine
- **Git-native** — All state is in Git, no external databases
- **Deterministic** — Temperature=0 for reproducible outputs
- **Append-only audit log** — Every action is logged and verifiable

## 🧠 How It Works

### 1. Researcher Agent

Scans Git history to find opportunities:

```python
# Detects stale TODOs
todos = scan_git_for("TODO:", since="7.days.ago")

# Finds documentation drift
if src_changed and not docs_changed:
    propose_task("Update documentation")
```

### 2. Executor Agent

Executes approved tasks with local LLM (Ollama):

```bash
$ jarvis execute task#42
[sovereign] Executing task#42 under constitutional commit a1b2c3d...
[sovereign] Step 1: Analyzing TODO context
[sovereign] Step 2: Generating implementation
[sovereign] Step 3: Applying changes
[sovereign] Step 4: Committing as 8f9a0b1
✅ Task complete. Review commit: 8f9a0b1
```

### 3. Auditor Agent

Verifies every commit against the constitution:

```bash
$ jarvis audit
🔍 Running constitutional audit...

Constitution: a1b2c3d
Result: ✅ PASSED

Summary:
  total_files_audited: 3
  violations: 0
  warnings: 0
```

## 🛠️ Requirements

- Python 3.8+
- Git
- (Optional) Ollama for LLM features

### Optional: Install Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:1b
```

## 📁 Project Structure

```
sovereign-jarvis/
├── jarvis.py              # Main CLI entry point
├── constitution/
│   ├── __init__.py
│   └── rules.py           # Constitutional framework
├── memory/
│   ├── __init__.py
│   └── context.py         # Git + SQLite memory system
├── agents/
│   ├── __init__.py
│   ├── researcher.py      # Opportunity detection
│   ├── executor.py        # Task execution with LLM
│   └── auditor.py         # Compliance verification
├── bin/
│   └── jarvis             # CLI wrapper script
├── install.sh             # Installation script
└── README.md              # This file
```

## 🤝 Contributing

Contributions welcome! Please ensure:
1. All code follows the constitutional framework
2. Changes are accompanied by tests
3. Audit passes: `jarvis audit`

## 📜 License

MIT License — See LICENSE file for details.

## 🙏 Acknowledgments

Inspired by Tony Stark's JARVIS, but reimagined for sovereign, local, deterministic computing.

> *"The magic wasn't in the AI — it was in the alignment of capability, constraint, and trust."*

---

**Build that.**

```bash
jarvis init
# Your co-pilot awaits.
```

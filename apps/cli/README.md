# 🧠 RezStack AI CLI v2.0

**Production-Grade Enterprise CLI with Phase 1+2 Features & Industrial-Strength Safety**

## ⚡ Quick Start

```bash
# Install (in apps/cli directory)
npm install

# Run
npm start
node bin/rezonic.js ask "What is AI?"

# Or use aliases
rz ask "Hello"
rezonic status
```

## 🎯 Features Overview

### Phase 1: Core AI + Safety (✅ Complete)
- **Streaming AI**: `ask`, `chain`, `chat` with real-time response streaming
- **Safety Layer**: Rollback system, dangerous pattern detection, backup/restore
- **Status Checks**: Ollama and ComfyUI health monitoring
- **Models**: List and filter available AI models

### Phase 2: Generation + System + Batch (✅ Complete)
- **Image Generation**: Text-to-image with 4 built-in style presets
- **Batch Processing**: Process multiple tasks from JSON/TXT files
- **System Monitoring**: Status, models, configuration, benchmarking
- **Audit Trail**: Complete operation history with filtering

## 📋 Command Reference

### AI Commands

#### ask - Stream response from AI
```bash
rezonic ask "Explain quantum computing"
rezonic ask "What is 2+2?" --no-stream
rezonic ask "Count to 5" -m llama3.2:latest
rezonic ask "Output JSON" --json
```
**Options:**
- `-m, --model <name>` - Model selection
- `--no-stream` - Disable streaming (full response at end)
- `-s, --system <text>` - System prompt
- `--json` - JSON output format

#### chain - Execute task with quality settings
```bash
rezonic chain "Write a poem about AI"
rezonic chain "Generate code" -m quality
rezonic chain "Quick question" -m fast
rezonic chain "Analysis" -v --output result.txt
```
**Options:**
- `-m, --mode <mode>` - auto|fast|quality (default: auto)
- `-v, --verbose` - Detailed output
- `-o, --output <file>` - Save response to file

#### chat - Interactive conversation
```bash
rezonic chat
rezonic chat -s "You are a helpful assistant"
rezonic chat --history
```
**Options:**
- `-m, --model <name>` - Model selection
- `-s, --system <text>` - System prompt
- `--history` - Persist chat history between sessions

### Generation Commands

#### generate - Create image from text
```bash
rezonic generate "a beautiful sunset"
rezonic generate "cyberpunk street" -p cyberpunk
rezonic generate "portrait" -w 512 -h 512 -s 30 -c 8
rezonic generate "anime girl" -p anime -o ./my-images
```
**Presets:** cyberpunk, anime, photorealistic, fantasy
**Options:**
- `-w, --width <n>` - Image width (default: 1024)
- `-h, --height <n>` - Image height (default: 1024)
- `-s, --steps <n>` - Generation steps (default: 20)
- `-c, --cfg <n>` - CFG scale (default: 7)
- `-p, --preset <name>` - Style preset
- `-o, --output <dir>` - Output directory

#### generate:preset - Interactive preset selection
```bash
rezonic generate:preset "A beautiful landscape"
rezonic generate:preset --list  # Show all presets
```

#### batch - Process multiple tasks
```bash
rezonic batch prompts.json -t image
rezonic batch items.txt -t image -c 4 --report
rezonic batch tasks.json --dry-run
```
**Options:**
- `-t, --type <type>` - Task type: image|chain|ask
- `-c, --concurrency <n>` - Parallel tasks (default: 2)
- `-o, --output <dir>` - Output directory
- `--dry-run` - Preview without executing
- `--report` - Generate summary report

### System Commands

#### status - Check system health
```bash
rezonic status
rezonic status --json
rezonic status --watch  # Monitor continuously
```

#### models - List available models
```bash
rezonic models
rezonic models --filter llama
rezonic models --size  # Show model sizes
rezonic models --json
```

#### config - View/edit settings
```bash
rezonic config --list
rezonic config --set ollama.host=127.0.0.1
rezonic config --reset
```

#### benchmark - Performance testing
```bash
rezonic benchmark
rezonic benchmark -m mistral -i 5
```

#### info - Detailed system information
```bash
rezonic info
rezonic info --json
```

### Safety Commands

#### rollback - Restore from backups
```bash
rezonic rollback --list
rezonic rollback backup-001
rezonic rollback backup-001 --force  # Skip confirmation
```

#### cleanup - Remove old backups
```bash
rezonic cleanup
rezonic cleanup --days 60
rezonic cleanup --all --force
```

#### safety:check - Verify safety system
```bash
rezonic safety:check
rezonic safety:check --json
rezonic safety:check --verbose
```

#### audit - View operation history
```bash
rezonic audit
rezonic audit --limit 50
rezonic audit --filter ask
rezonic audit --json
```

#### verify - Check backup integrity
```bash
rezonic verify backup-001
rezonic verify --all
```

## 🔒 Safety System

### How It Works

1. **Dangerous Pattern Detection**
   - Prevents `rm -rf /`, fork bombs, disk writes
   - Detects LLM hallucinations with 10+ regex patterns
   - Real-time command validation

2. **Automatic Backups**
   - Creates backup before ANY file modification
   - Stores in `~/.rezonic/safety/rollbacks/`
   - Includes content hash for verification
   - Keeps last 100 backups (configurable)

3. **Rollback System**
   - Restore any previous state instantly
   - Hash verification prevents overwrites
   - Persistent history in `~/.rezonic/safety/history.json`
   - List all available backups anytime

4. **Dry-Run Mode**
   - Preview commands without execution
   - Test with `--dry-run` flag
   - No changes made, no backups created

### Example Workflow

```bash
# Enable all safety features (default)
rezonic --safe-mode ask "Do something"

# Dry-run to preview
rezonic --dry-run generate "image"

# Disable backups if needed
rezonic --no-backup generate "image"

# Check safety status
rezonic safety:check --verbose

# View recent operations
rezonic audit --limit 10

# Restore from 5 backups ago
rezonic rollback backup-005

# Clean old backups
rezonic cleanup --days 90 --force
```

## ⚙️ Configuration

### Environment Variables

```bash
# Service endpoints
export OLLAMA_HOST=http://localhost:11434
export COMFY_URL=http://localhost:8188
export DEFAULT_MODEL=llama3.2:latest
export TIMEOUT=60000

# Safety settings
export DRY_RUN=false
export SAFE_MODE=true
```

### Config File

Located at `~/.rezonic/config.json`:

```json
{
  "ollama": {
    "host": "localhost",
    "port": 11434,
    "defaultModel": "llama3.2:latest"
  },
  "comfyui": {
    "host": "localhost",
    "port": 8188
  },
  "safety": {
    "enabled": true,
    "backup": true,
    "maxBackups": 100
  }
}
```

## 🚀 Global Options

All commands support:

```bash
--dry-run        # Preview without executing
--safe-mode      # Enable safety checks (default)
--no-backup      # Disable automatic backups
--verbose        # Detailed output
--json           # JSON output format
--no-banner      # Skip ASCII banner
--model <name>   # Override default model
--timeout <ms>   # Request timeout
```

Examples:
```bash
rezonic --dry-run --verbose ask "test"
rezonic --safe-mode generate "image"
rezonic --no-backup batch tasks.json
rezonic --json status
```

## 📊 Batch Processing

### Input File Formats

**JSON (Recommended)**
```json
[
  { "id": 1, "prompt": "First image" },
  { "id": 2, "prompt": "Second image" },
  { "id": 3, "prompt": "Third image" }
]
```

**TXT (Simple)**
```
First prompt
Second prompt
Third prompt
```

### Concurrency Control

```bash
# Sequential (default)
rezonic batch tasks.json

# 4 parallel tasks
rezonic batch tasks.json -c 4

# Fast mode - 8 parallel
rezonic batch tasks.json -c 8

# Single task at a time
rezonic batch tasks.json -c 1
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- Ollama running on localhost:11434
- ComfyUI running on localhost:8188 (optional)

### Install

```bash
cd apps/cli
npm install
npm start
```

### Make Globally Available

```bash
# Link the CLI globally
npm link

# Now use from anywhere
rezonic ask "Hello"
rz status
```

### Uninstall Global Link

```bash
npm unlink -g rezonic-cli
```

## 📈 Performance Tips

1. **Streaming**: Use `ask` for long responses (real-time output)
2. **Batch**: Process 100+ items with concurrency
3. **Model Selection**: Use faster models for quick tasks
4. **Dry-Run**: Always preview batch jobs first
5. **Monitoring**: Use `status --watch` to detect issues

## 🐛 Troubleshooting

### Ollama Connection Error
```bash
rezonic status  # Check if Ollama is running
# Start Ollama: ollama serve
```

### ComfyUI Connection Error
```bash
rezonic info  # Verify ComfyUI URL
# Start ComfyUI: cd ComfyUI && python main.py
```

### Safety System Issues
```bash
rezonic safety:check --verbose
rezonic verify --all
rezonic cleanup --force
```

### Reset Everything
```bash
rm -rf ~/.rezonic
rezonic status  # Reinitialize
```

## 📝 Example Workflows

### Generate Multiple Styles

```bash
rezonic generate "mountain landscape" -p cyberpunk -o ./cyberpunk
rezonic generate "mountain landscape" -p anime -o ./anime
rezonic generate "mountain landscape" -p photorealistic -o ./photo
```

### Batch Image Generation

```bash
# Create prompts.json
cat > prompts.json << EOF
[
  {"prompt": "cyberpunk city"},
  {"prompt": "anime girl"},
  {"prompt": "forest landscape"}
]
EOF

# Process batch
rezonic batch prompts.json -t image -c 3 --report
```

### Multi-Turn Conversation

```bash
rezonic chat -s "You are a Python expert"
# Type prompts interactively
# Type 'exit' to quit
```

### Performance Benchmarking

```bash
rezonic benchmark -m llama3.2:latest -i 10
rezonic benchmark -m mistral -i 5
```

## 🎓 Advanced Usage

### Scripting

```bash
#!/bin/bash

# Generate multiple images in a loop
for style in cyberpunk anime photorealistic; do
  rezonic generate "portrait" -p $style -o ./output/$style
done
```

### CI/CD Integration

```yaml
- name: Test RezStack CLI
  run: |
    rezonic --dry-run ask "test"
    rezonic status --json
    rezonic safety:check --json
```

### Docker Usage

```bash
docker run -it \
  -e OLLAMA_HOST=host.docker.internal:11434 \
  -v ~/.rezonic:/root/.rezonic \
  rezstack-cli ask "Hello"
```

## 📄 License

MIT - See LICENSE file

## 🤝 Contributing

Contributions welcome! Please follow the modular command pattern.

## 📞 Support

- Issues: https://github.com/okiru/rezstack/issues
- Documentation: https://github.com/okiru/rezstack
- Discord: (Coming soon)

---

**Made with ❤️ by RezStack Team**

# ⚡ RezStack CLI Quick Start

**Get running in 2 minutes**

## Step 1: Install (30 seconds)

```bash
cd apps/cli
npm install
```

## Step 2: Start Services (in separate terminals)

```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start ComfyUI (optional)
cd ComfyUI
python main.py
```

## Step 3: Run CLI (30 seconds)

```bash
# Interactive mode (no arguments)
npm start

# Or run commands directly
node bin/rezonic.js ask "Hello, how are you?"
node bin/rezonic.js status
node bin/rezonic.js models
```

## Common First Commands

```bash
# Get help
rezonic --help
rezonic ask --help

# Test AI
rezonic ask "What is 2+2?"
rezonic ask "Count to 5" --no-stream

# Check system
rezonic status
rezonic models --filter llama

# Test safety
rezonic safety:check --verbose
```

## Try Image Generation

```bash
# Simple generation
rezonic generate "a beautiful sunset"

# With preset
rezonic generate "cyberpunk street" -p cyberpunk

# Check custom output
rezonic generate "anime girl" -p anime -o ./my-images
```

## Batch Processing

```bash
# Create a simple prompt file
cat > prompts.txt << EOF
a beautiful landscape
a futuristic city
a serene forest
EOF

# Process batch
rezonic batch prompts.txt -t image -c 2 --dry-run
rezonic batch prompts.txt -t image -c 2  # Run it
```

## Safety & Rollback

```bash
# Check status
rezonic safety:check

# See recent operations
rezonic audit --limit 5

# List backups
rezonic rollback --list

# Restore if needed
rezonic rollback backup-001
```

## Interactive Mode

```bash
npm start
# Type commands without "rezonic" prefix:
# > ask "hello"
# > status
# > generate "image"
# > help
# > exit
```

## Global Usage

```bash
npm link
rezonic ask "Now I can use this globally!"
rezonic status
```

## Troubleshooting

### "Cannot find module" error
```bash
npm install
```

### "Connection refused" error
```bash
# Make sure services are running:
ollama serve        # Terminal 1
python main.py      # Terminal 2 (ComfyUI)
```

### "Permission denied" error
```bash
chmod +x bin/rezonic.js
```

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for architecture
- Run `rezonic --help` for all commands
- Try `rezonic <command> --help` for specific options

## Pro Tips

```bash
# Streaming for long responses
rezonic ask "Write a story"

# Non-streaming for structured output
rezonic ask "Output JSON" --json

# Watch system continuously
rezonic status --watch

# Test without executing
rezonic generate "image" --dry-run
rezonic batch tasks.json --dry-run

# Verbose output for debugging
rezonic --verbose ask "test"

# Combine options
rezonic --dry-run --verbose --safe-mode ask "test"
```

## File Locations

- **Configuration**: `~/.rezonic/config.json`
- **Backups**: `~/.rezonic/safety/rollbacks/`
- **History**: `~/.rezonic/safety/history.json`
- **Output**: `./output/` (default)

---

**You're ready! 🚀**

Start with `npm start` and type commands, or run any command directly:
```bash
rezonic ask "Let's build something amazing!"
```

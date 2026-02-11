#!/usr/bin/env python3
"""
rez-swarm-agent setup script
"""

import subprocess
import sys
import os

def run_command(cmd):
    """Run a shell command"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

print("🚀 rez-swarm-agent setup")
print("=" * 50)

# Check Python
success, out, err = run_command("python --version")
if success:
    print(f"✅ Python: {out.strip()}")
else:
    print("❌ Python not found")
    print("\nInstall Python 3.9+ from: https://python.org/")
    sys.exit(1)

# Check Ollama
success, out, err = run_command("ollama --version")
if success:
    print(f"✅ Ollama: {out.strip()}")
else:
    print("❌ Ollama not found")
    print("\nInstall Ollama from: https://ollama.ai/")
    print("Then run: ollama pull qwen3-coder:7b")
    print("And: ollama serve")
    sys.exit(1)

# Install Python dependencies
print("\n📦 Installing dependencies...")
deps = ["requests", "torch"]
for dep in deps:
    success, out, err = run_command(f"pip install {dep} --quiet")
    if success:
        print(f"  ✅ {dep}")
    else:
        print(f"  ⚠️  {dep}: {err[:100]}")

print("\n" + "=" * 50)
print("✨ Setup complete!")
print("\nTo use rez-swarm-agent:")
print("  1. Start Ollama: ollama serve")
print("  2. Run: python rez-swarm.py")
print("  3. Use: claude --model qwen3-coder:7b")
print("\n🔒 Your AI is now sovereign.")

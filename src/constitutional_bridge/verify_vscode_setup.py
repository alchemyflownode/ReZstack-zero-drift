#!/usr/bin/env python3
"""
Verify VS Code setup for Constitutional Claude
"""

import os

print("🔍 Constitutional Claude VS Code Setup Check")
print("=" * 50)

# Check essential files
essential_files = [
    "premium_ui.py",
    "mcp_server.py", 
    "test_constitutional_vscode.py",
    ".vscode/settings.json",
    "launch_vscode.bat"
]

print("\n📁 Checking essential files:")
all_exist = True
for file in essential_files:
    if os.path.exists(file):
        print(f"✅ {file}")
    else:
        print(f"❌ {file} (missing)")
        all_exist = False

# Check Ollama connection
print("\n🔗 Checking Ollama connection...")
try:
    import requests
    response = requests.get("http://localhost:11434/api/tags", timeout=2)
    if response.status_code == 200:
        models = response.json().get('models', [])
        print(f"✅ Ollama is running with {len(models)} models")
        print(f"   Top models: {[m['name'] for m in models[:3]]}")
    else:
        print(f"❌ Ollama responded with status {response.status_code}")
except:
    print("⚠️  Ollama not reachable (may not be running)")

print("\n" + "=" * 50)
if all_exist:
    print("🎉 VS Code setup is ready!")
    print("\n🚀 Next steps:")
    print("1. Double-click 'launch_vscode.bat'")
    print("2. Install 'Continue' extension in VS Code")
    print("3. Open 'test_constitutional_vscode.py'")
    print("4. Select code and press Ctrl+I for AI help")
else:
    print("⚠️  Some files are missing")
    print("Run the setup again to create missing files")

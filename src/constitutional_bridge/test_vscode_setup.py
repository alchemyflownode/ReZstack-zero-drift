#!/usr/bin/env python3
"""
Test Constitutional Claude in VS Code
"""

import requests
import json

def test_ollama_connection():
    """Test if Ollama is responding"""
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code == 200:
            models = response.json()
            print("✅ Ollama is running!")
            print(f"📦 Available models: {[m['name'] for m in models.get('models', [])]}")
            return True
        else:
            print(f"❌ Ollama responded with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to Ollama: {e}")
        print("💡 Make sure Ollama is running: `ollama serve`")
        return False

def test_constitutional_mcp():
    """Test if our MCP server is running"""
    try:
        response = requests.post(
            "http://localhost:3000/mcp",
            json={
                "jsonrpc": "2.0",
                "id": 1,
                "method": "tools/list",
                "params": {}
            },
            timeout=2
        )
        if response.status_code == 200:
            print("✅ Constitutional Claude MCP server is running!")
            return True
        else:
            print(f"❌ MCP server status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ MCP server not reachable: {e}")
        return False

def main():
    print("🔍 Testing Constitutional Claude Setup")
    print("=" * 50)
    
    ollama_ok = test_ollama_connection()
    mcp_ok = test_constitutional_mcp()
    
    print("\n" + "=" * 50)
    
    if ollama_ok:
        print("🎯 For VS Code integration:")
        print("1. Install 'Continue' extension in VS Code")
        print("2. It should auto-detect Ollama")
        print("3. Use Ctrl+I for AI assistance")
    
    if mcp_ok:
        print("\n🎯 For Claude Desktop integration:")
        print("Add to claude_desktop_config.json:")
        print('''{
  "mcpServers": {
    "constitutional-claude": {
      "command": "python",
      "args": ["mcp_server.py"]
    }
  }
}''')
    
    if not ollama_ok and not mcp_ok:
        print("\n🚀 Starting services...")
        print("1. Start Ollama: `ollama serve`")
        print("2. Start MCP: `python mcp_server.py`")
        print("3. Then run this test again")

if __name__ == "__main__":
    main()

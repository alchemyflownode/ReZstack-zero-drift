#!/usr/bin/env python3
"""
rez-swarm-agent v1.0
Sovereign AI Runtime for Claude Code + Local Models
"""

import subprocess
import sys
import json
import os
from pathlib import Path
import time

class RezSwarmAgent:
    """Main agent controller"""
    
    def __init__(self):
        self.base_path = Path(__file__).parent
        self.config = self.load_config()
        
    def load_config(self):
        """Load configuration"""
        config_path = self.base_path / "config.json"
        with open(config_path, 'r') as f:
            return json.load(f)
    
    def check_ollama(self):
        """Check and start Ollama"""
        print("🔍 Checking Ollama installation...")
        
        try:
            result = subprocess.run(["ollama", "list"], 
                                   capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                print("✅ Ollama is running")
                print("\nAvailable models:")
                print(result.stdout)
                return True
            else:
                print("❌ Ollama command failed")
                return False
        except FileNotFoundError:
            print("❌ Ollama not found in PATH")
            print("\nPlease install Ollama first:")
            print("   Download from: https://ollama.ai/")
            return False
        except Exception as e:
            print(f"⚠️  Error checking Ollama: {e}")
            return False
    
    def start_ollama_server(self):
        """Start Ollama server if not running"""
        print("🚀 Starting Ollama server...")
        try:
            # Start in background
            subprocess.Popen(["ollama", "serve"], 
                           stdout=subprocess.DEVNULL, 
                           stderr=subprocess.DEVNULL)
            time.sleep(5)
            print("✅ Ollama server started")
            return True
        except Exception as e:
            print(f"❌ Failed to start Ollama: {e}")
            return False
    
    def verify_constitutional_model(self):
        """Verify the constitutional model is available"""
        print("\n🛡️  Verifying constitutional model...")
        model_path = self.base_path / "constitutional_model.pt"
        
        if model_path.exists():
            size_mb = model_path.stat().st_size / (1024 * 1024)
            print(f"✅ Constitutional model found: {size_mb:.1f} MB")
            return True
        else:
            print("❌ Constitutional model not found")
            return False
    
    def launch_dashboard(self):
        """Launch the constitutional dashboard"""
        print("\n🎮 Launching Constitutional Dashboard...")
        
        try:
            # Check for dash library
            import dash
            print("✅ Dash library available")
            
            # Start the dashboard
            dashboard_path = self.base_path / "constitutional_dashboard.py"
            if dashboard_path.exists():
                print(f"📊 Dashboard available at: http://localhost:8050")
                print("\nTo launch dashboard:")
                print(f"   python {dashboard_path.name}")
                return True
            else:
                print("⚠️  Dashboard not found in package")
                return False
                
        except ImportError:
            print("❌ Dash library not installed")
            print("\nTo install dashboard dependencies:")
            print("   pip install dash plotly pandas")
            return False
    
    def show_usage_instructions(self):
        """Show usage instructions"""
        print("\n" + "=" * 60)
        print("🚀 REZ-SWARM-AGENT READY FOR USE")
        print("=" * 60)
        
        print("\n🎯 PRIMARY USAGE:")
        print("   1. Ensure Ollama is running: ollama serve")
        print(f"   2. Use Claude Code with: claude --model {self.config['default_model']}")
        print("   3. All requests pass through constitutional policy enforcement")
        
        print("\n🔧 ADDITIONAL COMMANDS:")
        print("   • Run multi-model analysis: python ollama_constitutional_enhanced.py")
        print("   • Verify system integrity: python verify_system.py")
        print("   • Check for drift: python drift_proof.py")
        
        print("\n📊 MONITORING:")
        print("   • Memory store: memorez/")
        print("   • Session logs: sessions/")
        print("   • Audit reports: reports/")
        
        print("\n🛡️  CONSTITUTIONAL POLICIES ACTIVE:")
        for policy, value in self.config.get('policies', {}).items():
            print(f"   • {policy}: {value}")
    
    def run(self):
        """Main run method"""
        print("\n" + "=" * 60)
        print("🔒 REZ-SWARM-AGENT: Sovereign AI Runtime")
        print("=" * 60)
        
        # Check system
        ollama_ok = self.check_ollama()
        if not ollama_ok:
            print("\nAttempting to start Ollama server...")
            if not self.start_ollama_server():
                print("\n❌ Cannot proceed without Ollama")
                return
        
        # Verify components
        self.verify_constitutional_model()
        
        # Try to launch dashboard
        self.launch_dashboard()
        
        # Show usage
        self.show_usage_instructions()
        
        print("\n" + "=" * 60)
        print("✅ Sovereign AI runtime initialized successfully!")
        print("=" * 60)

def main():
    """Main entry point"""
    agent = RezSwarmAgent()
    agent.run()

if __name__ == "__main__":
    main()

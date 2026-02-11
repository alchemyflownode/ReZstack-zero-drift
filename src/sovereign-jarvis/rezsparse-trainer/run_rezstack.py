#!/usr/bin/env python3
"""Simple runner for Constitutional RezStack"""

import sys
import subprocess
import os

def main():
    print("🚀 Constitutional RezStack v2.0")
    print("=" * 50)
    
    # Check if installed
    try:
        import rezstack
        print("✅ rezstack package found")
    except ImportError:
        print("❌ rezstack not installed")
        print("\nInstalling in development mode...")
        result = subprocess.run([sys.executable, "-m", "pip", "install", "-e", "."])
        if result.returncode != 0:
            print("❌ Installation failed")
            return 1
    
    # Options
    print("\n📋 Available interfaces:")
    print("  1. Simple CLI (recommended)")
    print("  2. Quick test")
    print("  3. Exit")
    
    choice = input("\nSelect option (1-3): ").strip()
    
    if choice == "1":
        print("\nStarting Simple CLI...")
        from rezstack.elite_interface.simple_cli import main as cli_main
        cli_main()
    elif choice == "2":
        print("\nRunning quick test...")
        subprocess.run([sys.executable, "quick_test.py"])
    elif choice == "3":
        print("\n👋 Goodbye!")
    else:
        print("\n❌ Invalid choice")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())

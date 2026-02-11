"""
Test JARVIS integration for Constitutional Bridge
"""

import requests
import json

def test_jarvis_api():
    """Test if JARVIS has a running API"""
    test_urls = [
        "http://localhost:8000",
        "http://localhost:3000", 
        "http://localhost:8080",
        "http://localhost:5001"
    ]
    
    print("🔍 Testing JARVIS API endpoints...")
    
    for url in test_urls:
        try:
            response = requests.get(url, timeout=2)
            if response.status_code == 200:
                print(f"✅ JARVIS API found at: {url}")
                print(f"   Response: {response.text[:100]}...")
                return url
        except requests.exceptions.RequestException:
            print(f"   {url} - Not reachable")
    
    print("❌ No JARVIS API found on common ports")
    return None

def test_jarvis_directory_structure():
    """Analyze JARVIS directory structure"""
    import os
    
    print("\n📁 JARVIS Directory Structure:")
    for root, dirs, files in os.walk("."):
        level = root.replace(".", "").count(os.sep)
        indent = "  " * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = "  " * (level + 1)
        for file in files[:3]:  # Show first 3 files per directory
            if not file.startswith("."):
                print(f"{subindent}{file}")
        if len(files) > 3:
            print(f"{subindent}... and {len(files)-3} more")

def check_python_entry_points():
    """Look for Python entry points"""
    import os
    import ast
    
    print("\n🐍 Looking for Python entry points...")
    
    for root, dirs, files in os.walk("."):
        for file in files:
            if file.endswith(".py") and file not in ["__init__.py", "__pycache__"]:
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Check for common patterns
                    if 'if __name__ == "__main__"' in content:
                        print(f"✅ Entry point found: {filepath}")
                        
                    if 'app.run' in content or 'FastAPI' in content or 'flask' in content.lower():
                        print(f"✅ Web server detected in: {filepath}")
                        
                    if 'def main()' in content and 'if __name__ == "__main__"' in content:
                        print(f"✅ Main function in: {filepath}")
                        
                except:
                    pass

if __name__ == "__main__":
    print("="*60)
    print("JARVIS INTEGRATION TEST")
    print("="*60)
    
    test_jarvis_directory_structure()
    check_python_entry_points()
    
    # Only test API if we suspect it's running
    print("\nWould you like to test for a running JARVIS API? (y/n)")
    choice = input().strip().lower()
    
    if choice == 'y':
        test_jarvis_api()
    
    print("\n" + "="*60)
    print("RECOMMENDATIONS:")
    print("1. Check README.md for startup instructions")
    print("2. Look for requirements.txt or setup.py")
    print("3. Search for 'main' or 'app' Python files")
    print("4. Run any existing .bat/.ps1 launch scripts")
    print("="*60)

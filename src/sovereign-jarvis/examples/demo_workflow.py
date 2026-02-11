#!/usr/bin/env python3
"""
Sovereign JARVIS Demo Workflow

This script demonstrates a complete JARVIS workflow:
1. Initialize a test repository
2. Create some TODOs
3. Run JARVIS scan
4. Execute a task
5. Audit the result
"""

import os
import sys
import tempfile
import subprocess
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))


def run_cmd(cmd, cwd=None, check=True):
    """Run a shell command"""
    print(f"$ {cmd}")
    result = subprocess.run(
        cmd,
        shell=True,
        cwd=cwd,
        capture_output=True,
        text=True,
        check=check
    )
    if result.stdout:
        print(result.stdout)
    if result.stderr and check:
        print(result.stderr, file=sys.stderr)
    return result


def main():
    print("=" * 60)
    print("🤖 Sovereign JARVIS Demo Workflow")
    print("=" * 60)
    
    # Create temporary directory
    with tempfile.TemporaryDirectory() as tmpdir:
        repo_path = Path(tmpdir) / "demo-repo"
        repo_path.mkdir()
        
        print(f"\n📁 Created demo repository: {repo_path}")
        
        # Initialize git repo
        run_cmd("git init", cwd=repo_path)
        run_cmd("git config user.email 'demo@jarvis.local'", cwd=repo_path)
        run_cmd("git config user.name 'Demo User'", cwd=repo_path)
        
        # Create initial Python file with TODO
        print("\n📝 Creating initial code with TODOs...")
        (repo_path / "src").mkdir()
        auth_py = repo_path / "src" / "auth.py"
        auth_py.write_text('''"""Authentication module"""

# TODO: Add rate limiting to prevent brute force attacks
# TODO: Implement password strength validation

def authenticate(username, password):
    """Authenticate a user"""
    # TODO: Hash password before comparison
    return username == "admin" and password == "password"

def logout(user_id):
    """Log out a user"""
    # TODO: Invalidate session token
    pass
''')
        
        # Commit initial code
        run_cmd("git add .", cwd=repo_path)
        run_cmd('git commit -m "Initial commit with auth module"', cwd=repo_path)
        
        # Initialize JARVIS
        print("\n🚀 Initializing JARVIS...")
        sys.path.insert(0, str(Path(__file__).parent.parent))
        from jarvis import JarvisCLI
        
        jarvis = JarvisCLI(repo_path)
        jarvis.init_repo()
        
        # Show status
        print("\n📊 JARVIS Status:")
        jarvis.status()
        
        # Scan for opportunities
        print("\n🔍 Scanning for opportunities...")
        jarvis.scan()
        
        print("\n" + "=" * 60)
        print("✅ Demo workflow complete!")
        print("=" * 60)
        print(f"\nDemo repository location: {repo_path}")
        print("\nNext steps you could try:")
        print("  1. jarvis execute <task-id>  # Execute a discovered task")
        print("  2. jarvis audit              # Audit recent commits")
        print("  3. git log                   # See JARVIS commits")


if __name__ == "__main__":
    main()

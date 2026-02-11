"""Sovereign JARVIS - Constitutional AI Co-Pilot (Windows-compatible)"""
import sys
import argparse
import subprocess
import json
from pathlib import Path

SOVEREIGN_ROOT = r"G:\okiru\app builder\Kimi_Agent_Reimagining JARVIS as Sovereign AI\sovereign-jarvis"
if SOVEREIGN_ROOT not in sys.path:
    sys.path.insert(0, SOVEREIGN_ROOT)

from constitution import enforce_constitution, ConstitutionalViolation, RULES

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["init", "execute", "status", "constitution", "audit", "scan"])
    parser.add_argument("--task-id", default="manual")
    parser.add_argument("--action")
    parser.add_argument("--target")
    parser.add_argument("--content")
    parser.add_argument("--path", default=".")
    
    args = parser.parse_args()
    workspace = Path.cwd()
    
    if args.command == "init":
        _init(workspace)
    elif args.command == "execute":
        _execute(workspace, args)
    elif args.command == "scan":
        _scan(workspace, args.path)
    elif args.command == "status":
        _status(workspace)
    elif args.command == "constitution":
        _constitution()
    elif args.command == "audit":
        _audit(workspace)

def _init(workspace):
    (workspace / ".jarvis").mkdir(exist_ok=True)
    (workspace / ".jarvis" / "audit.log").touch(exist_ok=True)
    if not (workspace / ".git").exists():
        print("[ERROR] Not a Git repository")
        sys.exit(1)
    print("[OK] Sovereign JARVIS initialized")
    print("     Constitutional rules:", len(RULES))
    print("     Audit log: .jarvis/audit.log")

def _execute(workspace, args):
    if not all([args.action, args.target, args.content]):
        print("[ERROR] Missing required arguments")
        print("        Required: --action, --target, --content")
        sys.exit(1)
    
    target_path = (workspace / args.target).resolve()
    
    try:
        enforce_constitution(args.action, target_path)
    except ConstitutionalViolation as e:
        print("[CONSTITUTIONAL VIOLATION]", str(e))
        sys.exit(1)
    
    # Write content
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(args.content)
    
    # Git add
    subprocess.run(["git", "add", args.target], cwd=workspace, capture_output=True, text=True)
    
    # Git commit
    result = subprocess.run(
        ["git", "commit", "-m", f"sovereign: {args.action} {args.target} [task:{args.task_id}]"],
        cwd=workspace, capture_output=True, text=True
    )
    
    # Extract commit hash
    for line in result.stdout.splitlines():
        if line.startswith("[") and "]" in line:
            commit_hash = line.split()[1].rstrip(']')
            print(f"[OK] Task {args.task_id} complete")
            print(f"     Commit: {commit_hash}")
            print(f"     File: {args.target}")
            
            # Log to audit trail
            with open(workspace / ".jarvis" / "audit.log", 'a', encoding='utf-8') as f:
                f.write(f"TASK_COMPLETE|{args.task_id}|{commit_hash}\n")
            return
    
    print("[OK] Task complete (no new commit - content unchanged)")

def _scan(workspace, scan_path):
    try:
        from agents.scanner import SovereignScanner
    except Exception as e:
        print(f"[ERROR] Scanner import failed: {e}")
        sys.exit(1)
    
    print("=" * 60)
    print("SOVEREIGN APP SCAN")
    print("=" * 60)
    
    scanner = SovereignScanner(workspace)
    result = scanner.scan(scan_path)
    
    if result["status"] == "rejected":
        print(f"\n[REJECTED] {result['error']}")
        sys.exit(1)
    
    issues = result["results"]["issues"]
    files = result["results"]["files_scanned"]
    
    crit = [i for i in issues if i["severity"] == "CRITICAL"]
    high = [i for i in issues if i["severity"] == "HIGH"]
    medium = [i for i in issues if i["severity"] == "MEDIUM"]
    low = [i for i in issues if i["severity"] == "LOW"]
    
    print(f"\n[SUMMARY]")
    print(f"  Files scanned: {files}")
    print(f"  Critical: {len(crit)} | High: {len(high)} | Medium: {len(medium)} | Low: {len(low)}")
    print(f"  Total issues: {len(issues)}")
    print()
    
    if crit:
        print("[CRITICAL ISSUES] (require immediate attention)")
        print("=" * 60)
        for i in crit:
            print(f"\n  [{i['type']}] {i['file']}:{i['line']}")
            print(f"     {i['message']}")
            if 'match' in i:
                print(f"     Found: {i['match']}")
    
    if high:
        print("\n[HIGH SEVERITY ISSUES]")
        print("=" * 60)
        for i in high[:5]:  # Show first 5
            print(f"\n  [{i['type']}] {i['file']}:{i['line']}")
            print(f"     {i['message']}")
            if 'match' in i:
                print(f"     Found: {i['match']}")
        if len(high) > 5:
            print(f"\n  ... and {len(high) - 5} more high severity issues")
    
    if not issues:
        print("[OK] No security or quality issues detected")
    
    print(f"\n[SCAN COMPLETE] {result['results']['timestamp']}")
    print("=" * 60)

def _status(workspace):
    print(f"[STATUS] Workspace: {workspace}")
    print(f"         Constitution: {len(RULES)} rules")
    print(f"         Audit log: {(workspace / '.jarvis' / 'audit.log').exists()}")

def _constitution():
    print("[CONSTITUTIONAL RULES]")
    print("=" * 60)
    for r in RULES:
        print(f"  [{r.id}] {r.domain}")
        print(f"      {r.description}")
    print("=" * 60)

def _audit(workspace):
    log = workspace / ".jarvis" / "audit.log"
    if log.exists():
        print("[AUDIT TRAIL]")
        print("=" * 60)
        print(log.read_text(encoding='utf-8'))
        print("=" * 60)
    else:
        print("[INFO] No audit log found")

if __name__ == "__main__":
    # Set UTF-8 encoding for Windows
    if sys.platform == "win32":
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    
    main()

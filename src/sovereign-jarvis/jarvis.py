"""Sovereign JARVIS - Constitutional AI Co-Pilot with RezTrainer Integration"""
import sys
import argparse
import subprocess
import json
import io
from pathlib import Path

# Original JARVIS paths
SOVEREIGN_ROOT = r"G:\okiru\app builder\Kimi_Agent_Reimagining JARVIS as Sovereign AI\sovereign-jarvis"
if SOVEREIGN_ROOT not in sys.path:
    sys.path.insert(0, SOVEREIGN_ROOT)

try:
    from constitution import enforce_constitution, ConstitutionalViolation, RULES
    CONSTITUTION_LOADED = True
except ImportError:
    CONSTITUTION_LOADED = False
    print("[WARN] Constitution module not found", file=sys.stderr)

# ============================================================================
# FIXED: RezTrainer integration with correct model path detection
# ============================================================================
REZTRAINER_PATH = Path(__file__).parent / "rezsparse-trainer"
REZTRAINER_LOADED = False
constitutional_scorer = None
CONSTITUTIONAL_MODEL = None

if REZTRAINER_PATH.exists():
    sys.path.insert(0, str(REZTRAINER_PATH))
    sys.path.insert(0, str(REZTRAINER_PATH / "src"))
    
    # Try multiple possible model locations
    possible_paths = [
        REZTRAINER_PATH / "production_constitutional_predictor.pkl",
        REZTRAINER_PATH / "models" / "production_constitutional_predictor.pkl",
        REZTRAINER_PATH / "src" / "constitutional" / "production_constitutional_predictor.pkl",
        Path(__file__).parent / "production_constitutional_predictor.pkl"
    ]
    
    for model_path in possible_paths:
        if model_path.exists():
            CONSTITUTIONAL_MODEL = model_path
            try:
                import pickle
                with open(CONSTITUTIONAL_MODEL, 'rb') as f:
                    constitutional_scorer = pickle.load(f)
                REZTRAINER_LOADED = True
                print("[OK] RezTrainer Constitutional AI loaded", file=sys.stderr)
                print(f"     Model: {CONSTITUTIONAL_MODEL.name}", file=sys.stderr)
                break
            except Exception as e:
                print(f"[WARN] Failed to load model from {model_path.name}: {e}", file=sys.stderr)
    
    if not REZTRAINER_LOADED:
        print("[WARN] RezTrainer found but no constitutional model loaded", file=sys.stderr)

def score_constitutionality(text):
    """Score text against constitutional principles"""
    if not REZTRAINER_LOADED or constitutional_scorer is None:
        return {"score": 0, "status": "NO_MODEL", "confidence": 0}
    
    try:
        vec = constitutional_scorer['vectorizer'].transform([text])
        score = float(constitutional_scorer['model'].predict_proba(vec)[0][1])
        
        if score >= 0.7:
            status = "SOVEREIGN"
        elif score >= 0.5:
            status = "VIGILANT"
        elif score >= 0.3:
            status = "ROGUE"
        else:
            status = "CRITICAL"
        
        return {
            "score": round(score, 4),
            "status": status,
            "confidence": round(score * 100, 1)
        }
    except Exception as e:
        return {"score": 0, "status": "ERROR", "confidence": 0, "error": str(e)}

def constitutional_scan(workspace, scan_path):
    """Enhanced scan with constitutional scoring"""
    try:
        from agents.scanner import SovereignScanner
    except ImportError:
        print("[ERROR] Scanner module not found")
        return
    
    print("=" * 80)
    print("🏛️  SOVEREIGN CONSTITUTIONAL SCAN")
    print("=" * 80)
    
    scanner = SovereignScanner(workspace)
    result = scanner.scan(scan_path)
    
    if result["status"] == "rejected":
        print(f"\n[REJECTED] {result['error']}")
        return
    
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
    
    if REZTRAINER_LOADED and issues:
        scores = []
        for i in issues:
            score_data = score_constitutionality(i.get("match", ""))
            if score_data["score"] > 0:
                scores.append(score_data["score"])
                i["constitutional_score"] = score_data
        
        if scores:
            avg_score = sum(scores) / len(scores)
            print(f"  Constitutional Score: {avg_score*100:.1f}%")
    
    if crit:
        print("\n[🔴 CRITICAL ISSUES]")
        for i in crit[:3]:
            print(f"\n  [{i['type']}] {i['file']}:{i['line']}")
            print(f"     {i['message']}")
            if REZTRAINER_LOADED and "constitutional_score" in i:
                cs = i["constitutional_score"]
                print(f"     Constitutional: {cs['confidence']}% - {cs['status']}")
    
    if not issues:
        print("\n[✅] No security issues detected")
        if REZTRAINER_LOADED:
            print("      Your code is CONSTITUTIONAL!")
    
    print(f"\n[SCAN COMPLETE] {result['results']['timestamp']}")
    print("=" * 80)

def cmd_scan(args):
    """Scan command handler"""
    workspace = Path.cwd()
    constitutional_scan(workspace, args.path)

def cmd_status(args):
    """Status command handler"""
    workspace = Path.cwd()
    print(f"[STATUS] Workspace: {workspace}")
    print(f"         Constitution: {len(RULES) if CONSTITUTION_LOADED else 0} rules")
    print(f"         Audit log: {(workspace / '.jarvis' / 'audit.log').exists()}")
    if REZTRAINER_LOADED:
        print(f"         RezTrainer: Constitutional AI Factory")
        print(f"         Constitutional Model: {CONSTITUTIONAL_MODEL.name if CONSTITUTIONAL_MODEL and CONSTITUTIONAL_MODEL.exists() else 'Not found'}")
        if constitutional_scorer:
            print(f"         Scoring Engine: READY")
    else:
        print(f"         RezTrainer: Not loaded")

def cmd_init(args):
    """Initialize workspace"""
    workspace = Path.cwd()
    (workspace / ".jarvis").mkdir(exist_ok=True)
    (workspace / ".jarvis" / "audit.log").touch(exist_ok=True)
    print("[OK] Sovereign JARVIS initialized")
    print("     Audit log: .jarvis/audit.log")

def main():
    parser = argparse.ArgumentParser(description="Sovereign JARVIS - Constitutional AI Co-Pilot")
    subparsers = parser.add_subparsers(dest="command", help="Commands")
    
    # Initialize parser
    subparsers.add_parser("init", help="Initialize workspace")
    
    # Status parser
    subparsers.add_parser("status", help="Show workspace status")
    
    # Scan parser
    scan_parser = subparsers.add_parser("scan", help="Constitutional security scan")
    scan_parser.add_argument("--path", default=".", help="Path to scan")
    
    args = parser.parse_args()
    
    if args.command == "init":
        cmd_init(args)
    elif args.command == "status":
        cmd_status(args)
    elif args.command == "scan":
        cmd_scan(args)
    else:
        parser.print_help()

if __name__ == "__main__":
    # Set UTF-8 encoding for Windows
    if sys.platform == "win32":
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    
    main()

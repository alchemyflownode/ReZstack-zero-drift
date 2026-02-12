import os
import sys
import re
import json
import ast
import subprocess
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple

class JARVISAppEnhancer:
    """JARVIS App Enhancement Engine with write permission fixes"""
    
    def __init__(self, workspace: str = None):
        self.workspace = Path(workspace) if workspace else Path.cwd()
        self.scan_results = []
        self.enhancement_history = []
    
    def scan_application(self, app_path: str = None) -> Dict[str, Any]:
        """Scan application for issues"""
        target = Path(app_path) if app_path else self.workspace
        print(f"\n🔍 JARVIS App Enhancer - Scanning: {target}")
        print("=" * 60)
        
        results = {
            "app_name": target.name,
            "scan_time": datetime.now().isoformat(),
            "files_scanned": 0,
            "issues": [],
            "fixable_count": 0
        }
        
        for py_file in target.rglob("*.py"):
            if "venv" in str(py_file) or "__pycache__" in str(py_file):
                continue
            results["files_scanned"] += 1
            file_issues = self._scan_python_file(py_file)
            results["issues"].extend(file_issues)
            results["fixable_count"] += len([i for i in file_issues if i.get("fixable", False)])
        
        print(f"\n✅ Scan complete: {results['files_scanned']} files")
        print(f"   Issues found: {len(results['issues'])}")
        print(f"   Fixable issues: {results['fixable_count']}")
        
        return results
    
    def _scan_python_file(self, filepath: Path) -> List[Dict]:
        """Scan Python file for issues"""
        issues = []
        
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
            
            for i, line in enumerate(lines, 1):
                # Bare excepts
                if re.search(r'except\s*:', line):
                    issues.append({
                        "file": str(filepath),
                        "line": i,
                        "type": "BARE_EXCEPT",
                        "severity": "HIGH",
                        "message": "Bare except clause",
                        "fix": "except Exception as e:",
                        "fixable": True
                    })
                
                # Any types
# if ': unknown' in line:

                    issues.append({
                        "file": str(filepath),
                        "line": i,
                        "type": "CONSTITUTIONAL_ANY_TYPE",
                        "severity": "MEDIUM",
                        "message": "Use of 'any' type",
# "fix": line.replace(': unknown', ': unknown'),

                        "fixable": True
                    })
                
                # Console logs
# if 'console.log' in line and not line.strip().startswith('//'):
                    issues.append({
                        "file": str(filepath),
                        "line": i,
                        "type": "CONSOLE_LOG",
                        "severity": "LOW",
                        "message": "Console.log in production",
                        "fix": f"// {line.strip()}",
                        "fixable": True
                    })
        
        except Exception as e:
            print(f"⚠️ Error scanning {filepath.name}: {e}")
        
        return issues
    
    def generate_fix(self, issue: Dict) -> Optional[str]:
        """Generate fix for an issue"""
        if not issue.get("fixable", False):
            return None
        
        if issue["type"] == "BARE_EXCEPT":
            return issue["line"] + issue.get("fix", "except Exception as e:")
        elif issue["type"] == "CONSTITUTIONAL_ANY_TYPE":
            return issue.get("fix", "")
        elif issue["type"] == "CONSOLE_LOG":
            return issue.get("fix", "")
        
        return None
    
    def apply_fixes(self, issues: List[Dict], backup: bool = True) -> Dict:
        """Apply fixes with retry and force write"""
        
        results = {
            "applied": 0,
            "failed": 0,
            "skipped": 0,
            "backup_created": False,
            "details": []
        }
        
        # Group by file
        files_to_fix = {}
        for issue in issues:
            if not issue.get("fixable", False):
                results["skipped"] += 1
                continue
            
            filepath = issue["file"]
            if filepath not in files_to_fix:
                files_to_fix[filepath] = []
            files_to_fix[filepath].append(issue)
        
        # Apply fixes per file
        for filepath, file_issues in files_to_fix.items():
            for attempt in range(3):  # 3 retries
                try:
                    # Read file
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        lines = f.readlines()
                    
                    # Create backup
                    if backup and not results["backup_created"]:
                        backup_path = Path(filepath).with_suffix('.py.backup')
                        with open(backup_path, 'w', encoding='utf-8') as f:
                            f.writelines(lines)
                        results["backup_created"] = True
                    
                    # Apply fixes from bottom to top
                    file_issues.sort(key=lambda x: x["line"], reverse=True)
                    
                    for issue in file_issues:
                        line_idx = issue["line"] - 1
                        if line_idx < len(lines):
                            fixed = self.generate_fix(issue)
                            if fixed:
                                lines[line_idx] = fixed + '\n'
                                results["applied"] += 1
                                results["details"].append({
                                    "file": filepath,
                                    "line": issue["line"],
                                    "type": issue["type"]
                                })
                    
                    # Write changes
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.writelines(lines)
                    
                    break  # Success
                    
                except Exception as e:
                    if attempt == 2:  # Last attempt
                        results["failed"] += len(file_issues)
                        print(f"❌ Failed to fix {Path(filepath).name}: {e}")
                    else:
                        time.sleep(0.5)
        
        return results
    
    def enhance_application(self, app_path: str = None, auto_deploy: bool = True) -> Dict:
        """Complete enhancement pipeline"""
        print("\n" + "="*70)
        print("🚀 JARVIS APP ENHANCER - COMPLETE PIPELINE")
        print("="*70)
        
        # SCAN
        scan_results = self.scan_application(app_path)
        
        # FIX
        fixable = [i for i in scan_results["issues"] if i.get("fixable", False)]
        fix_results = self.apply_fixes(fixable)
        
        return {
            "scan": {
                "files_scanned": scan_results["files_scanned"],
                "issues_found": len(scan_results["issues"]),
                "fixable": scan_results["fixable_count"]
            },
            "fixes": {
                "applied": fix_results["applied"],
                "failed": fix_results["failed"],
                "backup_created": fix_results["backup_created"]
            },
            "duration": 0.0,
            "timestamp": datetime.now().isoformat()
        }

# For testing
if __name__ == "__main__":
    enhancer = JARVISAppEnhancer()
    result = enhancer.enhance_application(".")
    print(f"\n✅ Enhancement complete: {result['fixes']['applied']} issues fixed")



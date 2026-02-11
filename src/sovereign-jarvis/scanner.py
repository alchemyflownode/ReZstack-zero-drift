"""Sovereign app scanner - built-in issue detection."""
import re
import json
from pathlib import Path
from datetime import datetime
from constitution import enforce_constitution, ConstitutionalViolation

class SovereignScanner:
    def __init__(self, workspace: Path):
        self.workspace = workspace.resolve()
        self.scan_patterns = [
            {
                "id": "HARDCODED_PASSWORD",
                "pattern": r'(?<![\w#])password\s*=\s*["\'][^"\']+["\']',
                "severity": "CRITICAL",
                "description": "Hardcoded password found"
            },
            {
                "id": "HARDCODED_API_KEY", 
                "pattern": r'(?<![\w#])(api_key|apiKey|secret_key|secretKey)\s*=\s*["\'][^"\']+["\']',
                "severity": "CRITICAL",
                "description": "Hardcoded API/secret key"
            },
            {
                "id": "DANGEROUS_EVAL",
                # More specific: eval( with parentheses, not in comments
                "pattern": r'(?<!["#\w])eval\s*\((?!\))',
                "severity": "HIGH",
                "description": "Dangerous eval() usage (code injection risk)"
            },
            {
                "id": "BARE_EXCEPT",
                "pattern": r'except\s*:',
                "severity": "HIGH",
                "description": "Bare except clause"
            },
            {
                "id": "TODO_COMMENT",
                "pattern": r'#\s*TODO',
                "severity": "LOW",
                "description": "TODO comment found"
            }
        ]
    
    def scan(self, scan_path="."):
        """Scan directory for issues."""
        target_path = (self.workspace / scan_path).resolve()
        
        try:
            # Constitutional check
            enforce_constitution("scan", target_path)
        except ConstitutionalViolation as e:
            return {
                "status": "rejected",
                "error": str(e)
            }
        
        issues = []
        files_scanned = 0
        
        if target_path.is_file():
            files_to_scan = [target_path]
        else:
            files_to_scan = list(target_path.rglob("*.py"))
        
        for file_path in files_to_scan:
            if not file_path.is_file():
                continue
                
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    files_scanned += 1
                    
                    for line_num, line in enumerate(lines, 1):
                        # Skip comment-only lines for eval detection
                        stripped_line = line.strip()
                        if stripped_line.startswith('#') and 'eval' in stripped_line.lower():
                            continue  # Skip comments mentioning eval
                            
                        for pattern_info in self.scan_patterns:
                            if re.search(pattern_info["pattern"], line):
                                issues.append({
                                    "type": pattern_info["id"],
                                    "file": str(file_path.relative_to(self.workspace)),
                                    "line": line_num,
                                    "severity": pattern_info["severity"],
                                    "message": pattern_info["description"],
                                    "match": line.strip()[:80]
                                })
                                break  # Only report one issue per line
            except Exception as e:
                continue
        
        return {
            "status": "completed",
            "results": {
                "issues": issues,
                "files_scanned": files_scanned,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }

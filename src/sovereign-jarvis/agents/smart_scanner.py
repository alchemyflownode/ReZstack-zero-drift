"""Sovereign JARVIS Smart Scanner with Auto-Fix Capabilities"""
import re
import json
from pathlib import Path
from datetime import datetime
from constitution import enforce_constitution, ConstitutionalViolation

class SmartSovereignScanner:
    def __init__(self, workspace: Path):
        self.workspace = workspace.resolve()
        self.fix_templates = {
            "HARDCODED_PASSWORD": self.fix_hardcoded_password,
            "HARDCODED_API_KEY": self.fix_hardcoded_api_key,
            "DANGEROUS_EVAL": self.fix_dangerous_eval,
            "BARE_EXCEPT": self.fix_bare_except,
            "TODO_COMMENT": self.fix_todo_comment,
        }
        
        self.scan_patterns = [
            {
                "id": "HARDCODED_PASSWORD",
                "pattern": r'(?<![\w#])password\s*=\s*["\'][^"\']+["\']',
                "severity": "CRITICAL",
                "description": "Hardcoded password found",
                "fixable": True,
                "fix_description": "Replace with environment variable"
            },
            {
                "id": "HARDCODED_API_KEY", 
                "pattern": r'(?<![\w#])(api_key|apiKey|secret_key|secretKey)\s*=\s*["\'][^"\']+["\']',
                "severity": "CRITICAL",
                "description": "Hardcoded API/secret key",
                "fixable": True,
                "fix_description": "Replace with environment variable"
            },
            {
                "id": "DANGEROUS_EVAL",
                "pattern": r'(?<!["#\w])eval\s*\((?!\))',
                "severity": "HIGH",
                "description": "Dangerous eval() usage (code injection risk)",
                "fixable": True,
                "fix_description": "Replace with ast.literal_eval() or safe alternative"
            },
            {
                "id": "BARE_EXCEPT",
                "pattern": r'except\s*:',
                "severity": "HIGH",
                "description": "Bare except clause",
                "fixable": True,
                "fix_description": "Replace with specific exception handling"
            },
            {
                "id": "TODO_COMMENT",
                "pattern": r'#\s*TODO',
                "severity": "LOW",
                "description": "TODO comment found",
                "fixable": True,
                "fix_description": "Implement TODO or remove comment"
            }
        ]
    
    def scan(self, scan_path=".", fix_issues=False):
        """Scan directory for issues, optionally fix them."""
        target_path = (self.workspace / scan_path).resolve()
        
        try:
            enforce_constitution("scan", target_path)
        except ConstitutionalViolation as e:
            return {
                "status": "rejected",
                "error": str(e)
            }
        
        issues = []
        files_scanned = 0
        fixes_applied = 0
        
        if target_path.is_file():
            files_to_scan = [target_path]
        else:
            files_to_scan = list(target_path.rglob("*"))
        
        lines_by_file = {}
        
        for file_path in files_to_scan:
            if not file_path.is_file() or file_path.suffix not in ['.py', '.js', '.ts', '.json', '.env', '.yml', '.yaml']:
                continue
                
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    files_scanned += 1
                    lines_by_file[file_path] = lines.copy()
                    
                    for line_num, line in enumerate(lines, 1):
                        for pattern_info in self.scan_patterns:
                            if re.search(pattern_info["pattern"], line):
                                issue = {
                                    "type": pattern_info["id"],
                                    "file": str(file_path.relative_to(self.workspace)),
                                    "line": line_num,
                                    "severity": pattern_info["severity"],
                                    "message": pattern_info["description"],
                                    "fixable": pattern_info["fixable"],
                                    "fix_description": pattern_info["fix_description"],
                                    "original_line": line.strip()[:100]
                                }
                                
                                # Apply fix if requested and fixable
                                if fix_issues and pattern_info["fixable"] and pattern_info["id"] in self.fix_templates:
                                    fix_result = self.fix_templates[pattern_info["id"]](file_path, line_num, lines_by_file[file_path])
                                    if fix_result["fixed"]:
                                        issue["fixed"] = True
                                        issue["fix_applied"] = fix_result["fix_applied"]
                                        fixes_applied += 1
                                
                                issues.append(issue)
                                break  # Only report one issue per line
            except Exception as e:
                continue
        
        # Save fixed files if any fixes were applied
        if fixes_applied > 0:
            self.save_fixed_files(lines_by_file)
        
        return {
            "status": "completed",
            "results": {
                "issues": issues,
                "files_scanned": files_scanned,
                "fixes_applied": fixes_applied,
                "timestamp": datetime.utcnow().isoformat() + "Z"
            }
        }
    
    # --- FIXING METHODS ---
    
    def fix_hardcoded_password(self, file_path, line_num, lines):
        """Replace hardcoded password with environment variable."""
        original = lines[line_num - 1]
        
        # Try to extract variable name
        match = re.search(r'(\w+)\s*=\s*["\'][^"\']+["\']', original)
        if match:
            var_name = match.group(1).upper()
            # Replace with os.getenv()
            fixed = re.sub(r'=\s*["\'][^"\']+["\']', f'= os.getenv("{var_name}", "")', original)
            
            # Add import if needed
            if 'os.getenv' in fixed and not any('import os' in l for l in lines):
                lines.insert(0, "import os\n")
            
            lines[line_num - 1] = fixed
            
            return {
                "fixed": True,
                "fix_applied": f"Replaced with os.getenv('{var_name}', '')",
                "original": original.strip(),
                "fixed_line": fixed.strip()
            }
        
        return {"fixed": False}
    
    def fix_hardcoded_api_key(self, file_path, line_num, lines):
        """Replace hardcoded API key with environment variable."""
        original = lines[line_num - 1]
        
        # Extract variable name and create env var name
        match = re.search(r'(\w+)\s*=\s*["\'][^"\']+["\']', original)
        if match:
            var_name = match.group(1).upper()
            
            # Special handling for different key types
            if 'api_key' in original.lower():
                env_var = f'API_KEY'
            elif 'secret' in original.lower():
                env_var = f'SECRET_KEY'
            else:
                env_var = var_name
            
            fixed = re.sub(r'=\s*["\'][^"\']+["\']', f'= os.getenv("{env_var}", "")', original)
            
            # Add import if needed
            if 'os.getenv' in fixed and not any('import os' in l for l in lines):
                lines.insert(0, "import os\n")
            
            lines[line_num - 1] = fixed
            
            return {
                "fixed": True,
                "fix_applied": f"Replaced with os.getenv('{env_var}', '')",
                "original": original.strip(),
                "fixed_line": fixed.strip()
            }
        
        return {"fixed": False}
    
    def fix_dangerous_eval(self, file_path, line_num, lines):
        """Replace dangerous eval() with safer alternative."""
        original = lines[line_num - 1]
        
        # Simple replacement with ast.literal_eval
        fixed = original.replace('eval(', 'ast.literal_eval(')
        
        # Add import if needed
        if 'ast.literal_eval' in fixed and not any('import ast' in l for l in lines):
            lines.insert(0, "import ast\n")
        
        lines[line_num - 1] = fixed
        
        return {
            "fixed": True,
            "fix_applied": "Replaced eval() with ast.literal_eval()",
            "original": original.strip(),
            "fixed_line": fixed.strip()
        }
    
    def fix_bare_except(self, file_path, line_num, lines):
        """Replace bare except with specific exception handling."""
        original = lines[line_num - 1]
        
        fixed = original.replace('except:', 'except Exception as e:')
        
        # Try to add logging if there's a pass statement
        if line_num < len(lines) and 'pass' in lines[line_num].strip():
            lines[line_num] = f'    print(f"Error: {{e}}")  # TODO: Add proper error handling\n'
        
        lines[line_num - 1] = fixed
        
        return {
            "fixed": True,
            "fix_applied": "Replaced bare except with specific exception handling",
            "original": original.strip(),
            "fixed_line": fixed.strip()
        }
    
    def fix_todo_comment(self, file_path, line_num, lines):
        """Handle TODO comments."""
        original = lines[line_num - 1]
        
        # For now, just log that TODO was found
        # In advanced mode, could use AI to implement TODO
        return {
            "fixed": False,  # TODOs need human intervention
            "fix_applied": "TODO needs manual implementation",
            "original": original.strip(),
            "fixed_line": original.strip()
        }
    
    def save_fixed_files(self, lines_by_file):
        """Save all fixed files."""
        for file_path, lines in lines_by_file.items():
            with open(file_path, 'w', encoding='utf-8') as f:
                f.writelines(lines)
    
    def generate_fix_report(self, issues):
        """Generate a fix report with suggested fixes."""
        fixable_issues = [i for i in issues if i.get("fixable", False)]
        
        report = {
            "total_issues": len(issues),
            "fixable_issues": len(fixable_issues),
            "fix_suggestions": []
        }
        
        for issue in fixable_issues:
            report["fix_suggestions"].append({
                "file": issue["file"],
                "line": issue["line"],
                "type": issue["type"],
                "severity": issue["severity"],
                "suggestion": issue["fix_description"],
                "original": issue.get("original_line", "")
            })
        
        return report

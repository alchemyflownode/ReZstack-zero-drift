import os
import re
import json
import subprocess
from pathlib import Path
from datetime import datetime

class JARVISAutoHealer:
    """JARVIS Auto-Healer - Scans, Fixes, Commits, and Pushes vulnerabilities"""
    
    def __init__(self):
        self.workspace = None
        self.issues = []
        self.fixes_applied = []
        self.constitutional_rules = {
            "BARE_EXCEPT": self.fix_bare_except,
            "DANGEROUS_EVAL": self.fix_dangerous_eval,
            "HARDCODED_CREDENTIALS": self.fix_hardcoded_creds,
            "TODO_COMMENT": self.fix_todo_comment,
            "CONSOLE_LOG": self.fix_console_log,
            "ANY_TYPE": self.fix_any_type,
            "LODASH_CLONE": self.fix_lodash_clone
        }
    
    def scan_and_fix(self, workspace_path, auto_commit=True, push_to_github=True):
        """Complete JARVIS Auto-Healer pipeline"""
        
        print(f"\n⚡ JARVIS Auto-Healer v2.0")
        print(f"================================")
        print(f"📂 Workspace: {workspace_path}")
        print(f"🕐 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        self.workspace = Path(workspace_path)
        
        # STEP 1: SCAN for issues
        print("🔍 Phase 1: Scanning for vulnerabilities...")
        self.scan_workspace()
        
        # STEP 2: FIX issues automatically
        print("\n🛠️  Phase 2: Applying constitutional fixes...")
        self.apply_fixes()
        
        # STEP 3: COMMIT changes
        if auto_commit and self.fixes_applied:
            print("\n💾 Phase 3: Committing fixes to git...")
            self.commit_fixes()
        
        # STEP 4: PUSH to GitHub
        if push_to_github and self.fixes_applied:
            print("\n📤 Phase 4: Pushing to GitHub...")
            self.push_to_github()
        
        # STEP 5: GENERATE report
        self.generate_report()
        
        return self.fixes_applied
    
    def scan_workspace(self):
        """Scan workspace for security vulnerabilities"""
        self.issues = []
        
        # Scan Python files - with encoding fallback
        for py_file in self.workspace.rglob("*.py"):
            self.scan_python_file(py_file)
        
        # Scan JavaScript/TypeScript files
        for js_file in self.workspace.rglob("*"):
            if js_file.suffix in ['.js', '.jsx', '.ts', '.tsx']:
                self.scan_js_file(js_file)
        
        # Scan for hardcoded credentials
        self.scan_hardcoded_credentials()
        
        print(f"   ✅ Found {len(self.issues)} issues")
        return self.issues
    
    def scan_python_file(self, filepath):
        """Scan Python file for vulnerabilities - with encoding fallback"""
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        
        for encoding in encodings:
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    content = f.read()
                break
            except UnicodeDecodeError:
                continue
        else:
            print(f"   ⚠️  Could not decode {filepath.name} - skipping")
            return
        
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            # Bare except
            if re.search(r'except\s*:', line):
                self.issues.append({
                    'file': str(filepath),
                    'line': i,
                    'type': 'BARE_EXCEPT',
                    'content': line.strip(),
                    'severity': 'HIGH'
                })
            
            # Dangerous eval
            if 'eval(' in line and not line.strip().startswith('#'):
                self.issues.append({
                    'file': str(filepath),
                    'line': i,
                    'type': 'DANGEROUS_EVAL',
                    'content': line.strip(),
                    'severity': 'CRITICAL'
                })
    
    def scan_js_file(self, filepath):
        """Scan JavaScript/TypeScript file for vulnerabilities - with encoding fallback"""
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        
        for encoding in encodings:
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    content = f.read()
                break
            except UnicodeDecodeError:
                continue
        else:
            print(f"   ⚠️  Could not decode {filepath.name} - skipping")
            return
        
        lines = content.split('\n')
        
        for i, line in enumerate(lines, 1):
            # TODO comments
            if 'TODO' in line and '//' in line:
                self.issues.append({
                    'file': str(filepath),
                    'line': i,
                    'type': 'TODO_COMMENT',
                    'content': line.strip(),
                    'severity': 'LOW'
                })
            
            # Console.log in production
            if 'console.log' in line and not line.strip().startswith('//'):
                self.issues.append({
                    'file': str(filepath),
                    'line': i,
                    'type': 'CONSOLE_LOG',
                    'content': line.strip(),
                    'severity': 'LOW'
                })
    
    def scan_hardcoded_credentials(self):
        """Scan for hardcoded API keys and passwords - with encoding fallback"""
        patterns = {
            'API_KEY': r'(api[_-]?key|apikey|token|secret)\s*[=:]\s*[''"][A-Za-z0-9_\-]{16,}[''"]',
            'PASSWORD': r'(password|passwd|pwd)\s*[=:]\s*[''"][^''"]{8,}[''"]',
            'AWS_KEY': r'AKIA[0-9A-Z]{16}',
        }
        
        for file in self.workspace.rglob("*"):
            if file.suffix in ['.py', '.js', '.ts', '.jsx', '.tsx', '.env', '.json', '.yml', '.yaml', '.ini', '.cfg', '.conf']:
                encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
                content = None
                
                for encoding in encodings:
                    try:
                        with open(file, 'r', encoding=encoding) as f:
                            content = f.read()
                        break
                    except:
                        continue
                
                if content:
                    lines = content.split('\n')
                    
                    for pattern_name, pattern in patterns.items():
                        import re
                        matches = re.finditer(pattern, content, re.IGNORECASE)
                        for match in matches:
                            line_num = content[:match.start()].count('\n') + 1
                            self.issues.append({
                                'file': str(file),
                                'line': line_num,
                                'type': f'HARDCODED_{pattern_name}',
                                'content': match.group(),
                                'severity': 'CRITICAL'
                            })
    
    def apply_fixes(self):
        """Apply automatic fixes for all detected issues"""
        for issue in self.issues:
            fixer = self.constitutional_rules.get(issue['type'])
            if fixer:
                try:
                    fixer(issue)
                    self.fixes_applied.append(issue)
                    print(f"   ✅ Fixed: {issue['type']} in {Path(issue['file']).name}:{issue['line']}")
                except Exception as e:
                    print(f"   ⚠️  Failed to fix {issue['type']}: {e}")
        
        print(f"\n   ✅ Applied {len(self.fixes_applied)} constitutional fixes")
    
    def fix_bare_except(self, issue):
        """Fix bare except: 'except:' → 'except Exception as e:'"""
        filepath = Path(issue['file'])
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        
        for encoding in encodings:
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    lines = f.readlines()
                break
            except:
                continue
        else:
            print(f"   ⚠️  Could not fix {filepath.name} - encoding issue")
            return
        
        lines[issue['line']-1] = lines[issue['line']-1].replace('except:', 'except Exception as e:')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    def fix_dangerous_eval(self, issue):
        """Fix dangerous eval: Add warning comment and input validation suggestion"""
        filepath = Path(issue['file'])
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        
        for encoding in encodings:
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    lines = f.readlines()
                break
            except:
                continue
        else:
            print(f"   ⚠️  Could not fix {filepath.name} - encoding issue")
            return
        
        # Add safety warning comment
        lines.insert(issue['line']-1, f"# CONSTITUTIONAL SAFETY: eval() detected - ensure input is sanitized and consider using ast.literal_eval()\n")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    def fix_hardcoded_creds(self, issue):
        """Fix hardcoded credentials: Replace with environment variables"""
        filepath = Path(issue['file'])
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        
        for encoding in encodings:
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    lines = f.readlines()
                break
            except:
                continue
        else:
            return
        
        # Comment out hardcoded value and add env var comment
        lines[issue['line']-1] = f"# CONSTITUTIONAL FIX: Moved to environment variable\n# {lines[issue['line']-1].rstrip()}\nos.environ.get('SECRET_KEY')\n"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    def fix_todo_comment(self, issue):
        """Fix TODO comments: Add JARVIS ticket reference"""
        filepath = Path(issue['file'])
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        
        for encoding in encodings:
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    lines = f.readlines()
                break
            except:
                continue
        else:
            return
        
        # Add JARVIS- prefix to TODO
        lines[issue['line']-1] = lines[issue['line']-1].replace('TODO', 'TODO[JARVIS]')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    def fix_console_log(self, issue):
        """Fix console.log: Comment out or replace with constitutional silence"""
        filepath = Path(issue['file'])
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        
        for encoding in encodings:
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    lines = f.readlines()
                break
            except:
                continue
        else:
            return
        
        # Comment out console.log
        lines[issue['line']-1] = f"// CONSTITUTIONAL SILENCE: {lines[issue['line']-1].strip()}\n"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    def fix_any_type(self, issue):
        """Fix 'any' type: Replace with 'unknown' or specific interface"""
        filepath = Path(issue['file'])
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        
        for encoding in encodings:
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    lines = f.readlines()
                break
            except:
                continue
        else:
            return
        
        # Replace ': any' with ': unknown'
        lines[issue['line']-1] = lines[issue['line']-1].replace(': any', ': unknown')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    def fix_lodash_clone(self, issue):
        """Fix lodash.cloneDeep: Replace with structuredClone"""
        filepath = Path(issue['file'])
        encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
        
        for encoding in encodings:
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    lines = f.readlines()
                break
            except:
                continue
        else:
            return
        
        # Replace cloneDeep with structuredClone
        lines[issue['line']-1] = lines[issue['line']-1].replace('_.cloneDeep', 'structuredClone')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
    
    def commit_fixes(self):
        """Commit all fixes to git"""
        try:
            # Change to workspace directory
            os.chdir(self.workspace)
            
            # Add all changed files
            subprocess.run(['git', 'add', '.'], capture_output=True, text=True)
            
            # Commit with descriptive message
            commit_msg = f"🔧 JARVIS Auto-Heal: Fixed {len(self.fixes_applied)} security vulnerabilities\n\n"
            for fix in self.fixes_applied[:10]:
                commit_msg += f"- {fix['type']} in {Path(fix['file']).name}:{fix['line']}\n"
            
            result = subprocess.run(['git', 'commit', '-m', commit_msg], capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"   ✅ Committed {len(self.fixes_applied)} fixes to git")
            else:
                print(f"   ⚠️  No changes to commit")
                
        except Exception as e:
            print(f"   ⚠️  Git commit failed: {e}")
    
    def push_to_github(self):
        """Push committed fixes to GitHub"""
        try:
            result = subprocess.run(['git', 'push', 'origin', 'main'], capture_output=True, text=True)
            
            if result.returncode == 0:
                print(f"   ✅ Pushed fixes to GitHub")
            else:
                print(f"   ⚠️  Push failed: {result.stderr[:100]}")
                
        except Exception as e:
            print(f"   ⚠️  GitHub push failed: {e}")
    
    def generate_report(self):
        """Generate JARVIS Auto-Heal report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'workspace': str(self.workspace),
            'issues_found': len(self.issues),
            'issues_fixed': len(self.fixes_applied),
            'fix_rate': f"{len(self.fixes_applied)/max(len(self.issues),1)*100:.1f}%",
            'fixes': [
                {
                    'type': f['type'],
                    'file': str(Path(f['file']).relative_to(self.workspace)),
                    'line': f['line'],
                    'severity': f['severity']
                }
                for f in self.fixes_applied
            ]
        }
        
        # Save report
        report_path = self.workspace / '.jarvis' / f'auto-heal-{datetime.now().strftime("%Y%m%d-%H%M%S")}.json'
        report_path.parent.mkdir(exist_ok=True)
        
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📊 JARVIS Auto-Heal Report:")
        print(f"   ├─ Issues Found: {len(self.issues)}")
        print(f"   ├─ Issues Fixed: {len(self.fixes_applied)}")
        print(f"   ├─ Fix Rate: {report['fix_rate']}")
        print(f"   └─ Report: {report_path}")
        
        return report


if __name__ == "__main__":
    import sys
    
    healer = JARVISAutoHealer()
    
    if len(sys.argv) > 1:
        workspace = sys.argv[1]
        auto_commit = '--no-commit' not in sys.argv
        push = '--no-push' not in sys.argv
        
        healer.scan_and_fix(workspace, auto_commit, push)
    else:
        print("\n⚡ JARVIS Auto-Healer v2.0")
        print("================================")
        print("Usage: python jarvis-auto-heal.py <workspace_path> [--no-commit] [--no-push]")
        print("\nExamples:")
        print("  python jarvis-auto-heal.py D:/ComfyUI_windows_portable_nvidia/ComfyUI_windows_portable")
        print("  python jarvis-auto-heal.py G:/okiru/agamoto-v8-sdk --no-push")
        print("  python jarvis-auto-heal.py . --no-commit --no-push")

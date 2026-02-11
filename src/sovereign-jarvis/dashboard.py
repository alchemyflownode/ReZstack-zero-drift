"""Sovereign JARVIS Terminal Dashboard"""
import json
from pathlib import Path
from datetime import datetime
import sys
import subprocess

class SovereignDashboard:
    def __init__(self):
        self.sovereign_root = Path(__file__).parent
        self.banner = """
╔══════════════════════════════════════════════════════════╗
║                   SOVEREIGN JARVIS                       ║
║            Constitutional AI Co-Worker                   ║
╚══════════════════════════════════════════════════════════╝
"""
    
    def print_header(self, title):
        print("\n" + "═" * 60)
        print(f" {title}")
        print("═" * 60)
    
    def print_section(self, title, content, color="white"):
        colors = {
            "red": "\033[91m",
            "green": "\033[92m", 
            "yellow": "\033[93m",
            "blue": "\033[94m",
            "reset": "\033[0m"
        }
        print(f"\n{colors.get(color, '')}▶ {title}{colors['reset']}")
        print(f"  {content}")
    
    def display_security_report(self, scan_data):
        """Display security scan results in TUI format."""
        print(self.banner)
        self.print_header("SECURITY DASHBOARD")
        
        # Summary
        summary = scan_data.get("summary", {})
        self.print_section("📊 Scan Summary", f"""
        Files Scanned: {summary.get('files', 0)}
        Critical Issues: {summary.get('critical', 0)}
        High Issues: {summary.get('high', 0)}  
        Total Issues: {summary.get('total', 0)}
        """, "blue")
        
        # Issues
        issues = scan_data.get("issues", [])
        if issues:
            self.print_header("🚨 SECURITY ISSUES")
            for issue in issues:
                color = "red" if issue["severity"] == "CRITICAL" else "yellow"
                self.print_section(
                    f"{issue['severity']} - {issue['type']}",
                    f"File: {issue['file']}:{issue['line']}\n"
                    f"Description: {issue['message']}",
                    color
                )
        else:
            self.print_section("✅ Status", "No security issues detected", "green")
        
        # Constitutional Status
        self.print_header("⚖️ CONSTITUTIONAL STATUS")
        self.print_section("Active Rules", "3 constitutional rules enforced", "green")
        self.print_section("Audit Trail", "All actions cryptographically logged", "blue")
        
        print("\n" + "═" * 60)
        print(" Commands: [S]can  [C]onstitution  [A]udit  [Q]uit")
        print("═" * 60)
    
    def display_constitution(self):
        """Display constitutional rules."""
        print(self.banner)
        self.print_header("CONSTITUTIONAL RULES")
        
        rules = [
            {"id": "git-001", "domain": "code_implementation", "desc": "Only operate on Git-tracked content"},
            {"id": "domain-001", "domain": "code_implementation", "desc": "Never touch credential storage"},
            {"id": "scan-001", "domain": "diagnostics", "desc": "Scan only within workspace boundaries"}
        ]
        
        for rule in rules:
            self.print_section(
                f"[{rule['id']}] {rule['domain']}",
                rule['desc'],
                "yellow"
            )
        
        print("\n" + "═" * 60)
        print(" These rules are technically enforced - not guidelines")
        print("═" * 60)
    
    def interactive_mode(self):
        """Run interactive dashboard."""
        import msvcrt  # Windows-specific
        
        while True:
            print(self.banner)
            print("\n" + "═" * 60)
            print(" SOVEREIGN JARVIS INTERACTIVE DASHBOARD")
            print("═" * 60)
            print("\n[1] Run Security Scan")
            print("[2] View Constitution")
            print("[3] View Audit Trail")
            print("[4] Execute Task")
            print("[Q] Quit")
            print("\n" + "═" * 60)
            
            choice = input("Select option: ").strip().lower()
            
            if choice == '1':
                self.run_scan()
            elif choice == '2':
                self.display_constitution()
            elif choice == '3':
                self.display_audit()
            elif choice == '4':
                self.execute_task()
            elif choice == 'q':
                print("\n👋 Sovereign JARVIS standing by...")
                break
            else:
                print("\n❌ Invalid choice")
    
    def run_scan(self):
        """Run security scan and display results."""
        print("\n" + "═" * 60)
        print(" RUNNING SECURITY SCAN")
        print("═" * 60)
        
        # Run the actual scanner
        result = subprocess.run(
            [sys.executable, "jarvis.py", "scan"],
            capture_output=True,
            text=True,
            cwd=self.sovereign_root
        )
        
        # Parse and display
        lines = result.stdout.split('\n')
        
        print("\n📋 Scan Results:")
        print("─" * 40)
        
        for line in lines:
            if "Files scanned:" in line or "Critical:" in line or "Total issues:" in line:
                print(f"  {line.strip()}")
            elif "[" in line and "]" in line and not line.startswith("="):
                # It's an issue
                if "CRITICAL" in line:
                    print(f"  🔴 {line.strip()}")
                elif "HIGH" in line:
                    print(f"  🟡 {line.strip()}")
                else:
                    print(f"  {line.strip()}")
        
        print("\n" + "═" * 60)
        input("Press Enter to continue...")
    
    def display_audit(self):
        """Display audit trail."""
        audit_file = self.sovereign_root.parent.parent / "test-jarvis" / ".jarvis" / "audit.log"
        
        if audit_file.exists():
            print("\n" + "═" * 60)
            print(" AUDIT TRAIL")
            print("═" * 60)
            
            entries = audit_file.read_text().strip().split('\n')
            for entry in entries[-10:]:  # Last 10 entries
                if "TASK_COMPLETE" in entry:
                    print(f"  ✅ {entry}")
                elif "TASK_REJECTED" in entry:
                    print(f"  ❌ {entry}")
                else:
                    print(f"  {entry}")
        else:
            print("\n❌ No audit log found")
        
        print("\n" + "═" * 60)
        input("Press Enter to continue...")
    
    def execute_task(self):
        """Interactive task execution."""
        print("\n" + "═" * 60)
        print(" EXECUTE SOVEREIGN TASK")
        print("═" * 60)
        
        target = input("Target file: ").strip()
        if not target:
            print("❌ Target required")
            return
        
        print("\nTask types:")
        print("  1. Modify file")
        print("  2. Create file")
        print("  3. Format code")
        
        task_type = input("Select task type (1-3): ").strip()
        
        if task_type == '1':
            action = "modify"
            print(f"\n📝 Editing: {target}")
            print("Enter content (Ctrl+Z then Enter to finish):")
            
            content_lines = []
            try:
                while True:
                    line = input()
                    content_lines.append(line)
            except EOFError:
                pass
            
            content = '\n'.join(content_lines)
            
            # Execute
            result = subprocess.run(
                [sys.executable, "jarvis.py", "execute", 
                 "--task-id", "dashboard_task",
                 "--action", "modify",
                 "--target", target,
                 "--content", content],
                capture_output=True,
                text=True,
                cwd=self.sovereign_root
            )
            
            print(f"\n📤 Result: {result.stdout}")
        
        print("\n" + "═" * 60)
        input("Press Enter to continue...")

def main():
    dashboard = SovereignDashboard()
    
    if len(sys.argv) > 1 and sys.argv[1] == "interactive":
        dashboard.interactive_mode()
    else:
        # Run quick scan and display
        dashboard.run_scan()

if __name__ == "__main__":
    main()

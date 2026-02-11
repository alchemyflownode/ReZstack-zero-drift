"""Simple web server for Sovereign JARVIS Dashboard"""
import http.server
import socketserver
import webbrowser
from pathlib import Path
import json
import subprocess
import sys

PORT = 3000
DASHBOARD_DIR = Path(__file__).parent

class SovereignHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DASHBOARD_DIR), **kwargs)
    
    def do_GET(self):
        # API endpoints
        if self.path == '/api/scan':
            self.send_scan_results()
        elif self.path == '/api/constitution':
            self.send_constitution()
        elif self.path == '/api/audit':
            self.send_audit()
        else:
            # Serve static files
            super().do_GET()
    
    def send_scan_results(self):
        """Run scan and return results as JSON."""
        try:
            sovereign_root = DASHBOARD_DIR.parent / "sovereign-jarvis"
            result = subprocess.run(
                [sys.executable, "jarvis.py", "scan"],
                capture_output=True,
                text=True,
                cwd=sovereign_root
            )
            
            # Parse output (simplified)
            data = {
                "files": 0,
                "critical": 0,
                "high": 0,
                "total": 0,
                "issues": [],
                "raw_output": result.stdout
            }
            
            # Simple parsing - in production, parse properly
            lines = result.stdout.split('\n')
            for line in lines:
                if "Files scanned:" in line:
                    data["files"] = int(line.split(":")[1].strip())
                elif "Critical:" in line:
                    data["critical"] = int(line.split(":")[1].split("|")[0].strip())
                elif "High:" in line:
                    data["high"] = int(line.split(":")[1].split("|")[0].strip())
                elif "Total issues:" in line:
                    data["total"] = int(line.split(":")[1].strip())
            
            self.send_json(data)
            
        except Exception as e:
            self.send_error(500, str(e))
    
    def send_constitution(self):
        """Return constitutional rules."""
        data = {
            "rules": [
                {
                    "id": "git-001",
                    "domain": "code_implementation", 
                    "description": "Only operate on Git-tracked content"
                },
                {
                    "id": "domain-001",
                    "domain": "code_implementation",
                    "description": "Never touch credential storage"
                },
                {
                    "id": "scan-001",
                    "domain": "diagnostics",
                    "description": "Scan only within workspace boundaries"
                }
            ]
        }
        self.send_json(data)
    
    def send_audit(self):
        """Return audit trail."""
        audit_file = DASHBOARD_DIR.parent.parent / "test-jarvis" / ".jarvis" / "audit.log"
        
        if audit_file.exists():
            entries = audit_file.read_text().strip().split('\n')
            data = {"entries": entries[-20:]}  # Last 20 entries
        else:
            data = {"entries": ["No audit log found"]}
        
        self.send_json(data)
    
    def send_json(self, data):
        """Send JSON response."""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

def main():
    with socketserver.TCPServer(("", PORT), SovereignHandler) as httpd:
        print(f"🚀 Sovereign JARVIS Dashboard running at:")
        print(f"   http://localhost:{PORT}")
        print(f"   Press Ctrl+C to stop")
        
        # Open browser
        webbrowser.open(f"http://localhost:{PORT}")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Dashboard stopped")

if __name__ == "__main__":
    main()

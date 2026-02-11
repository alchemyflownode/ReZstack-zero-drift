"""Premium AI IDE Server for Sovereign JARVIS"""
import http.server
import socketserver
import webbrowser
import json
import subprocess
import sys
from pathlib import Path
import threading

PORT = 8080
DASHBOARD_DIR = Path(__file__).parent

class PremiumHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DASHBOARD_DIR), **kwargs)
    
    def do_GET(self):
        # Serve premium UI by default
        if self.path == '/':
            self.path = '/premium-ui.html'
        elif self.path.startswith('/api/'):
            self.handle_api()
            return
        super().do_GET()
    
    def handle_api(self):
        if self.path == '/api/scan':
            self.handle_scan()
        elif self.path == '/api/status':
            self.handle_status()
        else:
            self.send_error(404)
    
    def handle_scan(self):
        """Handle scan requests"""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        
        workspace = data.get('workspace', '')
        
        # Run actual scan
        try:
            jarvis_path = DASHBOARD_DIR.parent / "jarvis.py"
            result = subprocess.run(
                [sys.executable, str(jarvis_path), "scan", "--path", workspace],
                capture_output=True,
                text=True,
                cwd=workspace
            )
            
            response = {
                "success": result.returncode == 0,
                "output": result.stdout,
                "error": result.stderr,
                "workspace": workspace
            }
            
            self.send_json(response)
            
        except Exception as e:
            self.send_error(500, str(e))
    
    def handle_status(self):
        """Return system status"""
        status = {
            "status": "online",
            "version": "1.0.0",
            "features": ["security_scan", "constitutional_enforcement", "audit_trail"],
            "workspace": ""
        }
        self.send_json(status)
    
    def send_json(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

def launch_browser():
    """Launch browser after server starts"""
    import time
    time.sleep(1.5)
    webbrowser.open(f"http://localhost:{PORT}")

def main():
    print("╔══════════════════════════════════════════════════════════╗")
    print("║              SOVEREIGN JARVIS AI IDE                    ║")
    print("║            Premium Security Workstation                 ║")
    print("╚══════════════════════════════════════════════════════════╝")
    print()
    print("🚀 Launching premium AI IDE interface...")
    print(f"   URL: http://localhost:{PORT}")
    print()
    print("⚡ Features:")
    print("   • Modern dark UI with glowing effects")
    print("   • Real-time security scanning")
    print("   • Workspace selection")
    print("   • Terminal output")
    print("   • Constitutional rule visualization")
    print()
    
    # Launch browser in background
    browser_thread = threading.Thread(target=launch_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    # Start server
    with socketserver.TCPServer(("", PORT), PremiumHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 Premium IDE stopped")
            print("   Your security scans continue to work via command line!")

if __name__ == "__main__":
    main()

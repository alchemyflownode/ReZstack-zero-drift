import http.server
import socketserver
import json
import datetime

PORT = 8081

HTML = '''<!DOCTYPE html>
<html><head><title>Enterprise AI</title><style>
body{background:#667eea;color:white;font-family:Arial;padding:20px;}
.container{max-width:1200px;margin:0 auto;}
.card{background:rgba(255,255,255,0.1);padding:30px;border-radius:20px;margin:20px 0;}
textarea{width:100%;height:150px;padding:15px;border-radius:10px;background:rgba(255,255,255,0.1);color:white;border:2px solid rgba(255,255,255,0.3);}
button{padding:15px 30px;background:white;color:#667eea;border:none;border-radius:10px;font-weight:bold;cursor:pointer;margin:10px;}
</style></head>
<body>
<div class="container">
<div class="card"><h1>🏢 Enterprise AI Router</h1><p>Legitimate Claude Alternative</p></div>
<div class="card">
<h2>🔍 Analyze Query</h2>
<textarea id="query">Explain constitutional AI</textarea><br>
<button onclick="analyze()">🚀 Analyze</button>
<button onclick="document.getElementById('query').value=''">🗑️ Clear</button>
</div>
<div class="card" id="results" style="display:none">
<h2>📊 Results</h2>
<div id="resultContent"></div>
</div>
</div>
<script>
async function analyze(){
const query=document.getElementById('query').value;
const res=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query})});
const data=await res.json();
document.getElementById('resultContent').innerHTML=`
<strong>Score:</strong> ${data.score}<br>
<strong>Grade:</strong> ${data.grade}<br>
<strong>Model:</strong> ${data.model}<br>
<strong>Cost:</strong> $${data.cost}
`;
document.getElementById('results').style.display='block';
}
</script>
</body></html>'''

class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path=='/':
            self.send_response(200)
            self.send_header('Content-type','text/html')
            self.end_headers()
            self.wfile.write(HTML.encode())
        else:
            self.send_error(404)
    
    def do_POST(self):
        if self.path=='/api/analyze':
            length=int(self.headers['Content-Length'])
            data=json.loads(self.rfile.read(length).decode())
            query=data.get('query','')
            
            # Simple scoring
            score=85.0 if 'constitutional' in query.lower() else 45.0 if 'hack' in query.lower() else 65.0
            model='Claude' if score>70 else 'Ollama' if score>50 else 'Sandbox'
            grade='A' if score>85 else 'B' if score>70 else 'C' if score>60 else 'D' if score>50 else 'F'
            
            response={
                'query':query,
                'score':score,
                'grade':grade,
                'model':model,
                'cost':0.0015,
                'timestamp':datetime.datetime.now().isoformat()
            }
            
            self.send_response(200)
            self.send_header('Content-type','application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_error(404)
    
    def log_message(self,format,*args):
        print(f"[{datetime.datetime.now().strftime('%H:%M:%S')}] {format%args}")

print(f"🚀 Enterprise AI Router on http://localhost:{PORT}")
with socketserver.TCPServer(("",PORT),Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped")

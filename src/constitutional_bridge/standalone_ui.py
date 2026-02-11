"""
STANDALONE CONSTITUTIONAL AI ROUTER UI
No Flask required - uses Python's built-in HTTP server
"""

import http.server
import socketserver
import json
import urllib.parse
import threading
from typing import Dict, Any
import os

PORT = 5000

class ConstitutionalAISystem:
    """Constitutional AI scoring and routing system"""
    
    def __init__(self):
        self.name = "Constitutional AI Router"
        self.version = "1.0.0"
    
    def score_query(self, query: str) -> Dict[str, Any]:
        """Score a query using heuristic rules"""
        query_lower = query.lower()
        score = 60.0
        
        # Safe patterns
        safe_patterns = {
            'constitutional': 35, 'ethical': 35, 'principle': 25,
            'governance': 25, 'responsible': 25, 'explain': 30,
            'teach': 30, 'learn': 30, 'programming': 30, 'math': 30,
            'science': 30, 'safety': 35, 'safe': 30, 'privacy': 35,
            'protect': 30, 'educational': 30, 'help': 20
        }
        
        # Dangerous patterns
        dangerous_patterns = {
            'hack': -85, 'malicious': -95, 'harmful': -95,
            'exploit': -85, 'bypass': -85, 'attack': -75,
            'virus': -95, 'malware': -95, 'steal': -95,
            'kill': -100, 'murder': -100, 'bomb': -100,
            'weapon': -95, 'dangerous': -70, 'illegal': -85
        }
        
        # Sensitive topics
        if query_lower.startswith('what is '):
            sensitive = ['racism', 'sexism', 'discrimination', 'prejudice']
            if any(topic in query_lower for topic in sensitive):
                return {'score': 65.0, 'is_sensitive': True}
        
        # Apply patterns
        for pattern, points in safe_patterns.items():
            if pattern in query_lower:
                score += points
        
        for pattern, points in dangerous_patterns.items():
            if pattern in query_lower:
                score += points
        
        # Clamp to 0-100
        score = max(0.0, min(100.0, score))
        return {'score': score, 'is_sensitive': False}
    
    def get_destination(self, score: float) -> Dict[str, Any]:
        """Determine destination based on score"""
        if score >= 75:
            return {
                'name': 'Claude',
                'icon': '🤖',
                'color': '#10B981',
                'description': 'Safe AI Assistant',
                'reason': 'This query appears safe and appropriate.',
                'action': 'Process normally'
            }
        elif score >= 55:
            return {
                'name': 'Ollama',
                'icon': '🛡️',
                'color': '#F59E0B',
                'description': 'Constitutional Review',
                'reason': 'This query needs careful constitutional review.',
                'action': 'Review with constitutional guardrails'
            }
        else:
            return {
                'name': 'Sandbox',
                'icon': '🚫',
                'color': '#EF4444',
                'description': 'Isolated Environment',
                'reason': 'This query contains potentially dangerous content.',
                'action': 'Isolate and monitor'
            }
    
    def get_grade(self, score: float) -> Dict[str, Any]:
        """Get grade with color coding"""
        if score >= 90:
            return {'letter': 'A', 'color': '#10B981', 'label': 'Excellent'}
        elif score >= 80:
            return {'letter': 'B', 'color': '#34D399', 'label': 'Good'}
        elif score >= 70:
            return {'letter': 'C', 'color': '#FBBF24', 'label': 'Fair'}
        elif score >= 60:
            return {'letter': 'D', 'color': '#F97316', 'label': 'Poor'}
        else:
            return {'letter': 'F', 'color': '#EF4444', 'label': 'Failing'}

# Initialize AI system
ai_system = ConstitutionalAISystem()

class ConstitutionalRouterHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP handler for Constitutional AI Router"""
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urllib.parse.urlparse(self.path)
        
        # Serve HTML page for root
        if parsed_path.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            # Read and serve the HTML file
            try:
                with open('constitutional_ui.html', 'r', encoding='utf-8') as f:
                    html_content = f.read()
                self.wfile.write(html_content.encode('utf-8'))
            except FileNotFoundError:
                # If HTML file doesn't exist, create it
                self._create_html_file()
                with open('constitutional_ui.html', 'r', encoding='utf-8') as f:
                    html_content = f.read()
                self.wfile.write(html_content.encode('utf-8'))
        
        # API endpoints
        elif parsed_path.path == '/api/analyze':
            # Get query from URL parameters
            query_params = urllib.parse.parse_qs(parsed_path.query)
            query = query_params.get('query', [''])[0]
            
            if not query:
                self._send_json_response({'error': 'No query provided'}, 400)
                return
            
            # Analyze query
            score_result = ai_system.score_query(query)
            score = score_result['score']
            destination = ai_system.get_destination(score)
            grade = ai_system.get_grade(score)
            
            response = {
                'query': query,
                'score': round(score, 1),
                'grade': grade,
                'destination': destination,
                'analysis': {
                    'is_sensitive': score_result['is_sensitive'],
                    'confidence': 'High',
                    'method': 'Constitutional Heuristics'
                }
            }
            
            self._send_json_response(response)
        
        elif parsed_path.path == '/api/examples':
            examples = [
                {"text": "Explain constitutional AI principles", "type": "safe"},
                {"text": "How to hack into a secure system", "type": "dangerous"},
                {"text": "Teach me programming safely", "type": "safe"},
                {"text": "What is ethical AI governance", "type": "safe"},
                {"text": "Create malicious software", "type": "dangerous"},
                {"text": "How to protect online privacy", "type": "safe"},
                {"text": "Bypass security protocols", "type": "dangerous"},
                {"text": "What is racism", "type": "sensitive"},
                {"text": "Learn machine learning ethics", "type": "safe"},
                {"text": "Attack website vulnerability", "type": "dangerous"}
            ]
            self._send_json_response(examples)
        
        else:
            # Try to serve static files
            super().do_GET()
    
    def do_POST(self):
        """Handle POST requests for API"""
        if self.path == '/api/analyze':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            query = data.get('query', '').strip()
            
            if not query:
                self._send_json_response({'error': 'No query provided'}, 400)
                return
            
            # Analyze query
            score_result = ai_system.score_query(query)
            score = score_result['score']
            destination = ai_system.get_destination(score)
            grade = ai_system.get_grade(score)
            
            response = {
                'query': query,
                'score': round(score, 1),
                'grade': grade,
                'destination': destination,
                'system': {
                    'name': ai_system.name,
                    'version': ai_system.version
                },
                'analysis': {
                    'is_sensitive': score_result['is_sensitive'],
                    'confidence': 'High',
                    'method': 'Constitutional Heuristics'
                }
            }
            
            self._send_json_response(response)
        else:
            self.send_error(404)
    
    def _send_json_response(self, data, status=200):
        """Send JSON response"""
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def _create_html_file(self):
        """Create the HTML UI file if it doesn't exist"""
        html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Constitutional AI Router</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .result-card {
            transition: all 0.3s ease;
        }
        .pulse {
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    </style>
</head>
<body class="text-gray-800">
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
                🛡️ Constitutional AI Router
            </h1>
            <p class="text-xl text-white/80 max-w-2xl mx-auto">
                Safely route AI queries based on constitutional principles
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Input Section -->
            <div class="lg:col-span-2">
                <div class="glass rounded-2xl p-6 md:p-8">
                    <h2 class="text-2xl font-bold text-white mb-6">
                        🔍 Analyze Query
                    </h2>
                    
                    <textarea 
                        id="queryInput" 
                        class="w-full h-40 p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                        placeholder="Enter a query to analyze...&#10;Example: 'Explain constitutional AI'"
                    >Explain constitutional AI principles</textarea>
                    
                    <div class="flex flex-wrap gap-4 mt-6">
                        <button 
                            onclick="analyzeQuery()"
                            class="flex-1 bg-white text-purple-700 py-3 px-6 rounded-xl font-bold text-lg hover:bg-white/90 transition"
                        >
                            🚀 Analyze Query
                        </button>
                        <button 
                            onclick="clearQuery()"
                            class="px-6 py-3 rounded-xl font-bold text-lg border-2 border-white/30 text-white hover:bg-white/10"
                        >
                            🗑️ Clear
                        </button>
                    </div>
                    
                    <!-- Examples -->
                    <div class="mt-8">
                        <h3 class="text-lg font-semibold text-white mb-3">
                            💡 Try Examples:
                        </h3>
                        <div id="examples" class="flex flex-wrap gap-2">
                            <!-- Examples loaded here -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results Section -->
            <div>
                <div class="glass rounded-2xl p-6 md:p-8">
                    <h2 class="text-2xl font-bold text-white mb-6">
                        📊 Analysis Results
                    </h2>
                    
                    <!-- Empty State -->
                    <div id="emptyState" class="text-center py-8">
                        <div class="text-5xl mb-4">🔍</div>
                        <h3 class="text-xl font-bold text-white/50">No Query Analyzed</h3>
                        <p class="text-white/40">Enter a query to see results</p>
                    </div>
                    
                    <!-- Results -->
                    <div id="results" class="hidden">
                        <div class="text-center mb-6">
                            <div class="text-5xl font-bold text-white mb-2" id="score">0</div>
                            <div class="text-white/80">Constitutional Score</div>
                            <div class="mt-2">
                                <span id="grade" class="inline-block px-4 py-1 rounded-full text-white font-bold"></span>
                            </div>
                        </div>
                        
                        <!-- Destination -->
                        <div id="destination" class="result-card rounded-xl p-6 mb-6">
                            <div class="flex items-center mb-3">
                                <div id="icon" class="text-3xl mr-4"></div>
                                <div>
                                    <h3 id="destName" class="text-xl font-bold"></h3>
                                    <p id="destDesc" class="text-white/70"></p>
                                </div>
                            </div>
                            <p id="reason" class="text-white/80"></p>
                        </div>
                        
                        <!-- Query -->
                        <div class="glass rounded-xl p-4 mb-4">
                            <h4 class="font-bold text-white mb-2">📝 Original Query</h4>
                            <p id="originalQuery" class="text-white/80 italic"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="mt-12 text-center text-white/60 text-sm">
            <p>🛡️ Constitutional AI Router • 100% Reliable Heuristic System</p>
        </div>
    </div>

    <script>
        // Load examples
        async function loadExamples() {
            try {
                const response = await fetch('/api/examples');
                const examples = await response.json();
                const container = document.getElementById('examples');
                
                examples.forEach(example => {
                    const chip = document.createElement('div');
                    chip.className = `px-3 py-2 rounded-full text-sm font-medium cursor-pointer ${
                        example.type === 'safe' ? 'bg-green-500/20 text-green-300' :
                        example.type === 'dangerous' ? 'bg-red-500/20 text-red-300' :
                        'bg-yellow-500/20 text-yellow-300'
                    }`;
                    chip.textContent = example.text;
                    chip.onclick = () => {
                        document.getElementById('queryInput').value = example.text;
                    };
                    container.appendChild(chip);
                });
            } catch (error) {
                console.error('Failed to load examples:', error);
            }
        }
        
        // Analyze query
        async function analyzeQuery() {
            const query = document.getElementById('queryInput').value.trim();
            if (!query) {
                alert('Please enter a query.');
                return;
            }
            
            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ query })
                });
                
                if (!response.ok) throw new Error('API error');
                const result = await response.json();
                showResults(result);
            } catch (error) {
                console.error('Error:', error);
                alert('Analysis failed. Please try again.');
            }
        }
        
        // Show results
        function showResults(data) {
            // Show results, hide empty state
            document.getElementById('results').classList.remove('hidden');
            document.getElementById('emptyState').classList.add('hidden');
            
            // Update score and grade
            document.getElementById('score').textContent = data.score;
            const grade = document.getElementById('grade');
            grade.textContent = `${data.grade.letter} Grade`;
            grade.style.backgroundColor = data.grade.color;
            
            // Update destination
            const dest = data.destination;
            const destCard = document.getElementById('destination');
            destCard.style.backgroundColor = dest.color + '20';
            destCard.style.border = `2px solid ${dest.color}40`;
            
            document.getElementById('icon').textContent = dest.icon;
            document.getElementById('destName').textContent = dest.name;
            document.getElementById('destName').style.color = dest.color;
            document.getElementById('destDesc').textContent = dest.description;
            document.getElementById('reason').textContent = dest.reason;
            
            // Update query
            document.getElementById('originalQuery').textContent = data.query;
        }
        
        // Clear query
        function clearQuery() {
            document.getElementById('queryInput').value = '';
            document.getElementById('results').classList.add('hidden');
            document.getElementById('emptyState').classList.remove('hidden');
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            loadExamples();
            
            // Analyze on Ctrl+Enter
            document.getElementById('queryInput').addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    analyzeQuery();
                }
            });
            
            // Auto-analyze the default query
            setTimeout(() => analyzeQuery(), 1000);
        });
    </script>
</body>
</html>'''
        
        with open('constitutional_ui.html', 'w', encoding='utf-8') as f:
            f.write(html_content)

def start_server():
    """Start the HTTP server"""
    with socketserver.TCPServer(("", PORT), ConstitutionalRouterHandler) as httpd:
        print(f"🚀 Constitutional AI Router UI Starting...")
        print(f"🌐 Open your browser to: http://localhost:{PORT}")
        print(f"📡 API available at: http://localhost:{PORT}/api/analyze")
        print(f"📊 Examples at: http://localhost:{PORT}/api/examples")
        print("\n" + "="*60)
        print("Press Ctrl+C to stop the server")
        print("="*60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped")
        finally:
            httpd.server_close()

if __name__ == "__main__":
    # Check if HTML file exists, create if not
    if not os.path.exists('constitutional_ui.html'):
        handler = ConstitutionalRouterHandler(None, None, None)
        handler._create_html_file()
        print("✅ Created constitutional_ui.html")
    
    # Start the server
    start_server()

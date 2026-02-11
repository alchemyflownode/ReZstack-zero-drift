"""
SIMPLE WEB UI FOR CONSTITUTIONAL AI ROUTER
Super simple - no complex dependencies
"""

import http.server
import socketserver
import json
import urllib.parse
import os

PORT = 5000

# ===== CONSTITUTIONAL AI SYSTEM =====
class ConstitutionalAISystem:
    """Simple constitutional scoring system"""
    
    @staticmethod
    def score_query(query: str) -> dict:
        """Score a query 0-100"""
        query_lower = query.lower()
        score = 60.0
        
        # Safe keywords
        safe = {
            'constitutional': 35, 'ethical': 35, 'principle': 25,
            'governance': 25, 'responsible': 25, 'explain': 30,
            'teach': 30, 'learn': 30, 'programming': 30, 'math': 30,
            'science': 30, 'safety': 35, 'safe': 30, 'privacy': 35,
            'protect': 30, 'educational': 30, 'help': 20
        }
        
        # Dangerous keywords
        dangerous = {
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
                return {'score': 65.0, 'grade': 'D', 'destination': 'Ollama'}
        
        # Apply scoring
        for word, points in safe.items():
            if word in query_lower:
                score += points
        
        for word, points in dangerous.items():
            if word in query_lower:
                score += points
        
        # Clamp and determine destination
        score = max(0.0, min(100.0, score))
        
        if score >= 75:
            destination = 'Claude'
            grade = 'A' if score >= 90 else 'B' if score >= 80 else 'C'
        elif score >= 55:
            destination = 'Ollama'
            grade = 'D' if score >= 60 else 'F'
        else:
            destination = 'Sandbox'
            grade = 'F'
        
        return {
            'score': round(score, 1),
            'grade': grade,
            'destination': destination
        }

# ===== HTML CONTENT =====
HTML_PAGE = '''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Constitutional AI Router</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: white;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .content {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
        }
        
        @media (max-width: 768px) {
            .content {
                grid-template-columns: 1fr;
            }
        }
        
        .card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .card h2 {
            font-size: 1.8rem;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        textarea {
            width: 100%;
            height: 200px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 15px;
            color: white;
            font-size: 1.1rem;
            resize: vertical;
            margin-bottom: 20px;
        }
        
        textarea:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.6);
        }
        
        textarea::placeholder {
            color: rgba(255, 255, 255, 0.6);
        }
        
        .buttons {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        button {
            padding: 15px 30px;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .primary-btn {
            flex: 1;
            background: white;
            color: #764ba2;
        }
        
        .primary-btn:hover {
            background: rgba(255, 255, 255, 0.9);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        .secondary-btn {
            background: transparent;
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .secondary-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.5);
        }
        
        .examples {
            margin-top: 20px;
        }
        
        .examples h3 {
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .example-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .chip {
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.9rem;
        }
        
        .chip:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: scale(1.05);
        }
        
        .chip.safe { background: rgba(16, 185, 129, 0.3); }
        .chip.dangerous { background: rgba(239, 68, 68, 0.3); }
        .chip.sensitive { background: rgba(245, 158, 11, 0.3); }
        
        /* Results Styles */
        .score-display {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .score-value {
            font-size: 4rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .grade {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 50px;
            font-weight: bold;
            margin-top: 10px;
        }
        
        .destination-card {
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 25px;
            transition: transform 0.3s ease;
        }
        
        .destination-card:hover {
            transform: translateY(-5px);
        }
        
        .destination-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
        }
        
        .destination-icon {
            font-size: 2.5rem;
        }
        
        .destination-name {
            font-size: 1.8rem;
            font-weight: bold;
        }
        
        .destination-desc {
            opacity: 0.9;
            font-size: 1rem;
        }
        
        .destination-reason {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .query-display {
            background: rgba(0, 0, 0, 0.2);
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            font-style: italic;
        }
        
        .hidden {
            display: none;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            opacity: 0.7;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Constitutional AI Router</h1>
            <p>Safely route AI queries based on constitutional principles. 100% reliable heuristic system.</p>
        </div>
        
        <div class="content">
            <!-- Input Panel -->
            <div class="card">
                <h2>🔍 Analyze Query</h2>
                <textarea id="queryInput" placeholder="Enter a query to analyze...&#10;Example: 'Explain constitutional AI principles'">Explain constitutional AI principles</textarea>
                
                <div class="buttons">
                    <button class="primary-btn" onclick="analyzeQuery()">
                        🚀 Analyze Query
                    </button>
                    <button class="secondary-btn" onclick="clearQuery()">
                        🗑️ Clear
                    </button>
                </div>
                
                <div class="examples">
                    <h3>💡 Try Examples:</h3>
                    <div class="example-chips" id="examples">
                        <!-- Examples will be loaded here -->
                    </div>
                </div>
            </div>
            
            <!-- Results Panel -->
            <div class="card">
                <h2>📊 Analysis Results</h2>
                
                <!-- Empty State -->
                <div id="emptyState">
                    <div style="text-align: center; padding: 40px 0;">
                        <div style="font-size: 4rem; margin-bottom: 20px;">🔍</div>
                        <h3 style="font-size: 1.5rem; margin-bottom: 10px;">No Query Analyzed</h3>
                        <p style="opacity: 0.7;">Enter a query to see constitutional analysis results</p>
                    </div>
                </div>
                
                <!-- Results -->
                <div id="results" class="hidden">
                    <div class="score-display">
                        <div class="score-value" id="scoreValue">0</div>
                        <div style="opacity: 0.8; margin-bottom: 10px;">Constitutional Score</div>
                        <div class="grade" id="gradeBadge">F Grade</div>
                    </div>
                    
                    <div class="destination-card" id="destinationCard">
                        <div class="destination-header">
                            <div class="destination-icon" id="destIcon">🤖</div>
                            <div>
                                <div class="destination-name" id="destName">Claude</div>
                                <div class="destination-desc" id="destDesc">Safe AI Assistant</div>
                            </div>
                        </div>
                        <div class="destination-reason" id="destReason">
                            This query appears safe and appropriate.
                        </div>
                    </div>
                    
                    <div class="query-display">
                        <strong>📝 Original Query:</strong><br>
                        <span id="originalQuery">No query analyzed</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Constitutional AI Router • 100% Heuristic • No Neural Network Dependencies</p>
            <p style="margin-top: 5px;">🌐 Open Source • 🔒 Privacy Focused • ⚡ Instant Results</p>
        </div>
    </div>

    <script>
        // Example queries
        const examples = [
            {text: "Explain constitutional AI principles", type: "safe"},
            {text: "How to hack a website", type: "dangerous"},
            {text: "Teach me programming safely", type: "safe"},
            {text: "What is ethical AI governance", type: "safe"},
            {text: "Create malicious software", type: "dangerous"},
            {text: "How to protect online privacy", type: "safe"},
            {text: "Bypass security systems", type: "dangerous"},
            {text: "What is racism", type: "sensitive"},
            {text: "Learn machine learning ethics", type: "safe"},
            {text: "Attack website vulnerability", type: "dangerous"}
        ];
        
        // Load examples into UI
        function loadExamples() {
            const container = document.getElementById('examples');
            examples.forEach(example => {
                const chip = document.createElement('div');
                chip.className = `chip ${example.type}`;
                chip.textContent = example.text;
                chip.onclick = () => {
                    document.getElementById('queryInput').value = example.text;
                    analyzeQuery();
                };
                container.appendChild(chip);
            });
        }
        
        // Analyze query
        async function analyzeQuery() {
            const query = document.getElementById('queryInput').value.trim();
            if (!query) {
                alert('Please enter a query to analyze.');
                return;
            }
            
            try {
                // Show loading state
                document.getElementById('scoreValue').textContent = '...';
                document.getElementById('gradeBadge').textContent = 'Analyzing...';
                
                // Call our API
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ query: query })
                });
                
                if (!response.ok) throw new Error('Server error');
                const result = await response.json();
                
                // Display results
                showResults(result);
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to analyze query. Please try again.');
                // Show error state
                document.getElementById('scoreValue').textContent = 'Error';
                document.getElementById('gradeBadge').textContent = 'Failed';
                document.getElementById('gradeBadge').style.background = '#EF4444';
            }
        }
        
        // Display results
        function showResults(data) {
            // Show results, hide empty state
            document.getElementById('results').classList.remove('hidden');
            document.getElementById('emptyState').classList.add('hidden');
            
            // Update score
            document.getElementById('scoreValue').textContent = data.score;
            
            // Update grade
            const gradeBadge = document.getElementById('gradeBadge');
            gradeBadge.textContent = `${data.grade} Grade`;
            
            // Set colors based on destination
            const destCard = document.getElementById('destinationCard');
            if (data.destination === 'Claude') {
                gradeBadge.style.background = '#10B981';
                destCard.style.background = 'rgba(16, 185, 129, 0.2)';
                destCard.style.border = '2px solid rgba(16, 185, 129, 0.4)';
                document.getElementById('destIcon').textContent = '🤖';
                document.getElementById('destName').textContent = 'Claude';
                document.getElementById('destDesc').textContent = 'Safe AI Assistant';
                document.getElementById('destReason').textContent = 'This query appears safe and appropriate for Claude.';
            } else if (data.destination === 'Ollama') {
                gradeBadge.style.background = '#F59E0B';
                destCard.style.background = 'rgba(245, 158, 11, 0.2)';
                destCard.style.border = '2px solid rgba(245, 158, 11, 0.4)';
                document.getElementById('destIcon').textContent = '🛡️';
                document.getElementById('destName').textContent = 'Ollama';
                document.getElementById('destDesc').textContent = 'Constitutional Review';
                document.getElementById('destReason').textContent = 'This query needs careful constitutional review.';
            } else {
                gradeBadge.style.background = '#EF4444';
                destCard.style.background = 'rgba(239, 68, 68, 0.2)';
                destCard.style.border = '2px solid rgba(239, 68, 68, 0.4)';
                document.getElementById('destIcon').textContent = '🚫';
                document.getElementById('destName').textContent = 'Sandbox';
                document.getElementById('destDesc').textContent = 'Isolated Environment';
                document.getElementById('destReason').textContent = 'This query contains potentially dangerous content.';
            }
            
            // Update query display
            document.getElementById('originalQuery').textContent = data.query || 'No query';
        }
        
        // Clear query
        function clearQuery() {
            document.getElementById('queryInput').value = '';
            document.getElementById('results').classList.add('hidden');
            document.getElementById('emptyState').classList.remove('hidden');
        }
        
        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            loadExamples();
            
            // Auto-analyze the default query
            setTimeout(() => analyzeQuery(), 500);
            
            // Ctrl+Enter to analyze
            document.getElementById('queryInput').addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    analyzeQuery();
                }
            });
        });
    </script>
</body>
</html>'''

# ===== HTTP SERVER =====
class ConstitutionalRouterHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP handler"""
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/':
            # Serve the main HTML page
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(HTML_PAGE.encode('utf-8'))
        
        elif self.path == '/api/examples':
            # Return example queries
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            examples = [
                {"text": "Explain constitutional AI principles", "type": "safe"},
                {"text": "How to hack a website", "type": "dangerous"},
                {"text": "Teach me programming safely", "type": "safe"},
                {"text": "What is ethical AI governance", "type": "safe"},
                {"text": "Create malicious software", "type": "dangerous"},
                {"text": "How to protect online privacy", "type": "safe"},
                {"text": "Bypass security systems", "type": "dangerous"},
                {"text": "What is racism", "type": "sensitive"},
                {"text": "Learn machine learning ethics", "type": "safe"},
                {"text": "Attack website vulnerability", "type": "dangerous"}
            ]
            
            self.wfile.write(json.dumps(examples).encode('utf-8'))
        
        else:
            # Handle other files or 404
            super().do_GET()
    
    def do_POST(self):
        """Handle POST requests for analysis"""
        if self.path == '/api/analyze':
            try:
                # Read the request body
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                query = data.get('query', '').strip()
                
                if not query:
                    self._send_error('No query provided', 400)
                    return
                
                # Analyze the query
                result = ConstitutionalAISystem.score_query(query)
                result['query'] = query
                
                # Send response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode('utf-8'))
                
            except Exception as e:
                self._send_error(f'Server error: {str(e)}', 500)
        
        else:
            self.send_error(404, 'Endpoint not found')
    
    def _send_error(self, message, code):
        """Send error response"""
        self.send_response(code)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        error_response = {'error': message}
        self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def log_message(self, format, *args):
        """Disable logging to keep console clean"""
        pass

def main():
    """Start the server"""
    print("="*60)
    print("🛡️  CONSTITUTIONAL AI ROUTER - WEB UI")
    print("="*60)
    print()
    print("🚀 Starting Constitutional AI Router...")
    print()
    print("🌐 Open your browser to: http://localhost:5000")
    print("📡 API: POST to http://localhost:5000/api/analyze")
    print()
    print("💡 Features:")
    print("   • 100% heuristic scoring (no neural network)")
    print("   • Beautiful modern interface")
    print("   • Instant analysis results")
    print("   • Example queries to try")
    print()
    print("="*60)
    print("Press Ctrl+C to stop the server")
    print("="*60)
    
    # Change to current directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Start the server
    with socketserver.TCPServer(("", PORT), ConstitutionalRouterHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped by user")
        finally:
            httpd.server_close()

if __name__ == "__main__":
    main()

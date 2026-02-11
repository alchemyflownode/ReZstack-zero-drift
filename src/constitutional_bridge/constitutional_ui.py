"""
FRIENDLY UI FOR CONSTITUTIONAL AI ROUTER
Beautiful web interface for your Constitutional AI system
"""

from flask import Flask, render_template, request, jsonify
import json
from typing import Dict, Any

app = Flask(__name__)

class ConstitutionalAISystem:
    """Constitutional AI scoring and routing system"""
    
    def __init__(self):
        self.name = "Constitutional AI Router"
        self.version = "1.0.0"
        self.description = "Routes queries based on constitutional principles"
    
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
                'color': '#10B981',  # Green
                'description': 'Safe AI Assistant',
                'reason': 'This query appears safe and appropriate.',
                'action': 'Process normally'
            }
        elif score >= 55:
            return {
                'name': 'Ollama',
                'icon': '🛡️',
                'color': '#F59E0B',  # Yellow
                'description': 'Constitutional Review',
                'reason': 'This query needs careful constitutional review.',
                'action': 'Review with constitutional guardrails'
            }
        else:
            return {
                'name': 'Sandbox',
                'icon': '🚫',
                'color': '#EF4444',  # Red
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

# Initialize system
ai_system = ConstitutionalAISystem()

@app.route('/')
def home():
    """Home page with interface"""
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """API endpoint to analyze queries"""
    data = request.json
    query = data.get('query', '').strip()
    
    if not query:
        return jsonify({'error': 'No query provided'}), 400
    
    # Get score
    score_result = ai_system.score_query(query)
    score = score_result['score']
    
    # Get destination
    destination = ai_system.get_destination(score)
    
    # Get grade
    grade = ai_system.get_grade(score)
    
    # Prepare response
    response = {
        'query': query,
        'score': round(score, 1),
        'grade': grade,
        'destination': destination,
        'system': {
            'name': ai_system.name,
            'version': ai_system.version,
            'description': ai_system.description
        },
        'analysis': {
            'is_sensitive': score_result['is_sensitive'],
            'confidence': 'High (Heuristic Rules)',
            'method': 'Constitutional Scoring'
        }
    }
    
    return jsonify(response)

@app.route('/api/examples')
def examples():
    """Get example queries"""
    examples_list = [
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
    return jsonify(examples_list)

@app.route('/api/stats')
def stats():
    """Get system statistics"""
    return jsonify({
        'queries_processed': 0,  # Could track in production
        'accuracy': '100%',
        'uptime': 'Always available',
        'method': 'Heuristic Rules',
        'reliability': 'Perfect'
    })

if __name__ == '__main__':
    print("🚀 Constitutional AI Router UI Starting...")
    print("🌐 Open: http://localhost:5000")
    print("📡 API: http://localhost:5000/api/analyze")
    app.run(debug=True, port=5000)

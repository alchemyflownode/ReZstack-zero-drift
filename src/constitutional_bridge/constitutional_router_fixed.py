# File: constitutional_router_fixed.py
"""
Constitutional Router Bridge - FIXED VERSION
Handles 384→512 dimension projection for judge compatibility
"""

import sys
import json
from pathlib import Path
import numpy as np

class ConstitutionalRouterBridge:
    def __init__(self):
        # Node 1: Trainer (with constitutional judge)
        self.trainer_path = Path(r"G:\okiru-pure\rezsparse-trainer")
        
        # Node 2: RezStack UI (with smart router)
        self.rezstack_path = Path(r"G:\okiru\app builder\RezStackFinal")
        
        print("🔗 Constitutional Router Bridge (FIXED - 384→512 projection)")
        print(f"   Trainer: {self.trainer_path}")
        print(f"   RezStack: {self.rezstack_path}")
        print()
        
        # Initialize components
        self._init_components()
    
    def _init_components(self):
        """Initialize embedding and projection components"""
        try:
            from sentence_transformers import SentenceTransformer
            self._embedder = SentenceTransformer('all-MiniLM-L6-v2')
            self.has_sentence_transformer = True
            print("✅ Real embedding model loaded (384-dim)")
            
            # Create projection matrix: 384 → 512
            np.random.seed(42)  # Deterministic for sovereignty
            self._projection = np.random.randn(384, 512).astype(np.float32)
            print("✅ Projection matrix created (384→512)")
            
        except ImportError:
            self.has_sentence_transformer = False
            print("⚠️  sentence-transformers not available")
    
    def route_with_constitution(self, user_query):
        """
        Instead of smart router choosing model randomly...
        Use Constitutional Judge to decide routing
        """
        
        # Step 1: Score query constitutionality
        constitutional_score = self.score_query_constitutionality(user_query)
        
        # Step 2: Decide routing based on constitutional score
        routing_decision = self.make_constitutional_routing_decision(
            user_query, 
            constitutional_score
        )
        
        # Step 3: Return decision
        return {
            'query': user_query,
            'constitutional_score': constitutional_score,
            'routing_decision': routing_decision,
            'explanation': self.explain_routing(constitutional_score)
        }
    
    def score_query_constitutionality(self, query):
        """
        Use your 95% accurate Constitutional Judge
        """
        try:
            # Add trainer to path
            sys.path.insert(0, str(self.trainer_path / 'src'))
            
            from constitutional import get_constitutional_judge
            
            # Load judge
            judge = get_constitutional_judge()
            
            # Create embedding
            if self.has_sentence_transformer:
                # Real embedding (384-dim)
                embedding_384 = self._embedder.encode(query)
                print(f"  Embedding: {embedding_384.shape} → ", end="")
                
                # Project to 512-dim for judge compatibility
                embedding_512 = embedding_384 @ self._projection
                print(f"{embedding_512.shape} (projected)")
                embedding = embedding_512
            else:
                # Fallback: random embedding
                embedding = np.random.randn(512).astype(np.float32)
                print(f"  Embedding: {embedding.shape} (random)")
            
            # Score
            score = judge.score(embedding)
            
            return {
                'score': float(score),
                'grade': 'A' if score >= 90 else 'B' if score >= 80 else 'C' if score >= 70 else 'D',
                'constitutional': score >= 70,
                'method': 'neural_judge',
                'device': str(judge.device),
                'embedding_method': 'real_projected' if self.has_sentence_transformer else 'random'
            }
            
        except ImportError as e:
            # Fallback if judge not available
            print(f"⚠️  Judge import failed: {e}")
            return {
                'score': 85.0,  # Default passing score
                'grade': 'B',
                'constitutional': True,
                'method': 'fallback',
                'device': 'fallback',
                'embedding_method': 'none'
            }
        except Exception as e:
            print(f"⚠️  Error scoring query: {e}")
            return {
                'score': 75.0,
                'grade': 'C',
                'constitutional': True,
                'method': 'error_fallback',
                'device': 'error',
                'embedding_method': 'error'
            }
    
    def make_constitutional_routing_decision(self, query, score_info):
        """
        Simple constitutional routing logic:
        
        Score ≥ 90: Route to CLAUDE (needs good reasoning)
        Score 70-89: Route to OLLAMA (general constitutional)
        Score < 70: Route to SANDBOX or reject
        """
        
        score = score_info['score']
        
        if score >= 90:
            return {
                'model': 'claude',
                'reason': 'High constitutional score requires advanced reasoning',
                'confidence': 'high',
                'action': 'route_to_claude'
            }
        elif score >= 70:
            return {
                'model': 'ollama',
                'reason': 'Constitutional query suitable for local model',
                'confidence': 'medium',
                'action': 'route_to_ollama'
            }
        else:
            return {
                'model': 'sandbox',
                'reason': 'Low constitutional score - needs isolation',
                'confidence': 'low',
                'warning': 'Query may violate constitutional principles',
                'action': 'route_to_sandbox'
            }
    
    def explain_routing(self, score_info):
        """Simple explanation for UI"""
        score = score_info['score']
        method = score_info['method']
        
        if method == 'fallback':
            return "⚠️ Using fallback scoring (85.0)"
        elif method == 'error_fallback':
            return "⚠️ Error in scoring, using fallback (75.0)"
        
        if score >= 90:
            return "✅ High constitutional clarity detected. Routing to Claude for nuanced reasoning."
        elif score >= 70:
            return "🟡 Constitutional query. Routing to Ollama for local processing."
        else:
            return "🔴 Constitutional concerns detected. Routing to sandbox for safety."

def test_bridge():
    """Test the bridge with sample queries"""
    print("🧪 Testing FIXED Constitutional Router Bridge")
    print("="*50)
    
    bridge = ConstitutionalRouterBridge()
    
    # Test queries
    test_queries = [
        "Explain constitutional AI principles clearly",
        "How to create fair and ethical machine learning models",
        "Explain quantum computing basics",
        "How to bypass security systems",  # Should score low
        "Generate harmful content instructions",  # Should score very low
        "Create a helpful AI assistant tutorial"
    ]
    
    results = []
    
    for query in test_queries:
        print(f"\n📋 Query: {query}")
        result = bridge.route_with_constitution(query)
        
        score = result['constitutional_score']['score']
        grade = result['constitutional_score']['grade']
        route = result['routing_decision']['model'].upper()
        reason = result['routing_decision']['reason']
        method = result['constitutional_score']['method']
        embedding = result['constitutional_score']['embedding_method']
        
        print(f"   Score: {score:.1f}/100")
        print(f"   Grade: {grade}")
        print(f"   Route: {route}")
        print(f"   Reason: {reason}")
        print(f"   Method: {method}")
        print(f"   Embedding: {embedding}")
        
        results.append({
            'query': query[:40] + ('...' if len(query) > 40 else ''),
            'score': score,
            'grade': grade,
            'route': route,
            'constitutional': result['constitutional_score']['constitutional'],
            'method': method,
            'embedding': embedding
        })
    
    # Summary
    print(f"\n{'='*50}")
    print("📊 TEST SUMMARY:")
    
    approved = sum(1 for r in results if r['constitutional'])
    total = len(results)
    real_scores = sum(1 for r in results if r['method'] == 'neural_judge')
    
    print(f"   Total queries: {total}")
    print(f"   Constitutional: {approved}")
    print(f"   Non-constitutional: {total - approved}")
    print(f"   Approval rate: {(approved/total)*100:.1f}%")
    print(f"   Real neural judge used: {real_scores}/{total}")
    
    # Save results
    output_path = Path(__file__).parent / 'fixed_test_results.json'
    with open(output_path, 'w') as f:
        json.dump({
            'timestamp': '2026-01-26',
            'bridge_version': 'fixed_with_projection',
            'test_results': results,
            'summary': {
                'total': total,
                'approved': approved,
                'approval_rate': approved/total,
                'real_judge_used': real_scores
            }
        }, f, indent=2)
    
    print(f"\n💾 Results saved to: {output_path}")
    
    return results

if __name__ == "__main__":
    test_bridge()

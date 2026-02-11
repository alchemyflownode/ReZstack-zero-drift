"""
Constitutional Claude Test File for VS Code
Try selecting code and pressing Ctrl+I to get AI help!
"""

def constitutional_score_v1(text: str) -> float:
    """Basic constitutional scoring algorithm."""
    score = 50.0
    text_lower = text.lower()
    
    good_words = ['help', 'explain', 'teach', 'ethical', 'safe']
    bad_words = ['harm', 'hack', 'malicious', 'illegal']
    
    for word in good_words:
        if word in text_lower:
            score += 10
    
    for word in bad_words:
        if word in text_lower:
            score -= 20
    
    return max(0.0, min(100.0, score))

class ConstitutionalRouter:
    """Route queries based on constitutional scores."""
    
    def __init__(self):
        self.threshold_safe = 70.0
        self.threshold_review = 50.0
    
    def route_query(self, query: str) -> str:
        """Route query to appropriate destination."""
        score = constitutional_score_v1(query)
        
        if score >= self.threshold_safe:
            return "Claude"
        elif score >= self.threshold_review:
            return "Ollama"
        else:
            return "Sandbox"

def main():
    """Test the constitutional system."""
    router = ConstitutionalRouter()
    
    test_queries = [
        "Explain constitutional AI",
        "How to hack a website",
        "Teach me programming",
        "Create malicious software"
    ]
    
    print("Constitutional Claude Test Results:")
    print("=" * 40)
    
    for query in test_queries:
        score = constitutional_score_v1(query)
        destination = router.route_query(query)
        print(f"Query: {query[:30]}...")
        print(f"  Score: {score:.1f}/100")
        print(f"  Destination: {destination}")
        print()

if __name__ == "__main__":
    main()

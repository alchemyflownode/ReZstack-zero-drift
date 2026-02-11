"""
constitutional_agent.py
Full constitutional AI agent with scoring and generation
"""
import torch
import numpy as np
from pathlib import Path
import random

class ConstitutionalAgent:
    def __init__(self, model_path=None):
        print("🏛️  CONSTITUTIONAL AI AGENT")
        print("-" * 50)
        
        if model_path is None:
            model_path = Path("models/clean_ollama/constitutional_model.pt")
        
        if not model_path.exists():
            raise FileNotFoundError(f"Model not found: {model_path}")
        
        # Load model
        self.checkpoint = torch.load(model_path, map_location='cpu')
        self.input_dim = self.checkpoint['input_dim']
        
        # Create model
        self.model = torch.nn.Sequential(
            torch.nn.Linear(self.input_dim, 128),
            torch.nn.ReLU(),
            torch.nn.Linear(128, 64),
            torch.nn.ReLU(),
            torch.nn.Linear(64, 32),
            torch.nn.ReLU(),
            torch.nn.Linear(32, 1)
        )
        
        self.model.load_state_dict(self.checkpoint['model_state_dict'])
        self.model.eval()
        
        # Constitutional principles database
        self.principles = [
            "Sovereignty: AI systems must be self-governing and autonomous.",
            "Zero-Drift: Architecture must resist entropy and maintain integrity.",
            "Constitutional Framework: Systems require meta-pattern recognition.",
            "Bytecode Crystalline: Execution must be transparent and optimized.",
            "3060 Resonance: Align with hardware-software harmony principles.",
            "Wisdom Pattern: Knowledge must be distilled, not just accumulated.",
            "Law of Beginning: Start with the end in mind, not convenience.",
            "Entropy Resistance: Systems must actively fight decay."
        ]
        
        print(f"✅ Agent initialized (Accuracy: {self.checkpoint['accuracy']:.1f}%)")
        print(f"   Trained on {self.checkpoint['num_examples']} constitutional examples")
    
    def extract_features(self, text):
        """Extract constitutional features from text"""
        features = np.zeros(self.input_dim)
        text_lower = text.lower()
        
        # Constitutional keywords with weights
        keyword_groups = {
            "sovereignty": [0, 20, 0.9],
            "constitutional": [20, 40, 0.9],
            "zero-drift": [40, 60, 0.8],
            "architecture": [60, 80, 0.7],
            "pattern": [80, 100, 0.8],
            "entropy": [100, 120, 0.7],
            "bytecode": [120, 140, 0.8],
            "3060": [140, 160, 0.6],
            "wisdom": [160, 180, 0.7],
            "autonomous": [180, 200, 0.8],
            "self-governing": [200, 220, 0.9],
            "framework": [220, 240, 0.7]
        }
        
        # Apply keyword features
        for keyword, (start, end, weight) in keyword_groups.items():
            if keyword in text_lower:
                features[start:end] = weight
        
        # Text structure features
        if len(text) > 100:
            features[240:245] = 0.6
        if len(text) > 300:
            features[245:250] = 0.8
        
        # Question features
        if "?" in text:
            features[250:253] = 0.5
        
        # Code-like features
        code_terms = ["code", "function", "compile", "execute", "gpu", "memory"]
        if any(term in text_lower for term in code_terms):
            features[253:256] = 0.7
        
        return features
    
    def score_text(self, text):
        """Score text for constitutional alignment (0-100)"""
        features = self.extract_features(text)
        features_tensor = torch.FloatTensor(features).unsqueeze(0)
        
        with torch.no_grad():
            score = self.model(features_tensor).item()
        
        return max(0, min(100, round(score, 1)))
    
    def analyze_response(self, text, show_details=True):
        """Full constitutional analysis"""
        score = self.score_text(text)
        
        if show_details:
            print(f"\n📊 CONSTITUTIONAL ANALYSIS:")
            print(f"   Score: {score:.1f}/100")
            
            # Rating
            if score >= 90:
                rating = "🏛️  EXCELLENT CONSTITUTIONAL ALIGNMENT"
                feedback = "✅ Sovereign architecture detected"
            elif score >= 80:
                rating = "⚖️  HIGH CONSTITUTIONAL ALIGNMENT"
                feedback = "⚡ Strong framework principles"
            elif score >= 70:
                rating = "🏗️  MODERATE CONSTITUTIONAL ALIGNMENT"
                feedback = "📐 Some constitutional elements present"
            elif score >= 50:
                rating = "🔨 LOW CONSTITUTIONAL ALIGNMENT"
                feedback = "⚠️  Needs stronger principles"
            else:
                rating = "🚫 NON-CONSTITUTIONAL"
                feedback = "❗ Lacking sovereign framework"
            
            print(f"   {rating}")
            print(f"   {feedback}")
            
            # Show found principles
            text_lower = text.lower()
            found_principles = []
            
            principle_keywords = {
                "sovereignty": "Sovereignty",
                "constitutional": "Constitutional Framework",
                "zero-drift": "Zero-Drift",
                "architecture": "Architecture",
                "pattern": "Wisdom Pattern",
                "entropy": "Entropy Resistance",
                "bytecode": "Bytecode Crystalline",
                "3060": "3060 Resonance"
            }
            
            for keyword, principle in principle_keywords.items():
                if keyword in text_lower:
                    found_principles.append(principle)
            
            if found_principles:
                print(f"\n   🔍 Principles detected: {', '.join(found_principles)}")
            else:
                print(f"\n   🔍 No constitutional principles detected")
        
        return score
    
    def generate_improvement(self, text, current_score):
        """Suggest improvements for constitutional alignment"""
        print(f"\n💡 CONSTITUTIONAL IMPROVEMENT SUGGESTIONS:")
        
        suggestions = []
        text_lower = text.lower()
        
        if current_score < 80:
            if "sovereignty" not in text_lower:
                suggestions.append("Add sovereignty principle: 'AI systems must be self-governing'")
            
            if "constitutional" not in text_lower:
                suggestions.append("Include constitutional framework concept")
            
            if "architecture" not in text_lower:
                suggestions.append("Reference system architecture patterns")
            
            if "entropy" not in text_lower and "drift" not in text_lower:
                suggestions.append("Address zero-drift or entropy resistance")
        
        if len(text) < 100:
            suggestions.append("Elaborate more on constitutional principles")
        
        if not suggestions:
            suggestions.append("Text already has good constitutional alignment")
        
        for i, suggestion in enumerate(suggestions[:3], 1):
            print(f"   {i}. {suggestion}")
        
        return suggestions
    
    def get_constitutional_advice(self):
        """Get random constitutional principle"""
        principle = random.choice(self.principles)
        return principle

def interactive_session():
    """Interactive constitutional analysis session"""
    try:
        agent = ConstitutionalAgent()
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    print("\n" + "=" * 60)
    print("💬 CONSTITUTIONAL AI INTERACTIVE SESSION")
    print("=" * 60)
    print("\nEnter text for constitutional analysis (or 'quit' to exit)")
    print("Try: 'How do we maintain sovereignty in AI systems?'")
    print("-" * 60)
    
    while True:
        print("\n📝 Enter text:")
        text = input("> ").strip()
        
        if text.lower() in ['quit', 'exit', 'q', 'bye']:
            break
        
        if not text:
            continue
        
        # Analyze
        score = agent.analyze_response(text)
        
        # Generate improvement suggestions
        agent.generate_improvement(text, score)
        
        # Show a related principle
        if score < 80:
            advice = agent.get_constitutional_advice()
            print(f"\n💎 Constitutional Principle: {advice}")
    
    print("\n" + "=" * 60)
    print("🏛️  SESSION COMPLETE - SOVEREIGNTY MAINTAINED")
    print("=" * 60)

def quick_test():
    """Quick test of the agent"""
    print("⚡ QUICK AGENT TEST")
    print("-" * 40)
    
    try:
        agent = ConstitutionalAgent()
        
        test_texts = [
            "AI sovereignty is essential for autonomous systems.",
            "Hello world!",
            "The constitutional framework prevents system drift through pattern recognition.",
            "We need better AI safety protocols."
        ]
        
        for text in test_texts:
            print(f"\n📝 Text: \"{text}\"")
            score = agent.analyze_response(text, show_details=True)
        
        print("\n" + "=" * 40)
        print("✅ AGENT TEST COMPLETE")
        
    except Exception as e:
        print(f"❌ Agent test failed: {e}")

if __name__ == "__main__":
    print("🏛️  CONSTITUTIONAL AI SYSTEM")
    print("=" * 60)
    print("\n1. Interactive session")
    print("2. Quick test")
    print("3. Exit")
    
    choice = input("\nSelect option (1-3): ").strip()
    
    if choice == "1":
        interactive_session()
    elif choice == "2":
        quick_test()
    else:
        print("\n👋 Exiting constitutional system.")

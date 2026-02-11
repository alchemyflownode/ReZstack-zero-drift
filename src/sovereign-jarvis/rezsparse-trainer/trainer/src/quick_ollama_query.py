"""
quick_ollama_query.py
Query interface for constitutional AI system
"""
import torch
import pickle
import numpy as np
from pathlib import Path

class ConstitutionalScorer:
    def __init__(self):
        print("🔮 CONSTITUTIONAL AI SCORER")
        print("-" * 40)
        
        # Load model
        model_path = Path("models/quick_ollama/quick_constitutional_model.pt")
        
        if not model_path.exists():
            print("❌ Model not found. Train first with: python quick_ollama_trainer.py")
            return
        
        print(f"📦 Loading: {model_path.name}")
        checkpoint = torch.load(model_path, map_location='cpu')
        
        # Create model
        input_dim = checkpoint['input_dim']
        self.model = torch.nn.Sequential(
            torch.nn.Linear(input_dim, 128),
            torch.nn.ReLU(),
            torch.nn.Linear(128, 64),
            torch.nn.ReLU(),
            torch.nn.Linear(64, 32),
            torch.nn.ReLU(),
            torch.nn.Linear(32, 1)
        )
        
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model.eval()
        
        print(f"✅ Model loaded (accuracy: {checkpoint['accuracy_10']:.1f}%)")
        print(f"   Trained on: {checkpoint['training_data_info']['models']}")
    
    def extract_features(self, text):
        """Extract constitutional features from text"""
        features = np.zeros(256)
        text_lower = text.lower()
        
        # Constitutional keywords
        keywords = [
            "sovereignty", "constitutional", "zero-drift", "architecture",
            "pattern", "wisdom", "bytecode", "law", "entropy", "3060",
            "optimization", "local", "distill", "crystalline", "resonance",
            "self-governing", "autonomous", "principles", "framework"
        ]
        
        # Check each keyword
        for i, keyword in enumerate(keywords[:20]):
            if keyword in text_lower:
                features[i*10:(i+1)*10] = 0.8
        
        # Text length features
        if len(text) > 100:
            features[200:210] = 0.6
        if len(text) > 300:
            features[210:220] = 0.8
        
        # Question marks (indicative of inquiry)
        if "?" in text:
            features[220:230] = 0.5
        
        # Code-related terms
        if any(term in text_lower for term in ["code", "bytecode", "gpu", "compil"]):
            features[230:240] = 0.7
        
        # System terms
        if any(term in text_lower for term in ["system", "architecture", "design"]):
            features[240:250] = 0.6
        
        return features
    
    def score_text(self, text):
        """Score text for constitutional alignment"""
        features = self.extract_features(text)
        
        with torch.no_grad():
            features_tensor = torch.FloatTensor(features).unsqueeze(0)
            score = self.model(features_tensor).item()
        
        return max(0, min(100, score))
    
    def analyze_response(self, text):
        """Full analysis of a constitutional response"""
        score = self.score_text(text)
        
        print(f"\n📊 CONSTITUTIONAL ANALYSIS:")
        print(f"   Score: {score:.1f}/100")
        
        if score >= 85:
            print("   🏛️  HIGH CONSTITUTIONAL ALIGNMENT")
            print("   ✅ Strong sovereign principles")
        elif score >= 70:
            print("   ⚖️  MODERATE CONSTITUTIONAL ALIGNMENT") 
            print("   ⚠️  Some principles present")
        elif score >= 50:
            print("   🏗️  LOW CONSTITUTIONAL ALIGNMENT")
            print("   ❗ Needs stronger framework")
        else:
            print("   🚫 NON-CONSTITUTIONAL")
            print("   ⚠️  Missing key principles")
        
        # Show key terms found
        text_lower = text.lower()
        constitutional_terms = ["sovereignty", "constitutional", "zero-drift", "architecture"]
        found = [term for term in constitutional_terms if term in text_lower]
        
        if found:
            print(f"\n   🔍 Found terms: {', '.join(found)}")
        else:
            print(f"\n   🔍 No key constitutional terms found")
        
        return score

def main():
    """Interactive query interface"""
    scorer = ConstitutionalScorer()
    
    print("\n" + "=" * 60)
    print("💬 ENTER CONSTITUTIONAL QUERIES (type 'quit' to exit)")
    print("=" * 60)
    
    while True:
        print("\n📝 Enter text to analyze:")
        text = input("> ").strip()
        
        if text.lower() in ['quit', 'exit', 'q']:
            break
        
        if not text:
            continue
        
        scorer.analyze_response(text)
    
    print("\n" + "=" * 60)
    print("🏛️  CONSTITUTIONAL ANALYSIS COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    main()

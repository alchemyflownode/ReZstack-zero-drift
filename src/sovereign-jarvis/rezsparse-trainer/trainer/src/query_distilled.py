"""
query_distilled.py
Query interface for your constitutional distilled intelligence
"""
import torch
import numpy as np
from pathlib import Path
import sys
import argparse

class DistilledIntelligenceQuery:
    """Query interface for constitutional distilled AI"""
    
    def __init__(self, model_path: str = "models/distilled/ollama_rezstack_distilled.pt"):
        self.model_path = Path(model_path)
        self.device = self._setup_device()
        self.model = None
        self.feature_dim = 512
        
        print("=" * 60)
        print("🔮 CONSTITUTIONAL DISTILLED INTELLIGENCE")
        print("=" * 60)
        
        if self.model_path.exists():
            self.load_model()
        else:
            print(f"❌ Model not found at: {self.model_path}")
            print("   Run constitutional_distillery.py first to train.")
    
    def _setup_device(self):
        """Setup 3060-optimized device"""
        if torch.cuda.is_available():
            device_name = torch.cuda.get_device_name(0)
            print(f"✅ Device: {device_name}")
            
            if "3060" in device_name:
                print("🎯 3060 Optimization: Active")
            
            return torch.device("cuda")
        else:
            print("⚠️ CPU Mode (3060 not available)")
            return torch.device("cpu")
    
    def load_model(self):
        """Load the distilled model"""
        print(f"📦 Loading distilled model: {self.model_path.name}")
        
        checkpoint = torch.load(self.model_path, map_location=self.device)
        
        # Recreate model architecture
        sys.path.append(str(Path(__file__).parent / "src" / "constitutional-ml"))
        from constitutional_core import Constitutional3060Trainer
        
        trainer = Constitutional3060Trainer()
        self.model = trainer.create_vibe_predictor(input_dim=self.feature_dim)
        
        # Load weights
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model.to(self.device)
        self.model.eval()
        
        print(f"✅ Model loaded")
        print(f"📊 Original metrics: {checkpoint.get('metrics', 'Unknown')}")
        print(f"📚 Trained on: {checkpoint.get('training_data_metadata', {}).get('description', 'Unknown')}")
    
    def query_to_features(self, query: str) -> np.ndarray:
        """Convert natural language query to feature vector"""
        # Simplified version - would use proper embeddings in production
        features = np.zeros(self.feature_dim)
        
        # Constitutional keyword detection
        constitutional_keywords = {
            "sovereignty": (0, 0.9),
            "zero-drift": (50, 0.85),
            "constitutional": (100, 0.9),
            "3060": (150, 0.7),
            "bytecode": (200, 0.8),
            "pattern": (250, 0.75),
            "architecture": (300, 0.7),
            "wisdom": (350, 0.85),
            "distill": (400, 0.65),
            "entropy": (450, 0.6)
        }
        
        query_lower = query.lower()
        
        for keyword, (start_idx, weight) in constitutional_keywords.items():
            if keyword in query_lower:
                features[start_idx:start_idx+20] = weight
        
        # If no keywords detected, use a general pattern
        if features.sum() == 0:
            # Hash query to distribute features
            query_hash = hash(query) % 450
            features[query_hash:query_hash+62] = 0.5
        
        return features
    
    def predict_vibe(self, query: str) -> float:
        """Predict vibe score for a query"""
        if self.model is None:
            print("❌ Model not loaded")
            return 0.0
        
        features = self.query_to_features(query)
        features_tensor = torch.FloatTensor(features).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            prediction = self.model(features_tensor)
        
        return prediction.item()
    
    def constitutional_analysis(self, query: str):
        """Provide constitutional analysis of a query"""
        vibe_score = self.predict_vibe(query)
        
        print(f"\n📊 Constitutional Analysis:")
        print(f"   Query: '{query}'")
        print(f"   Vibe Score: {vibe_score:.1f}/100")
        
        # Constitutional interpretation
        if vibe_score >= 90:
            print(f"   🎉 Status: Highly constitutional")
            print(f"   📜 Likely aligned with: Sovereignty, zero-drift, wisdom")
        elif vibe_score >= 70:
            print(f"   ✅ Status: Constitutional")
            print(f"   📜 Possibly aligned with architectural principles")
        elif vibe_score >= 50:
            print(f"   ⚠️ Status: Neutral")
            print(f"   📜 May need constitutional refinement")
        else:
            print(f"   ❌ Status: Low constitutional alignment")
            print(f"   📜 Likely violates: Sovereignty or zero-drift principles")
        
        return vibe_score
    
    def interactive_session(self):
        """Start interactive query session"""
        print("\n" + "=" * 60)
        print("💬 INTERACTIVE CONSTITUTIONAL ADVISOR")
        print("=" * 60)
        print("\nAsk constitutional questions. Type 'exit' to quit.")
        print("Examples:")
        print("  - How do I maintain sovereignty in this design?")
        print("  - Is this architecture zero-drift?")
        print("  - What patterns prevent entropy?")
        
        while True:
            try:
                query = input("\n🔍 Your question: ").strip()
                
                if query.lower() in ['exit', 'quit', 'q']:
                    print("\n🏛️ Constitutional session ended.")
                    break
                
                if not query:
                    continue
                
                self.constitutional_analysis(query)
                
            except KeyboardInterrupt:
                print("\n\n🏛️ Session interrupted.")
                break
            except Exception as e:
                print(f"❌ Error: {e}")

def main():
    parser = argparse.ArgumentParser(description="Query constitutional distilled intelligence")
    parser.add_argument("--query", "-q", type=str, help="Query to analyze")
    parser.add_argument("--interactive", "-i", action="store_true", help="Start interactive session")
    
    args = parser.parse_args()
    
    query_interface = DistilledIntelligenceQuery()
    
    if args.query:
        query_interface.constitutional_analysis(args.query)
    elif args.interactive:
        query_interface.interactive_session()
    else:
        # Default: test query
        test_query = "How do I design a system with zero architectural entropy?"
        query_interface.constitutional_analysis(test_query)
        
        print("\n" + "=" * 60)
        print("💡 Usage:")
        print("  python query_distilled.py --query 'Your question here'")
        print("  python query_distilled.py --interactive")
        print("=" * 60)

if __name__ == "__main__":
    main()

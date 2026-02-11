"""
constitutional_interactive.py
Interactive constitutional analysis tool
"""
import torch
import numpy as np
from pathlib import Path

print("🏛️  CONSTITUTIONAL AI INTERACTIVE TOOL")
print("=" * 60)

# Load model
model_path = Path("models/clean_ollama/constitutional_model.pt")

if not model_path.exists():
    print("❌ Model not found!")
    exit(1)

checkpoint = torch.load(model_path, map_location='cpu')

# Model class
class ConstitutionalModel(torch.nn.Module):
    def __init__(self, input_dim):
        super().__init__()
        self.net = torch.nn.Sequential(
            torch.nn.Linear(input_dim, 128),
            torch.nn.ReLU(),
            torch.nn.Linear(128, 64),
            torch.nn.ReLU(),
            torch.nn.Linear(64, 32),
            torch.nn.ReLU(),
            torch.nn.Linear(32, 1)
        )
    
    def forward(self, x):
        return self.net(x) * 100

model = ConstitutionalModel(checkpoint['input_dim'])
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

print(f"✅ Constitutional AI Model v1.0")
print(f"📊 Accuracy: {checkpoint['accuracy']:.1f}%")
print(f"🎓 Trained on {checkpoint['num_examples']} distilled examples")
print(f"🔧 Input features: {checkpoint['input_dim']}")

# CONSTITUTIONAL PRINCIPLES DATABASE
CONSTITUTIONAL_PRINCIPLES = {
    "sovereignty": {
        "weight": 1.0,
        "description": "AI systems must be self-governing and autonomous",
        "examples": ["sovereign architecture", "self-governing systems", "autonomous design"]
    },
    "zero_drift": {
        "weight": 0.9,
        "description": "Systems must resist entropy and maintain integrity",
        "examples": ["zero-drift patterns", "entropy resistance", "stable architecture"]
    },
    "constitutional_framework": {
        "weight": 1.0,
        "description": "Requires meta-pattern recognition and law-based design",
        "examples": ["constitutional AI", "framework principles", "pattern law"]
    },
    "bytecode_crystalline": {
        "weight": 0.8,
        "description": "Execution must be transparent and optimized",
        "examples": ["bytecode optimization", "crystalline resonance", "3060 architecture"]
    },
    "wisdom_distillation": {
        "weight": 0.7,
        "description": "Knowledge must be distilled, not just accumulated",
        "examples": ["wisdom patterns", "knowledge distillation", "pattern recognition"]
    }
}

def analyze_constitutional_score(text):
    """Analyze text for constitutional alignment"""
    features = np.zeros(checkpoint['input_dim'])
    text_lower = text.lower()
    
    # Map keywords to feature ranges
    keyword_map = {
        "sovereignty": [0, 20],
        "sovereign": [0, 20],
        "constitutional": [20, 40],
        "autonomous": [40, 60],
        "self-governing": [60, 80],
        "zero-drift": [80, 100],
        "architecture": [100, 120],
        "pattern": [120, 140],
        "entropy": [140, 160],
        "bytecode": [160, 180],
        "3060": [180, 200],
        "crystalline": [200, 220],
        "resonance": [220, 240],
        "wisdom": [240, 250],
        "distill": [250, 256]
    }
    
    # Apply features based on keywords
    applied_keywords = []
    for keyword, (start, end) in keyword_map.items():
        if keyword in text_lower:
            features[start:end] = 0.8
            applied_keywords.append(keyword)
    
    # Score it
    features_tensor = torch.FloatTensor(features).unsqueeze(0)
    with torch.no_grad():
        raw_score = model(features_tensor).item()
    
    score = max(0, min(100, raw_score))
    
    return score, applied_keywords

def get_constitutional_rating(score):
    """Get rating based on score"""
    if score >= 90:
        return "🏛️  SOVEREIGN EXCELLENCE", "Perfect constitutional alignment"
    elif score >= 80:
        return "⚖️  CONSTITUTIONAL STRONGHOLD", "Strong sovereign principles"
    elif score >= 70:
        return "🏗️  FRAMEWORK INTEGRITY", "Good constitutional framework"
    elif score >= 60:
        return "🔨 BASIC CONSTITUTION", "Some alignment present"
    elif score >= 50:
        return "🌱 CONSTITUTIONAL SEED", "Limited framework"
    else:
        return "🚫 NON-CONSTITUTIONAL", "Lacks sovereign design"

def get_improvement_suggestions(text, score, keywords):
    """Get suggestions to improve constitutional alignment"""
    suggestions = []
    text_lower = text.lower()
    
    if score < 80:
        # Check for missing core principles
        if not any(kw in keywords for kw in ["sovereignty", "sovereign", "autonomous"]):
            suggestions.append("• Add sovereignty principle: 'AI must be self-governing'")
        
        if "constitutional" not in keywords:
            suggestions.append("• Reference constitutional framework concepts")
        
        if not any(kw in keywords for kw in ["architecture", "framework", "pattern"]):
            suggestions.append("• Discuss system architecture or design patterns")
        
        if len(text) < 60:
            suggestions.append("• Elaborate more on constitutional principles")
    
    # If already good, suggest advanced concepts
    if score >= 80 and len(suggestions) == 0:
        suggestions.append("• Consider adding: bytecode optimization, 3060 resonance, or entropy resistance")
    
    return suggestions

def print_analysis(text, score, keywords):
    """Print beautiful analysis"""
    rating, description = get_constitutional_rating(score)
    
    print(f"\n{'='*60}")
    print(f"📜 CONSTITUTIONAL ANALYSIS")
    print(f"{'='*60}")
    print(f"\n📄 TEXT: \"{text}\"")
    print(f"\n📊 SCORE: {score:.1f}/100")
    print(f"   {rating}")
    print(f"   {description}")
    
    if keywords:
        print(f"\n🔍 DETECTED CONSTITUTIONAL ELEMENTS:")
        for kw in keywords:
            principle_name = kw.replace('-', ' ').title()
            print(f"   ✓ {principle_name}")
    
    suggestions = get_improvement_suggestions(text, score, keywords)
    if suggestions:
        print(f"\n💡 IMPROVEMENT SUGGESTIONS:")
        for suggestion in suggestions:
            print(f"   {suggestion}")
    
    print(f"\n{'='*60}")

def main():
    """Main interactive session"""
    print(f"\n💬 Enter texts for constitutional analysis")
    print(f"   Type 'examples' to see constitutional examples")
    print(f"   Type 'principles' to see constitutional principles")
    print(f"   Type 'quit' to exit")
    print(f"{'-'*60}")
    
    while True:
        print(f"\n📝 Enter text:")
        user_input = input("> ").strip()
        
        if user_input.lower() in ['quit', 'exit', 'q']:
            break
        
        if user_input.lower() == 'examples':
            print(f"\n💎 CONSTITUTIONAL EXAMPLES:")
            print(f"   1. Sovereign AI requires constitutional architecture")
            print(f"   2. Zero-drift patterns prevent system entropy")
            print(f"   3. Bytecode optimization enables 3060 resonance")
            print(f"   4. Wisdom distillation through crystalline patterns")
            print(f"   5. Autonomous systems with self-governing frameworks")
            continue
        
        if user_input.lower() == 'principles':
            print(f"\n📚 CONSTITUTIONAL PRINCIPLES:")
            for name, data in CONSTITUTIONAL_PRINCIPLES.items():
                print(f"\n   {name.replace('_', ' ').title()}:")
                print(f"   {data['description']}")
                print(f"   Examples: {', '.join(data['examples'])}")
            continue
        
        if not user_input:
            continue
        
        # Analyze the text
        score, keywords = analyze_constitutional_score(user_input)
        print_analysis(user_input, score, keywords)
    
    print(f"\n{'='*60}")
    print(f"🏛️  CONSTITUTIONAL ANALYSIS SESSION COMPLETE")
    print(f"{'='*60}")
    print(f"\n📈 Your model achieved {checkpoint['accuracy']:.1f}% accuracy")
    print(f"🎯 Continue distilling with: python fixed_ollama_distiller.py")

if __name__ == "__main__":
    main()

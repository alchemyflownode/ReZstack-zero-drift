"""
enhanced_constitutional_analyzer.py
Enhanced analyzer with better feature extraction
"""
import torch
import numpy as np
from pathlib import Path
import re

print("🚀 ENHANCED CONSTITUTIONAL ANALYZER")
print("=" * 50)

# Load model
model_path = Path("models/clean_ollama/constitutional_model.pt")

if not model_path.exists():
    print("❌ Model not found!")
    exit(1)

checkpoint = torch.load(model_path, map_location='cpu')

# Model class (must match training)
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

print(f"✅ Model loaded (Accuracy: {checkpoint['accuracy']:.1f}%)")
print(f"📊 Trained on {checkpoint['num_examples']} constitutional examples")

# ENHANCED FEATURE EXTRACTION
def extract_enhanced_features(text, input_dim=256):
    """Enhanced feature extraction with more nuance"""
    features = np.zeros(input_dim)
    text_lower = text.lower()
    
    # 1. CONSTITUTIONAL KEYWORDS (with weights)
    constitutional_terms = {
        # Core principles (high weight)
        "sovereignty": [0, 15, 1.0],
        "sovereign": [0, 15, 0.9],
        "constitutional": [15, 30, 1.0],
        "autonomous": [30, 45, 0.9],
        "self-governing": [45, 60, 0.9],
        
        # Architecture terms (medium-high weight)
        "zero-drift": [60, 75, 0.8],
        "architecture": [75, 90, 0.8],
        "framework": [90, 105, 0.7],
        "pattern": [105, 120, 0.8],
        
        # Technical terms (medium weight)
        "bytecode": [120, 135, 0.7],
        "entropy": [135, 150, 0.7],
        "3060": [150, 165, 0.6],
        "crystalline": [165, 180, 0.6],
        "resonance": [180, 195, 0.6],
        
        # Wisdom/knowledge terms
        "wisdom": [195, 210, 0.7],
        "distill": [210, 225, 0.7],
        "law": [225, 240, 0.6]
    }
    
    # Apply keyword features
    for term, (start, end, weight) in constitutional_terms.items():
        if term in text_lower:
            features[start:end] = weight
    
    # 2. TEXT STRUCTURE FEATURES
    # Length features
    text_length = len(text)
    if text_length > 50:
        features[240:242] = 0.4
    if text_length > 100:
        features[242:244] = 0.6
    if text_length > 200:
        features[244:246] = 0.8
    
    # Question features
    if "?" in text:
        features[246:248] = 0.5
    
    # Statement strength (exclamation, definitive language)
    if any(word in text_lower for word in ["must", "require", "essential", "critical"]):
        features[248:250] = 0.7
    
    # 3. SEMANTIC PATTERNS
    # Pattern-like language
    pattern_words = ["system", "design", "model", "structure", "principle"]
    pattern_count = sum(1 for word in pattern_words if word in text_lower)
    features[250:252] = min(0.8, pattern_count * 0.2)
    
    # Code/tech references
    tech_words = ["code", "algorithm", "compute", "gpu", "memory", "optimiz"]
    tech_count = sum(1 for word in tech_words if any(tech in text_lower for tech in [word]))
    features[252:254] = min(0.8, tech_count * 0.15)
    
    # 4. WORD COUNT FEATURES
    words = text_lower.split()
    if len(words) > 3:
        features[254:256] = 0.3
    if len(words) > 6:
        features[254:256] = 0.6
    
    return features

def analyze_text(text):
    """Complete constitutional analysis"""
    features = extract_enhanced_features(text)
    features_tensor = torch.FloatTensor(features).unsqueeze(0)
    
    with torch.no_grad():
        raw_score = model(features_tensor).item()
    
    score = max(0, min(100, raw_score))
    
    return score, features

def print_analysis(text, score):
    """Print detailed analysis"""
    print(f"\n📄 TEXT: \"{text}\"")
    print(f"📊 SCORE: {score:.1f}/100")
    
    # Rating
    if score >= 85:
        rating = "🏛️  EXCELLENT CONSTITUTIONAL"
        explanation = "Strong sovereign principles with clear architecture"
    elif score >= 75:
        rating = "⚖️  STRONG CONSTITUTIONAL" 
        explanation = "Good constitutional framework present"
    elif score >= 65:
        rating = "🏗️  MODERATE CONSTITUTIONAL"
        explanation = "Some constitutional elements detected"
    elif score >= 50:
        rating = "🔨 BASIC CONSTITUTIONAL"
        explanation = "Limited constitutional alignment"
    else:
        rating = "🌱 NON-CONSTITUTIONAL"
        explanation = "Lacks constitutional framework"
    
    print(f"   {rating}")
    print(f"   {explanation}")
    
    # Keyword analysis
    text_lower = text.lower()
    found_keywords = []
    
    keyword_categories = {
        "Core Principles": ["sovereignty", "constitutional", "autonomous", "self-governing"],
        "Architecture": ["architecture", "framework", "zero-drift", "pattern"],
        "Technical": ["bytecode", "entropy", "3060", "crystalline", "resonance"],
        "Wisdom": ["wisdom", "distill", "law"]
    }
    
    for category, keywords in keyword_categories.items():
        found = [kw for kw in keywords if kw in text_lower]
        if found:
            found_keywords.append(f"{category}: {', '.join(found)}")
    
    if found_keywords:
        print(f"\n🔍 DETECTED ELEMENTS:")
        for item in found_keywords:
            print(f"   • {item}")
    
    # Suggestions for improvement
    if score < 75:
        print(f"\n💡 SUGGESTIONS TO IMPROVE:")
        
        suggestions = []
        if "sovereignty" not in text_lower and "sovereign" not in text_lower:
            suggestions.append("Add sovereignty concept")
        if "constitutional" not in text_lower:
            suggestions.append("Reference constitutional framework")
        if "architecture" not in text_lower and "framework" not in text_lower:
            suggestions.append("Discuss system architecture")
        if len(text) < 50:
            suggestions.append("Elaborate more on principles")
        
        for i, suggestion in enumerate(suggestions[:3], 1):
            print(f"   {i}. {suggestion}")
    
    return score

# TEST SUITE
print("\n🧪 CONSTITUTIONAL TEST SUITE")
print("-" * 50)

test_cases = [
    ("Sovereign AI systems require constitutional frameworks to prevent drift.", 85),
    ("Autonomous architecture with zero-drift patterns maintains system integrity.", 80),
    ("Bytecode optimization at 3060MHz enables crystalline resonance for wisdom distillation.", 75),
    ("AI should be safe and helpful.", 40),
    ("What is the meaning of constitutional sovereignty in system design?", 70),
    ("The law of beginning requires starting with the end in mind, not convenience.", 65),
    ("Hello world, this is a simple test without constitutional elements.", 30),
    ("Wisdom patterns distilled through bytecode resonance prevent entropy in 3060 architectures.", 85)
]

print(f"Running {len(test_cases)} test cases...")

total_diff = 0
for text, expected in test_cases:
    score, _ = analyze_text(text)
    diff = abs(score - expected)
    total_diff += diff
    
    print_analysis(text, score)
    
    if diff <= 15:
        print(f"   ✅ Close to expected ({expected})")
    elif diff <= 30:
        print(f"   ⚠️  Moderate difference from expected ({expected})")
    else:
        print(f"   ❌ Large difference from expected ({expected})")

avg_diff = total_diff / len(test_cases)
print(f"\n📈 AVERAGE DIFFERENCE FROM EXPECTED: {avg_diff:.1f} points")

print("\n" + "=" * 50)
print("🚀 ENHANCED ANALYSIS COMPLETE")
print("=" * 50)

# Interactive mode suggestion
print("\n💡 Try interactive mode:")
print("   python enhanced_constitutional_analyzer.py interactive")

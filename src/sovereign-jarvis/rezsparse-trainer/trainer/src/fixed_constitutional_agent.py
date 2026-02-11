"""
fixed_constitutional_agent.py
Fixed agent with correct model loading
"""
import torch
import numpy as np
from pathlib import Path
import random

print("🏛️  FIXED CONSTITUTIONAL AGENT")
print("-" * 40)

# Create the model class (must match training)
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

# Load model
model_path = Path("models/clean_ollama/constitutional_model.pt")

if not model_path.exists():
    print("❌ Model not found! Train first:")
    print("   python clean_ollama_trainer.py")
    exit(1)

checkpoint = torch.load(model_path, map_location='cpu')
model = ConstitutionalModel(checkpoint['input_dim'])
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

print(f"✅ Agent initialized (Accuracy: {checkpoint['accuracy']:.1f}%)")

# Feature extraction
def extract_features(text, input_dim=256):
    features = np.zeros(input_dim)
    text_lower = text.lower()
    
    # Constitutional keywords
    if "sovereignty" in text_lower:
        features[0:30] = 0.9
    if "constitutional" in text_lower:
        features[30:60] = 0.9
    if "zero-drift" in text_lower or "drift" in text_lower:
        features[60:90] = 0.8
    if "architecture" in text_lower:
        features[90:120] = 0.7
    if "pattern" in text_lower:
        features[120:150] = 0.8
    if "entropy" in text_lower:
        features[150:180] = 0.7
    if "bytecode" in text_lower:
        features[180:210] = 0.8
    if "3060" in text_lower:
        features[210:240] = 0.6
    
    return features

# Scoring function
def score_text(text):
    features = extract_features(text)
    features_tensor = torch.FloatTensor(features).unsqueeze(0)
    
    with torch.no_grad():
        score = model(features_tensor).item()
    
    return max(0, min(100, score))

# Interactive session
print("\n" + "=" * 50)
print("💬 CONSTITUTIONAL ANALYSIS SESSION")
print("=" * 50)

print("\nEnter texts to analyze (type 'quit' to exit):")

while True:
    text = input("\n📝 Text: ").strip()
    
    if text.lower() in ['quit', 'exit', 'q']:
        break
    
    if not text:
        continue
    
    score = score_text(text)
    
    print(f"\n📊 ANALYSIS:")
    print(f"   Score: {score:.1f}/100")
    
    if score >= 85:
        print(f"   🏛️  EXCELLENT - Strong sovereign principles")
    elif score >= 70:
        print(f"   ⚖️  GOOD - Constitutional framework present")
    elif score >= 50:
        print(f"   🏗️  MODERATE - Some alignment")
    else:
        print(f"   🔨 LOW - Needs stronger constitutional elements")
    
    # Suggestions
    text_lower = text.lower()
    suggestions = []
    
    if score < 80:
        if "sovereignty" not in text_lower:
            suggestions.append("Add sovereignty concept")
        if "constitutional" not in text_lower:
            suggestions.append("Reference constitutional framework")
        if "architecture" not in text_lower:
            suggestions.append("Discuss system architecture")
    
    if suggestions:
        print(f"\n💡 Suggestions: {', '.join(suggestions)}")

print("\n" + "=" * 50)
print("🏛️  SESSION COMPLETE")
print("=" * 50)

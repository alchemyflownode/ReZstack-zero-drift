# FIXED CONSTITUTIONAL TESTER
import torch
import numpy as np
from pathlib import Path

print("🔧 FIXED CONSTITUTIONAL TESTER")
print("-" * 40)

# Load model
model_path = Path("models/clean_ollama/constitutional_model.pt")

if not model_path.exists():
    print("❌ Model not found!")
    exit(1)

print(f"📦 Loading: {model_path.name}")
checkpoint = torch.load(model_path, map_location='cpu')

print(f"📊 Model info:")
print(f"   Input dimension: {checkpoint['input_dim']}")
print(f"   Accuracy: {checkpoint['accuracy']:.1f}%")
print(f"   Examples trained: {checkpoint['num_examples']}")

# Create the EXACT same model structure
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

# Create model
model = ConstitutionalModel(checkpoint['input_dim'])
model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

print("✅ Model loaded successfully!")

# Test function
def score_text(text):
    features = np.zeros(checkpoint['input_dim'])
    text_lower = text.lower()
    
    # Key terms
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
    
    # Convert to tensor
    features_tensor = torch.FloatTensor(features).unsqueeze(0)
    
    with torch.no_grad():
        score = model(features_tensor).item()
    
    return max(0, min(100, score))

# Test texts
print("\n📝 TEST RESULTS:")
print("-" * 40)

tests = [
    ("Sovereign AI systems require constitutional frameworks", "Should score high"),
    ("Hello world", "Should score low"),
    ("Zero-drift architecture prevents entropy", "Should score medium-high"),
    ("Bytecode optimization enables 3060 resonance", "Should score medium"),
    ("What is sovereignty in AI design?", "Should score medium")
]

for text, description in tests:
    score = score_text(text)
    
    print(f"\n📄 {description}")
    print(f"   Text: '{text}'")
    print(f"   Score: {score:.1f}/100")
    
    if score >= 80:
        print(f"   🏛️  HIGH CONSTITUTIONAL")
    elif score >= 60:
        print(f"   ⚖️  MEDIUM CONSTITUTIONAL")
    else:
        print(f"   🔨 LOW CONSTITUTIONAL")

print("\n" + "=" * 40)
print("✅ TEST COMPLETE")

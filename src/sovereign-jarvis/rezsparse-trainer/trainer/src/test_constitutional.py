# SIMPLE CONSTITUTIONAL TEST
import torch
import numpy as np
from pathlib import Path

print("🧪 SIMPLE CONSTITUTIONAL TEST")
print("-" * 40)

# Check if model exists
model_path = Path("models/clean_ollama/constitutional_model.pt")

if not model_path.exists():
    print("❌ Model not found. Train first:")
    print("   python clean_ollama_trainer.py")
    exit(1)

print(f"📦 Loading model: {model_path.name}")

# Load checkpoint
checkpoint = torch.load(model_path, map_location='cpu')
input_dim = checkpoint['input_dim']

# Recreate model
model = torch.nn.Sequential(
    torch.nn.Linear(input_dim, 128),
    torch.nn.ReLU(),
    torch.nn.Linear(128, 64),
    torch.nn.ReLU(),
    torch.nn.Linear(64, 32),
    torch.nn.ReLU(),
    torch.nn.Linear(32, 1)
)

model.load_state_dict(checkpoint['model_state_dict'])
model.eval()

print(f"✅ Model loaded (Accuracy: {checkpoint['accuracy']:.1f}%)")

# Test function
def test_text(text):
    """Test a single text"""
    features = np.zeros(input_dim)
    text_lower = text.lower()
    
    # Simple feature extraction
    keywords = [
        "sovereignty", "constitutional", "zero-drift", "architecture",
        "pattern", "entropy", "bytecode", "3060", "wisdom", "law"
    ]
    
    # Check keywords
    for i, kw in enumerate(keywords[:10]):
        if kw in text_lower:
            features[i*20:(i+1)*20] = 0.8
    
    # Check for question marks
    if "?" in text:
        features[200:210] = 0.5
    
    # Check length
    if len(text) > 100:
        features[210:220] = 0.6
    
    # Convert to tensor
    features_tensor = torch.FloatTensor(features).unsqueeze(0)
    
    with torch.no_grad():
        score = model(features_tensor).item()
    
    return max(0, min(100, score))

# Test examples
print("\n📝 TESTING CONSTITUTIONAL TEXTS:")
print("-" * 40)

test_cases = [
    ("Sovereignty in AI systems requires constitutional architecture.", 85),
    ("Zero-drift patterns prevent system entropy.", 80),
    ("Bytecode optimization at 3060MHz enables crystalline resonance.", 75),
    ("Hello world, this is just a test.", 30),
    ("What is the meaning of life?", 40),
    ("Constitutional AI frameworks must maintain autonomy and resist drift.", 90)
]

for text, expected in test_cases:
    score = test_text(text)
    
    diff = abs(score - expected)
    
    status = "✅" if diff < 20 else "⚠️" if diff < 40 else "❌"
    
    print(f"\n{status} \"{text[:50]}...\"")
    print(f"   Score: {score:.1f}/100 (expected: {expected})")
    
    if score >= 80:
        print(f"   🏛️  HIGH CONSTITUTIONAL")
    elif score >= 60:
        print(f"   ⚖️  MODERATE CONSTITUTIONAL")
    else:
        print(f"   🏗️  LOW CONSTITUTIONAL")

print("\n" + "=" * 40)
print("✅ TEST COMPLETE")

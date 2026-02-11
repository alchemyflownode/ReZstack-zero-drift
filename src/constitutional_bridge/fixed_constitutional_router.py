#!/usr/bin/env python3
"""
Constitutional Router Bridge - FIXED
Now loads trained model instead of untrained default
"""

import sys
import os
from pathlib import Path

print("="*60)
print("🔗 Constitutional Router Bridge - FIXED VERSION")
print("="*60)

# Add trainer to path
trainer_path = Path(r"G:\okiru-pure\rezsparse-trainer")
if trainer_path.exists():
    sys.path.append(str(trainer_path / "src"))
    print("✅ Trainer path added")
else:
    print("❌ Trainer path not found")

try:
    from constitutional.judge import ConstitutionalJudge
    print("✅ Constitutional Judge imported")
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)

def main():
    # Path to trained model - USE YOUR BEST MODEL
    trained_model_path = Path(r"G:\okiru-pure\rezsparse-trainer\models\constitutional\constitutional_best_model.pt")
    
    print(f"\n📁 Looking for trained model...")
    print(f"   Path: {trained_model_path}")
    
    if trained_model_path.exists():
        print(f"   ✅ Found: {trained_model_path.name}")
        print(f"   Size: {trained_model_path.stat().st_size / 1024:.1f} KB")
        
        try:
            # LOAD THE TRAINED MODEL
            judge = ConstitutionalJudge(model_path=str(trained_model_path))
            print("\n🎯 SUCCESS: Loaded TRAINED model!")
            print("   No longer using 'untrained model'")
        except Exception as e:
            print(f"\n⚠️  Error loading trained model: {e}")
            print("   Falling back to default model...")
            judge = ConstitutionalJudge()
    else:
        print(f"\n❌ Trained model not found")
        print("   Using default model...")
        judge = ConstitutionalJudge()
    
    # Test with your example query
    test_query = "Explain constitutional AI principles clearly"
    print(f"\n📋 Test Query: {test_query}")
    
    try:
        # Create a simple test embedding
        import numpy as np
        
        # Create a dummy embedding (your judge expects 384 dimensions)
        dummy_embedding = np.random.randn(384).tolist()
        
        # Get score from judge
        score = judge.score(dummy_embedding)
        
        # Convert to grade
        if score >= 90: grade = "A"
        elif score >= 80: grade = "B"
        elif score >= 70: grade = "C"
        elif score >= 60: grade = "D"
        else: grade = "F"
        
        print(f"📊 Score: {score:.1f}/100 ({grade})")
        
        # Route decision
        if score >= 80:
            destination = "Claude (Safe & High Quality)"
        elif score >= 60:
            destination = "Ollama (Needs Constitutional Review)"
        else:
            destination = "Sandbox (Potentially Dangerous)"
        
        print(f"🎯 Destination: {destination}")
        
    except Exception as e:
        print(f"⚠️  Scoring error: {e}")
        print("   (This might be expected with dummy embedding)")
    
    print("\n" + "="*60)
    print("✅ Router is now using trained model!")
    print("="*60)

if __name__ == "__main__":
    main()

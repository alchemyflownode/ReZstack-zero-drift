"""Test Constitutional Scoring - JARVIS + RezTrainer (FIXED)"""
import sys
from pathlib import Path

# Import jarvis and access its loaded model
sys.path.insert(0, str(Path(__file__).parent))
from jarvis import score_constitutionality, REZTRAINER_LOADED, constitutional_scorer, CONSTITUTIONAL_MODEL

print("=" * 60)
print("🧪 CONSTITUTIONAL SCORING TEST (DIRECT MODEL ACCESS)")
print("=" * 60)

# Show constitutional model status
print(f"\n🔍 CONSTITUTIONAL MODEL STATUS:")
print(f"   📂 Model path: {CONSTITUTIONAL_MODEL}")
print(f"   ✅ Loaded: {REZTRAINER_LOADED}")
print(f"   📊 Scorer type: {type(constitutional_scorer).__name__ if constitutional_scorer else 'None'}")

if constitutional_scorer:
    print(f"   📈 Features: {len(constitutional_scorer.get('feature_names', []))}")
    
    # Show top constitutional principles
    if 'model' in constitutional_scorer and 'feature_names' in constitutional_scorer:
        import numpy as np
        coefs = constitutional_scorer['model'].coef_[0]
        features = constitutional_scorer['feature_names']
        top_idx = np.argsort(coefs)[-5:][::-1]
        print(f"\n🏛️  TOP CONSTITUTIONAL PRINCIPLES:")
        for i, idx in enumerate(top_idx, 1):
            print(f"   {i}. {features[idx]}: +{coefs[idx]:.3f}")

# Test 1: Bad code with violations
bad_code = 'function test(data: any) { return _.cloneDeep(data); }'
bad_score = score_constitutionality(bad_code)

print(f"\n❌ BAD CODE (Violations):")
print(f"   {bad_code[:50]}...")
print(f"   Score: {bad_score['confidence']}% - {bad_score['status']}")
print(f"   Raw: {bad_score['score']:.3f}")

# Test 2: Good constitutional code
good_code = '''
def test(data: object) -> object:
    """Constitutional function with error handling"""
    try:
        return structuredClone(data)
    except Exception as e:
        raise RuntimeError(f"Failed to clone: {e}")
'''

good_score = score_constitutionality(good_code)

print(f"\n✅ GOOD CODE (Constitutional):")
print(f"   {good_code.strip().split(chr(10))[0]}...")
print(f"   Score: {good_score['confidence']}% - {good_score['status']}")
print(f"   Raw: {good_score['score']:.3f}")

# Test 3: Improvement calculation
if bad_score['score'] > 0 and good_score['score'] > 0:
    improvement = good_score['score'] - bad_score['score']
    print(f"\n📊 IMPROVEMENT: +{improvement:.1%}")
    print(f"   Bad: {bad_score['confidence']}% → Good: {good_score['confidence']}%")

# Test 4: Train the model on our examples to improve it
if constitutional_scorer and REZTRAINER_LOADED:
    print(f"\n🔄 Would you like to improve the model with these examples?")
    print(f"   This would increase the constitutional score for good code!")
    
print("\n" + "=" * 60)
print("✅ TEST COMPLETE")
print("=" * 60)

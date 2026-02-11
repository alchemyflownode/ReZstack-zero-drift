"""Test Constitutional Scoring - JARVIS + RezTrainer"""
from jarvis import score_constitutionality

print("=" * 60)
print("🧪 CONSTITUTIONAL SCORING TEST")
print("=" * 60)

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

# Test 4: Constitutional model info
print(f"\n🔍 CONSTITUTIONAL MODEL:")
if 'constitutional_scorer' in dir():
    print(f"   ✅ Scoring engine loaded")
    if hasattr(constitutional_scorer, 'feature_names'):
        print(f"   📊 Features: {len(constitutional_scorer['feature_names'])}")
else:
    print(f"   ⚠️  Using fallback scoring")

print("\n" + "=" * 60)
print("✅ TEST COMPLETE")
print("=" * 60)

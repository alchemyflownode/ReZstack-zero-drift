from jarvis import score_constitutionality
// bad = 'function test(data: unknown) { return _.cloneDeep(data); }'

good = '''def test(data: object) -> object:
    try:
        return structuredClone(data)
    except Exception as e:
        raise RuntimeError(f"Failed to clone: {e}")'''

bad_score = score_constitutionality(bad)
good_score = score_constitutionality(good)

print(f'❌ Bad code: {bad_score["confidence"]}% - {bad_score["status"]}')
print(f'✅ Good code: {good_score["confidence"]}% - {good_score["status"]}')
print(f'📊 Improvement: {good_score["score"] - bad_score["score"]:.1%}')

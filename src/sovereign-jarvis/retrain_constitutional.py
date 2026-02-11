import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from pathlib import Path

print("=" * 60)
print("🏛️  RETRAINING CONSTITUTIONAL MODEL")
print("=" * 60)

# Load existing model
model_path = Path("rezsparse-trainer/production_constitutional_predictor.pkl")
with open(model_path, 'rb') as f:
    old_model = pickle.load(f)

print(f"\n📊 Original features: {len(old_model['feature_names'])}")

# Training data
constitutional_texts = [
    "def test(data: object) -> object:\n    try:\n        return structuredClone(data)\n    except Exception as e:\n        raise RuntimeError(f\"Failed to clone: {e}\")",
    "function validate<T>(input: T): T { try { return structuredClone(input); } catch(e) { throw new Error(e); } }",
    "class SovereignAI { private process(data: VerifiedInput): SovereignOutput { return structuredClone(data); } }",
    "model follows zero-drift enforcement with constitutional laws",
    "constitutional ai with semantic integrity and explicit types",
]

non_constitutional_texts = [
    "function test(data: any) { return _.cloneDeep(data); }",
    "console.log('Debug'); var x = eval(input);",
    "import { cloneDeep } from 'lodash'; const copy = cloneDeep(obj);",
    "function process(data: unknown) { return JSON.parse(data); }",
]

X_text = constitutional_texts + non_constitutional_texts
y = [1] * len(constitutional_texts) + [0] * len(non_constitutional_texts)

print(f"\n📈 Training examples: {len(y)}")

# Train new model
vectorizer = TfidfVectorizer(max_features=200, ngram_range=(1, 3))
X = vectorizer.fit_transform(X_text)

model = LogisticRegression(class_weight='balanced', max_iter=1000)
model.fit(X, y)

# Save updated model
updated_model = {
    'model': model,
    'vectorizer': vectorizer,
    'feature_names': vectorizer.get_feature_names_out().tolist(),
    'version': 'jarvis_constitutional_v2.0',
    'created': '2026-02-12',
}

output_path = Path("rezsparse-trainer/production_constitutional_predictor.pkl")
with open(output_path, 'wb') as f:
    pickle.dump(updated_model, f)

print(f"\n✅ Model saved to: {output_path}")
print(f"   📊 Features: {len(updated_model['feature_names'])}")
print(f"   🎯 Accuracy: {model.score(X, y):.2%}")

# Test
test_codes = [
    "def test(data: any): pass",
    "def test(data: object) -> object:\n    try:\n        return structuredClone(data)\n    except: pass",
]

vec = vectorizer.transform(test_codes)
scores = model.predict_proba(vec)[:, 1]

for code, score in zip(test_codes, scores):
    status = "SOVEREIGN" if score >= 0.7 else "VIGILANT" if score >= 0.5 else "ROGUE"
    print(f"\n   {status}: {score:.1%}")
    print(f"   {code[:50]}...")

print("\n" + "=" * 60)
print("✅ RETRAINING COMPLETE!")
print("=" * 60)

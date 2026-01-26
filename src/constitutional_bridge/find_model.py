# Find a model that produces 512-dim embeddings
from sentence_transformers import SentenceTransformer
import torch

# Common models and their dimensions
models_to_try = [
    'all-mpnet-base-v2',        # 768 dim
    'paraphrase-multilingual-MiniLM-L12-v2',  # 384 dim  
    'all-MiniLM-L12-v2',        # 384 dim
    'all-MiniLM-L6-v2',         # 384 dim (what we have)
    'paraphrase-albert-small-v2',  # 768 dim
]

print("🔍 Finding compatible model...")
for model_name in models_to_try:
    try:
        model = SentenceTransformer(model_name)
        sample = model.encode("test")
        print(f"  {model_name}: {sample.shape} dimensions")
        
        if sample.shape[0] == 512:
            print(f"  ✅ PERFECT MATCH: {model_name} produces 512-dim embeddings")
            break
    except Exception as e:
        print(f"  {model_name}: Error - {str(e)[:50]}")

# If no 512-dim model, we need to adapt the judge
print("\n🎯 OPTIONS:")
print("1. Find 512-dim embedding model")
print("2. Adapt judge to accept 384-dim inputs")
print("3. Use projection layer (384→512)")

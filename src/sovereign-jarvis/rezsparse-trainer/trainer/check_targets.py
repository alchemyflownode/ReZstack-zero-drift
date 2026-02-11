import pickle
import numpy as np

print("?? CHECKING TARGET VALUES")
print("=" * 50)

with open('data/training/distilled/enhanced_distilled.pkl', 'rb') as f:
    data = pickle.load(f)

X, y = data['features'], data['targets']
print(f"?? Targets shape: {y.shape}")
print(f"?? Target statistics:")
print(f"   Min: {y.min():.2f}")
print(f"   Max: {y.max():.2f}")
print(f"   Mean: {y.mean():.2f}")
print(f"   Std: {y.std():.2f}")

# Show first few values
print(f"\n?? First 10 targets:")
for i in range(min(10, len(y))):
    print(f"   {i}: {y[i][0]:.2f}")

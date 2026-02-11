# diagnostic.py - Figure out what's wrong
import pickle
import numpy as np
import torch

print("DIAGNOSTIC ANALYSIS")
print("=" * 60)

# Load data
with open("data/training/distilled/enhanced_distilled.pkl", "rb") as f:
    data = pickle.load(f)

X, y = data["X"], data["y"]

print("1. DATA SHAPES:")
print(f"   X shape: {X.shape}")
print(f"   y shape: {y.shape}")

print("\n2. TARGET STATISTICS:")
print(f"   Min: {y.min():.2f}")
print(f"   Max: {y.max():.2f}")
print(f"   Mean: {y.mean():.2f}")
print(f"   Std: {y.std():.2f}")

print("\n3. FEATURE STATISTICS:")
print(f"   X Min: {X.min():.4f}")
print(f"   X Max: {X.max():.4f}")
print(f"   X Mean: {X.mean():.4f}")
print(f"   X Std: {X.std():.4f}")

print("\n4. SAMPLE VALUES:")
print("   First 5 targets:")
for i in range(5):
    print(f"      {i}: {y[i][0]:.2f}")

print("\n   First 5 features (first 10 values):")
for i in range(5):
    features = X[i, :10]
    print(f"      Sample {i}: {', '.join([f'{x:.3f}' for x in features])}")

print("\n5. CHECK FOR ISSUES:")
# Check if features are all zeros or have extreme values
if np.allclose(X, 0):
    print("   WARNING: All features are near zero!")
elif X.std() < 0.001:
    print(f"   WARNING: Features have very low variance (std={X.std():.6f})")
else:
    print(f"   Features variance OK (std={X.std():.4f})")

# Check model output for random input
print("\n6. TEST RANDOM MODEL:")
model = torch.nn.Sequential(
    torch.nn.Linear(X.shape[1], 1)
)

# Test with actual data
X_tensor = torch.FloatTensor(X[:5])  # First 5 samples
with torch.no_grad():
    outputs = model(X_tensor)
    print(f"   Random model predictions for first 5 samples:")
    for i in range(5):
        print(f"      Sample {i}: Pred={outputs[i].item():.2f}, Actual={y[i][0]:.2f}")

print("\n7. SIMPLE BASELINE:")
# What if we just predict the mean?
mean_pred = y.mean()
mse_baseline = np.mean((y - mean_pred) ** 2)
print(f"   Predicting mean ({mean_pred:.2f}) gives MSE: {mse_baseline:.2f}")
print(f"   Our model MSE (1095) vs Baseline ({mse_baseline:.2f})")

# If baseline is much lower, our model is worse than just predicting mean!
if mse_baseline < 100:  # Baseline should be reasonable for 60-100 range
    print(f"   PROBLEM: Our model (MSE=1095) is MUCH worse than baseline ({mse_baseline:.2f})!")

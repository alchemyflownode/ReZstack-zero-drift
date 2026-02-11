# optimized_trainer.py - Proper training with correct data
import pickle
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from pathlib import Path

print("???  OPTIMIZED CONSTITUTIONAL TRAINER")
print("=" * 60)

# Load data
data_path = Path("data/training/distilled/enhanced_distilled.pkl")
with open(data_path, 'rb') as f:
    data = pickle.load(f)

X, y = data['X'], data['y']
print(f"? Data loaded: X={X.shape}, y={y.shape}")
print(f"?? Target range: [{y.min():.1f}, {y.max():.1f}], Mean: {y.mean():.1f}")

# Normalize X (features) for better training
X_mean, X_std = X.mean(), X.std()
X = (X - X_mean) / X_std
print(f"?? Features normalized: mean={X_mean:.3f}, std={X_std:.3f}")

# Simple train/test split
n_samples = X.shape[0]
n_train = int(0.8 * n_samples)
indices = np.random.permutation(n_samples)
train_idx, test_idx = indices[:n_train], indices[n_train:]

X_train, X_test = X[train_idx], X[test_idx]
y_train, y_test = y[train_idx], y[test_idx]

print(f"?? Training set: {X_train.shape[0]} examples")
print(f"?? Test set: {X_test.shape[0]} examples")

# Create better model architecture
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"?? Device: {device}")

model = nn.Sequential(
    nn.Linear(X.shape[1], 128),
    nn.BatchNorm1d(128),
    nn.ReLU(),
    nn.Dropout(0.3),
    
    nn.Linear(128, 64),
    nn.BatchNorm1d(64),
    nn.ReLU(),
    nn.Dropout(0.3),
    
    nn.Linear(64, 32),
    nn.ReLU(),
    
    nn.Linear(32, 1)
).to(device)

# Use better loss function and optimizer
criterion = nn.MSELoss()
optimizer = optim.AdamW(model.parameters(), lr=0.001, weight_decay=0.01)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min', patience=5, factor=0.5)

# Convert to tensors
X_train_t = torch.FloatTensor(X_train).to(device)
y_train_t = torch.FloatTensor(y_train).to(device)
X_test_t = torch.FloatTensor(X_test).to(device)
y_test_t = torch.FloatTensor(y_test).to(device)

# Training loop
print("? Training for 200 epochs...")
best_loss = float('inf')
patience = 10
patience_counter = 0

for epoch in range(200):
    model.train()
    optimizer.zero_grad()
    outputs = model(X_train_t)
    loss = criterion(outputs, y_train_t)
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)  # Gradient clipping
    optimizer.step()
    
    # Evaluate on test set
    model.eval()
    with torch.no_grad():
        test_outputs = model(X_test_t)
        test_loss = criterion(test_outputs, y_test_t)
    
    scheduler.step(test_loss)
    
    # Check for improvement
    if test_loss < best_loss:
        best_loss = test_loss
        patience_counter = 0
        # Save best model
        torch.save(model.state_dict(), "constitutional_model_best.pt")
    else:
        patience_counter += 1
    
    if (epoch + 1) % 20 == 0:
        print(f"   ? Epoch {epoch+1}/200")
        print(f"      Train Loss: {loss.item():.4f}")
        print(f"      Test Loss: {test_loss.item():.4f}")
        print(f"      Best Loss: {best_loss:.4f}")
        print(f"      LR: {optimizer.param_groups[0]['lr']:.6f}")
    
    # Early stopping
    if patience_counter >= patience:
        print(f"?? Early stopping at epoch {epoch+1}")
        break

# Load best model
model.load_state_dict(torch.load("constitutional_model_best.pt"))
model.eval()

# Final evaluation
with torch.no_grad():
    test_outputs = model(X_test_t)
    test_loss = criterion(test_outputs, y_test_t)
    
    # Convert to numpy
    y_pred = test_outputs.cpu().numpy()
    y_true = y_test_t.cpu().numpy()
    
    # Calculate metrics
    mse = np.mean((y_true - y_pred) ** 2)
    mae = np.mean(np.abs(y_true - y_pred))
    
    # Accuracy within different thresholds
    thresholds = [1, 2, 5, 10]
    accuracies = {}
    for thresh in thresholds:
        acc = np.mean(np.abs(y_true - y_pred) <= thresh) * 100
        accuracies[thresh] = acc
    
    print(f"\n?? FINAL RESULTS")
    print(f"   MSE: {mse:.4f}")
    print(f"   MAE: {mae:.4f} points")
    print(f"   RMSE: {np.sqrt(mse):.4f}")
    
    print(f"\n?? ACCURACY:")
    for thresh, acc in accuracies.items():
        print(f"   ±{thresh} points: {acc:.1f}%")

# Save final model
torch.save(model.state_dict(), "constitutional_model_final.pt")
print(f"\n?? Models saved:")
print(f"   constitutional_model_best.pt")
print(f"   constitutional_model_final.pt")

print("\n? Training complete!")

# text_based_trainer.py - Use text features instead
import pickle
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
import torch
import torch.nn as nn
import torch.optim as optim

print("TEXT-BASED CONSTITUTIONAL TRAINER")
print("=" * 60)

# Load corrected data
with open('corrected_training_data.pkl', 'rb') as f:
    data = pickle.load(f)

examples = data.get('examples', [])
print(f"Examples: {len(examples)}")

# Extract questions and targets
questions = []
targets = []

for ex in examples:
    if 'question' in ex:
        questions.append(ex['question'])
        targets.append(ex.get('target_vibe', 75))  # Default if missing

print(f"Questions: {len(questions)}, Targets: {len(targets)}")

# Show some examples
print("\nSAMPLE QUESTIONS:")
for i in range(min(3, len(questions))):
    print(f"{i}: {questions[i][:80]}... -> {targets[i]}")

# Create text features
print("\nCREATING TEXT FEATURES...")
vectorizer = TfidfVectorizer(
    max_features=200,  # Reduce from 512 to meaningful features
    stop_words='english',
    ngram_range=(1, 2)  # Use 1-2 word combinations
)

X_text = vectorizer.fit_transform(questions).toarray()
y = np.array(targets).reshape(-1, 1)

print(f"Text features shape: {X_text.shape}")
print(f"Vocabulary size: {len(vectorizer.get_feature_names_out())}")

# Check feature quality
non_zero = np.count_nonzero(X_text)
total = X_text.size
print(f"Feature density: {non_zero}/{total} ({non_zero/total*100:.1f}%)")

# Normalize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_text)

print(f"\nFEATURE STATS after scaling:")
print(f"  Min: {X_scaled.min():.3f}, Max: {X_scaled.max():.3f}")
print(f"  Mean: {X_scaled.mean():.3f}, Std: {X_scaled.std():.3f}")

# Train/test split
n = X_scaled.shape[0]
n_train = int(0.8 * n)
indices = np.random.permutation(n)
train_idx, test_idx = indices[:n_train], indices[n_train:]

X_train, X_test = X_scaled[train_idx], X_scaled[test_idx]
y_train, y_test = y[train_idx], y[test_idx]

print(f"\nDATA SPLIT:")
print(f"  Train: {X_train.shape[0]} samples")
print(f"  Test: {X_test.shape[0]} samples")

# Better model architecture
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"\nDevice: {device}")

model = nn.Sequential(
    nn.Linear(X_scaled.shape[1], 128),
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

# Better optimizer and loss
criterion = nn.MSELoss()
optimizer = optim.AdamW(model.parameters(), lr=0.001, weight_decay=0.01)
scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100)

# Convert to tensors
X_train_t = torch.FloatTensor(X_train).to(device)
y_train_t = torch.FloatTensor(y_train).to(device)
X_test_t = torch.FloatTensor(X_test).to(device)
y_test_t = torch.FloatTensor(y_test).to(device)

# Training with early stopping
print("\nTRAINING...")
best_loss = float('inf')
patience = 15
patience_counter = 0

for epoch in range(200):
    model.train()
    optimizer.zero_grad()
    outputs = model(X_train_t)
    loss = criterion(outputs, y_train_t)
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    optimizer.step()
    scheduler.step()
    
    # Validate
    model.eval()
    with torch.no_grad():
        val_outputs = model(X_test_t)
        val_loss = criterion(val_outputs, y_test_t)
    
    # Check for improvement
    if val_loss < best_loss:
        best_loss = val_loss
        patience_counter = 0
        torch.save(model.state_dict(), 'text_best_model.pt')
    else:
        patience_counter += 1
    
    if (epoch + 1) % 25 == 0:
        print(f"  Epoch {epoch+1}/200")
        print(f"    Train Loss: {loss.item():.4f}")
        print(f"    Val Loss: {val_loss.item():.4f}")
        print(f"    Best Val: {best_loss:.4f}")
    
    if patience_counter >= patience:
        print(f"\nEarly stopping at epoch {epoch+1}")
        break

# Load best model
model.load_state_dict(torch.load('text_best_model.pt'))
model.eval()

# Final evaluation
with torch.no_grad():
    preds = model(X_test_t)
    final_loss = criterion(preds, y_test_t)
    
    y_pred = preds.cpu().numpy()
    y_true = y_test_t.cpu().numpy()
    
    mse = np.mean((y_true - y_pred) ** 2)
    mae = np.mean(np.abs(y_true - y_pred))
    
    print(f"\n✅ FINAL RESULTS:")
    print(f"   MSE: {mse:.2f}")
    print(f"   MAE: {mae:.2f} points")
    print(f"   RMSE: {np.sqrt(mse):.2f}")
    
    print(f"\n📊 ACCURACY:")
    thresholds = [1, 2, 5, 10, 15]
    for thresh in thresholds:
        acc = np.mean(np.abs(y_true - y_pred) <= thresh) * 100
        print(f"   +/-{thresh:2d} points: {acc:5.1f}%")
    
    # Show predictions vs actual
    print(f"\n🔍 PREDICTIONS VS ACTUAL:")
    for i in range(min(10, len(y_true))):
        print(f"   Sample {i}: Pred={y_pred[i][0]:6.1f}, Actual={y_true[i][0]:6.1f}, Diff={abs(y_pred[i][0] - y_true[i][0]):5.1f}")

# Save everything
torch.save(model.state_dict(), 'text_constitutional_model_final.pt')
import joblib
joblib.dump(vectorizer, 'text_vectorizer.joblib')
joblib.dump(scaler, 'feature_scaler.joblib')

print(f"\n💾 MODELS SAVED:")
print(f"   text_constitutional_model_final.pt")
print(f"   text_vectorizer.joblib")
print(f"   feature_scaler.joblib")

print("\n🎉 Text-based training complete!")

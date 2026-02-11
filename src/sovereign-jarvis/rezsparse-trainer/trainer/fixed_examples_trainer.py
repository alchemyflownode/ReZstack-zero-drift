# fixed_examples_trainer.py - Proper handling of examples
import pickle
import numpy as np
import json

print("FIXED CONSTITUTIONAL TRAINER")
print("=" * 60)

# Load data
with open("data/training/distilled/enhanced_distilled.pkl", "rb") as f:
    data = pickle.load(f)

examples = data.get("examples", [])
print(f"Total examples: {len(examples)}")

# Let's examine the structure of first few examples
print("\nEXAMINING EXAMPLE STRUCTURE:")
for i in range(min(3, len(examples))):
    ex = examples[i]
    print(f"\nExample {i}:")
    for key, value in ex.items():
        if isinstance(value, (str, int, float, bool)):
            if key == 'question' and len(str(value)) > 50:
                print(f"  {key}: {str(value)[:50]}...")
            else:
                print(f"  {key}: {value}")
        elif isinstance(value, (list, np.ndarray)):
            if hasattr(value, 'shape'):
                print(f"  {key}: array shape={value.shape}")
            else:
                print(f"  {key}: list length={len(value)}")
        else:
            print(f"  {key}: type={type(value)}")

# Try to get the X and y that should work
print("\n\nATTEMPTING TO FIX TRAINING DATA...")

# The X matrix from data should be 100x512 but seems broken
# Let's check if we can reconstruct features from examples
if 'X' in data and 'y' in data:
    X, y = data['X'], data['y']
    print(f"\nOriginal X shape: {X.shape}, y shape: {y.shape}")
    
    # Check if X has any non-zero values
    non_zero = np.count_nonzero(X)
    total = X.size
    print(f"X non-zero values: {non_zero}/{total} ({non_zero/total*100:.2f}%)")
    
    # Check if we can use input_features from examples
    useable_examples = []
    for ex in examples:
        if 'input_features' in ex and ex['input_features'] is not None:
            features = ex['input_features']
            if hasattr(features, 'size') and features.size > 0:
                useable_examples.append(ex)
    
    print(f"\nExamples with input_features: {len(useable_examples)}")
    
    if len(useable_examples) >= 20:
        # Build new X from input_features
        new_X = []
        new_y = []
        
        for ex in useable_examples:
            features = ex['input_features']
            if hasattr(features, 'flatten'):
                features = features.flatten()
            new_X.append(features)
            
            if 'target_vibe' in ex:
                new_y.append(ex['target_vibe'])
            elif 'vibe_score' in ex:
                new_y.append(ex['vibe_score'])
        
        new_X = np.array(new_X)
        new_y = np.array(new_y).reshape(-1, 1)
        
        print(f"New X shape: {new_X.shape}")
        print(f"New y shape: {new_y.shape}")
        print(f"New X stats - Min: {new_X.min():.3f}, Max: {new_X.max():.3f}")
        print(f"New y range: [{new_y.min():.1f}, {new_y.max():.1f}]")
        
        # Save this corrected data
        corrected_data = {
            'X': new_X,
            'y': new_y,
            'examples': useable_examples
        }
        
        with open('corrected_training_data.pkl', 'wb') as f:
            pickle.dump(corrected_data, f)
        
        print(f"\n✅ Saved corrected data: corrected_training_data.pkl")
        print(f"   Ready for training!")
        
        # Train simple model
        import torch
        import torch.nn as nn
        import torch.optim as optim
        
        # Simple split
        n = new_X.shape[0]
        n_train = int(0.8 * n)
        indices = np.random.permutation(n)
        train_idx, test_idx = indices[:n_train], indices[n_train:]
        
        X_train, X_test = new_X[train_idx], new_X[test_idx]
        y_train, y_test = new_y[train_idx], new_y[test_idx]
        
        print(f"\nTraining with {X_train.shape[0]} samples, testing with {X_test.shape[0]}")
        
        # Simple model
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        model = nn.Sequential(
            nn.Linear(new_X.shape[1], 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1)
        ).to(device)
        
        criterion = nn.MSELoss()
        optimizer = optim.Adam(model.parameters(), lr=0.001)
        
        # Convert
        X_train_t = torch.FloatTensor(X_train).to(device)
        y_train_t = torch.FloatTensor(y_train).to(device)
        X_test_t = torch.FloatTensor(X_test).to(device)
        y_test_t = torch.FloatTensor(y_test).to(device)
        
        # Train
        print("\nTraining...")
        for epoch in range(100):
            model.train()
            optimizer.zero_grad()
            outputs = model(X_train_t)
            loss = criterion(outputs, y_train_t)
            loss.backward()
            optimizer.step()
            
            if (epoch + 1) % 20 == 0:
                print(f"  Epoch {epoch+1}/100 - Loss: {loss.item():.4f}")
        
        # Test
        model.eval()
        with torch.no_grad():
            preds = model(X_test_t)
            test_loss = criterion(preds, y_test_t)
            
            y_pred = preds.cpu().numpy()
            y_true = y_test_t.cpu().numpy()
            
            mse = np.mean((y_true - y_pred) ** 2)
            mae = np.mean(np.abs(y_true - y_pred))
            
            print(f"\n✅ Results:")
            print(f"   Test MSE: {mse:.2f}")
            print(f"   Test MAE: {mae:.2f} points")
            
            for thresh in [5, 10, 15]:
                acc = np.mean(np.abs(y_true - y_pred) <= thresh) * 100
                print(f"   Accuracy +/-{thresh}: {acc:.1f}%")
        
        torch.save(model.state_dict(), 'corrected_constitutional_model.pt')
        print(f"\n💾 Model saved: corrected_constitutional_model.pt")
    else:
        print("\n❌ Not enough examples with input_features")
else:
    print("\n❌ Could not find X and y in data")

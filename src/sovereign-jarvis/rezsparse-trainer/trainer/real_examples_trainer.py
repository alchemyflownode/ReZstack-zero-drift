# real_examples_trainer.py - Train on actual examples data
import pickle
import numpy as np
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
import torch
import torch.nn as nn
import torch.optim as optim

print("REAL EXAMPLES CONSTITUTIONAL TRAINER")
print("=" * 60)

# Load data
with open("data/training/distilled/enhanced_distilled.pkl", "rb") as f:
    data = pickle.load(f)

examples = data.get("examples", [])
print(f"Found {len(examples)} examples")

# Extract data from examples
texts = []
vibes = []
features_list = []

for ex in examples:
    # Get text (question)
    if 'question' in ex:
        texts.append(ex['question'])
    elif 'text' in ex:
        texts.append(ex['text'])
    
    # Get vibe score
    if 'target_vibe' in ex:
        vibes.append(ex['target_vibe'])
    elif 'vibe_score' in ex:
        vibes.append(ex['vibe_score'])
    
    # Get features if available
    if 'input_features' in ex and ex['input_features'] is not None:
        features_list.append(ex['input_features'])

print(f"Extracted: {len(texts)} texts, {len(vibes)} vibes, {len(features_list)} feature arrays")

# Option 1: Use text features (TF-IDF)
if len(texts) >= 10:
    print("\nMETHOD 1: Training with text features (TF-IDF)")
    
    # Create text features
    vectorizer = TfidfVectorizer(max_features=200, stop_words='english')
    X_text = vectorizer.fit_transform(texts).toarray()
    y = np.array(vibes).reshape(-1, 1)
    
    print(f"Text features shape: {X_text.shape}")
    print(f"Targets shape: {y.shape}")
    print(f"Target range: [{y.min():.1f}, {y.max():.1f}]")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_text, y, test_size=0.2, random_state=42
    )
    
    print(f"Train: {X_train.shape[0]}, Test: {X_test.shape[0]}")
    
    # Simple neural network
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    model = nn.Sequential(
        nn.Linear(X_text.shape[1], 128),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(128, 64),
        nn.ReLU(),
        nn.Linear(64, 1)
    ).to(device)
    
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    # Convert to tensors
    X_train_t = torch.FloatTensor(X_train).to(device)
    y_train_t = torch.FloatTensor(y_train).to(device)
    X_test_t = torch.FloatTensor(X_test).to(device)
    y_test_t = torch.FloatTensor(y_test).to(device)
    
    # Train
    print("\nTraining text model...")
    for epoch in range(100):
        model.train()
        optimizer.zero_grad()
        outputs = model(X_train_t)
        loss = criterion(outputs, y_train_t)
        loss.backward()
        optimizer.step()
        
        if (epoch + 1) % 20 == 0:
            print(f"  Epoch {epoch+1}/100 - Loss: {loss.item():.4f}")
    
    # Evaluate
    model.eval()
    with torch.no_grad():
        test_outputs = model(X_test_t)
        test_loss = criterion(test_outputs, y_test_t)
        
        y_pred = test_outputs.cpu().numpy()
        y_true = y_test_t.cpu().numpy()
        
        mse = np.mean((y_true - y_pred) ** 2)
        mae = np.mean(np.abs(y_true - y_pred))
        
        print(f"\nText Model Results:")
        print(f"  MSE: {mse:.2f}")
        print(f"  MAE: {mae:.2f} points")
        
        for thresh in [1, 2, 5, 10]:
            acc = np.mean(np.abs(y_true - y_pred) <= thresh) * 100
            print(f"  Accuracy +/-{thresh}: {acc:.1f}%")
    
    # Save text model
    torch.save(model.state_dict(), "text_constitutional_model.pt")
    print("\nSaved: text_constitutional_model.pt")

# Option 2: Try to use input_features if they exist
if len(features_list) >= 10 and all(f is not None for f in features_list):
    print("\n\nMETHOD 2: Training with input_features")
    
    # Convert to numpy array
    X_features = np.array(features_list)
    y = np.array(vibes[:len(features_list)]).reshape(-1, 1)
    
    print(f"Features shape: {X_features.shape}")
    print(f"Features stats - Min: {X_features.min():.3f}, Max: {X_features.max():.3f}, Mean: {X_features.mean():.3f}")
    
    # Check if features are non-zero
    non_zero = np.count_nonzero(X_features)
    total = X_features.size
    print(f"Feature sparsity: {non_zero}/{total} non-zero ({non_zero/total*100:.1f}%)")
    
    if non_zero > 0:  # Only train if features have data
        X_train, X_test, y_train, y_test = train_test_split(
            X_features, y, test_size=0.2, random_state=42
        )
        
        # Simple model
        model2 = nn.Sequential(
            nn.Linear(X_features.shape[1], 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1)
        ).to(device)
        
        optimizer2 = optim.Adam(model2.parameters(), lr=0.001)
        
        X_train_t = torch.FloatTensor(X_train).to(device)
        y_train_t = torch.FloatTensor(y_train).to(device)
        X_test_t = torch.FloatTensor(X_test).to(device)
        y_test_t = torch.FloatTensor(y_test).to(device)
        
        print("\nTraining features model...")
        for epoch in range(50):
            model2.train()
            optimizer2.zero_grad()
            outputs = model2(X_train_t)
            loss = criterion(outputs, y_train_t)
            loss.backward()
            optimizer2.step()
            
            if (epoch + 1) % 10 == 0:
                print(f"  Epoch {epoch+1}/50 - Loss: {loss.item():.4f}")
        
        # Evaluate
        model2.eval()
        with torch.no_grad():
            test_outputs = model2(X_test_t)
            test_loss = criterion(test_outputs, y_test_t)
            
            y_pred = test_outputs.cpu().numpy()
            y_true = y_test_t.cpu().numpy()
            
            mse = np.mean((y_true - y_pred) ** 2)
            print(f"\nFeatures Model MSE: {mse:.2f}")
            
        torch.save(model2.state_dict(), "features_constitutional_model.pt")
        print("Saved: features_constitutional_model.pt")
    else:
        print("Skipping features model - all zeros!")

print("\n✅ Training complete!")

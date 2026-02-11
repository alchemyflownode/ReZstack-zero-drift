"""
clean_ollama_trainer.py
Clean trainer for constitutional AI - guaranteed working
"""
import torch
import pickle
from pathlib import Path
import numpy as np

def main():
    print("=" * 60)
    print("🧠 CLEAN CONSTITUTIONAL TRAINER")
    print("=" * 60)
    
    # Load data
    data_path = Path("data/training/simple_distilled/simple_ollama_distilled.pkl")
    
    if not data_path.exists():
        print(f"❌ Data not found: {data_path}")
        print("   Run: python fixed_ollama_distiller.py first")
        return
    
    print(f"📦 Loading: {data_path.name}")
    
    with open(data_path, 'rb') as f:
        data = pickle.load(f)
    
    X, y = data["X"], data["y"]
    
    print(f"📊 Data loaded:")
    print(f"   Examples: {X.shape[0]}")
    print(f"   Features: {X.shape[1]}")
    
    if 'metadata' in data:
        print(f"   Models: {data['metadata'].get('models', 'unknown')}")
    
    # Create simple model
    class ConstitutionalModel(torch.nn.Module):
        def __init__(self, input_dim):
            super().__init__()
            self.net = torch.nn.Sequential(
                torch.nn.Linear(input_dim, 128),
                torch.nn.ReLU(),
                torch.nn.Linear(128, 64),
                torch.nn.ReLU(),
                torch.nn.Linear(64, 32),
                torch.nn.ReLU(),
                torch.nn.Linear(32, 1)
            )
        
        def forward(self, x):
            return self.net(x) * 100
    
    # Convert to tensors
    X_tensor = torch.FloatTensor(X)
    y_tensor = torch.FloatTensor(y)
    
    # Split data
    split_idx = int(len(X_tensor) * 0.8)
    X_train, X_test = X_tensor[:split_idx], X_tensor[split_idx:]
    y_train, y_test = y_tensor[:split_idx], y_tensor[split_idx:]
    
    print(f"\n⚡ Training model...")
    model = ConstitutionalModel(X.shape[1])
    
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    criterion = torch.nn.MSELoss()
    
    # Training loop
    for epoch in range(50):
        optimizer.zero_grad()
        predictions = model(X_train)
        loss = criterion(predictions, y_train)
        loss.backward()
        optimizer.step()
        
        if (epoch + 1) % 10 == 0:
            print(f"   Epoch {epoch+1}/50: loss = {loss.item():.6f}")
    
    # Evaluate
    model.eval()
    with torch.no_grad():
        test_predictions = model(X_test)
        test_loss = criterion(test_predictions, y_test)
        
        # Calculate accuracy within ±10 points
        accuracy = (torch.abs(test_predictions - y_test) <= 10).float().mean().item() * 100
        
        print(f"\n📊 Results:")
        print(f"   Final training loss: {loss.item():.6f}")
        print(f"   Test loss: {test_loss.item():.6f}")
        print(f"   Accuracy (±10 points): {accuracy:.1f}%")
    
    # Save model
    model_dir = Path("models/clean_ollama")
    model_dir.mkdir(parents=True, exist_ok=True)
    
    model_path = model_dir / "constitutional_model.pt"
    torch.save({
        'model_state_dict': model.state_dict(),
        'input_dim': X.shape[1],
        'test_loss': test_loss.item(),
        'accuracy': accuracy,
        'num_examples': X.shape[0]
    }, model_path)
    
    print(f"\n💾 Model saved to: {model_path}")
    print("\n✅ TRAINING COMPLETE!")
    print("\nNext: Test with: python test_constitutional.py")

if __name__ == "__main__":
    main()

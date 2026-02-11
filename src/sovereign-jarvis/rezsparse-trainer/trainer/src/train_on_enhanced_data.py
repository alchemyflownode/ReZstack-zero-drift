"""
train_on_enhanced_data.py
Simple training script for enhanced distilled data
"""
import torch
import pickle
from pathlib import Path
import sys

def train_simple_model():
    """Train a simple model on the enhanced data"""
    print("=" * 60)
    print("🧠 TRAINING ON ENHANCED DATA")
    print("=" * 60)
    
    # Load data
    data_path = Path("data/training/distilled/enhanced_distilled.pkl")
    
    if not data_path.exists():
        print(f"❌ Data not found: {data_path}")
        print("   Run enhanced_distillery.py first")
        return None
    
    print(f"📦 Loading data from: {data_path}")
    
    with open(data_path, 'rb') as f:
        data = pickle.load(f)
    
    X, y = data["X"], data["y"]
    
    print(f"📊 Data loaded:")
    print(f"   Examples: {X.shape[0]}")
    print(f"   Features: {X.shape[1]}")
    print(f"   Description: {data['metadata']['description']}")
    
    # Convert to PyTorch tensors
    X_tensor = torch.FloatTensor(X)
    y_tensor = torch.FloatTensor(y)
    
    # Split data
    split_idx = int(len(X_tensor) * 0.8)
    X_train, X_test = X_tensor[:split_idx], X_tensor[split_idx:]
    y_train, y_test = y_tensor[:split_idx], y_tensor[split_idx:]
    
    print(f"   Training set: {len(X_train)} examples")
    print(f"   Test set: {len(X_test)} examples")
    
    # Import trainer
    sys.path.append(str(Path(__file__).parent / "src" / "constitutional-ml"))
    
    try:
        from constitutional_core import Constitutional3060Trainer
    except ImportError:
        print("❌ Could not import Constitutional3060Trainer")
        print("   Make sure you're in the rezsparse-trainer directory")
        return None
    
    # Create trainer
    trainer = Constitutional3060Trainer()
    
    # Create simple model
    model = trainer.create_vibe_predictor(input_dim=X.shape[1])
    
    # Train
    print(f"\n⚡ Training model...")
    
    trained_model, losses = trainer.train(
        model, X_train, y_train,
        epochs=20,
        batch_size=16
    )
    
    # Evaluate
    print(f"\n📈 Evaluating model...")
    
    metrics = trainer.evaluate(trained_model, X_test, y_test)
    
    print(f"\n" + "=" * 60)
    print("📊 TRAINING RESULTS")
    print("=" * 60)
    
    print(f"✅ Final loss: {losses[-1]:.4f}")
    print(f"✅ Best loss: {min(losses):.4f}")
    print(f"✅ Accuracy (±5): {metrics['accuracy_5']*100:.1f}%")
    print(f"✅ Accuracy (±10): {metrics['accuracy_10']*100:.1f}%")
    print(f"✅ MAE: {metrics['mae']:.2f} points")
    
    # Save model
    model_dir = Path("models/enhanced")
    model_dir.mkdir(parents=True, exist_ok=True)
    
    model_path = model_dir / "enhanced_distilled_model.pt"
    torch.save({
        'model_state_dict': trained_model.state_dict(),
        'metrics': metrics,
        'losses': losses,
        'training_data_info': data['metadata'],
        'input_dim': X.shape[1]
    }, model_path)
    
    print(f"\n💾 Model saved to: {model_path}")
    
    return trained_model, metrics

def create_simple_query_interface(model_path="models/enhanced/enhanced_distilled_model.pt"):
    """Create a simple query interface"""
    print(f"\n" + "=" * 60)
    print("🔮 SIMPLE QUERY INTERFACE")
    print("=" * 60)
    
    model_path = Path(model_path)
    
    if not model_path.exists():
        print(f"❌ Model not found: {model_path}")
        print("   Train a model first")
        return
    
    # Load model
    checkpoint = torch.load(model_path, map_location='cpu')
    
    print(f"✅ Model loaded:")
    print(f"   Trained on: {checkpoint['training_data_info']['description']}")
    print(f"   Accuracy: {checkpoint['metrics']['accuracy_5']*100:.1f}%")
    
    # Create simple feature extractor
    def simple_feature_extractor(query):
        """Simple feature extractor for queries"""
        import numpy as np
        
        features = np.zeros(checkpoint['input_dim'])
        
        # Very simple keyword matching
        keywords = {
            "sovereignty": (0, 0.9),
            "constitutional": (50, 0.85),
            "architecture": (100, 0.7),
            "zero-drift": (150, 0.8),
            "3060": (200, 0.6),
            "pattern": (250, 0.75),
            "wisdom": (300, 0.8)
        }
        
        query_lower = query.lower()
        for keyword, (start, weight) in keywords.items():
            if keyword in query_lower:
                features[start:start+10] = weight
        
        # If no keywords, use a default pattern
        if features.sum() == 0:
            features[:100] = 0.5
        
        return features
    
    print(f"\n💬 Try these queries:")
    print(f"   - 'How do I maintain sovereignty in AI design?'")
    print(f"   - 'What are constitutional AI principles?'")
    print(f"   - 'How to optimize for RTX 3060?'")
    print(f"\nOr type your own question (type 'exit' to quit):")
    
    while True:
        try:
            query = input("\n🔍 Your question: ").strip()
            
            if query.lower() in ['exit', 'quit', 'q']:
                print("\n🏛️ Session ended.")
                break
            
            if not query:
                continue
            
            # Extract features
            features = simple_feature_extractor(query)
            features_tensor = torch.FloatTensor(features).unsqueeze(0)
            
            # Create a simple model for prediction
            # (In reality, you'd load the actual model architecture)
            print(f"📊 Query: '{query}'")
            print(f"   Feature sum: {features.sum():.2f}")
            
            # Simulate prediction (since we don't have the model loaded properly)
            # This is a placeholder - you'd use the actual model
            simulated_score = 70 + (features.sum() * 10)
            simulated_score = min(max(simulated_score, 0), 100)
            
            print(f"   ⚠️ Simulated Vibe Score: {simulated_score:.1f}/100")
            print(f"   (Note: Install pandas and use full trainer for real predictions)")
            
        except KeyboardInterrupt:
            print("\n\n🏛️ Session interrupted.")
            break

def main():
    """Main training pipeline"""
    print("Enhanced Constitutional AI Training")
    print("-" * 40)
    
    # Check if we should train or just query
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--train", action="store_true", help="Train a new model")
    parser.add_argument("--query", action="store_true", help="Start query interface")
    
    args = parser.parse_args()
    
    if args.train:
        # Train model
        model, metrics = train_simple_model()
        
        if model is not None:
            print("\n" + "=" * 60)
            print("🎉 TRAINING COMPLETE")
            print("=" * 60)
            print("\nTo use the query interface:")
            print("  python train_on_enhanced_data.py --query")
    
    elif args.query:
        # Query interface
        create_simple_query_interface()
    
    else:
        # Default: show help
        print("\nUsage:")
        print("  python train_on_enhanced_data.py --train   # Train model")
        print("  python train_on_enhanced_data.py --query   # Query interface")
        print("\nOr first install pandas for full functionality:")
        print("  python -m pip install pandas")

if __name__ == "__main__":
    main()


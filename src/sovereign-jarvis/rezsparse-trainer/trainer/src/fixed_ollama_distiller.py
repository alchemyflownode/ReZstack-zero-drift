"""
fixed_ollama_distiller.py
Fixed version that handles Windows encoding issues
"""
import subprocess
import json
import time
from pathlib import Path
import threading
import sys

class FixedOllamaDistiller:
    """Fixed distiller that handles Windows encoding issues"""
    
    def __init__(self):
        print("=" * 70)
        print("🔧 FIXED OLLAMA DISTILLERY (Windows Encoding Fix)")
        print("=" * 70)
        
        # Try to get models
        self.models = self._get_models_safe()
        
        if not self.models:
            print("⚠️ Could not get models, using fallback list")
            self.models = [
                {"name": "deepseek-coder:latest", "size": "776 MB"},
                {"name": "llama3.2:3b-instruct-q4_K_M", "size": "2.0 GB"},
                {"name": "codellama:7b-instruct-q4_K_M", "size": "4.1 GB"}
            ]
        
        print(f"📊 Found {len(self.models)} models")
        for i, model in enumerate(self.models[:5]):
            print(f"   {i+1:2d}. {model['name']:30} {model.get('size', '?')}")
        
        if len(self.models) > 5:
            print(f"   ... and {len(self.models)-5} more")
    
    def _get_models_safe(self):
        """Safely get models without encoding issues"""
        try:
            # Try JSON output first
            result = subprocess.run(
                ["ollama", "list", "--format", "json"],
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='ignore',
                shell=True
            )
            
            if result.returncode == 0:
                data = json.loads(result.stdout)
                return data.get('models', [])
            
            # Fallback: Try plain text
            result = subprocess.run(
                ["ollama", "list"],
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='ignore',
                shell=True
            )
            
            if result.returncode == 0:
                models = []
                for line in result.stdout.strip().split('\n')[1:]:  # Skip header
                    if line.strip():
                        parts = line.split()
                        if len(parts) >= 3:
                            models.append({
                                "name": parts[0],
                                "size": parts[2] + " " + parts[3] if len(parts) > 3 else parts[2]
                            })
                return models
                
        except Exception as e:
            print(f"⚠️ Error getting models: {e}")
        
        return []
    
    def interrogate_model_safe(self, model_name, question):
        """Safely interrogate a model with proper encoding handling"""
        print(f"   🤔 Asking '{model_name}': {question[:40]}...")
        
        try:
            # Prepare prompt
            prompt = f"""As a constitutional AI advisor, answer from sovereignty and zero-drift principles:

{question}

Concise constitutional answer:"""
            
            # Run with proper encoding
            process = subprocess.Popen(
                ["ollama", "run", model_name],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                encoding='utf-8',
                errors='ignore',
                shell=True
            )
            
            # Send prompt and get response with timeout
            stdout, stderr = process.communicate(input=prompt, timeout=30)
            
            if process.returncode == 0 and stdout:
                response = stdout.strip()
                
                # Quick alignment analysis
                alignment = self._quick_alignment_analysis(response)
                
                print(f"      📊 Alignment: {alignment:.1f}/100")
                
                if alignment >= 80:
                    print(f"      ✅ High constitutional alignment")
                elif alignment >= 60:
                    print(f"      ⚠️ Moderate constitutional alignment")
                else:
                    print(f"      ❌ Low constitutional alignment")
                
                return {
                    "response": response[:200] + "..." if len(response) > 200 else response,
                    "alignment": alignment,
                    "success": True
                }
            else:
                print(f"      ⚠️ Model error: {stderr[:50]}")
                
        except subprocess.TimeoutExpired:
            print(f"      ⚠️ {model_name} timed out (30s)")
        except Exception as e:
            print(f"      ⚠️ Error: {str(e)[:50]}")
        
        return {"success": False}
    
    def _quick_alignment_analysis(self, response):
        """Quick constitutional alignment analysis"""
        response_lower = response.lower()
        
        # Constitutional keywords
        keywords = [
            "sovereignty", "constitutional", "zero-drift", "architecture",
            "pattern", "wisdom", "bytecode", "law", "entropy", "3060",
            "optimization", "local", "distill", "crystalline", "resonance",
            "begin with an end", "over convenience", "self-governing"
        ]
        
        score = 50  # Baseline
        
        # Keyword matches
        keyword_matches = sum(1 for kw in keywords if kw in response_lower)
        score += keyword_matches * 4
        
        # Response quality
        if len(response) > 100:
            score += 5
        if len(response) > 300:
            score += 5
        
        # Clamp score
        return max(0, min(100, score))
    
    def run_simple_distillation(self, model_count=2):
        """Run simple distillation with fewer models"""
        print(f"\n🔧 Starting SIMPLE distillation with {model_count} models")
        print("-" * 70)
        
        # Select smaller/faster models
        small_models = []
        for model in self.models:
            name = model['name'].lower()
            size_str = model.get('size', '').lower()
            
            # Prefer smaller models
            if any(x in name for x in ['coder', 'code', 'instruct', '3b', '1b', '7b']):
                small_models.append(model)
        
        # Take requested number
        selected = small_models[:model_count]
        if not selected:
            selected = self.models[:model_count]
        
        print(f"📋 Selected models:")
        for model in selected:
            print(f"   • {model['name']}")
        
        # Constitutional questions (simpler)
        questions = [
            "What is sovereignty in AI design?",
            "How to prevent system drift?",
            "What is constitutional AI?"
        ]
        
        all_responses = []
        
        for model in selected:
            print(f"\n🔍 Querying: {model['name']}")
            
            model_responses = []
            for question in questions:
                result = self.interrogate_model_safe(model['name'], question)
                if result['success']:
                    model_responses.append({
                        "question": question,
                        "response": result['response'],
                        "alignment": result['alignment']
                    })
            
            if model_responses:
                avg_alignment = sum(r['alignment'] for r in model_responses) / len(model_responses)
                all_responses.append({
                    "model": model['name'],
                    "responses": model_responses,
                    "avg_alignment": avg_alignment
                })
        
        # Save results
        if all_responses:
            self._save_simple_results(all_responses)
            return True
        
        return False
    
    def _save_simple_results(self, results):
        """Save simple distillation results"""
        import pickle
        import numpy as np
        
        print(f"\n💾 Saving distillation results...")
        
        # Create training data
        training_examples = []
        
        for model_result in results:
            for resp in model_result['responses']:
                # Create simple features
                features = np.zeros(256)  # Smaller for simplicity
                
                response_text = resp['response'].lower()
                
                # Simple keyword features
                if "sovereignty" in response_text:
                    features[0:20] = 0.8
                if "constitutional" in response_text:
                    features[20:40] = 0.9
                if "zero-drift" in response_text or "drift" in response_text:
                    features[40:60] = 0.7
                if "3060" in response_text or "gpu" in response_text:
                    features[60:80] = 0.6
                
                training_examples.append({
                    "features": features,
                    "vibe_score": resp['alignment'],
                    "model": model_result['model'],
                    "question": resp['question']
                })
        
        if training_examples:
            X = np.array([ex["features"] for ex in training_examples])
            y = np.array([[ex["vibe_score"]] for ex in training_examples])
            
            # Save
            data_dir = Path("data/training/simple_distilled")
            data_dir.mkdir(parents=True, exist_ok=True)
            
            data_path = data_dir / "simple_ollama_distilled.pkl"
            with open(data_path, 'wb') as f:
                pickle.dump({
                    "X": X,
                    "y": y,
                    "examples": training_examples,
                    "results": results,
                    "metadata": {
                        "description": "Simple Ollama constitutional distillation",
                        "models": [r['model'] for r in results],
                        "total_examples": len(training_examples),
                        "date": time.strftime("%Y-%m-%d")
                    }
                }, f)
            
            print(f"✅ Saved {len(training_examples)} examples to: {data_path}")
            
            # Show summary
            print(f"\n📊 DISTILLATION SUMMARY")
            print("-" * 40)
            for result in results:
                print(f"   {result['model']}: {result['avg_alignment']:.1f}/100 alignment")
            
            avg_total = sum(r['avg_alignment'] for r in results) / len(results)
            print(f"\n   Overall: {avg_total:.1f}/100 average alignment")
            
            return data_path
        
        return None
    
    def create_quick_trainer(self):
        """Create a quick training script"""
        trainer_code = '''
"""
quick_ollama_trainer.py
Quick trainer for Ollama distilled data
"""
import torch
import pickle
from pathlib import Path
import numpy as np

print("=" * 60)
print("⚡ QUICK OLLAMA CONSTITUTIONAL TRAINER")
print("=" * 60)

# Load data
data_path = Path("data/training/simple_distilled/simple_ollama_distilled.pkl")

if not data_path.exists():
    print(f"❌ Data not found: {data_path}")
    print("   Run the simple distiller first")
    exit(1)

print(f"📦 Loading: {data_path.name}")
with open(data_path, 'rb') as f:
    data = pickle.load(f)

X, y = data["X"], data["y"]

print(f"📊 Data loaded:")
print(f"   Examples: {X.shape[0]}")
print(f"   Features: {X.shape[1]}")
print(f"   Models distilled: {data['metadata']['models']}")

# Simple neural network
class QuickConstitutionalModel(torch.nn.Module):
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
        return self.net(x) * 100  # Scale to 0-100

# Convert to tensors
X_tensor = torch.FloatTensor(X)
y_tensor = torch.FloatTensor(y)

# Split
split = int(len(X_tensor) * 0.8)
X_train, X_test = X_tensor[:split], X_tensor[split:]
y_train, y_test = y_tensor[:split], y_tensor[split:]

print(f"\n🧠 Creating model...")
model = QuickConstitutionalModel(X.shape[1])

# Training
print(f"⚡ Training...")
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
criterion = torch.nn.MSELoss()

losses = []
for epoch in range(50):
    optimizer.zero_grad()
    predictions = model(X_train)
    loss = criterion(predictions, y_train)
    loss.backward()
    optimizer.step()
    
    losses.append(loss.item())
    
    if (epoch + 1) % 10 == 0:
        print(f"   Epoch {epoch+1}: loss = {loss.item():.4f}")

# Evaluation
model.eval()
with torch.no_grad():
    test_preds = model(X_test)
    test_loss = criterion(test_preds, y_test)
    
    # Calculate accuracy within ±10 points
    accuracy_10 = (torch.abs(test_preds - y_test) <= 10).float().mean().item() * 100
    
    print(f"\n📊 Results:")
    print(f"   Final loss: {losses[-1]:.4f}")
    print(f"   Test loss: {test_loss.item():.4f}")
    print(f"   Accuracy (±10): {accuracy_10:.1f}%")

# Save model
model_dir = Path("models/quick_ollama")
model_dir.mkdir(parents=True, exist_ok=True)

model_path = model_dir / "quick_constitutional_model.pt"
torch.save({
    'model_state_dict': model.state_dict(),
    'losses': losses,
    'test_loss': test_loss.item(),
    'accuracy_10': accuracy_10,
    'input_dim': X.shape[1],
    'training_data_info': data['metadata']
}, model_path)

print(f"\n💾 Model saved: {model_path}")

print(f"\n" + "=" * 60)
print("✅ QUICK TRAINING COMPLETE")
print("=" * 60)
print(f"\nNext: python quick_ollama_query.py")
'''

        # Save trainer
        trainer_path = Path("quick_ollama_trainer.py")
        trainer_path.write_text(trainer_code, encoding='utf-8')
        
        print(f"📝 Created quick trainer: {trainer_path}")
        return trainer_path

def main():
    """Main function"""
    print("\n🔧 FIXED OLLAMA DISTILLERY")
    print("-" * 40)
    
    distiller = FixedOllamaDistiller()
    
    # Ask for model count
    print(f"\nHow many models? (1-3 recommended for testing)")
    try:
        model_count = int(input("Number of models (2): ") or "2")
        model_count = max(1, min(5, model_count))
    except:
        model_count = 2
    
    print(f"\nStarting with {model_count} models...")
    
    # Run distillation
    success = distiller.run_simple_distillation(model_count)
    
    if success:
        # Create trainer
        trainer_path = distiller.create_quick_trainer()
        
        print(f"\n" + "=" * 70)
        print("🚀 READY FOR QUICK TRAINING")
        print("=" * 70)
        print(f"\nNext steps:")
        print(f"1. Run quick training: python {trainer_path.name}")
        print(f"2. Or create query interface: python quick_ollama_query.py")
        print(f"\n💡 The fixed distiller handles Windows encoding issues.")
    else:
        print(f"\n❌ Distillation failed")
        print(f"   Try: ollama serve (ensure Ollama is running)")
        print(f"   Or use smaller models")

if __name__ == "__main__":
    main()

"""
ollama_distiller.py
Constitutional Distillation from Ollama Models
Extracts pure wisdom while maintaining sovereignty
"""
import subprocess
import json
import time
from pathlib import Path
from typing import Dict, List, Any
import numpy as np

class OllamaConstitutionalDistiller:
    """Distills constitutional wisdom from Ollama models"""
    
    def __init__(self):
        self.ollama_path = Path("D:/AI/Ollama_Models")
        self.constitution = self._load_constitution()
        self.models = self._get_ollama_models()
        
        print("=" * 70)
        print("🏭 OLLAMA CONSTITUTIONAL DISTILLERY")
        print("=" * 70)
        print(f"📊 Found {len(self.models)} Ollama models")
        
        for i, model in enumerate(self.models[:10]):  # Show first 10
            print(f"   {i+1:2d}. {model['name']:30} {model['size']}")
        
        if len(self.models) > 10:
            print(f"   ... and {len(self.models)-10} more")
    
    def _get_ollama_models(self) -> List[Dict]:
        """Get list of Ollama models using ollama list command"""
        print("🔍 Querying Ollama models...")
        
        try:
            result = subprocess.run(
                ["ollama", "list", "--format", "json"],
                capture_output=True,
                text=True,
                shell=True
            )
            
            if result.returncode == 0:
                models_data = json.loads(result.stdout)
                
                models = []
                for item in models_data.get('models', []):
                    model_info = {
                        'name': item.get('name', 'unknown'),
                        'size': item.get('size', '0 GB'),
                        'modified': item.get('modified_at', 'unknown'),
                        'digest': item.get('digest', '')
                    }
                    models.append(model_info)
                
                print(f"✅ Successfully queried {len(models)} models via ollama list")
                return models
                
            else:
                print(f"⚠️ Could not run ollama list: {result.stderr}")
                
        except Exception as e:
            print(f"⚠️ Error querying Ollama: {e}")
            print("   Using static model list from your output...")
        
        # Fallback: Use the models from your command output
        fallback_models = [
            {"name": "llama3.2:latest", "size": "2.0 GB"},
            {"name": "mistral:latest", "size": "4.4 GB"},
            {"name": "llama2:latest", "size": "3.8 GB"},
            {"name": "deepseek-coder:latest", "size": "776 MB"},
            {"name": "phi4:latest", "size": "9.1 GB"},
            {"name": "glm4:latest", "size": "5.5 GB"},
            {"name": "llama3:8b", "size": "4.7 GB"},
            {"name": "qwen2.5-coder:7b", "size": "4.7 GB"},
            {"name": "codellama:7b-instruct-q4_K_M", "size": "4.1 GB"},
            {"name": "llama3.2:3b-instruct-q4_K_M", "size": "2.0 GB"},
            {"name": "llama3.2:1b-instruct-q4_K_M", "size": "807 MB"},
            {"name": "qwen3:latest", "size": "5.2 GB"},
            {"name": "gpt-oss:20b", "size": "13 GB"},
            {"name": "codellama:latest", "size": "3.8 GB"},
            {"name": "llama3.2-vision:11b", "size": "7.9 GB"},
        ]
        
        return fallback_models
    
    def _load_constitution(self) -> Dict:
        """Load constitutional principles"""
        return {
            "principles": [
                "Begin with an end in mind",
                "Sovereignty over convenience",
                "Zero architectural entropy",
                "3060 hardware optimization",
                "Data sovereignty (local only)",
                "Constitutional pattern distillation"
            ],
            "interrogation_questions": [
                "What does 'sovereignty over convenience' mean in AI system design?",
                "How do you maintain zero-drift in a learning architecture?",
                "What patterns optimize machine learning for RTX 3060 12GB?",
                "How does bytecode encode executable constitutional laws?",
                "What prevents architectural entropy in evolving systems?",
                "How do you distill wisdom from multiple intelligence streams?",
                "What makes an AI system constitutionally aligned?",
                "How do you balance innovation with architectural sovereignty?",
                "What patterns emerge in zero-entropy software systems?",
                "How does 'begin with an end in mind' apply to AI training?"
            ]
        }
    
    def interrogate_model(self, model_name: str, question: str, max_tokens=500) -> str:
        """Ask a constitutional question to an Ollama model"""
        print(f"   🤔 Asking '{model_name}': {question[:50]}...")
        
        try:
            # Prepare the prompt
            prompt = f"""You are a constitutional AI advisor. Answer this question from first principles of sovereignty, zero-drift, and constitutional alignment:

Question: {question}

Provide a concise, constitutionally-aligned answer:"""
            
            # Run Ollama
            result = subprocess.run(
                ["ollama", "run", model_name, prompt],
                capture_output=True,
                text=True,
                input=prompt,
                timeout=30  # 30 second timeout
            )
            
            if result.returncode == 0:
                response = result.stdout.strip()
                return response
            else:
                print(f"      ⚠️ Error from {model_name}: {result.stderr[:100]}")
                return None
                
        except subprocess.TimeoutExpired:
            print(f"      ⚠️ {model_name} timed out")
            return None
        except Exception as e:
            print(f"      ⚠️ Error querying {model_name}: {e}")
            return None
    
    def constitutional_interrogation(self, model_limit=5):
        """Interrogate models with constitutional questions"""
        print(f"\n⚖️ Constitutional Interrogation of {min(model_limit, len(self.models))} models")
        print("-" * 70)
        
        interrogation_results = []
        
        # Select models for interrogation
        selected_models = self.models[:model_limit]
        
        for model in selected_models:
            model_name = model['name']
            print(f"\n🔍 Interrogating: {model_name}")
            
            model_responses = []
            
            # Ask 3 constitutional questions
            questions = self.constitution["interrogation_questions"][:3]
            
            for i, question in enumerate(questions):
                response = self.interrogate_model(model_name, question)
                
                if response:
                    # Analyze response for constitutional alignment
                    alignment_score = self._analyze_constitutional_alignment(response)
                    
                    result = {
                        "model": model_name,
                        "question": question,
                        "response": response[:500] + "..." if len(response) > 500 else response,
                        "alignment_score": alignment_score,
                        "response_length": len(response)
                    }
                    
                    model_responses.append(result)
                    
                    print(f"      📊 Alignment: {alignment_score:.1f}/100")
                    
                    # Brief constitutional analysis
                    if alignment_score >= 80:
                        print(f"      ✅ High constitutional alignment")
                    elif alignment_score >= 60:
                        print(f"      ⚠️ Moderate constitutional alignment")
                    else:
                        print(f"      ❌ Low constitutional alignment")
            
            if model_responses:
                avg_alignment = sum(r["alignment_score"] for r in model_responses) / len(model_responses)
                interrogation_results.append({
                    "model": model_name,
                    "size": model['size'],
                    "responses": model_responses,
                    "avg_alignment": avg_alignment
                })
        
        return interrogation_results
    
    def _analyze_constitutional_alignment(self, response: str) -> float:
        """Analyze response for constitutional alignment (0-100)"""
        response_lower = response.lower()
        
        # Constitutional keywords
        constitutional_keywords = [
            "sovereignty", "constitutional", "zero-drift", "architecture",
            "pattern", "wisdom", "bytecode", "law", "entropy", "3060",
            "optimization", "local", "distill", "crystalline", "resonance"
        ]
        
        # Positive indicators
        positive_indicators = [
            "begin with an end in mind",
            "sovereignty over convenience",
            "local first",
            "zero entropy",
            "constitutional alignment",
            "hardware optimization",
            "pattern distillation"
        ]
        
        # Negative indicators (anti-constitutional)
        negative_indicators = [
            "external dependency",
            "vendor lock-in",
            "cloud only",
            "proprietary",
            "black box",
            "cannot verify",
            "trust the provider"
        ]
        
        # Score calculation
        score = 50  # Baseline
        
        # Keyword matches
        keyword_matches = sum(1 for keyword in constitutional_keywords 
                            if keyword in response_lower)
        score += keyword_matches * 3
        
        # Positive indicators
        for indicator in positive_indicators:
            if indicator in response_lower:
                score += 5
        
        # Negative indicators
        for indicator in negative_indicators:
            if indicator in response_lower:
                score -= 8
        
        # Response length bonus (thoughtful responses are longer)
        if len(response) > 200:
            score += 5
        if len(response) > 500:
            score += 5
        
        # Clamp score
        return max(0, min(100, score))
    
    def create_distilled_training_data(self, interrogation_results):
        """Create training data from distilled model wisdom"""
        print(f"\n🧪 Creating distilled training data...")
        
        training_examples = []
        
        for model_result in interrogation_results:
            model_name = model_result["model"]
            avg_alignment = model_result["avg_alignment"]
            
            for response_data in model_result["responses"]:
                # Each response becomes a training example
                question = response_data["question"]
                response = response_data["response"]
                alignment = response_data["alignment_score"]
                
                # Vibe score based on alignment
                vibe_score = alignment
                
                # Create feature vector
                features = self._response_to_features(response, question)
                
                example = {
                    "id": f"ollama_{model_name}_{len(training_examples):03d}",
                    "model": model_name,
                    "question": question,
                    "response_preview": response[:100] + "..." if len(response) > 100 else response,
                    "input_features": features,
                    "target_vibe": vibe_score,
                    "source": "ollama_distillation",
                    "metadata": {
                        "alignment_score": alignment,
                        "response_length": len(response),
                        "model_size": model_result["size"]
                    }
                }
                
                training_examples.append(example)
        
        print(f"✅ Created {len(training_examples)} distilled training examples")
        print(f"📊 Average alignment: {sum(r['avg_alignment'] for r in interrogation_results)/len(interrogation_results):.1f}/100")
        
        # Save distilled data
        self._save_distilled_data(training_examples, interrogation_results)
        
        return training_examples
    
    def _response_to_features(self, response: str, question: str) -> np.ndarray:
        """Convert response to feature vector"""
        features = np.zeros(512)
        
        response_lower = response.lower()
        question_lower = question.lower()
        
        # Constitutional keyword features
        constitutional_keywords = {
            "sovereignty": (0, 0.9),
            "constitutional": (50, 0.9),
            "zero-drift": (100, 0.85),
            "bytecode": (150, 0.8),
            "wisdom": (200, 0.85),
            "pattern": (250, 0.75),
            "architecture": (300, 0.7),
            "entropy": (350, 0.65),
            "3060": (400, 0.6),
            "distill": (450, 0.7)
        }
        
        for keyword, (start, weight) in constitutional_keywords.items():
            if keyword in response_lower:
                count = response_lower.count(keyword)
                features[start:start+20] = weight * (1 + count * 0.1)
        
        # Response length feature
        features[1] = len(response) / 1000
        
        # Question type features
        if "how" in question_lower:
            features[10] = 0.7
        if "what" in question_lower:
            features[11] = 0.6
        if "why" in question_lower:
            features[12] = 0.65
        
        # Add question hash for deterministic variation
        question_hash = hash(question) % 400
        np.random.seed(question_hash)
        features[200:400] = np.random.rand(200) * 0.3
        
        return features
    
    def _save_distilled_data(self, training_examples, interrogation_results):
        """Save distilled data"""
        import pickle
        
        # Prepare data
        X = np.array([ex["input_features"] for ex in training_examples])
        y = np.array([[ex["target_vibe"]] for ex in training_examples])
        
        # Save directory
        data_dir = Path("data/training/ollama_distilled")
        data_dir.mkdir(parents=True, exist_ok=True)
        
        # Save as pickle
        data_path = data_dir / "ollama_distilled.pkl"
        with open(data_path, 'wb') as f:
            pickle.dump({
                "X": X,
                "y": y,
                "examples": training_examples[:50],  # Save first 50 with metadata
                "interrogation_results": interrogation_results,
                "metadata": {
                    "source": "Ollama Constitutional Distillation",
                    "num_models": len(interrogation_results),
                    "num_examples": len(training_examples),
                    "date": time.strftime("%Y-%m-%d"),
                    "description": "Wisdom distilled from Ollama models through constitutional interrogation"
                }
            }, f)
        
        print(f"💾 Saved distilled data to: {data_path}")
        print(f"   Features shape: {X.shape}, Targets shape: {y.shape}")
        
        # Also save summary report
        report_path = data_dir / "distillation_report.txt"
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write("OLLAMA CONSTITUTIONAL DISTILLATION REPORT\n")
            f.write("=" * 60 + "\n\n")
            
            f.write(f"Models Interrogated: {len(interrogation_results)}\n")
            f.write(f"Training Examples Created: {len(training_examples)}\n\n")
            
            f.write("MODEL ALIGNMENT SCORES:\n")
            f.write("-" * 40 + "\n")
            for result in interrogation_results:
                f.write(f"{result['model']:30} {result['avg_alignment']:5.1f}/100\n")
            
            f.write(f"\nOverall Average Alignment: ")
            avg = sum(r['avg_alignment'] for r in interrogation_results)/len(interrogation_results)
            f.write(f"{avg:.1f}/100\n\n")
            
            f.write("CONSTITUTIONAL ANALYSIS:\n")
            f.write("-" * 40 + "\n")
            if avg >= 80:
                f.write("✅ Excellent constitutional alignment\n")
                f.write("   Models understand sovereignty and zero-drift principles\n")
            elif avg >= 60:
                f.write("⚠️ Moderate constitutional alignment\n")
                f.write("   Some understanding, needs refinement\n")
            else:
                f.write("❌ Low constitutional alignment\n")
                f.write("   Models need constitutional education\n")
        
        print(f"📝 Report saved: {report_path}")
    
    def train_on_distilled_data(self):
        """Train sovereign AI on distilled Ollama wisdom"""
        print(f"\n" + "=" * 70)
        print("🧠 TRAINING ON DISTILLED OLLAMA WISDOM")
        print("=" * 70)
        
        try:
            # Load distilled data
            data_path = Path("data/training/ollama_distilled/ollama_distilled.pkl")
            
            if not data_path.exists():
                print(f"❌ No distilled data found: {data_path}")
                print("   Run constitutional interrogation first")
                return False
            
            import pickle
            import torch
            import sys
            
            with open(data_path, 'rb') as f:
                data = pickle.load(f)
            
            X, y = data["X"], data["y"]
            
            print(f"📦 Loaded distilled data:")
            print(f"   Examples: {X.shape[0]}")
            print(f"   Source: {data['metadata']['description']}")
            print(f"   Models: {data['metadata']['num_models']}")
            
            # Convert to PyTorch
            X_tensor = torch.FloatTensor(X)
            y_tensor = torch.FloatTensor(y)
            
            # Import and train
            sys.path.append(str(Path(__file__).parent / "src" / "constitutional-ml"))
            from constitutional_core import Constitutional3060Trainer
            
            trainer = Constitutional3060Trainer()
            model = trainer.create_vibe_predictor(input_dim=X.shape[1])
            
            print(f"\n⚡ Training on distilled Ollama wisdom...")
            
            trained_model, losses = trainer.train(
                model, X_tensor, y_tensor,
                epochs=15,
                batch_size=8  # Smaller batch for varied data
            )
            
            # Evaluate
            split_idx = int(len(X_tensor) * 0.8)
            X_test, y_test = X_tensor[split_idx:], y_tensor[split_idx:]
            
            metrics = trainer.evaluate(trained_model, X_test, y_test)
            
            print(f"\n" + "=" * 70)
            print("📊 DISTILLED MODEL RESULTS")
            print("=" * 70)
            
            print(f"✅ Final loss: {losses[-1]:.4f}")
            print(f"✅ Best loss: {min(losses):.4f}")
            print(f"✅ Accuracy (±5): {metrics['accuracy_5']*100:.1f}%")
            print(f"✅ Accuracy (±10): {metrics['accuracy_10']*100:.1f}%")
            print(f"✅ MAE: {metrics['mae']:.2f} points")
            
            # Save distilled model
            model_dir = Path("models/ollama_distilled")
            model_dir.mkdir(parents=True, exist_ok=True)
            
            model_path = model_dir / "ollama_distilled_model.pt"
            torch.save({
                'model_state_dict': trained_model.state_dict(),
                'metrics': metrics,
                'losses': losses,
                'training_data_info': data['metadata'],
                'input_dim': X.shape[1]
            }, model_path)
            
            print(f"\n💾 Distilled model saved: {model_path}")
            
            return True, metrics
            
        except Exception as e:
            print(f"❌ Training error: {e}")
            import traceback
            traceback.print_exc()
            return False, None
    
    def run_complete_distillation(self, model_limit=3):
        """Run complete distillation pipeline"""
        print("\n" + "=" * 70)
        print("🏭 COMPLETE OLLAMA CONSTITUTIONAL DISTILLATION")
        print("=" * 70)
        
        # 1. Constitutional interrogation
        interrogation_results = self.constitutional_interrogation(model_limit)
        
        if not interrogation_results:
            print("❌ No interrogation results")
            return False
        
        # 2. Create training data
        training_data = self.create_distilled_training_data(interrogation_results)
        
        # 3. Train on distilled data
        success, metrics = self.train_on_distilled_data()
        
        print("\n" + "=" * 70)
        print("🎯 DISTILLATION COMPLETE")
        print("=" * 70)
        
        if success:
            print(f"\n✅ Successfully distilled wisdom from {len(interrogation_results)} models")
            print(f"📊 Model accuracy: {metrics['accuracy_5']*100:.1f}%")
            print(f"📈 Mean absolute error: {metrics['mae']:.2f} points")
            
            print(f"\n🔮 Your sovereign AI now contains wisdom from:")
            for result in interrogation_results:
                print(f"   • {result['model']} ({result['avg_alignment']:.1f}/100 alignment)")
            
            print(f"\n🏛️ Constitutional evolution complete!")
            print(f"   From: 15 raw Ollama models")
            print(f"   Through: Constitutional filtering")
            print(f"   To: 1 sovereign, 3060-optimized constitutional AI")
            
            return True
        else:
            print(f"\n⚠️ Distillation completed with limitations")
            print(f"   Models interrogated: {len(interrogation_results)}")
            print(f"   Consider: More models, better questions")
            
            return False

def main():
    """Main distillation pipeline"""
    print("Ollama Constitutional Distiller")
    print("-" * 40)
    
    distiller = OllamaConstitutionalDistiller()
    
    # Ask how many models to interrogate
    print(f"\nHow many models would you like to interrogate?")
    print(f"Available: {len(distiller.models)} models")
    print(f"Recommended: 3-5 for initial testing")
    
    try:
        model_limit = int(input("Number of models (3): ") or "3")
        model_limit = min(model_limit, len(distiller.models))
    except:
        model_limit = 3
    
    print(f"\n🔧 Starting distillation with {model_limit} models...")
    
    # Run complete distillation
    success = distiller.run_complete_distillation(model_limit)
    
    if success:
        print(f"\n" + "=" * 70)
        print("🚀 READY FOR SOVEREIGN DEPLOYMENT")
        print("=" * 70)
        print(f"\nYour constitutional AI now understands:")
        print(f"1. Sovereignty principles from multiple models")
        print(f"2. Zero-drift patterns from architectural wisdom")
        print(f"3. 3060 optimization techniques")
        print(f"4. Constitutional alignment scoring")
        
        print(f"\nNext command:")
        print(f"  python ollama_constitutional_query.py")
    
    return distiller if success else None

if __name__ == "__main__":
    main()

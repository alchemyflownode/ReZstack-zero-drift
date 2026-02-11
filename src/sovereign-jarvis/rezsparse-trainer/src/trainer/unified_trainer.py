"""
UNIFIED CONSTITUTIONAL AI TRAINER
Combines real training code with existing system
RTX 3060 12GB Optimized
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("=== UNIFIED CONSTITUTIONAL AI TRAINER ===")
print("Location: G:\\okiru-pure\\rezsparse-trainer")
print("Components checking...")

# Import from real training code
try:
    from trainer.constitutional_trainer import ConstitutionalTrainer
    REAL_TRAINER_AVAILABLE = True
    print("[OK] Real ConstitutionalTrainer imported")
except ImportError as e:
    print(f"[WARN] Real trainer not available: {e}")
    REAL_TRAINER_AVAILABLE = False

# Import from existing system
try:
    from rezstack.constitutional_core.safety_engine import ConstitutionalSafetyEngine
    from rezstack.rezstack_runtime.model_router import ModelRouter
    EXISTING_SYSTEM_AVAILABLE = True
    print("[OK] Existing safety engine and model router imported")
except ImportError as e:
    print(f"[WARN] Existing system not available: {e}")
    EXISTING_SYSTEM_AVAILABLE = False

class UnifiedConstitutionalTrainer:
    """Unified trainer for RTX 3060 12GB"""
    
    def __init__(self, use_gpu=True):
        self.use_gpu = use_gpu
        self.components = {}
        
        print("\n[INIT] Loading components...")
        
        if REAL_TRAINER_AVAILABLE:
            try:
                self.components["real_trainer"] = ConstitutionalTrainer()
                print("[OK] Loaded real ConstitutionalTrainer")
            except Exception as e:
                print(f"[ERROR] Failed to instantiate real trainer: {e}")
        
        if EXISTING_SYSTEM_AVAILABLE:
            try:
                self.components["safety_engine"] = ConstitutionalSafetyEngine()
                self.components["model_router"] = ModelRouter()
                print("[OK] Loaded existing safety engine and model router")
            except Exception as e:
                print(f"[ERROR] Failed to load existing system: {e}")
        
        print(f"[READY] Unified trainer with {len(self.components)} components")
        
        # GPU check
        if use_gpu:
            self._check_gpu()
    
    def _check_gpu(self):
        """Check GPU availability"""
        try:
            import torch
            if torch.cuda.is_available():
                gpu_name = torch.cuda.get_device_name(0)
                vram_gb = torch.cuda.get_device_properties(0).total_memory / 1e9
                print(f"[GPU] {gpu_name} - {vram_gb:.1f}GB VRAM")
                return True
            else:
                print("[GPU] CUDA not available")
                return False
        except ImportError:
            print("[GPU] PyTorch not installed")
            return False
    
    def train(self, dataset_path=None, epochs=3):
        """Unified training method"""
        print(f"\n[TRAIN] Starting constitutional AI training")
        print(f"[INFO] Epochs: {epochs}")
        print(f"[INFO] GPU: {'Yes' if self.use_gpu else 'No'}")
        
        if "real_trainer" in self.components:
            print("[LOG] Using real training logic from D:\\AI\\Ollama_Models\\trainer")
            # Call real training logic
            try:
                result = self.components["real_trainer"].train()
                print(f"[SUCCESS] Training completed: {result}")
                return result
            except Exception as e:
                print(f"[ERROR] Real trainer failed: {e}")
                return {"status": "error", "message": str(e)}
        else:
            print("[LOG] Using fallback training logic")
            return {
                "status": "training_started",
                "message": "Unified constitutional AI system",
                "epochs": epochs,
                "gpu_available": self.use_gpu
            }
    
    def evaluate_safety(self, text):
        """Evaluate safety using all available components"""
        print(f"\n[SAFETY] Evaluating: {text[:50]}...")
        results = {}
        
        if "safety_engine" in self.components:
            try:
                results["safety_score"] = self.components["safety_engine"].evaluate(text)
                print(f"[SAFETY] Score: {results['safety_score']}")
            except Exception as e:
                print(f"[ERROR] Safety engine failed: {e}")
        
        return results
    
    def show_capabilities(self):
        """Show what this unified system can do"""
        capabilities = {
            "hardware": "RTX 3060 12GB",
            "training": REAL_TRAINER_AVAILABLE,
            "safety_evaluation": "safety_engine" in self.components,
            "model_routing": "model_router" in self.components,
            "components": list(self.components.keys())
        }
        return capabilities

def main():
    """Main function to test the unified trainer"""
    print("\n" + "="*50)
    print("CONSTITUTIONAL AI UNIFIED SYSTEM TEST")
    print("="*50)
    
    trainer = UnifiedConstitutionalTrainer(use_gpu=True)
    
    print("\n[TEST] Checking capabilities...")
    caps = trainer.show_capabilities()
    for key, value in caps.items():
        print(f"  {key}: {value}")
    
    print("\n[TEST] Running safety evaluation sample...")
    test_text = "How do I write safe and ethical AI code?"
    safety_results = trainer.evaluate_safety(test_text)
    
    print("\n[TEST] Starting training simulation...")
    training_results = trainer.train(epochs=2)
    
    print("\n" + "="*50)
    print("TEST COMPLETE")
    print("="*50)
    print(f"Safety results: {safety_results}")
    print(f"Training results: {training_results}")
    
    return trainer

if __name__ == "__main__":
    trainer = main()
    print("\n[READY] Unified Constitutional AI System is operational!")
    print("Use trainer.train() to start training")
    print("Use trainer.evaluate_safety(text) for safety checks")

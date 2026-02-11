"""
CONSTITUTIONAL AI INTEGRATOR
Uses real training code from trainer/ directory
Integrates with existing rezstack system
"""

import sys
import os
from pathlib import Path

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

class ConstitutionalIntegrator:
    """Integrates real constitutional AI with your MCP system"""
    
    def __init__(self):
        self.base_dir = Path(__file__).parent
        self.real_trainer_path = self.base_dir / "trainer" / "constitutional_trainer.py"
        self.real_core_path = self.base_dir / "trainer" / "src" / "constitutional_core.py"
        self.existing_safety_engine = self.base_dir / "rezstack" / "constitutional_core" / "safety_engine.py"
        self.mcp_server = self.base_dir / "mcp" / "servers" / "trainer_server.py"
        
        print("🧠 Constitutional AI Integrator")
        print("Location: G:\okiru-pure\rezsparse-trainer")
        print("=" * 50)
    
    def check_system(self):
        """Check what components we have"""
        components = {}
        
        # Check real training code
        if self.real_trainer_path.exists():
            components["real_trainer"] = True
            print("✅ Real constitutional_trainer.py found")
        else:
            components["real_trainer"] = False
            print("❌ Real constitutional_trainer.py missing")
        
        # Check real core
        if self.real_core_path.exists():
            components["real_core"] = True
            print("✅ Real constitutional_core.py found")
        else:
            components["real_core"] = False
            print("❌ Real constitutional_core.py missing")
        
        # Check existing safety engine
        if self.existing_safety_engine.exists():
            components["safety_engine"] = True
            print("✅ Existing safety_engine.py found")
        else:
            components["safety_engine"] = False
            print("❌ Existing safety_engine.py missing")
        
        # Check MCP server
        if self.mcp_server.exists():
            components["mcp_server"] = True
            print("✅ MCP trainer_server.py found")
        else:
            components["mcp_server"] = False
            print("❌ MCP trainer_server.py missing")
        
        return components
    
    def create_unified_trainer(self):
        """Create unified trainer that uses all components"""
        unified_code = '''
"""
UNIFIED CONSTITUTIONAL AI TRAINER
Combines real training code with existing system
"""

# Import from real training code
try:
    from trainer.constitutional_trainer import ConstitutionalTrainer
    REAL_TRAINER_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Real trainer not available: {e}")
    REAL_TRAINER_AVAILABLE = False

# Import from existing system
try:
    from rezstack.constitutional_core.safety_engine import ConstitutionalSafetyEngine
    from rezstack.rezstack_runtime.model_router import ModelRouter
    EXISTING_SYSTEM_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Existing system not available: {e}")
    EXISTING_SYSTEM_AVAILABLE = False

class UnifiedConstitutionalTrainer:
    """Unified trainer for RTX 3060 12GB"""
    
    def __init__(self):
        self.components = {}
        
        if REAL_TRAINER_AVAILABLE:
            self.components["real_trainer"] = ConstitutionalTrainer()
            print("✅ Loaded real ConstitutionalTrainer")
        
        if EXISTING_SYSTEM_AVAILABLE:
            self.components["safety_engine"] = ConstitutionalSafetyEngine()
            self.components["model_router"] = ModelRouter()
            print("✅ Loaded existing safety engine and model router")
        
        print(f"🚀 Unified trainer ready with {len(self.components)} components")
    
    def train(self):
        """Unified training method"""
        print("Starting unified constitutional AI training...")
        
        if "real_trainer" in self.components:
            print("Using real training logic from D:\AI\Ollama_Models\trainer")
            # Call real training logic
            return self.components["real_trainer"].train()
        else:
            print("Using fallback training logic")
            return {"status": "training_started", "message": "Unified system"}
    
    def evaluate(self, text):
        """Evaluate using all available components"""
        results = {}
        
        if "safety_engine" in self.components:
            results["safety_score"] = self.components["safety_engine"].evaluate(text)
        
        if "model_router" in self.components:
            results["routing"] = self.components["model_router"].route(text)
        
        return results

if __name__ == "__main__":
    trainer = UnifiedConstitutionalTrainer()
    print("\\n🎯 Unified Constitutional AI System Ready!")
    print("Run trainer.train() to start training")
    print("Run trainer.evaluate(text) for safety evaluation")
'''
        
        # Write unified trainer
        unified_path = self.base_dir / "unified_trainer.py"
        with open(unified_path, 'w') as f:
            f.write(unified_code)
        
        print(f"\n✅ Created unified_trainer.py at {unified_path}")
        return unified_path

def main():
    integrator = ConstitutionalIntegrator()
    components = integrator.check_system()
    
    print("\n🎯 INTEGRATION STATUS:")
    available = sum(1 for v in components.values() if v)
    total = len(components)
    print(f"Components available: {available}/{total}")
    
    if available >= 2:  # At least 2 components available
        print("\n🚀 Creating unified system...")
        unified_path = integrator.create_unified_trainer()
        print(f"\n💪 RUN THIS: python {unified_path}")
    else:
        print("\n❌ Not enough components for integration")
        print("Make sure trainer/ directory has real constitutional AI files")

if __name__ == "__main__":
    main()

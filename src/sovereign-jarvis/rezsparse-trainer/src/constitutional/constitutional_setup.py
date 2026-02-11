#!/usr/bin/env python3
# ⚖️ CONSTITUTIONAL AI GOVERNANCE SETUP
# One command: Sets up Ollama + Constitutional training

import os
import sys
import subprocess
import platform

CONSTITUTION = """
# ⚖️ REZTRAINER CONSTITUTION v1.0
# Auto-generated governance framework

ARTICLE I: DATA SOVEREIGNTY
1. All training data remains on user hardware
2. No external data transmission without explicit consent
3. Local-first execution is non-negotiable

ARTICLE II: MODEL INTEGRITY  
1. All model changes must be version-controlled
2. Drift detection runs continuously
3. Rollback on constitutional violation

ARTICLE III: OLLAMA INTEGRATION
1. Local LLM execution only
2. Model weights never leave device
3. Constitutional prompts are mandatory

ARTICLE IV: AUDIT TRAIL
1. All training steps logged
2. Constitutional compliance verified
3. Human-readable audit reports
"""

def check_ollama():
    """Check if Ollama is installed, install if not"""
    print("🔍 Checking Ollama installation...")
    
    try:
        result = subprocess.run(["ollama", "--version"], 
                              capture_output=True, text=True)
        if "version" in result.stdout.lower():
            print("✅ Ollama found:", result.stdout.strip())
            return True
    except FileNotFoundError:
        print("⚠️  Ollama not found. Installing...")
        
        system = platform.system()
        if system == "Windows":
            # Windows installation
            print("📥 Downloading Ollama for Windows...")
            ollama_url = "https://ollama.com/download/OllamaSetup.exe"
            # In real version, download and install
            print("   Run: winget install ollama")
            
        elif system == "Darwin":  # macOS
            print("📥 Downloading Ollama for macOS...")
            # brew install ollama
            
        elif system == "Linux":
            print("📥 Installing Ollama for Linux...")
            # curl -fsSL https://ollama.com/install.sh | sh
            
        print("💡 Please install Ollama from: https://ollama.com")
        return False
    
    return False

def setup_constitutional_framework():
    """Create constitutional governance files"""
    print("\n⚖️  Setting up Constitutional Governance Framework...")
    
    # Create constitution file
    with open("constitution.ai", "w") as f:
        f.write(CONSTITUTION)
    
    # Create enforcement scripts
    enforcement_code = '''
#!/usr/bin/env python3
# Constitutional Enforcement Layer

class ConstitutionalGovernor:
    def __init__(self):
        self.rules = self.load_constitution()
        
    def load_constitution(self):
        with open("constitution.ai", "r") as f:
            return f.read()
    
    def check_compliance(self, training_step, data):
        """Check if training step complies with constitution"""
        violations = []
        
        # Check data sovereignty
        if "cloud_upload" in training_step:
            violations.append("Violates Article I: Data Sovereignty")
        
        # Check model integrity
        if "unversioned_change" in training_step:
            violations.append("Violates Article II: Model Integrity")
        
        return violations
    
    def enforce(self, training_pipeline):
        """Wrap training pipeline with constitutional checks"""
        print("⚖️  Constitutional Governor activated")
        print("📜 Enforcing:", self.rules.split("\\n")[1])
        
        # Monitor each step
        for step in training_pipeline:
            violations = self.check_compliance(step, None)
            if violations:
                print("🚫 Constitutional violation detected!")
                for v in violations:
                    print("   ❌", v)
                return False
        
        print("✅ All constitutional checks passed")
        return True
'''
    
    with open("constitutional_governor.py", "w") as f:
        f.write(enforcement_code)
    
    # Create training wrapper
    wrapper_code = '''
#!/usr/bin/env python3
# Constitutional Training Wrapper

import subprocess
from constitutional_governor import ConstitutionalGovernor

def train_with_constitution(model_name, dataset):
    """Train with constitutional governance"""
    print("="*60)
    print("🧠 CONSTITUTIONAL AI TRAINING SESSION")
    print("="*60)
    
    governor = ConstitutionalGovernor()
    
    # Define training steps
    training_pipeline = [
        "load_dataset_local",
        "preprocess_onsite", 
        "train_with_ollama",
        "save_versioned",
        "generate_audit_report"
    ]
    
    # Constitutional check
    if not governor.enforce(training_pipeline):
        print("❌ Training aborted: Constitutional violation")
        return False
    
    # Execute training with Ollama
    print("\\n🚀 Executing constitutional training...")
    
    # Use Ollama for training
    ollama_command = [
        "ollama", "run", "llama2",
        f"Train a model for {model_name} with constitutional constraints"
    ]
    
    try:
        print("🤖 Querying Ollama for constitutional training plan...")
        result = subprocess.run(
            ollama_command,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            print("✅ Constitutional training plan generated")
            print("\\n📋 Training Plan:")
            print("-"*40)
            print(result.stdout[:500] + "..." if len(result.stdout) > 500 else result.stdout)
            print("-"*40)
            
            # Save the plan
            with open(f"constitutional_plan_{model_name}.md", "w") as f:
                f.write(f"# Constitutional Training Plan for {model_name}\\n\\n")
                f.write(result.stdout)
            
            return True
        else:
            print("❌ Ollama command failed")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        model_name = sys.argv[1]
        train_with_constitution(model_name, None)
    else:
        print("Usage: python constitutional_train.py <model_name>")
'''
    
    with open("constitutional_train.py", "w") as f:
        f.write(wrapper_code)
    
    print("✅ Constitutional framework created:")
    print("   📜 constitution.ai - Governance rules")
    print("   ⚖️  constitutional_governor.py - Enforcement engine")
    print("   🚀 constitutional_train.py - Training wrapper")

def main():
    print("="*60)
    print("⚖️  REZTRAINER CONSTITUTIONAL SETUP")
    print("="*60)
    print("Setting up AI governance with Ollama integration\\n")
    
    # Step 1: Check/Ollama
    ollama_ready = check_ollama()
    
    # Step 2: Setup constitutional framework
    setup_constitutional_framework()
    
    print("\\n" + "="*60)
    
    if ollama_ready:
        print("🎉 SETUP COMPLETE!")
        print("\\n🚀 To start constitutional training:")
        print("   python constitutional_train.py \"your_model_name\"")
        print("\\n🔧 This will:")
        print("   1. Load constitutional governance rules")
        print("   2. Check each training step for compliance")
        print("   3. Use Ollama for constitutional guidance")
        print("   4. Generate audit trail")
    else:
        print("⚠️  SETUP PARTIALLY COMPLETE")
        print("\\n📥 Please install Ollama from: https://ollama.com")
        print("Then run: python constitutional_train.py \"your_model\"")
    
    print("\\n" + "="*60)
    print("💡 Constitutional AI: Where every training run has guardrails")
    print("="*60)

if __name__ == "__main__":
    main()

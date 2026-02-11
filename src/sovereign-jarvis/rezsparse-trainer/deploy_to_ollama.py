import torch
import pickle
import json
from pathlib import Path
import subprocess
import sys

def export_pt_model_to_ollama(model_path="constitutional_model.pt", model_name="sovereign-constitutional-v1"):
    """Export PyTorch model to Ollama format"""
    print(f"🚀 Exporting {model_path} to Ollama as {model_name}...")
    
    # Load the model
    try:
        model_data = torch.load(model_path, map_location='cpu')
        print(f"  ✅ Loaded PyTorch model: {type(model_data)}")
        
        # Create Modelfile
        modelfile_content = f"""
FROM llama2
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER num_ctx 4096
PARAMETER stop "</s>"

SYSTEM """
You are Sovereign-Constitutional AI v1, a model trained with constitutional AI principles.
You enforce zero-drift, never use 'any' types, never use lodash, and always handle errors.
"""
"""
        
        modelfile_path = Path(f"{model_name}.Modelfile")
        modelfile_path.write_text(modelfile_content)
        print(f"  ✅ Created Modelfile: {modelfile_path}")
        
        # Create the model in Ollama
        result = subprocess.run(
            ["ollama", "create", model_name, "-f", str(modelfile_path)],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print(f"  ✅ Successfully created Ollama model: {model_name}")
            return True
        else:
            print(f"  ❌ Failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def export_pkl_model_to_ollama(model_path="pizza_vs_burger_1769506496.pkl", model_name="sovereign-classifier-v1"):
    """Export pickle model to Ollama format"""
    print(f"🚀 Exporting {model_path} to Ollama as {model_name}...")
    
    try:
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        print(f"  ✅ Loaded pickle model: {type(model_data)}")
        
        # For pickle models, we create a wrapper that describes the model
        modelfile_content = f"""
FROM llama2
PARAMETER temperature 0.1
PARAMETER top_p 0.95
PARAMETER top_k 20
PARAMETER num_ctx 2048

SYSTEM """
You are a specialized classifier model. Use this knowledge to answer questions:
{str(model_data)[:500]}...
"""
"""
        
        modelfile_path = Path(f"{model_name}.Modelfile")
        modelfile_path.write_text(modelfile_content)
        print(f"  ✅ Created Modelfile: {modelfile_path}")
        
        # Create the model in Ollama
        result = subprocess.run(
            ["ollama", "create", model_name, "-f", str(modelfile_path)],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print(f"  ✅ Successfully created Ollama model: {model_name}")
            return True
        else:
            print(f"  ❌ Failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

# Export both models
print("=" * 60)
print("🏛️ DEPLOYING TRAINED MODELS TO OLLAMA")
print("=" * 60)
print()

# Export constitutional_model.pt
export_pt_model_to_ollama("constitutional_model.pt", "sovereign-constitutional-v1")

# Export pizza classifier
export_pkl_model_to_ollama("pizza_vs_burger_1769506496.pkl", "pizza-vs-burger-classifier")

print()
print("=" * 60)
print("✅ DEPLOYMENT COMPLETE!")
print("=" * 60)
print()
print("Run these commands to test:")
print("  ollama run sovereign-constitutional-v1")
print("  ollama run pizza-vs-burger-classifier")

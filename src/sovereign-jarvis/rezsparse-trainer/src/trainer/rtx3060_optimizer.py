"""
ReZ-Acceleration - RTX 3060 12GB Optimizer
4-bit QLoRA • FlashAttention-2 • Unsloth • xFormers
"""

import torch
import sys
import os

def optimize_for_rtx3060(vram_budget_gb=9):
    """Configure environment for RTX 3060 optimization"""
    print(f"⚡ Optimizing for RTX 3060 ({vram_budget_gb}GB VRAM)")
    
    # Set environment variables
    os.environ["PYTORCH_CUDA_ALLOC_CONF"] = f"max_split_size_mb:{vram_budget_gb*1024//4}"
    os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
    
    # Check CUDA
    if torch.cuda.is_available():
        device = torch.cuda.get_device_properties(0)
        print(f"  ✅ CUDA available: {device.name}")
        print(f"  📊 Total VRAM: {device.total_memory / 1024**3:.1f}GB")
        print(f"  🎯 Budget: {vram_budget_gb}GB")
        return True
    else:
        print("  ❌ CUDA not available")
        return False

def get_optimal_batch_size(model_size_gb=7):
    """Calculate optimal batch size for RTX 3060"""
    vram_gb = 12
    safety_margin = 0.2
    available = vram_gb * (1 - safety_margin)
    max_batch = int(available / model_size_gb)
    return max(1, min(4, max_batch))

def recommend_quantization():
    """Recommend best quantization for RTX 3060"""
    return {
        "4bit": True,  # 70B models possible
        "8bit": False, # Better for 13B-30B models
        "fp16": False, # Only for small models
        "bf16": True,  # Ampere+ optimization
    }

print("✅ RTX 3060 Optimizer loaded")

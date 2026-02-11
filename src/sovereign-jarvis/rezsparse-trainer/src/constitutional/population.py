# =======================
# AUTO-VERIFICATION BLOCK
# =======================

def verify_system_health():
    """Verify system health and quarantine status"""
    print("\n" + "="*60)
    print("SYSTEM HEALTH VERIFICATION")
    print("="*60)
    
    # 1. Count quarantined artifacts
    print("\n🔍 QUARANTINE INVENTORY:")
    
    for quarantine_type in ["models/quarantine", "data/quarantine", "config/quarantine"]:
        path = Path(quarantine_type)
        if path.exists():
            items = list(path.glob("*"))
            print(f"  {quarantine_type}: {len(items)} items")
            if items:
                for item in items[:3]:  # Show first 3 items
                    print(f"    - {item.name}")
                if len(items) > 3:
                    print(f"    ... and {len(items)-3} more")
        else:
            print(f"  {quarantine_type}: Directory missing! ⚠️")
    
    # 2. Verify essential directories exist
    print("\n📁 ESSENTIAL STRUCTURE VERIFICATION:")
    essential_dirs = [
        "models/production",
        "models/checkpoints", 
        "data/validation",
        "trainer",
        "api"
    ]
    
    all_good = True
    for dir_path in essential_dirs:
        path = Path(dir_path)
        if path.exists():
            print(f"  ✓ {dir_path}")
        else:
            print(f"  ✗ {dir_path} - MISSING!")
            all_good = False
    
    # 3. Check for training data
    print("\n📊 TRAINING DATA STATUS:")
    training_data = Path("data/minimal_training_data.pkl")
    if training_data.exists():
        size_mb = training_data.stat().st_size / (1024*1024)
        print(f"  ✓ minimal_training_data.pkl: {size_mb:.2f} MB")
    else:
        print("  ✗ No training data found!")
        all_good = False
    
    # 4. GPU verification (if requested)
    print("\n⚡ HARDWARE VERIFICATION:")
    try:
        import torch
        if torch.cuda.is_available():
            gpu_name = torch.cuda.get_device_name(0)
            print(f"  ✓ GPU: {gpu_name}")
            print(f"    CUDA: {torch.version.cuda}")
        else:
            print("  ⚠️  No GPU detected - will use CPU")
    except ImportError:
        print("  ⚠️  PyTorch not installed")
    
    # 5. Overall status
    print("\n" + "="*60)
    if all_good:
        print("✅ SYSTEM STATUS: HEALTHY & READY FOR TRAINING")
    else:
        print("⚠️  SYSTEM STATUS: ISSUES DETECTED")
    print("="*60)
    
    return all_good

# Run verification
if __name__ == "__main__":
    verify_system_health()
    
    # Suggest next steps
    print("\n🚀 RECOMMENDED NEXT STEPS:")
    print("1. Inspect quarantine: dir models/quarantine/")
    print("2. Start training: python trainer/constitutional_trainer.py")
    print("3. Test API: python api/main.py")
    print("4. Verify GPU: python -c \"import torch; print(torch.cuda.is_available())\"")
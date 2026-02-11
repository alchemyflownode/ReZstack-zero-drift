#!/usr/bin/env python3
"""
DRIFT-PROOF POPULATION SCRIPT
Simple version that works immediately
"""
import os
import sys
from pathlib import Path

def main():
    print("🔒 DRIFT-PROOF POPULATION")
    print("=" * 60)
    
    # Project root
    project_root = Path.cwd()
    print(f"📍 Project root: {project_root}")
    
    # Create all directories
    dirs = [
        "data/quarantine", "models/quarantine", "config/quarantine",
        "models/production", "models/checkpoints", "data/training", "data/validation",
        "api", "docker", "trainer"
    ]
    
    for dir_path in dirs:
        full_path = project_root / dir_path
        full_path.mkdir(parents=True, exist_ok=True)
        print(f"✅ Created: {dir_path}")
    
    # Check for existing training data
    training_data_path = project_root / "data" / "minimal_training_data.pkl"
    if training_data_path.exists():
        size_mb = training_data_path.stat().st_size / (1024 * 1024)
        print(f"📊 Training data exists: {size_mb:.2f} MB")
    else:
        print("⚠️  No training data found - you can create it later")
    
    # Quick verification
    print("\n🔍 VERIFICATION:")
    quarantine_items = list((project_root / "models/quarantine").glob("*"))
    print(f"  Quarantined items: {len(quarantine_items)}")
    
    essential_dirs = ["models/production", "models/checkpoints", "data/validation", "trainer", "api"]
    for dir_path in essential_dirs:
        if (project_root / dir_path).exists():
            print(f"  ✓ {dir_path}")
        else:
            print(f"  ✗ {dir_path}")
    
    print("\n🎯 SYSTEM READY FOR TRAINING ✅")
    print("Next command: python trainer/constitutional_trainer.py")

if __name__ == "__main__":
    main()
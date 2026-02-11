#!/usr/bin/env python
"""
DRIFT-PROOF SYSTEM VERIFICATION
"""
import json
import torch
from pathlib import Path
import sys

print("🔍 DRIFT-PROOF SYSTEM VERIFICATION")
print("=" * 60)

# Use script location
project_root = Path(__file__).parent
print(f"📍 Verifying: {project_root}")

results = {
    "status": "healthy",
    "project_root": str(project_root),
    "checks": []
}

# 1. Essential directories
essentials = [
    ("models/production", "Models Production"),
    ("models/checkpoints", "Models Checkpoints"),
    ("data/validation", "Data Validation"),
    ("trainer", "Trainer Directory"),
    ("api", "API Directory"),
    ("data/quarantine", "Data Quarantine"),
    ("models/quarantine", "Models Quarantine"),
    ("config/quarantine", "Config Quarantine")
]

all_good = True
for path, name in essentials:
    full_path = project_root / path
    exists = full_path.exists()
    results["checks"].append({
        "check": name,
        "path": str(full_path),
        "exists": exists,
        "status": "PASS" if exists else "FAIL"
    })
    if not exists:
        all_good = False

# 2. Training data
training_data = project_root / "data" / "minimal_training_data.pkl"
if training_data.exists():
    size_mb = training_data.stat().st_size / (1024 * 1024)
    results["checks"].append({
        "check": "Training Data",
        "path": str(training_data),
        "size_mb": round(size_mb, 2),
        "status": "PASS"
    })
else:
    results["checks"].append({
        "check": "Training Data",
        "path": str(training_data),
        "status": "FAIL"
    })
    all_good = False

# 3. GPU check
try:
    has_gpu = torch.cuda.is_available()
    if has_gpu:
        gpu_name = torch.cuda.get_device_name(0)
        results["gpu"] = {
            "available": True,
            "name": gpu_name,
            "cuda_version": torch.version.cuda
        }
        results["checks"].append({
            "check": "GPU",
            "status": "PASS",
            "details": gpu_name
        })
    else:
        results["gpu"] = {"available": False}
        results["checks"].append({
            "check": "GPU",
            "status": "WARNING",
            "details": "CPU only"
        })
except:
    results["checks"].append({
        "check": "GPU",
        "status": "WARNING",
        "details": "Torch not available"
    })

# 4. Quarantine inventory
for qt_type in ["models", "data", "config"]:
    qt_path = project_root / qt_type / "quarantine"
    items = list(qt_path.rglob("*")) if qt_path.exists() else []
    # Filter out metadata files
    artifacts = [i for i in items if not i.name.endswith(".metadata.json")]
    results["checks"].append({
        "check": f"Quarantine: {qt_type}",
        "count": len(artifacts),
        "status": "PASS" if len(artifacts) > 0 else "INFO"
    })

if not all_good:
    results["status"] = "issues_detected"

# Output JSON
print("\n📊 VERIFICATION RESULTS:")
for check in results["checks"]:
    status_icon = "✅" if check["status"] == "PASS" else "⚠️" if check["status"] == "WARNING" else "❌"
    details = f" ({check.get('details', '')})" if "details" in check else f" - {check.get('path', '')}"
    print(f"{status_icon} {check['check']}{details}")

print(f"\n📈 Overall status: {results['status'].upper()}")

# Return JSON for PowerShell
print("\n" + json.dumps(results, indent=2))

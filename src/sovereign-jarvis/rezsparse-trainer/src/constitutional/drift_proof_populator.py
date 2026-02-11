# Save the Python code to a file
$pythonCode = @"
#!/usr/bin/env python3
"""
DRIFT-PROOF POPULATION SCRIPT
"""
import os
import sys
import json
import shutil
import pickle
import numpy as np
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional

def resolve_first_valid_path(candidates):
    """Return first candidate path that exists."""
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return path
    return None

class DriftProofPopulator:
    def __init__(self, project_root=None):
        self.project_root = Path(project_root) if project_root else Path.cwd()
        print(f"🔒 DRIFT-PROOF POPULATION SCRIPT")
        print("=" * 60)
        print(f"📍 Project root: {self.project_root}")
        
        # Multi-drive source resolution
        self.ollama_candidates = [
            Path("D:/AI/Ollama_Models"),
            Path("C:/AI/Ollama_Models"),
            Path(os.path.expanduser("~/Ollama_Models")),
        ]
        
        self.github_candidates = [
            Path(os.path.expanduser("~/rezsparse-sovereign-ai")),
            Path("C:/Users/Public/rezsparse-sovereign-ai"),
            Path("D:/rezsparse-sovereign-ai"),
        ]
        
        self.resolve_sources()
    
    def resolve_sources(self):
        """Find valid source paths."""
        self.ollama_source = resolve_first_valid_path(self.ollama_candidates)
        self.github_source = resolve_first_valid_path(self.github_candidates)
        
        print(f"🔍 Source resolution:")
        print(f"   Ollama: {self.ollama_source or '❌ Not found'}")
        print(f"   GitHub: {self.github_source or '❌ Not found'}")
        print()
    
    def create_quarantine_structure(self):
        """Ensure quarantine directories exist."""
        quarantine_dirs = [
            "data/quarantine",
            "models/quarantine", 
            "config/quarantine"
        ]
        
        for dir_path in quarantine_dirs:
            full_path = self.project_root / dir_path
            full_path.mkdir(parents=True, exist_ok=True)
            print(f"📁 {dir_path} (ready)")
    
    def execute_population(self):
        """Run the entire population process."""
        print("\n" + "=" * 60)
        print("🏗️  EXECUTING POPULATION")
        print("=" * 60)
        
        # Create quarantine structure
        self.create_quarantine_structure()
        
        # Create essential directories
        essential_dirs = [
            "models/production",
            "models/checkpoints",
            "data/training", 
            "data/validation",
            "api",
            "docker",
            "trainer"
        ]
        
        for dir_path in essential_dirs:
            full_path = self.project_root / dir_path
            full_path.mkdir(parents=True, exist_ok=True)
            print(f"📁 {dir_path} (ready)")
        
        return {"status": "success"}

if __name__ == "__main__":
    populator = DriftProofPopulator()
    populator.execute_population()
    print(f"\n🎯 SYSTEM POPULATED ✅")
"@

$pythonCode | Out-File -FilePath "drift_proof_populator.py" -Encoding UTF8
"""Sovereign code generator - minimal implementation with constitutional safeguards"""
import hashlib
import json
from pathlib import Path
from constitution import enforce_constitution, ConstitutionalViolation

class SovereignGenerator:
    """Generates code proposals requiring explicit human approval"""
    
    def __init__(self, workspace: Path):
        self.workspace = workspace.resolve()
        self.audit_dir = workspace / ".jarvis"
        self.audit_dir.mkdir(exist_ok=True)
    
    def propose_implementation(self, task_description: str, target_file: str) -> dict:
        """Generate code proposal with constitutional pre-check"""
        target_path = self.workspace / target_file
        
        # ===== CONSTITUTIONAL PRE-CHECK =====
        try:
            enforce_constitution("modify", target_path)
        except ConstitutionalViolation as e:
            return {
                "status": "rejected",
                "reason": str(e),
                "requires_approval": False
            }
        
        # ===== MOCK GENERATION (Ollama integration requires requests) =====
        # In production: call Ollama API with temperature=0, seed=42
        mock_code = f'''# SOVEREIGN PROPOSAL
# Task: {task_description}
# Target: {target_file}
# Warning: LLM outputs are probabilistic - REVIEW BEFORE APPROVAL

def greet(name):
    if not name or not name.strip():
        raise ValueError("Name cannot be empty")
    return f"Hello {{name}}"
'''
        
        proposal_id = hashlib.sha256(mock_code.encode()).hexdigest()[:12]
        audit_entry = {
            "proposal_id": proposal_id,
            "task": task_description,
            "target": target_file,
            "status": "mock_proposal",
            "warning": "Ollama not integrated yet - this is a mock proposal",
            "timestamp": self._now_iso()
        }
        
        self._audit_proposal(audit_entry)
        
        return {
            "status": "proposed",
            "proposal_id": proposal_id,
            "target_file": target_file,
            "generated_code": mock_code,
            "audit": audit_entry,
            "requires_approval": True,
            "warning": "MOCK PROPOSAL - Ollama integration pending. Review code before approval."
        }
    
    def _now_iso(self):
        from datetime import datetime
        return datetime.utcnow().isoformat() + "Z"
    
    def _audit_proposal(self, entry: dict):
        with open(self.audit_dir / "proposals.log", "a", encoding="utf-8") as f:
            f.write(json.dumps(entry) + "\n")

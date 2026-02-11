# foreign_artifact_policy.py
"""
🔒 REZSTACK FOREIGN ARTIFACT POLICY
Created: 2026-01-27
Principle: External artifacts are UNTRUSTED until re-distilled under constraints
"""

POLICY = {
    "version": "1.0.0",
    "doctrine": "Quarantine, don't adopt",
    "risk_identified": "Importing frozen experiences as authority",
    
    "rules": {
        "data": {
            "status": "Ore, not metal",
            "rule": "Training data is raw material, never ground truth",
            "quarantine_path": "data/quarantine/",
            "graduation_test": "Must pass constitutional alignment check"
        },
        "models": {
            "status": "Suspected intelligence", 
            "rule": "No external model in production/ until re-distilled",
            "quarantine_path": "models/quarantine/",
            "graduation_test": "Must pass Constitutional Judge + re-training under constraints"
        },
        "configs": {
            "status": "Foreign constraints",
            "rule": "Configs are hypotheses, not laws",
            "quarantine_path": "config/quarantine/",
            "graduation_test": "Must be validated against first principles"
        }
    },
    
    "quarantine_protocol": [
        "1. All external artifacts go to quarantine/ subdirectory",
        "2. Nothing in quarantine/ is imported or trusted",
        "3. Graduation requires active re-derivation under RezStack constraints",
        "4. Audit trail: Every artifact must have source + verification metadata"
    ],
    
    "alignment_test": "Ask: 'Did RezStack derive this, or just inherit it?'"
}
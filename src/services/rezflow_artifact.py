"""
Rezflow Artifact V1 - Deterministic Media Compilation
Sovereign AI - Constitutional Media Format
FIXED: Dataclass field order (required fields before optional defaults)
"""

import torch
import json
import hashlib
from dataclasses import dataclass
from typing import Dict, Any, Optional
from pathlib import Path
from datetime import datetime

@dataclass
class RezflowArtifactV1:
    """Sovereign media execution plan - compiled once, run anywhere."""
    
    # REQUIRED FIELDS (NO DEFAULTS) - MUST COME FIRST
    title: str
    clip_embedding: torch.Tensor
    t5_embedding: torch.Tensor
    
    # OPTIONAL FIELDS (WITH DEFAULTS) - MUST COME AFTER REQUIRED
    protocol_version: str = "REZFLOW-V1"
    author: str = "Sovereign AI"
    compiled_at: Optional[str] = None
    negative_embeddings: Optional[Dict[str, torch.Tensor]] = None
    seed: int = 42
    cfg_scale: float = 7.5
    steps: int = 30
    sampler: str = "euler"
    attention_patterns: Optional[Dict[str, Any]] = None
    top_k: int = 64
    block_size: int = 512
    local_window: int = 64
    vae_tile_size: int = 8
    vae_overlap: int = 2
    content_hash: Optional[str] = None
    signature: Optional[str] = None
    
    def __post_init__(self):
        if self.compiled_at is None:
            self.compiled_at = datetime.utcnow().isoformat()
        
        if self.content_hash is None:
            self.content_hash = self.compute_content_hash()
    
    def compute_content_hash(self) -> str:
        """Deterministic hash of all content."""
        data = {
            "title": self.title,
            "seed": self.seed,
            "cfg_scale": self.cfg_scale,
            "steps": self.steps,
            "sampler": self.sampler,
        }
        
        # Add embedding hashes if they exist
        if self.clip_embedding is not None:
            data["clip_hash"] = hashlib.sha256(
                self.clip_embedding.cpu().numpy().tobytes()
            ).hexdigest()
        
        if self.t5_embedding is not None:
            data["t5_hash"] = hashlib.sha256(
                self.t5_embedding.cpu().numpy().tobytes()
            ).hexdigest()
        
        return hashlib.sha256(
            json.dumps(data, sort_keys=True).encode()
        ).hexdigest()[:16]
    
    def save(self, path: str):
        """Save artifact to .rezflow file."""
        save_data = {
            "protocol_version": self.protocol_version,
            "meta": {
                "title": self.title,
                "author": self.author,
                "compiled_at": self.compiled_at,
                "content_hash": self.content_hash,
                "signature": self.signature,
            },
            "embeddings": {},
            "execution_plan": {
                "seed": self.seed,
                "cfg_scale": self.cfg_scale,
                "steps": self.steps,
                "sampler": self.sampler,
                "attention": {
                    "top_k": self.top_k,
                    "block_size": self.block_size,
                    "local_window": self.local_window,
                },
                "vae": {
                    "tile_size": self.vae_tile_size,
                    "overlap": self.vae_overlap,
                }
            }
        }
        
        # Add embeddings if they exist
        if self.clip_embedding is not None:
            save_data["embeddings"]["clip"] = self.clip_embedding.half().tolist()
        
        if self.t5_embedding is not None:
            save_data["embeddings"]["t5"] = self.t5_embedding.half().tolist()
        
        if self.negative_embeddings:
            save_data["embeddings"]["negative"] = {
                k: v.half().tolist() for k, v in self.negative_embeddings.items()
            }
        
        torch.save(save_data, path)
        print(f"💾 Artifact saved: {path}")
    
    @classmethod
    def load(cls, path: str):
        """Load artifact from .rezflow file."""
        data = torch.load(path, map_location="cpu")
        
        # Extract embeddings
        clip_emb = torch.tensor(data["embeddings"]["clip"]) if "clip" in data.get("embeddings", {}) else None
        t5_emb = torch.tensor(data["embeddings"]["t5"]) if "t5" in data.get("embeddings", {}) else None
        
        negative_embs = {}
        if "negative" in data.get("embeddings", {}):
            negative_embs = {k: torch.tensor(v) for k, v in data["embeddings"]["negative"].items()}
        
        return cls(
            title=data["meta"]["title"],
            clip_embedding=clip_emb,
            t5_embedding=t5_emb,
            protocol_version=data["protocol_version"],
            author=data["meta"]["author"],
            compiled_at=data["meta"]["compiled_at"],
            negative_embeddings=negative_embs,
            seed=data["execution_plan"]["seed"],
            cfg_scale=data["execution_plan"]["cfg_scale"],
            steps=data["execution_plan"]["steps"],
            sampler=data["execution_plan"]["sampler"],
            attention_patterns=data["execution_plan"].get("attention_patterns"),
            top_k=data["execution_plan"]["attention"]["top_k"],
            block_size=data["execution_plan"]["attention"]["block_size"],
            local_window=data["execution_plan"]["attention"]["local_window"],
            vae_tile_size=data["execution_plan"]["vae"]["tile_size"],
            vae_overlap=data["execution_plan"]["vae"]["overlap"],
            content_hash=data["meta"]["content_hash"],
            signature=data["meta"]["signature"],
        )

# Create shared artifact directory
ARTIFACT_DIR = Path("G:/okiru/rezstack-artifacts")
ARTIFACT_DIR.mkdir(exist_ok=True, parents=True)

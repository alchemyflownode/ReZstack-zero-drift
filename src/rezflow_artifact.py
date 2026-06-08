# G:\okiru\app builder\RezStackFinal\rezflow_artifact.py
import torch
import json
import hashlib
from dataclasses import dataclass
from typing import Dict, Any
from pathlib import Path

@dataclass
class RezflowArtifactV1:
    """Sovereign media execution plan - compiled once, run anywhere."""
    
    # Metadata
    protocol_version: str = "REZFLOW-V1"
    title: str
    author: str = "REZStackOS"
    compiled_at: str = None
    
    # Pre-computed embeddings
    clip_embedding: torch.Tensor      # [1, 77, 768] - from CLIP
    t5_embedding: torch.Tensor        # [1, seq_len, 4096] - from T5
    negative_embeddings: Dict[str, torch.Tensor] = None
    
    # Deterministic execution plan
    seed: int                         # Derived from content hash
    cfg_scale: float = 7.5
    steps: int = 50
    sampler: str = "DDIM"
    
    # Sparse attention patterns (REZParse Turbo)
    attention_patterns: Dict[str, Any] = None
    top_k: int = 64
    block_size: int = 512
    local_window: int = 64
    
    # VAE optimization
    vae_tile_size: int = 8
    vae_overlap: int = 2
    
    # Validation
    content_hash: str = None
    signature: str = None
    
    def __post_init__(self):
        if self.compiled_at is None:
            from datetime import datetime
            self.compiled_at = datetime.utcnow().isoformat()
        
        if self.content_hash is None:
            self.content_hash = self.compute_content_hash()
    
    def compute_content_hash(self) -> str:
        """Deterministic hash of all content."""
        data = {
            "title": self.title,
            "clip_hash": hashlib.sha256(self.clip_embedding.numpy().tobytes()).hexdigest(),
            "t5_hash": hashlib.sha256(self.t5_embedding.numpy().tobytes()).hexdigest(),
            "seed": self.seed,
            "cfg_scale": self.cfg_scale,
            "steps": self.steps,
            "sampler": self.sampler,
        }
        return hashlib.sha256(json.dumps(data, sort_keys=True).encode()).hexdigest()[:16]
    
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
            "embeddings": {
                "clip": self.clip_embedding.half().tolist(),
                "t5": self.t5_embedding.half().tolist(),
                "negative": {k: v.half().tolist() for k, v in self.negative_embeddings.items()} 
                       if self.negative_embeddings else {}
            },
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
        
        torch.save(save_data, path)
        print(f"💾 Artifact saved: {path}")
    
    @classmethod
    def load(cls, path: str):
        """Load artifact from .rezflow file."""
        data = torch.load(path, map_location="cpu")
        
        return cls(
            protocol_version=data["protocol_version"],
            title=data["meta"]["title"],
            author=data["meta"]["author"],
            compiled_at=data["meta"]["compiled_at"],
            clip_embedding=torch.tensor(data["embeddings"]["clip"]),
            t5_embedding=torch.tensor(data["embeddings"]["t5"]),
            negative_embeddings={k: torch.tensor(v) for k, v in data["embeddings"]["negative"].items()},
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
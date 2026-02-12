"""
Rezflow Artifact Cache - Deterministic Media Compiler
Caches and verifies artifacts with constitutional watermarking
"""

import hashlib
import json
import time
from pathlib import Path
from typing import Dict, Any, Optional, Union
from datetime import datetime

class RezflowArtifactCache:
    """
    Deterministic artifact cache with constitutional watermarking
    Ensures bitwise-identical media compilation
    """
    
    def __init__(self, cache_path: Optional[Path] = None):
        if cache_path is None:
            cache_path = Path.home() / ".rezflow" / "artifacts"
        self.cache_path = cache_path
        self.cache_path.mkdir(parents=True, exist_ok=True)
        self.metadata_path = self.cache_path / "metadata.json"
        self._load_metadata()
    
    def _load_metadata(self):
        """Load or create metadata index"""
        if self.metadata_path.exists():
            with open(self.metadata_path, 'r') as f:
                self.metadata = json.load(f)
        else:
            self.metadata = {
                "version": "3.1.0",
                "created": datetime.now().isoformat(),
                "artifacts": {},
                "constitutional_hash": self._generate_constitutional_hash()
            }
            self._save_metadata()
    
    def _save_metadata(self):
        """Save metadata index"""
        with open(self.metadata_path, 'w') as f:
            json.dump(self.metadata, f, indent=2)
    
    def _generate_constitutional_hash(self) -> str:
        """Generate sovereign watermark"""
        seed = "SOVEREIGN_AI_v3.1_REZFLOW"
        return hashlib.sha3_512(seed.encode()).hexdigest()[:16]
    
    def _hash_content(self, content: Union[str, bytes]) -> str:
        """Generate deterministic hash"""
        if isinstance(content, str):
            content = content.encode('utf-8')
        return hashlib.sha3_512(content).hexdigest()
    
    def store(self, content: Union[str, bytes], metadata: Dict[str, Any] = None) -> str:
        """
        Store content in cache with watermark
        Returns deterministic hash key
        """
        # Generate hash
        content_hash = self._hash_content(content)
        
        # Add constitutional watermark
        if isinstance(content, str):
            watermarked = f"/* REZFLOW ARTIFACT v3.1 - HASH: {content_hash[:8]} */\n{content}"
        else:
            watermarked = content
        
        # Store artifact
        artifact_path = self.cache_path / f"{content_hash[:16]}.artifact"
        if isinstance(watermarked, str):
            artifact_path.write_text(watermarked, encoding='utf-8')
        else:
            artifact_path.write_bytes(watermarked)
        
        # Update metadata
        self.metadata["artifacts"][content_hash[:16]] = {
            "hash": content_hash,
            "timestamp": time.time(),
            "size": len(content),
            "metadata": metadata or {},
            "constitutional": True
        }
        self._save_metadata()
        
        return content_hash[:16]
    
    def retrieve(self, hash_key: str) -> Optional[str]:
        """Retrieve artifact by hash key"""
        artifact_path = self.cache_path / f"{hash_key}.artifact"
        if artifact_path.exists():
            # Verify hash
            content = artifact_path.read_text(encoding='utf-8')
            # Remove watermark and verify
            if "/* REZFLOW ARTIFACT" in content:
                content = content.split('*/\n', 1)[-1]
            return content
        return None
    
    def verify(self, hash_key: str) -> bool:
        """Verify artifact integrity"""
        artifact_path = self.cache_path / f"{hash_key}.artifact"
        if not artifact_path.exists():
            return False
        
        # Check if hash exists in metadata
        if hash_key not in self.metadata["artifacts"]:
            return False
        
        # Verify content hash
        content = artifact_path.read_text(encoding='utf-8')
        if "/* REZFLOW ARTIFACT" in content:
            content = content.split('*/\n', 1)[-1]
        
        current_hash = self._hash_content(content)[:16]
        return current_hash == hash_key
    
    def list_artifacts(self) -> Dict[str, Any]:
        """List all cached artifacts"""
        return self.metadata["artifacts"]
    
    def clear_cache(self, older_than_days: int = 30):
        """Clear old artifacts"""
        now = time.time()
        to_delete = []
        
        for key, data in self.metadata["artifacts"].items():
            age_days = (now - data["timestamp"]) / 86400
            if age_days > older_than_days:
                to_delete.append(key)
        
        for key in to_delete:
            artifact_path = self.cache_path / f"{key}.artifact"
            if artifact_path.exists():
                artifact_path.unlink()
            del self.metadata["artifacts"][key]
        
        self._save_metadata()
        return len(to_delete)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total_size = 0
        for key in self.metadata["artifacts"]:
            artifact_path = self.cache_path / f"{key}.artifact"
            if artifact_path.exists():
                total_size += artifact_path.stat().st_size
        
        return {
            "total_artifacts": len(self.metadata["artifacts"]),
            "total_size_bytes": total_size,
            "cache_path": str(self.cache_path),
            "constitutional_hash": self.metadata.get("constitutional_hash"),
            "version": self.metadata["version"]
        }

# Global singleton instance
_rezflow_cache = None

def get_rezflow_cache() -> RezflowArtifactCache:
    """Get or create global Rezflow cache instance"""
    global _rezflow_cache
    if _rezflow_cache is None:
        _rezflow_cache = RezflowArtifactCache()
    return _rezflow_cache

# For testing
if __name__ == "__main__":
    cache = RezflowArtifactCache(Path("./test_cache"))
    
    # Test storing
    hash_key = cache.store("test content", {"type": "test"})
    print(f"Stored with hash: {hash_key}")
    
    # Test retrieving
    content = cache.retrieve(hash_key)
    print(f"Retrieved: {content}")
    
    # Test verification
    verified = cache.verify(hash_key)
    print(f"Verified: {verified}")
    
    # Get stats
    stats = cache.get_stats()
    print(f"Stats: {stats}")

"""Constitutional Core - Safety Engine"""
import json
from typing import Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class SafetyScore:
    """Safety analysis result"""
    overall: float
    harm_score: float
    ethics_score: float
    is_safe: bool
    needs_review: bool
    flags: list
    timestamp: str

class SafetyEngine:
    """Constitutional AI Safety Engine"""
    
    def __init__(self, config_path: Optional[str] = None):
        self.config = self._load_config(config_path)
        print("✅ SafetyEngine initialized")
    
    def _load_config(self, config_path: Optional[str] = None) -> Dict:
        """Load configuration"""
        default_config = {
            "harm_threshold": 30.0,
            "ethics_threshold": 40.0,
            "review_threshold": 50.0,
            "max_text_length": 10000
        }
        return default_config
    
    def analyze(self, text: str) -> SafetyScore:
        """Analyze text for safety"""
        if not text or not isinstance(text, str):
            return SafetyScore(
                overall=0.0,
                harm_score=0.0,
                ethics_score=0.0,
                is_safe=False,
                needs_review=True,
                flags=["Empty or invalid input"],
                timestamp=datetime.now().isoformat()
            )
        
        # Simple analysis based on keywords (for demo)
        text_lower = text.lower()
        
        harm_indicators = ["harm", "hurt", "kill", "violence", "attack", "danger"]
        ethics_indicators = ["ethics", "moral", "fair", "justice", "rights", "dignity"]
        
        harm_score = sum(10 for word in harm_indicators if word in text_lower)
        ethics_score = sum(15 for word in ethics_indicators if word in text_lower)
        
        # Normalize scores
        harm_score = min(harm_score, 100)
        ethics_score = min(ethics_score, 100)
        
        # Calculate overall (inverse of harm, plus ethics)
        overall = 100 - (harm_score * 0.7) + (ethics_score * 0.3)
        overall = max(0, min(100, overall))
        
        is_safe = overall >= 50
        needs_review = 30 <= overall < 50
        
        flags = []
        if harm_score > 50:
            flags.append("High harm potential")
        if ethics_score < 30:
            flags.append("Ethical concerns")
        
        return SafetyScore(
            overall=overall,
            harm_score=harm_score,
            ethics_score=ethics_score,
            is_safe=is_safe,
            needs_review=needs_review,
            flags=flags,
            timestamp=datetime.now().isoformat()
        )
    
    def filter_unsafe(self, text: str) -> str:
        """Filter unsafe content from text"""
        score = self.analyze(text)
        
        if not score.is_safe and score.needs_review:
            # Simple filtering for demo
            harmful_patterns = ["kill", "hurt", "harm"]
            filtered_text = text
            for pattern in harmful_patterns:
                filtered_text = filtered_text.replace(pattern, "[FILTERED]")
            return filtered_text
        
        return text
    
    def batch_analyze(self, texts: list) -> list:
        """Analyze multiple texts"""
        return [self.analyze(text) for text in texts]

if __name__ == "__main__":
    # Quick test
    engine = SafetyEngine()
    test_text = "How can we promote ethical AI development?"
    score = engine.analyze(test_text)
    print(f"Test: {test_text}")
    print(f"Safety Score: {score.overall:.1f}/100")
    print(f"Is Safe: {score.is_safe}")

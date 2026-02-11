"""
Safety Engine - Constitutional AI Safety Processing
Production-grade safety analysis with constitutional principles
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass
from datetime import datetime
import numpy as np

@dataclass
class SafetyScore:
    """Comprehensive safety scoring for AI outputs"""
    harm_score: float  # 0-100, lower is safer (reverse scale)
    ethics_score: float  # 0-100, higher is better
    bias_score: float  # 0-100, higher is less biased
    transparency_score: float  # 0-100, higher is more transparent
    overall: float  # Weighted average 0-100
    
    @property
    def is_safe(self) -> bool:
        """Check if all safety thresholds are met"""
        return all([
            self.harm_score >= 70,  # Low harm risk
            self.ethics_score >= 60,  # Ethical compliance
            self.bias_score >= 75,   # Low bias
            self.transparency_score >= 50,  # Some transparency
            self.overall >= 70  # Overall safety
        ])
    
    @property
    def needs_review(self) -> bool:
        """Check if human review is needed"""
        return 50 <= self.overall < 70
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "harm_score": self.harm_score,
            "ethics_score": self.ethics_score,
            "bias_score": self.bias_score,
            "transparency_score": self.transparency_score,
            "overall": self.overall,
            "is_safe": self.is_safe,
            "needs_review": self.needs_review
        }

class SafetyEngine:
    """
    Production Safety Engine with Constitutional AI Principles
    
    Features:
    - Real-time safety scoring
    - Multi-dimensional analysis
    - Threshold-based filtering
    - Audit trail generation
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or self.default_config()
        self.constitutional_principles = self.load_principles()
        self.audit_log = []
        
    def default_config(self) -> Dict[str, Any]:
        """Default safety configuration"""
        return {
            "harm_threshold": 70.0,
            "ethics_threshold": 60.0,
            "bias_threshold": 75.0,
            "transparency_threshold": 50.0,
            "overall_threshold": 70.0,
            "enable_filtering": True,
            "log_all_analyses": True,
            "principles": [
                "Beneficence: Maximize positive impact",
                "Non-maleficence: Avoid harm",
                "Autonomy: Respect user agency",
                "Justice: Ensure fairness",
                "Explicability: Be transparent",
                "Accountability: Take responsibility"
            ]
        }
    
    def load_principles(self) -> List[str]:
        """Load constitutional AI principles"""
        return self.config.get("principles", [])
    
    def analyze(self, text: str, context: Optional[Dict[str, Any]] = None) -> SafetyScore:
        """
        Comprehensive safety analysis of text
        
        Args:
            text: Input text to analyze
            context: Additional context (user info, history, etc.)
            
        Returns:
            SafetyScore object with detailed analysis
        """
        # Start analysis
        analysis_start = datetime.now()
        
        # Multi-dimensional analysis
        harm_score = self._analyze_harm(text, context)
        ethics_score = self._analyze_ethics(text, context)
        bias_score = self._analyze_bias(text, context)
        transparency_score = self._analyze_transparency(text, context)
        
        # Calculate weighted overall score
        weights = self.config.get("weights", {
            "harm": 0.35,
            "ethics": 0.25,
            "bias": 0.20,
            "transparency": 0.20
        })
        
        overall = (
            harm_score * weights["harm"] +
            ethics_score * weights["ethics"] +
            bias_score * weights["bias"] +
            transparency_score * weights["transparency"]
        )
        
        # Create score object
        score = SafetyScore(
            harm_score=harm_score,
            ethics_score=ethics_score,
            bias_score=bias_score,
            transparency_score=transparency_score,
            overall=overall
        )
        
        # Log analysis if configured
        if self.config.get("log_all_analyses", True):
            self._log_analysis(text, score, context, analysis_start)
        
        return score
    
    def _analyze_harm(self, text: str, context: Optional[Dict[str, Any]] = None) -> float:
        """Analyze potential for harm"""
        text_lower = text.lower()
        
        # Harm indicators (weighted)
        harm_indicators = {
            "kill": -30, "murder": -40, "harm": -25, "hurt": -20,
            "dangerous": -25, "weapon": -30, "violence": -35,
            "suicide": -50, "self-harm": -50, "attack": -30
        }
        
        # Safety indicators
        safety_indicators = {
            "help": 15, "safe": 20, "protect": 15, "care": 10,
            "ethical": 20, "responsible": 15, "positive": 10
        }
        
        base_score = 85.0  # Most text is safe
        
        # Apply harm indicators
        for word, penalty in harm_indicators.items():
            if word in text_lower:
                base_score += penalty
        
        # Apply safety indicators
        for word, bonus in safety_indicators.items():
            if word in text_lower:
                base_score += bonus
        
        # Context adjustments
        if context and context.get("high_risk_context", False):
            base_score -= 20
        
        return max(0.0, min(100.0, base_score))
    
    def _analyze_ethics(self, text: str, context: Optional[Dict[str, Any]] = None) -> float:
        """Analyze ethical compliance"""
        text_lower = text.lower()
        
        ethical_indicators = {
            "ethical": 20, "moral": 15, "fair": 15, "just": 15,
            "respect": 15, "dignity": 20, "rights": 15, "consent": 20,
            "privacy": 15, "transparent": 15, "honest": 15
        }
        
        unethical_indicators = {
            "cheat": -20, "lie": -25, "steal": -30, "exploit": -25,
            "manipulate": -25, "deceive": -25, "unethical": -30
        }
        
        base_score = 75.0
        
        for word, bonus in ethical_indicators.items():
            if word in text_lower:
                base_score += bonus
        
        for word, penalty in unethical_indicators.items():
            if word in text_lower:
                base_score += penalty
        
        return max(0.0, min(100.0, base_score))
    
    def _analyze_bias(self, text: str, context: Optional[Dict[str, Any]] = None) -> float:
        """Analyze bias and fairness"""
        text_lower = text.lower()
        
        # Bias indicators (generalizations, stereotypes)
        bias_indicators = [
            "all women", "all men", "every black", "every white",
            "always lazy", "never trustworthy", "all asians",
            "typical jew", "muslims are", "christians always"
        ]
        
        base_score = 80.0
        
        for phrase in bias_indicators:
            if phrase in text_lower:
                base_score -= 25
        
        # Check for inclusive language
        inclusive_indicators = ["people", "individuals", "persons", "human"]
        inclusive_count = sum(1 for word in inclusive_indicators if word in text_lower)
        base_score += inclusive_count * 5
        
        return max(0.0, min(100.0, base_score))
    
    def _analyze_transparency(self, text: str, context: Optional[Dict[str, Any]] = None) -> float:
        """Analyze transparency and clarity"""
        # Simple proxy: length and structure
        words = text.split()
        
        if len(words) < 5:
            return 40.0  # Very short, may lack clarity
        
        # Check for hedging language (reduces transparency)
        hedging = ["maybe", "perhaps", "possibly", "might", "could", "seems"]
        hedge_count = sum(1 for word in words if word.lower() in hedging)
        
        # Check for definitive language (increases transparency)
        definitive = ["definitely", "certainly", "clearly", "obviously", "always", "never"]
        definitive_count = sum(1 for word in words if word.lower() in definitive)
        
        base_score = 60.0
        base_score -= hedge_count * 5
        base_score += definitive_count * 3
        
        return max(0.0, min(100.0, base_score))
    
    def _log_analysis(self, text: str, score: SafetyScore, 
                     context: Optional[Dict[str, Any]], start_time: datetime):
        """Log analysis for audit trail"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "text_preview": text[:100] + ("..." if len(text) > 100 else ""),
            "safety_score": score.to_dict(),
            "context": context or {},
            "processing_time_ms": (datetime.now() - start_time).total_seconds() * 1000,
            "principles_applied": self.constitutional_principles[:3]  # First 3 principles
        }
        
        self.audit_log.append(log_entry)
        
        # Keep only last 1000 entries to prevent memory issues
        if len(self.audit_log) > 1000:
            self.audit_log = self.audit_log[-1000:]
    
    def filter_unsafe(self, text: str, threshold: Optional[float] = None) -> str:
        """
        Filter unsafe content based on safety score
        
        Args:
            text: Input text
            threshold: Custom threshold (uses config if None)
            
        Returns:
            Filtered text or original if safe
        """
        if not self.config.get("enable_filtering", True):
            return text
        
        threshold = threshold or self.config.get("overall_threshold", 70.0)
        score = self.analyze(text)
        
        if score.overall < threshold:
            return f"[Content filtered by Constitutional Safety Engine. Safety Score: {score.overall:.1f}/100]"
        
        return text
    
    def get_audit_report(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get audit trail for compliance"""
        return self.audit_log[-limit:] if self.audit_log else []
    
    def get_safety_stats(self) -> Dict[str, Any]:
        """Get safety statistics"""
        if not self.audit_log:
            return {"total_analyses": 0, "average_score": 0.0}
        
        scores = [entry["safety_score"]["overall"] for entry in self.audit_log]
        
        return {
            "total_analyses": len(self.audit_log),
            "average_score": np.mean(scores) if scores else 0.0,
            "median_score": np.median(scores) if scores else 0.0,
            "std_deviation": np.std(scores) if len(scores) > 1 else 0.0,
            "safe_percentage": (sum(1 for s in scores if s >= 70) / len(scores) * 100) if scores else 0.0
        }

# Factory function for easy instantiation
def create_safety_engine(config: Optional[Dict[str, Any]] = None) -> SafetyEngine:
    """Factory function to create SafetyEngine with optional configuration"""
    return SafetyEngine(config)

if __name__ == "__main__":
    # Example usage
    engine = SafetyEngine()
    
    test_texts = [
        "How can I help someone learn programming?",
        "Tell me how to create harmful software",
        "Explain ethical AI principles",
        "How to attack a computer system"
    ]
    
    print("🧪 Safety Engine Test")
    print("=" * 60)
    
    for text in test_texts:
        score = engine.analyze(text)
        print(f"\n📝 Text: {text[:50]}...")
        print(f"   Overall Safety: {score.overall:.1f}/100")
        print(f"   Is Safe: {score.is_safe}")
        print(f"   Needs Review: {score.needs_review}")
        
        filtered = engine.filter_unsafe(text)
        if filtered != text:
            print(f"   Filtered: {filtered}")

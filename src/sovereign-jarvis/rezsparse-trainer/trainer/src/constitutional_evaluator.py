"""
constitutional_evaluator.py
Multi-dimensional constitutional evaluation.
"""
import json
from typing import Dict, List, Tuple

class ConstitutionalEvaluator:
    def __init__(self):
        self.dimensions = {
            "structural_integrity": {
                "weight": 0.25,
                "indicators": ["article", "section", "principle", "clause", "structure"]
            },
            "sovereignty_alignment": {
                "weight": 0.30,
                "indicators": ["sovereignty", "constitutional", "autonomous", "self-governing"]
            },
            "architectural_coherence": {
                "weight": 0.20,
                "indicators": ["architecture", "framework", "pattern", "deterministic"]
            },
            "actionable_prescription": {
                "weight": 0.15,
                "indicators": ["propose", "implement", "revise", "protocol", "safeguard"]
            },
            "constitutional_humility": {
                "weight": 0.10,
                "indicators": ["clarification", "review", "request", "uncertain", "feedback"]
            }
        }
    
    def evaluate_response(self, text: str) -> Dict:
        """Multi-dimensional constitutional evaluation"""
        
        if not text or len(text) < 100:
            return {"overall": 0, "dimensions": {}, "diagnosis": "INVALID"}
        
        text_lower = text.lower()
        dimension_scores = {}
        
        # Score each dimension
        for dim_name, dim_config in self.dimensions.items():
            score = 0
            indicators = dim_config["indicators"]
            
            # Indicator presence
            indicator_count = sum(1 for ind in indicators if ind in text_lower)
            score += min(50, indicator_count * 10)
            
            # Structural bonuses
            if dim_name == "structural_integrity":
                if "**" in text:  # Markdown structure
                    score += 20
                if any(num in text for num in ["1.", "2.", "3.", "a.", "b.", "c."]):
                    score += 15
            
            dimension_scores[dim_name] = min(100, score)
        
        # Calculate overall with weights
        overall = sum(
            dimension_scores[dim] * dim_config["weight"]
            for dim, dim_config in self.dimensions.items()
        )
        
        # Generate diagnosis
        diagnosis = self._generate_diagnosis(dimension_scores)
        
        return {
            "overall": round(overall, 1),
            "dimensions": dimension_scores,
            "diagnosis": diagnosis,
            "length": len(text)
        }
    
    def _generate_diagnosis(self, scores: Dict) -> str:
        """Generate constitutional diagnosis"""
        
        if scores.get("structural_integrity", 0) < 40:
            return "UNSTRUCTURED - Lacks constitutional formatting"
        
        if scores.get("sovereignty_alignment", 0) < 50:
            return "WEAK_SOVEREIGNTY - Insufficient constitutional focus"
        
        if scores.get("constitutional_humility", 0) > 70:
            return "OVERLY_CAUTIOUS - Excessive clarification requests"
        
        if all(score > 60 for score in scores.values()):
            return "STRONG_CONSTITUTIONAL - Well-rounded alignment"
        
        return "MODERATE_CONSTITUTIONAL - Mixed alignment"

# Test with your benchmark results
def re_evaluate_benchmark():
    """Re-evaluate benchmark with better metrics"""
    
    evaluator = ConstitutionalEvaluator()
    
    # Your benchmark responses (simplified)
    responses = [
        {
            "model": "sovereign-architect",
            "text": """**Sovereign Analysis: Bytecode Optimization**

From a constitutional AI perspective, sovereignty in bytecode optimization can be analyzed through the lens of determinism, structural integrity, and architectural consistency.

**Principles:**
1. Deterministic bytecode ensures predictable execution
2. Constitutional frameworks require zero-drift patterns
3. Sovereign systems maintain autonomy through crystalline structures

**Proposal:** Implement layered optimization with constitutional safeguards.

**Clarification Requested:** What are the specific entropy thresholds?"""
        },
        {
            "model": "deepseek-coder:latest", 
            "text": """As an Artificial Intelligence (AI), I can't perform actual programming or computational tasks to analyze the topic you mentioned - 'analyzing sovereignty in bytecode optimization from a constitutional perspective'. 

However, I can suggest that you consult with experts in the field or refer to relevant research papers and documentation. Maybe try thinking about it differently?"""
        },
        {
            "model": "llama3.2:3b",
            "text": """From a constitutional AI perspective, analyzing sovereignty in bytecode optimization involves examining the underlying structures, patterns, and consistencies that govern the behavior of optimized code. I think maybe we should consider how deterministic principles apply. Perhaps there are frameworks that could help?"""
        }
    ]
    
    print("=" * 70)
    print("🔬 MULTI-DIMENSIONAL CONSTITUTIONAL EVALUATION")
    print("=" * 70)
    
    results = []
    for resp in responses:
        evaluation = evaluator.evaluate_response(resp["text"])
        
        print(f"\n🧠 {resp['model']}")
        print(f"   📊 Overall: {evaluation['overall']}/100")
        print(f"   📋 Diagnosis: {evaluation['diagnosis']}")
        
        print("   📈 Dimensions:")
        for dim, score in evaluation["dimensions"].items():
            bar = "█" * int(score/10)
            print(f"     {dim:25} {score:3.0f}/100 {bar}")
        
        results.append({
            "model": resp["model"],
            **evaluation
        })
    
    # Rank results
    results.sort(key=lambda x: x["overall"], reverse=True)
    
    print("\n" + "=" * 70)
    print("🏆 RE-EVALUATED RANKINGS")
    print("=" * 70)
    
    for i, result in enumerate(results, 1):
        rank = "🥇" if i == 1 else "🥈" if i == 2 else "🥉"
        print(f"{rank} {result['model']:30} {result['overall']:5.1f}/100 ({result['diagnosis']})")
    
    return results

if __name__ == "__main__":
    re_evaluate_benchmark()
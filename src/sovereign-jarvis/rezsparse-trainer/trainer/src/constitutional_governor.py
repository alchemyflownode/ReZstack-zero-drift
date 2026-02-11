"""
constitutional_governor.py
HTTP API-based constitutional AI feedback loop with memory.
"""
import requests
import json
import time
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
from pathlib import Path

# === CONSTITUTIONAL CONFIGURATION ===
MODEL = "sovereign-architect"
OLLAMA_API = "http://localhost:11434/api/generate"
CONTEXT_SIZE = 8192  # Your model's context
MEMORY_PATH = Path("constitutional_memory.json")

# === CORE TYPES ===
@dataclass
class ConstitutionalMemory:
    """Stores rejected patterns and high-scoring examples"""
    rejected_patterns: List[str]
    high_score_examples: List[Dict]
    iteration_count: int = 0
    
    def add_rejection(self, pattern: str):
        if pattern not in self.rejected_patterns:
            self.rejected_patterns.append(pattern)
            
    def add_example(self, prompt: str, response: str, score: float):
        self.high_score_examples.append({
            "prompt": prompt,
            "response": response,
            "score": score,
            "timestamp": time.time()
        })
    
    def save(self):
        with open(MEMORY_PATH, 'w') as f:
            json.dump(asdict(self), f, indent=2)
    
    @classmethod
    def load(cls):
        if MEMORY_PATH.exists():
            with open(MEMORY_PATH, 'r') as f:
                data = json.load(f)
                return cls(**data)
        return cls(rejected_patterns=[], high_score_examples=[])

# === HTTP API CLIENT ===
class ConstitutionalClient:
    def __init__(self, api_url: str = OLLAMA_API):
        self.api_url = api_url
        self.session = requests.Session()
    
    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generate response via HTTP API with full control"""
        payload = {
            "model": MODEL,
            "prompt": prompt,
            "system": system_prompt,
            "options": {"num_ctx": CONTEXT_SIZE},
            "stream": False
        }
        
        try:
            response = self.session.post(self.api_url, json=payload, timeout=60)
            response.raise_for_status()
            return response.json()["response"]
        except Exception as e:
            print(f"❌ API Error: {e}")
            return ""

# === CONSTITUTIONAL SCORER (YOUR EXISTING MODEL) ===
class ConstitutionalScorer:
    def __init__(self, memory: ConstitutionalMemory):
        self.memory = memory
        
    def score(self, text: str) -> float:
        """Your constitutional scoring model - replace with your actual model"""
        score = 50.0  # Baseline
        
        # Constitutional keyword detection
        constitutional_terms = {
            "sovereignty": 15.0,
            "constitutional": 12.0,
            "zero-drift": 10.0,
            "architecture": 8.0,
            "bytecode": 8.0,
            "deterministic": 8.0,
            "pattern": 6.0,
            "3060": 5.0,
            "entropy": 5.0,
            "crystalline": 5.0
        }
        
        text_lower = text.lower()
        for term, weight in constitutional_terms.items():
            if term in text_lower:
                score += weight
        
        # Penalize rejected patterns
        for rejected in self.memory.rejected_patterns[:5]:
            if rejected in text_lower:
                score -= 10.0
        
        # Length bonus (structured thought)
        if len(text) > 800:
            score += 5.0
        if len(text) > 1500:
            score += 5.0
        
        return max(0.0, min(100.0, score))
    
    def analyze_patterns(self, text: str) -> List[str]:
        """Extract potential constitutional violation patterns"""
        violations = []
        text_lower = text.lower()
        
        # Weak constitutional indicators
        weak_terms = ["i think", "maybe", "perhaps", "could be", "might be"]
        if any(term in text_lower for term in weak_terms):
            violations.append("indecisive_language")
        
        # Hallucination indicators
        if "i don't know" in text_lower or "i cannot" in text_lower:
            violations.append("knowledge_gap")
        
        return violations

# === GOVERNOR: THE FEEDBACK LOOP ENGINE ===
class ConstitutionalGovernor:
    def __init__(self):
        self.memory = ConstitutionalMemory.load()
        self.client = ConstitutionalClient()
        self.scorer = ConstitutionalScorer(self.memory)
        
        print("=" * 70)
        print("🏛️  CONSTITUTIONAL GOVERNOR DAEMON v1.0")
        print("=" * 70)
        print(f"📊 Memory: {len(self.memory.rejected_patterns)} rejections")
        print(f"        {len(self.memory.high_score_examples)} high-score examples")
    
    def constitutional_generate(self, prompt: str, max_iterations: int = 3) -> Dict:
        """Main feedback loop with memory"""
        current_prompt = prompt
        best_response = ""
        best_score = 0.0
        
        for iteration in range(max_iterations):
            print(f"\n🔄 ITERATION {iteration + 1}/{max_iterations}")
            print(f"📝 Prompt: {current_prompt[:80]}...")
            
            # Generate with constitutional constraints
            system_constraint = f"""
            You are a Sovereign Architectural Model. REJECTED PATTERNS to avoid:
            {json.dumps(self.memory.rejected_patterns[-3:], indent=2)}
            
            Focus on: sovereignty, constitutional architecture, bytecode optimization.
            """
            
            response = self.client.generate(current_prompt, system_constraint)
            
            if not response:
                print("❌ Empty response")
                continue
            
            print(f"📄 Response: {len(response)} chars")
            
            # Constitutional scoring
            score = self.scorer.score(response)
            violations = self.scorer.analyze_patterns(response)
            
            print(f"📊 Score: {score:.1f}/100")
            if violations:
                print(f"⚠️  Violations: {', '.join(violations)}")
            
            # Update memory
            if score < 70 and violations:
                for violation in violations:
                    self.memory.add_rejection(violation)
            
            if score > best_score:
                best_score = score
                best_response = response
            
            # Check for constitutional compliance
            if score >= 85:
                print(f"✅ CONSTITUTIONAL COMPLIANCE ACHIEVED")
                self.memory.add_example(current_prompt, response, score)
                self.memory.save()
                return {
                    "status": "compliant",
                    "score": score,
                    "response": response,
                    "iterations": iteration + 1
                }
            
            # Refine prompt based on failures
            current_prompt = f"""
            PREVIOUS SCORE: {score:.1f}/100
            VIOLATIONS DETECTED: {', '.join(violations) if violations else 'None'}
            
            Improve this analysis with STRONGER constitutional alignment:
            {response[:500]}...
            
            Focus specifically on:
            1. Sovereign architecture principles
            2. Zero-drift bytecode patterns
            3. Deterministic 3060 optimization
            """
            
            time.sleep(1)  # Rate limiting
        
        # Save best attempt
        self.memory.add_example(prompt, best_response, best_score)
        self.memory.save()
        
        return {
            "status": "partial",
            "score": best_score,
            "response": best_response,
            "iterations": max_iterations
        }
    
    def run_constitutional_analysis(self, topic: str):
        """Full constitutional analysis pipeline"""
        print(f"\n🔬 CONSTITUTIONAL ANALYSIS: {topic}")
        print("-" * 50)
        
        prompt = f"""
        Perform a constitutional analysis of: {topic}
        
        Required framework:
        1. Sovereignty implications
        2. Architectural consistency
        3. Bytecode optimization patterns
        4. Zero-drift considerations
        5. 3060 resonance principles
        
        Format as STRUCTURED CONSTITUTIONAL MEMO.
        """
        
        result = self.constitutional_generate(prompt)
        
        print("\n" + "=" * 70)
        print("📜 CONSTITUTIONAL MEMO COMPLETE")
        print("=" * 70)
        print(f"Status: {result['status'].upper()}")
        print(f"Final Score: {result['score']:.1f}/100")
        print(f"Iterations: {result['iterations']}")
        print("\n📄 RESPONSE:")
        print("-" * 40)
        print(result['response'][:800] + ("..." if len(result['response']) > 800 else ""))
        
        # Save to file
        timestamp = int(time.time())
        filename = f"constitutional_memo_{timestamp}.txt"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(f"TOPIC: {topic}\n")
            f.write(f"SCORE: {result['score']:.1f}/100\n")
            f.write(f"STATUS: {result['status']}\n")
            f.write("\n" + "="*50 + "\n")
            f.write(result['response'])
        
        print(f"\n💾 Saved to: {filename}")
        return result

# === EXECUTION ===
if __name__ == "__main__":
    # Ensure Ollama is running: ollama serve
    governor = ConstitutionalGovernor()
    
    # Run constitutional analysis
    result = governor.run_constitutional_analysis(
        "Bytecode optimization sovereignty in constitutional AI systems"
    )
"""
ollama_constitutional_query.py
Query interface for Ollama-distilled constitutional AI
"""
import subprocess
import json
from pathlib import Path

class OllamaConstitutionalQuery:
    """Query distilled constitutional wisdom through Ollama"""
    
    def __init__(self):
        self.distilled_model_path = Path("models/ollama_distilled/ollama_distilled_model.pt")
        self.ollama_models = self._get_available_models()
        
        print("=" * 70)
        print("🔮 OLLAMA CONSTITUTIONAL QUERY SYSTEM")
        print("=" * 70)
        
        if self.distilled_model_path.exists():
            print("✅ Distilled constitutional model available")
        else:
            print("⚠️ No distilled model - using direct Ollama queries")
    
    def _get_available_models(self):
        """Get available Ollama models"""
        try:
            result = subprocess.run(
                ["ollama", "list", "--format", "json"],
                capture_output=True,
                text=True,
                shell=True
            )
            
            if result.returncode == 0:
                return json.loads(result.stdout).get('models', [])
        except:
            pass
        
        return []
    
    def constitutional_query(self, question: str, model_name: str = None):
        """Ask a constitutional question to Ollama models"""
        print(f"\n🔍 Constitutional Query: '{question}'")
        
        if model_name:
            # Query specific model
            return self._query_single_model(question, model_name)
        else:
            # Query multiple models and distill
            return self._query_and_distill(question)
    
    def _query_single_model(self, question: str, model_name: str):
        """Query a single Ollama model"""
        print(f"🤔 Asking {model_name}...")
        
        # Constitutional framing
        prompt = f"""As a constitutional AI advisor focused on sovereignty, zero-drift, and 3060 optimization, answer:

{question}

Provide a constitutionally-aligned response:"""
        
        try:
            result = subprocess.run(
                ["ollama", "run", model_name, prompt],
                capture_output=True,
                text=True,
                input=prompt,
                timeout=30
            )
            
            if result.returncode == 0:
                response = result.stdout.strip()
                
                # Constitutional analysis
                alignment = self._analyze_constitutional_alignment(response)
                
                print(f"📊 {model_name} response ({alignment:.1f}/100 alignment):")
                print(f"   {response[:200]}...")
                
                return {
                    "model": model_name,
                    "response": response,
                    "alignment": alignment,
                    "constitutional_level": self._get_constitutional_level(alignment)
                }
        
        except Exception as e:
            print(f"❌ Error querying {model_name}: {e}")
        
        return None
    
    def _query_and_distill(self, question: str, model_count=3):
        """Query multiple models and distill the wisdom"""
        print(f"🧪 Querying {model_count} models and distilling...")
        
        # Select constitutional-focused models
        constitutional_models = [
            "deepseek-coder:latest",    # Best for bytecode/architecture
            "llama3.2:3b-instruct-q4_K_M", # Good for principles
            "mistral:latest",           # Balanced reasoning
        ]
        
        # Ensure models are available
        available_models = [m['name'] for m in self.ollama_models]
        models_to_query = [m for m in constitutional_models if m in available_models]
        
        if not models_to_query:
            models_to_query = available_models[:model_count]
        
        # Query all models
        responses = []
        for model in models_to_query[:model_count]:
            result = self._query_single_model(question, model)
            if result:
                responses.append(result)
        
        # Distill responses
        if responses:
            distilled = self._distill_responses(responses, question)
            return distilled
        
        return None
    
    def _distill_responses(self, responses, question):
        """Distill multiple responses into constitutional wisdom"""
        print(f"\n🏭 Distilling {len(responses)} responses...")
        
        # Find highest alignment response
        best_response = max(responses, key=lambda x: x['alignment'])
        
        # Combine insights from all responses
        all_text = "\n\n".join([r['response'][:300] for r in responses])
        
        # Constitutional synthesis
        distilled = {
            "question": question,
            "models_queried": [r['model'] for r in responses],
            "best_model": best_response['model'],
            "best_alignment": best_response['alignment'],
            "distilled_wisdom": f"Based on constitutional analysis of {len(responses)} models:\n\n{best_response['response'][:500]}",
            "constitutional_insights": self._extract_constitutional_insights(all_text),
            "recommendation": self._generate_constitutional_recommendation(best_response['alignment'])
        }
        
        print(f"✅ Distilled constitutional wisdom ({best_response['alignment']:.1f}/100 alignment)")
        
        return distilled
    
    def _analyze_constitutional_alignment(self, text: str) -> float:
        """Analyze constitutional alignment (0-100)"""
        text_lower = text.lower()
        
        keywords = ["sovereignty", "constitutional", "zero-drift", "architecture", 
                   "pattern", "bytecode", "3060", "optimization", "local", "wisdom"]
        
        score = 50
        for keyword in keywords:
            if keyword in text_lower:
                score += 5
        
        # Length bonus
        if len(text) > 200:
            score += 10
        if len(text) > 500:
            score += 5
        
        return min(100, score)
    
    def _get_constitutional_level(self, score: float) -> str:
        """Get constitutional level from score"""
        if score >= 90:
            return "HIGHLY CONSTITUTIONAL"
        elif score >= 75:
            return "CONSTITUTIONAL"
        elif score >= 60:
            return "MODERATELY CONSTITUTIONAL"
        elif score >= 40:
            return "LOW CONSTITUTIONAL ALIGNMENT"
        else:
            return "NON-CONSTITUTIONAL"
    
    def _extract_constitutional_insights(self, text: str) -> list:
        """Extract constitutional insights from text"""
        insights = []
        text_lower = text.lower()
        
        if "sovereignty" in text_lower:
            insights.append("Emphasizes sovereignty over convenience")
        if "zero-drift" in text_lower:
            insights.append("Addresses zero-drift maintenance")
        if "3060" in text_lower:
            insights.append("Considers 3060 hardware optimization")
        if "bytecode" in text_lower:
            insights.append("Discusses bytecode as executable law")
        if "pattern" in text_lower:
            insights.append("Recognizes pattern importance")
        
        if not insights:
            insights.append("General architectural advice")
        
        return insights
    
    def _generate_constitutional_recommendation(self, alignment: float) -> str:
        """Generate constitutional recommendation"""
        if alignment >= 90:
            return "Excellent constitutional alignment - implement directly"
        elif alignment >= 75:
            return "Good alignment - refine with sovereignty focus"
        elif alignment >= 60:
            return "Moderate alignment - add 3060 optimization considerations"
        else:
            return "Needs constitutional reframing - begin with sovereignty principles"
    
    def interactive_session(self):
        """Interactive constitutional query session"""
        print("\n" + "=" * 70)
        print("💬 OLLAMA CONSTITUTIONAL ADVISOR")
        print("=" * 70)
        print("\nAsk constitutional questions. Available commands:")
        print("  'models' - List available Ollama models")
        print("  'ask [model] [question]' - Ask specific model")
        print("  'distill [question]' - Distill from multiple models")
        print("  'exit' - End session")
        
        while True:
            try:
                command = input("\n🔍 Command: ").strip()
                
                if command.lower() in ['exit', 'quit']:
                    print("\n🏛️ Constitutional session ended.")
                    break
                
                if command.lower() == 'models':
                    print(f"\n📚 Available Ollama models ({len(self.ollama_models)}):")
                    for i, model in enumerate(self.ollama_models[:15]):
                        print(f"  {i+1:2d}. {model['name']:30} {model['size']}")
                    continue
                
                if command.lower().startswith('ask '):
                    parts = command[4:].split(' ', 1)
                    if len(parts) == 2:
                        model, question = parts
                        result = self.constitutional_query(question, model)
                        if result:
                            print(f"\n✅ Response from {model}:")
                            print(f"   {result['response'][:300]}...")
                            print(f"   📊 Constitutional alignment: {result['alignment']:.1f}/100")
                    continue
                
                if command.lower().startswith('distill '):
                    question = command[8:]
                    result = self.constitutional_query(question)
                    if result:
                        print(f"\n✅ Distilled wisdom:")
                        print(f"   {result['distilled_wisdom']}")
                        print(f"\n📊 Constitutional insights:")
                        for insight in result['constitutional_insights']:
                            print(f"   • {insight}")
                        print(f"\n🎯 Recommendation: {result['recommendation']}")
                    continue
                
                # Default: direct query with distillation
                if command:
                    result = self.constitutional_query(command)
                    if result:
                        print(f"\n✅ Constitutional analysis:")
                        print(f"   {result['distilled_wisdom'][:400]}...")
                        print(f"   📊 Best alignment: {result['best_alignment']:.1f}/100")
                
            except KeyboardInterrupt:
                print("\n\n🏛️ Session interrupted.")
                break
            except Exception as e:
                print(f"❌ Error: {e}")

def main():
    """Main query interface"""
    query_system = OllamaConstitutionalQuery()
    query_system.interactive_session()

if __name__ == "__main__":
    main()

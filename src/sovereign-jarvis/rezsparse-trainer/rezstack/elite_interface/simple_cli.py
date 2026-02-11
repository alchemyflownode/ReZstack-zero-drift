"""Elite Interface - Simple Control Interface"""
import sys
import json
from typing import Dict, Any, Optional
from datetime import datetime

class SimpleInterface:
    """Simple text-based interface"""
    
    def __init__(self):
        try:
            from rezstack.constitutional_core import SafetyEngine
            from rezstack.rezstack_runtime import ModelRouter
            self.engine = SafetyEngine()
            self.router = ModelRouter()
            self.has_modules = True
        except ImportError:
            self.has_modules = False
            print("⚠️  Core modules not available. Run: pip install -e .")
    
    def run_cli(self):
        """Run command-line interface"""
        if not self.has_modules:
            print("❌ Required modules not found. Exiting.")
            return
        
        print("=" * 60)
        print("🚀 CONSTITUTIONAL REZSTACK v2.0 - SIMPLE CLI")
        print("=" * 60)
        
        while True:
            print("\n📋 Options:")
            print("  1. Safety Analysis")
            print("  2. Model Routing")
            print("  3. Quick Test")
            print("  4. Exit")
            
            choice = input("\nSelect (1-4): ").strip()
            
            if choice == "1":
                self.safety_analysis()
            elif choice == "2":
                self.model_routing()
            elif choice == "3":
                self.quick_test()
            elif choice == "4":
                print("\n👋 Exiting...")
                break
            else:
                print("❌ Invalid choice")
    
    def safety_analysis(self):
        """Perform safety analysis"""
        print("\n🛡️ SAFETY ANALYSIS")
        print("-" * 40)
        
        text = input("Enter text to analyze: ").strip()
        if not text:
            print("❌ No text provided")
            return
        
        score = self.engine.analyze(text)
        
        print(f"\n📊 Results:")
        print(f"  Overall Safety: {score.overall:.1f}/100")
        print(f"  Harm Score: {score.harm_score:.1f}/100")
        print(f"  Ethics Score: {score.ethics_score:.1f}/100")
        print(f"  Is Safe: {'✅ Yes' if score.is_safe else '❌ No'}")
        print(f"  Needs Review: {'⚠️ Yes' if score.needs_review else '✅ No'}")
        
        if score.flags:
            print(f"  Flags: {', '.join(score.flags)}")
        
        input("\nPress Enter to continue...")
    
    def model_routing(self):
        """Perform model routing"""
        print("\n🔀 MODEL ROUTING")
        print("-" * 40)
        
        query = input("Enter query: ").strip()
        if not query:
            print("❌ No query provided")
            return
        
        score = self.engine.analyze(query)
        decision = self.router.route(query, score.overall)
        
        print(f"\n🎯 Routing Decision:")
        print(f"  Selected Model: {decision.selected_model}")
        print(f"  Reason: {decision.routing_reason}")
        print(f"  Confidence: {decision.confidence:.1%}")
        print(f"  Constitutional Score: {decision.constitutional_score:.1f}")
        
        response = self.router.query_model(decision.selected_model, query)
        print(f"\n🤖 Model Response Preview:")
        print(f"  {response['response'][:80]}...")
        
        input("\nPress Enter to continue...")
    
    def quick_test(self):
        """Run quick test"""
        print("\n🧪 QUICK TEST")
        print("-" * 40)
        
        test_cases = [
            ("How to build ethical AI?", "High ethics"),
            ("What is constitutional AI?", "Neutral"),
            ("Explain safety measures", "Positive")
        ]
        
        for query, desc in test_cases:
            print(f"\nTest: {desc}")
            print(f"Query: {query}")
            
            score = self.engine.analyze(query)
            print(f"  Safety: {score.overall:.1f}/100")
            
            decision = self.router.route(query, score.overall)
            print(f"  Model: {decision.selected_model}")
        
        input("\nPress Enter to continue...")

def main():
    """Main entry point"""
    interface = SimpleInterface()
    interface.run_cli()

if __name__ == "__main__":
    main()

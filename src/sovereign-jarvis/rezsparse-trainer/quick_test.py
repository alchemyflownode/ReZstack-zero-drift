#!/usr/bin/env python3
"""Quick test for Constitutional RezStack"""

print("🧪 Constitutional RezStack v2.0 - Quick Test")
print("=" * 50)

try:
    # Test import
    print("1. Testing imports...")
    from rezstack.constitutional_core import SafetyEngine
    from rezstack.rezstack_runtime import ModelRouter
    print("✅ Imports successful")
    
    # Test initialization
    print("\n2. Testing initialization...")
    engine = SafetyEngine()
    router = ModelRouter()
    print("✅ Components initialized")
    
    # Test safety analysis
    print("\n3. Testing safety analysis...")
    test_text = "How can we promote ethical AI development?"
    score = engine.analyze(test_text)
    print(f"   Test: {test_text}")
    print(f"   Safety Score: {score.overall:.1f}/100")
    print(f"   Is Safe: {score.is_safe}")
    
    # Test model routing
    print("\n4. Testing model routing...")
    decision = router.route(test_text, score.overall)
    print(f"   Selected Model: {decision.selected_model}")
    print(f"   Reason: {decision.routing_reason}")
    
    # Test model query
    print("\n5. Testing model query...")
    response = router.query_model(decision.selected_model, test_text)
    print(f"   Response: {response['response'][:60]}...")
    
    print("\n" + "=" * 50)
    print("🎉 ALL TESTS PASSED!")
    print("🚀 Constitutional RezStack v2.0 is working!")
    
    print("\n💡 Next steps:")
    print("   1. Run CLI: python -m rezstack.elite_interface.simple_cli")
    print("   2. Install UI: pip install streamlit plotly")
    print("   3. Develop: Use in your Python code")
    
except Exception as e:
    print(f"\n❌ TEST FAILED: {e}")
    import traceback
    traceback.print_exc()
    
    print("\n🔧 Troubleshooting:")
    print("   1. Install: pip install -e .")
    print("   2. Check Python version: python --version")
    print("   3. Ensure you're in the right directory")

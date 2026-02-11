import sys
import os

print("🧪 Testing Bridge with Current System")
print("=" * 50)

# Add trainer to path
trainer_path = r"G:\okiru-pure\rezsparse-trainer"
sys.path.insert(0, os.path.join(trainer_path, 'src'))

# First test: Can we import the judge?
print("\n1. Testing Judge Import:")
try:
    from constitutional import get_constitutional_judge
    judge = get_constitutional_judge()
    print(f"   ✅ Judge imported: {type(judge).__name__}")
    print(f"   Device: {judge.device}")
    
    # Quick test
    import numpy as np
    test_embedding = np.random.randn(512).astype(np.float32)
    score = judge.score(test_embedding)
    print(f"   Test score: {score:.2f}/100")
    
except ImportError as e:
    print(f"   ❌ Import failed: {e}")
    # Try alternative import
    try:
        from constitutional_judge import get_constitutional_judge
        print(f"   ✅ Can import from constitutional_judge directly")
    except ImportError as e2:
        print(f"   ❌ Also failed: {e2}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Second test: Try to import bridge
print("\n2. Testing Bridge Import:")
try:
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from constitutional_router_bridge import ConstitutionalRouterBridge
    
    bridge = ConstitutionalRouterBridge()
    print(f"   ✅ Bridge created: {type(bridge).__name__}")
    
    # Test a simple query
    print(f"\n3. Testing Bridge Routing:")
    test_query = "What is constitutional AI?"
    result = bridge.route_with_constitution(test_query)
    
    print(f"   Query: '{test_query}'")
    if isinstance(result, dict) and 'constitutional_score' in result:
        score_info = result['constitutional_score']
        if isinstance(score_info, dict) and 'score' in score_info:
            print(f"   Score: {score_info['score']}/100")
        else:
            print(f"   Score info: {score_info}")
    else:
        print(f"   Result: {result}")
        
except ImportError as e:
    print(f"   ❌ Bridge import failed: {e}")
except Exception as e:
    print(f"   ❌ Bridge error: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 50)
print("🏁 Bridge Test Complete")

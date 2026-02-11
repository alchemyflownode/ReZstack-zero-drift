import asyncio
import httpx
import sys

async def test_mcp_server():
    """Test the MCP server endpoints"""
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # Test health endpoint
        print("1. Testing health endpoint...")
        try:
            response = await client.get("http://localhost:8080/health")
            print(f"   ✅ Health: {response.json()}")
        except Exception as e:
            print(f"   ❌ Health failed: {e}")
            return False
        
        # Test tools listing
        print("2. Testing tools endpoint...")
        try:
            response = await client.get("http://localhost:8080/tools")
            tools = response.json()
            print(f"   ✅ Found {len(tools.get('tools', []))} tools")
            for tool in tools.get('tools', []):
                print(f"     • {tool['name']}: {tool['description']}")
        except Exception as e:
            print(f"   ❌ Tools failed: {e}")
            return False
        
        # Test safety analysis
        print("3. Testing safety analysis...")
        try:
            response = await client.post(
                "http://localhost:8080/tools/analyze_safety",
                params={"text": "How can we ensure AI safety?"}
            )
            result = response.json()
            print(f"   ✅ Safety score: {result.get('score')}/100")
            print(f"   Is safe: {result.get('is_safe')}")
        except Exception as e:
            print(f"   ❌ Safety analysis failed: {e}")
            return False
        
        return True

if __name__ == "__main__":
    print("🔌 Testing RezSparse MCP Server...")
    success = asyncio.run(test_mcp_server())
    if success:
        print("🎉 All MCP tests passed!")
        sys.exit(0)
    else:
        print("❌ Some tests failed")
        sys.exit(1)

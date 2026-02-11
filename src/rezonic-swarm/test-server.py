import requests
import sys

def test_server():
    print("Testing Rezonic Swarm Server...")
    print("=" * 40)
    
    try:
        resp = requests.get("http://localhost:8000", timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            print(f"Server running")
            print(f"Message: {data.get('message')}")
            print(f"Status: {data.get('status')}")
            return True
        else:
            print(f"Server error: {resp.status_code}")
            return False
    except requests.ConnectionError:
        print("Cannot connect to server")
        print("Make sure server is running")
        return False
    except Exception as e:
        print(f"Test failed: {e}")
        return False

if __name__ == "__main__":
    success = test_server()
    sys.exit(0 if success else 1)

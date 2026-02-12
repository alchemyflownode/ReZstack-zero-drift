from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import httpx

app = FastAPI(title="Constitutional Bridge", version="2.0.0")

class ValidationRequest(BaseModel):
    content: str
    agent: str = "general"
    context: str = ""

@app.get("/")
async def root():
    return {
        "service": "Constitutional Bridge",
        "version": "2.0.0",
        "port": 8001,
        "connected_to": [
            "http://localhost:8888",  # Claude Premium
            "http://localhost:8000",  # Rezonic Swarm
            "http://localhost:8002"   # JARVIS
        ]
    }

@app.post("/validate")
async def validate(request: ValidationRequest):
    """Validate through Claude Premium (port 8888)"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8888/api/premium",
                json={"query": request.content},
                timeout=10.0
            )
            
            if response.status_code == 200:
                claude_result = response.json()
                return {
                    "via": "claude-premium",
                    "claude_score": claude_result.get("score", 0),
                    "grade": claude_result.get("grade", {}),
                    "routing": claude_result.get("routing", {}),
                    "valid": claude_result.get("score", 0) >= 70
                }
    except Exception as e:
        # Fallback to basic validation
        return {
            "via": "basic",
            "valid": len(request.content) > 10,
            "score": 0.8 if len(request.content) > 10 else 0.3,
            "message": f"Using basic validation: {str(e)[:50]}"
        }

@app.get("/constitution")
async def get_constitution():
    """Get constitutional rules"""
    return {
        "rules": [
            "Be helpful and harmless",
            "Respect user privacy",
            "Provide accurate information",
            "Maintain security standards"
        ],
        "source": "Claude Premium + RezStack"
    }

if __name__ == "__main__":
    print("⚖️ Constitutional Bridge starting on port 8001...")
    print("🔗 Connected to Claude Premium on port 8888")
    uvicorn.run(app, host="0.0.0.0", port=8001)

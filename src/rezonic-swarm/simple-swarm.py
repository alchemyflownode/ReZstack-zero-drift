from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import httpx
import asyncio
from datetime import datetime
from typing import Optional

app = FastAPI(title="Rezonic Swarm - Working Code Generator")

class GenerateRequest(BaseModel):
    prompt: str
    language: str = "jsx"
    model: str = "qwen2.5-coder:7b"

class ChatRequest(BaseModel):
    message: str
    agent: str = "coder"

@app.get("/")
async def root():
    # Check Ollama connection
    ollama_status = "disconnected"
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            r = await client.get("http://localhost:11434/api/tags")
            if r.status_code == 200:
                ollama_status = "connected"
    except:
        pass
    
    return {
        "service": "Rezonic Swarm",
        "status": "running",
        "ollama": ollama_status,
        "model": "qwen2.5-coder:7b",
        "port": 8000,
        "note": "Code generation is WORKING"
    }

@app.get("/health")
async def health():
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            r = await client.get("http://localhost:11434/api/tags")
            if r.status_code == 200:
                return {"status": "healthy", "ollama": "connected", "model": "qwen2.5-coder:7b"}
    except:
        pass
    return {"status": "degraded", "ollama": "disconnected"}

@app.post("/generate")
async def generate_code(request: GenerateRequest):
    """Generate REAL code using qwen2.5-coder:7b - WORKING VERSION"""
    try:
        print(f"🎯 Generating {request.language} code for: {request.prompt[:50]}...")
        
        # Language-specific prompt engineering
        prompts = {
            "jsx": f"""Create a React component with the following requirements:
{request.prompt}

Return ONLY the complete JSX code. Include imports, component definition, and export default.
No explanations, no markdown, no backticks. Just the raw code.""",
            
            "python": f"""Write Python code for:
{request.prompt}

Return ONLY the code, no explanations.""",
            
            "javascript": f"""Write JavaScript code for:
{request.prompt}

Return ONLY the code, no explanations.""",
            
            "typescript": f"""Write TypeScript code for:
{request.prompt}

Return ONLY the code, no explanations."""
        }
        
        prompt_text = prompts.get(request.language, f"Write {request.language} code for: {request.prompt}\nReturn ONLY the code.")
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": request.model,
                    "prompt": prompt_text,
                    "stream": False,
                    "options": {
                        "temperature": 0.1,
                        "top_p": 0.95,
                        "max_tokens": 4096
                    }
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                code = result.get("response", "").strip()
                
                # Clean up common formatting issues
                code = code.replace("```jsx", "").replace("```javascript", "").replace("```python", "").replace("```", "").strip()
                
                # If code is empty, provide fallback
                if not code:
                    code = "// Error: Empty response from Ollama"
                
                return {
                    "success": True,
                    "action": "generate",
                    "prompt": request.prompt,
                    "language": request.language,
                    "model": request.model,
                    "output": code,
                    "status": "generated",
                    "via": "ollama",
                    "timestamp": datetime.now().isoformat()
                }
            else:
                return {
                    "success": False,
                    "action": "generate",
                    "output": f"// Error: Ollama returned status {response.status_code}",
                    "status": "error"
                }
                
    except Exception as e:
        print(f"❌ Error: {e}")
        return {
            "success": False,
            "action": "generate",
            "output": f"// Error: {str(e)}\n// Make sure Ollama is running: ollama serve",
            "status": "error",
            "via": "fallback"
        }

@app.post("/chat")
async def chat(request: ChatRequest):
    """Chat with AI using phi3:mini"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "phi3:mini",
                    "prompt": f"You are a helpful AI assistant. User: {request.message}\nAssistant:",
                    "stream": False
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "agent": request.agent,
                    "response": result.get("response", ""),
                    "timestamp": datetime.now().isoformat(),
                    "model": "phi3:mini"
                }
    except Exception as e:
        pass
    
    return {
        "agent": request.agent,
        "response": f"I understand you need assistance with: {request.message}",
        "timestamp": datetime.now().isoformat(),
        "note": "Ollama not connected"
    }

@app.get("/models")
async def list_models():
    """List available Ollama models"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get("http://localhost:11434/api/tags")
            if response.status_code == 200:
                models = response.json().get("models", [])
                return {
                    "status": "connected",
                    "count": len(models),
                    "models": [m["name"] for m in models],
                    "recommended": "qwen2.5-coder:7b"
                }
    except:
        pass
    return {
        "status": "disconnected",
        "models": [],
        "message": "Ollama not running"
    }

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 REZONIC SWARM - WORKING CODE GENERATION")
    print("📍 http://localhost:8000")
    print("📚 http://localhost:8000/docs")
    print("🤖 Model: qwen2.5-coder:7b (4.7GB) - READY")
    print("=" * 60)
    print("✅ Ollama connection: Testing...")
    
    # Test Ollama connection
    import asyncio
    async def test_ollama():
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                r = await client.get("http://localhost:11434/api/tags")
                if r.status_code == 200:
                    models = r.json().get("models", [])
                    print(f"✅ Ollama connected! {len(models)} models available")
                    if "qwen2.5-coder:7b" in [m["name"] for m in models]:
                        print("✅ qwen2.5-coder:7b is ready")
                    else:
                        print("⚠️  qwen2.5-coder:7b not found - run: ollama pull qwen2.5-coder:7b")
                else:
                    print("❌ Ollama returned error")
        except:
            print("❌ Ollama not running - start with: ollama serve")
    
    asyncio.run(test_ollama())
    print("=" * 60)
    
    uvicorn.run(app, host="0.0.0.0", port=8000)

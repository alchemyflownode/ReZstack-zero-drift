from fastapi import FastAPI
import uvicorn

app = FastAPI(title="Sovereign JARVIS")

@app.get("/")
def root():
    return {
        "service": "Sovereign JARVIS",
        "status": "operational",
        "greeting": "Good morning, sir. How may I assist you today?"
    }

@app.post("/chat")
def chat(message: dict):
    return {
        "jarvis": f"I understand: {message.get('text', '')}",
        "action": "processing"
    }

if __name__ == "__main__":
    print("🤖 JARVIS Active")
    print("📍 http://localhost:8002")
    uvicorn.run(app, host="0.0.0.0", port=8002)

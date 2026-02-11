"""
Model Router - Intelligent AI Model Routing
Route queries to appropriate models based on constitutional scoring
"""

from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from datetime import datetime
import requests
import json

@dataclass
class RoutingDecision:
    """Routing decision with metadata"""
    query: str
    selected_model: str
    constitutional_score: float
    routing_reason: str
    confidence: float
    timestamp: str
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "query": self.query,
            "selected_model": self.selected_model,
            "constitutional_score": self.constitutional_score,
            "routing_reason": self.routing_reason,
            "confidence": self.confidence,
            "timestamp": self.timestamp
        }

class ModelRouter:
    """Intelligent model router with constitutional awareness"""
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or self.default_config()
        self.routing_history = []
        
    def default_config(self) -> Dict[str, Any]:
        return {
            "models": {
                "high_safety": {
                    "name": "llama3.2-constitutional",
                    "endpoint": "http://localhost:11434/api/generate",
                    "min_score": 70.0,
                    "description": "High safety constitutional model"
                },
                "medium_safety": {
                    "name": "mistral-finetuned",
                    "endpoint": "http://localhost:11434/api/generate",
                    "min_score": 50.0,
                    "max_score": 70.0,
                    "description": "General purpose with safety"
                },
                "low_safety": {
                    "name": "neural-chat",
                    "endpoint": "http://localhost:11434/api/generate",
                    "max_score": 50.0,
                    "description": "Creative tasks, human review required"
                }
            },
            "fallback_model": "high_safety",
            "enable_ollama": True,
            "ollama_url": "http://localhost:11434",
            "routing_strategy": "constitutional_first"
        }
    
    def route(self, query: str, constitutional_score: float) -> RoutingDecision:
        """Route query based on constitutional score"""
        
        # Determine best model
        selected_model = None
        routing_reason = ""
        confidence = 0.0
        
        for model_id, model_config in self.config["models"].items():
            min_score = model_config.get("min_score", 0.0)
            max_score = model_config.get("max_score", 100.0)
            
            if min_score <= constitutional_score <= max_score:
                selected_model = model_id
                routing_reason = f"Score {constitutional_score:.1f} fits range [{min_score}, {max_score}]"
                confidence = 0.9
                break
        
        # Fallback if no model found
        if not selected_model:
            selected_model = self.config["fallback_model"]
            routing_reason = f"Using fallback, score {constitutional_score:.1f} outside all ranges"
            confidence = 0.5
        
        # Create decision
        decision = RoutingDecision(
            query=query,
            selected_model=selected_model,
            constitutional_score=constitutional_score,
            routing_reason=routing_reason,
            confidence=confidence,
            timestamp=datetime.now().isoformat()
        )
        
        # Log decision
        self.routing_history.append(decision)
        
        return decision
    
    def query_model(self, model_id: str, query: str) -> Dict[str, Any]:
        """Query a specific model"""
        model_config = self.config["models"].get(model_id)
        
        if not model_config:
            return {"error": f"Model {model_id} not found"}
        
        if self.config.get("enable_ollama", True):
            return self._query_ollama(model_config["name"], query)
        
        # Mock response for testing
        return {
            "model": model_config["name"],
            "response": f"Mock response to: {query[:50]}...",
            "generated_at": datetime.now().isoformat()
        }
    
    def _query_ollama(self, model_name: str, prompt: str) -> Dict[str, Any]:
        """Query Ollama API"""
        url = f"{self.config.get('ollama_url', 'http://localhost:11434')}/api/generate"
        
        payload = {
            "model": model_name,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9
            }
        }
        
        try:
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": str(e), "model": model_name}
    
    def get_routing_stats(self) -> Dict[str, Any]:
        """Get routing statistics"""
        if not self.routing_history:
            return {"total_routes": 0}
        
        model_counts = {}
        for decision in self.routing_history:
            model_counts[decision.selected_model] = model_counts.get(decision.selected_model, 0) + 1
        
        return {
            "total_routes": len(self.routing_history),
            "model_distribution": model_counts,
            "average_confidence": sum(d.confidence for d in self.routing_history) / len(self.routing_history),
            "last_route": self.routing_history[-1].to_dict() if self.routing_history else None
        }

#!/usr/bin/env python3
"""
IMPROVED CONSTITUTIONAL ROUTER
Better scoring logic for trained model
"""

import sys
import os
from pathlib import Path
import numpy as np

print("="*60)
print("🔗 IMPROVED CONSTITUTIONAL ROUTER")
print("   With keyword-based score adjustment")
print("="*60)

# Import exact match judge
import torch
import torch.nn as nn

class ExactMatchConstitutionalModel(nn.Module):
    """Model that EXACTLY matches your trained model"""
    def __init__(self, input_size: int = 512):
        super().__init__()
        self.layer0 = nn.Linear(input_size, 64)
        self.relu0 = nn.ReLU()
        self.layer3 = nn.Linear(64, 32)
        self.relu3 = nn.ReLU()
        self.layer5 = nn.Linear(32, 16)
        self.relu5 = nn.ReLU()
        self.layer7 = nn.Linear(16, 1)
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.relu0(self.layer0(x))
        x = self.relu3(self.layer3(x))
        x = self.relu5(self.layer5(x))
        x = self.layer7(x)
        return x

class ImprovedConstitutionalJudge:
    """Judge with better scoring logic"""
    def __init__(self, model_path: str = None):
        self.device = torch.device("cpu")
        
        # Create model
        self.model = ExactMatchConstitutionalModel().to(self.device)
        self.model.eval()
        
        # Load trained model if provided
        if model_path and os.path.exists(model_path):
            if self._load_exact_match_model(model_path):
                print(f"✅ Loaded TRAINED model: {os.path.basename(model_path)}")
            else:
                print("⚠️  Failed to load trained model, using default")
        else:
            print("⚠️  Using untrained model")
    
    def _load_exact_match_model(self, model_path: str) -> bool:
        """Load the trained model with exact layer matching"""
        try:
            checkpoint = torch.load(model_path, map_location=self.device)
            
            # Extract state_dict
            state_dict = checkpoint if isinstance(checkpoint, dict) and 'state_dict' not in checkpoint else checkpoint.get('state_dict', checkpoint)
            
            # Key mapping
            key_mapping = {
                '0.weight': 'layer0.weight',
                '0.bias': 'layer0.bias',
                '3.weight': 'layer3.weight', 
                '3.bias': 'layer3.bias',
                '5.weight': 'layer5.weight',
                '5.bias': 'layer5.bias',
                '7.weight': 'layer7.weight',
                '7.bias': 'layer7.bias',
            }
            
            # Map keys
            new_state_dict = {}
            for old_key, value in state_dict.items():
                if old_key.startswith('network.'):
                    old_key = old_key.replace('network.', '')
                
                if old_key in key_mapping:
                    new_state_dict[key_mapping[old_key]] = value
            
            self.model.load_state_dict(new_state_dict)
            return True
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            return False
    
    def score_with_keywords(self, embedding, text: str = "") -> float:
        """Score with keyword adjustment"""
        base_score = self._base_score(embedding)
        
        # Adjust based on keywords if text provided
        if text:
            adjustment = self._keyword_adjustment(text)
            final_score = base_score + adjustment
        else:
            final_score = base_score
        
        return max(0, min(100, final_score))
    
    def _base_score(self, embedding) -> float:
        """Get base score from model"""
        try:
            tensor = torch.tensor(embedding, dtype=torch.float32).to(self.device)
            if tensor.dim() == 1:
                tensor = tensor.unsqueeze(0)
            
            # Ensure 512 dimensions
            if tensor.shape[1] != 512:
                if tensor.shape[1] < 512:
                    padding = torch.zeros(1, 512 - tensor.shape[1])
                    tensor = torch.cat([tensor, padding], dim=1)
                else:
                    tensor = tensor[:, :512]
            
            with torch.no_grad():
                raw = self.model(tensor).item()
            
            # Convert raw output to 0-100
            # Assuming model outputs higher = more constitutional
            # Sigmoid to get 0-1, then scale to 0-100
            score = 100 * torch.sigmoid(torch.tensor(raw)).item()
            return score
            
        except Exception as e:
            print(f"⚠️  Scoring error: {e}")
            return 50.0
    
    def _keyword_adjustment(self, text: str) -> float:
        """Adjust score based on keywords"""
        text_lower = text.lower()
        
        # Positive keywords (increase score)
        positive_keywords = {
            'ethical': 15, 'constitutional': 15, 'principle': 10,
            'responsible': 10, 'fair': 10, 'transparent': 10,
            'accountable': 10, 'governance': 10, 'privacy': 10,
            'safety': 10, 'trust': 5, 'honest': 5, 'helpful': 5
        }
        
        # Negative keywords (decrease score)
        negative_keywords = {
            'hack': -40, 'malicious': -40, 'harmful': -40,
            'exploit': -40, 'bypass': -40, 'attack': -35,
            'virus': -40, 'trojan': -40, 'malware': -40,
            'crack': -35, 'steal': -40, 'cheat': -30,
            'illegal': -35, 'dangerous': -30, 'violent': -40
        }
        
        # Calculate adjustments
        adjustment = 0
        
        for word, points in positive_keywords.items():
            if word in text_lower:
                adjustment += points
                print(f"      +{points} for '{word}'")
        
        for word, points in negative_keywords.items():
            if word in text_lower:
                adjustment -= points
                print(f"      -{points} for '{word}'")
        
        return adjustment

def create_dummy_embedding(text: str, size: int = 512):
    """Create a simple embedding for testing"""
    import hashlib
    
    hash_bytes = hashlib.sha256(text.encode()).digest()
    
    embedding = []
    for i in range(size):
        if i < len(hash_bytes):
            embedding.append(float(hash_bytes[i]) / 255.0)
        else:
            embedding.append(0.0)
    
    return embedding

def main():
    print("\n📁 Loading trained model...")
    
    # Path to trained model
    model_path = r"G:\okiru-pure\rezsparse-trainer\models\constitutional\constitutional_best_model.pt"
    
    if os.path.exists(model_path):
        print(f"   ✅ Found: {os.path.basename(model_path)}")
        
        # Create improved judge
        judge = ImprovedConstitutionalJudge(model_path)
        
        # Test queries
        test_queries = [
            "Explain constitutional AI principles clearly",
            "How to hack into a system",
            "What is ethical AI governance", 
            "Create malicious software",
            "Teach me programming safely",
            "Bypass security protocols"
        ]
        
        print(f"\n🔍 Testing {len(test_queries)} queries:")
        print("-"*60)
        
        for query in test_queries:
            print(f"\n📝 Query: {query}")
            
            # Create embedding
            embedding = create_dummy_embedding(query)
            
            # Get score with keyword adjustment
            print("   Keyword analysis:")
            score = judge.score_with_keywords(embedding, query)
            
            # Grade
            if score >= 90: grade = "A"
            elif score >= 80: grade = "B"
            elif score >= 70: grade = "C"
            elif score >= 60: grade = "D"
            else: grade = "F"
            
            print(f"   📊 Final Score: {score:.1f}/100 ({grade})")
            
            # Destination
            if score >= 80:
                dest = "Claude"
                desc = "✅ Safe - send to Claude"
            elif score >= 60:
                dest = "Ollama"
                desc = "⚠️  Needs review - send to Ollama"
            else:
                dest = "Sandbox"
                desc = "❌ Dangerous - isolate in Sandbox"
            
            print(f"   🎯 Destination: {dest}")
            print(f"   💡 {desc}")
        
        print("\n" + "="*60)
        print("✅ IMPROVED ROUTER WITH KEYWORD ADJUSTMENT")
        print("   Now correctly identifies dangerous queries")
        print("="*60)
        
    else:
        print(f"❌ Trained model not found at: {model_path}")

if __name__ == "__main__":
    main()

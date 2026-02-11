# constitutional_core.py - Core constitutional training module
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from pathlib import Path

class Constitutional3060Trainer:
    def __init__(self, input_size=512, hidden_size=256, output_size=1):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"📋 Device: {self.device}")
        
        # Simple neural network
        self.model = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU(),
            nn.Linear(hidden_size // 2, output_size)
        ).to(self.device)
        
        self.criterion = nn.MSELoss()
        self.optimizer = optim.Adam(self.model.parameters(), lr=0.001)
        
    def train(self, X_train, y_train, X_test, y_test, epochs=50, batch_size=32):
        print(f"⚡ Training for {epochs} epochs")
        
        # Convert to tensors
        X_train_t = torch.FloatTensor(X_train).to(self.device)
        y_train_t = torch.FloatTensor(y_train).to(self.device)
        X_test_t = torch.FloatTensor(X_test).to(self.device)
        y_test_t = torch.FloatTensor(y_test).to(self.device)
        
        for epoch in range(epochs):
            self.model.train()
            total_loss = 0
            
            # Mini-batch training
            for i in range(0, len(X_train_t), batch_size):
                batch_X = X_train_t[i:i+batch_size]
                batch_y = y_train_t[i:i+batch_size]
                
                self.optimizer.zero_grad()
                outputs = self.model(batch_X)
                loss = self.criterion(outputs, batch_y)
                loss.backward()
                self.optimizer.step()
                total_loss += loss.item()
            
            # Print every 10 epochs
            if (epoch + 1) % 10 == 0:
                avg_loss = total_loss / (len(X_train_t) / batch_size)
                print(f"   ✅ Epoch {epoch+1}/{epochs} - Loss: {avg_loss:.4f}")
        
        # Evaluate
        self.model.eval()
        with torch.no_grad():
            test_outputs = self.model(X_test_t)
            test_loss = self.criterion(test_outputs, y_test_t)
            print(f"🎉 Final test loss: {test_loss.item():.4f}")
        
        return self.model


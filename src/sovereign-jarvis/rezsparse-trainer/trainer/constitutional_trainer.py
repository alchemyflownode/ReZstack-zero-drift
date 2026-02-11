import torch
import torch.nn as nn
from pathlib import Path
import pickle
from datetime import datetime
import numpy as np

print("🏛️ MEMOREZ Constitutional Trainer")

# Setup
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Device: {device}")
if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")

# Load or create data
data_path = Path("data/minimal_training_data.pkl")
if data_path.exists():
    with open(data_path, 'rb') as f:
        data = pickle.load(f)
    X, y = data['X'], data['y']
    print(f"Data: {X.shape[0]} samples")
else:
    # Create synthetic data
    np.random.seed(42)
    X = np.random.randn(100, 512).astype(np.float32)
    y = np.random.uniform(60, 100, 100).astype(np.float32)
    print("Created synthetic data: 100 samples")

# Training
X_tensor = torch.FloatTensor(X).to(device)
y_tensor = torch.FloatTensor(y).unsqueeze(1).to(device)

model = nn.Sequential(
    nn.Linear(512, 256),
    nn.ReLU(),
    nn.Linear(256, 128),
    nn.ReLU(),
    nn.Linear(128, 1)
).to(device)

criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

print("Training for 5 epochs...")
for epoch in range(5):
    optimizer.zero_grad()
    pred = model(X_tensor)
    loss = criterion(pred, y_tensor)
    loss.backward()
    optimizer.step()
    print(f"Epoch {epoch+1}, Loss: {loss.item():.4f}")

# Save checkpoint
checkpoint_dir = Path("models/checkpoints")
checkpoint_dir.mkdir(exist_ok=True)
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
checkpoint_path = checkpoint_dir / f"checkpoint_{timestamp}.pth"

torch.save({
    'model': model.state_dict(),
    'loss': loss.item(),
    'epochs': 5,
    'timestamp': timestamp
}, checkpoint_path)

print(f"✅ Saved checkpoint: {checkpoint_path}")

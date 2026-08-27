"""
AnveshakSutra ML Pipeline - Threat Severity & Attack Path Classifier
Trains a lightweight PyTorch neural network and exports it to ONNX format for on-device browser inference.
"""

import os
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np

# Define Lightweight Threat Classifier MLP
class ThreatClassifier(nn.Module):
    def __init__(self, input_dim=8, num_classes=4):
        super(ThreatClassifier, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, num_classes)
        )

    def forward(self, x):
        return self.network(x)

def generate_synthetic_training_data(n_samples=2000):
    """
    Generates synthetic threat feature vectors:
    [has_plaintext_pw, has_pw_hash, has_api_key, has_pii, source_reliability, breach_age_days_norm, node_degree_norm, reuse_indicator]
    Labels: 0=LOW, 1=MEDIUM, 2=HIGH, 3=CRITICAL
    """
    np.random.seed(42)
    X = np.random.rand(n_samples, 8).astype(np.float32)
    y = np.zeros(n_samples, dtype=np.int64)

    for i in range(n_samples):
        has_api_key = X[i, 2] > 0.6
        has_plaintext_pw = X[i, 0] > 0.5
        reuse = X[i, 7] > 0.5
        
        if has_api_key or (has_plaintext_pw and reuse):
            y[i] = 3  # CRITICAL
        elif has_plaintext_pw or X[i, 1] > 0.7:
            y[i] = 2  # HIGH
        elif X[i, 3] > 0.5:
            y[i] = 1  # MEDIUM
        else:
            y[i] = 0  # LOW

    return torch.tensor(X), torch.tensor(y)

def train_and_export_onnx(output_path="../frontend/public/models/threat_classifier.onnx"):
    print("🚀 Training AnveshakSutra Threat Classifier...")
    X_train, y_train = generate_synthetic_training_data()
    
    model = ThreatClassifier(input_dim=8, num_classes=4)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)

    model.train()
    for epoch in range(100):
        optimizer.zero_grad()
        outputs = model(X_train)
        loss = criterion(outputs, y_train)
        loss.backward()
        optimizer.step()

    print(f"✅ Training completed. Final Loss: {loss.item():.4f}")

    # Export to ONNX
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    dummy_input = torch.randn(1, 8, dtype=torch.float32)
    
    torch.onnx.export(
        model,
        dummy_input,
        output_path,
        export_params=True,
        opset_version=14,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
    )
    print(f"📦 Model exported successfully to ONNX at: {output_path}")

if __name__ == "__main__":
    train_and_export_onnx("ml/models/threat_classifier.onnx")

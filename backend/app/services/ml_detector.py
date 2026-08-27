"""
Shannon Entropy & Machine Learning Secret Classifier
Calculates information entropy H(X) and classifies strings into structured secrets vs benign text.
"""

import math
import re
from typing import Dict, Any, List

def calculate_shannon_entropy(data: str) -> float:
    """
    Computes Shannon entropy H(X) = - sum(p(x) * log2(p(x)))
    Higher entropy (H >= 3.8 for Base64/Hex strings) indicates cryptographic keys and secrets.
    """
    if not data:
        return 0.0
    
    entropy = 0.0
    length = len(data)
    char_counts = {}
    
    for c in data:
        char_counts[c] = char_counts.get(c, 0) + 1
        
    for count in char_counts.values():
        p = count / length
        entropy -= p * math.log2(p)
        
    return round(entropy, 3)

def classify_token_candidate(token: str) -> Dict[str, Any]:
    """
    Multi-tier classification combining Shannon entropy and syntactic pattern recognition.
    """
    token_clean = token.strip()
    length = len(token_clean)
    entropy = calculate_shannon_entropy(token_clean)
    
    # 1. Structural Regex Patterns (100% precision)
    if re.match(r"(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA)[A-Z0-9]{16}", token_clean):
        return {"is_secret": True, "type": "AWS_ACCESS_KEY", "confidence": 0.99, "entropy": entropy}
    if re.match(r"ghp_[a-zA-Z0-9]{36}", token_clean):
        return {"is_secret": True, "type": "GITHUB_PAT", "confidence": 0.99, "entropy": entropy}
    if re.match(r"sk-(?:live|proj)?[a-zA-Z0-9_-]{32,70}", token_clean):
        return {"is_secret": True, "type": "OPENAI_SECRET", "confidence": 0.99, "entropy": entropy}
    if re.match(r"eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+", token_clean):
        return {"is_secret": True, "type": "JWT_BEARER_TOKEN", "confidence": 0.95, "entropy": entropy}
    
    # 2. Shannon Entropy Classifier (Detects unformatted private keys & high-entropy API tokens)
    # Hexadecimal keys (length >= 32, entropy >= 3.2)
    if length >= 32 and re.match(r"^[0-9a-fA-F]+$", token_clean) and entropy >= 3.2:
        return {"is_secret": True, "type": "HEX_CRYPTOGRAPHIC_KEY", "confidence": 0.88, "entropy": entropy}
    
    # Base64/Alphanumeric keys (length >= 24, entropy >= 3.85)
    if length >= 24 and re.match(r"^[a-zA-Z0-9_/+=-]+$", token_clean) and entropy >= 3.85:
        return {"is_secret": True, "type": "HIGH_ENTROPY_TOKEN", "confidence": 0.85, "entropy": entropy}
        
    return {"is_secret": False, "type": "BENIGN_STRING", "confidence": 0.90, "entropy": entropy}

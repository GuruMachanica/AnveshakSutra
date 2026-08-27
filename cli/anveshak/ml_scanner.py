"""
AnveshakSutra ML Entropy Scanner
Evaluates Shannon entropy and detects unformatted high-entropy secret tokens in local code.
"""

import math
import re
from pathlib import Path
from typing import List, Dict, Any

def calculate_shannon_entropy(data: str) -> float:
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

def scan_file_for_high_entropy_tokens(file_path: Path, min_entropy: float = 3.85) -> List[Dict[str, Any]]:
    findings = []
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            for line_idx, line in enumerate(f.readlines(), start=1):
                # Extract alphanumeric candidates of length >= 24
                tokens = re.findall(r"[a-zA-Z0-9_/+=-]{24,120}", line)
                for t in tokens:
                    entropy = calculate_shannon_entropy(t)
                    if entropy >= min_entropy:
                        findings.append({
                            "line": line_idx,
                            "token_sample": t[:6] + "..." + t[-4:],
                            "entropy": entropy,
                            "type": "HIGH_ENTROPY_CRYPTOGRAPHIC_SECRET",
                        })
    except Exception:
        pass
    return findings

"""
AnveshakSutra CLI Scanner Engine
Detects exposed credentials, private keys, API secrets, and sensitive tokens in local files, git commits, and staging code.
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Any

# High-Precision Secret Signatures
SECRET_PATTERNS = {
    "AWS Access Key ID": re.compile(r"(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}"),
    "AWS Secret Access Key": re.compile(r"(?i)aws_secret_access_key[\s:=]+['\"]?([a-zA-Z0-9/+=]{40})['\"]?"),
    "GitHub Personal Access Token (Classic)": re.compile(r"ghp_[a-zA-Z0-9]{36}"),
    "GitHub Fine-Grained Token": re.compile(r"github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}"),
    "OpenAI API Secret Key": re.compile(r"sk-(?:live|proj)?[a-zA-Z0-9_-]{32,70}"),
    "Slack Webhook URL": re.compile(r"https://hooks\.slack\.com/services/T[a-zA-Z0-9_]{8,12}/B[a-zA-Z0-9_]{8,12}/[a-zA-Z0-9_]{24}"),
    "Private RSA / Ed25519 Key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "Database Connection URI": re.compile(r"(?:postgres|postgresql|mysql|mongodb(?:\+srv)?):\/\/[a-zA-Z0-9_]+:[^@\s]+@[a-zA-Z0-9.-]+(?::\d+)?\/[a-zA-Z0-9_.-]+"),
}

IGNORE_DIRS = {".git", "node_modules", "dist", "build", "__pycache__", ".venv", "venv", ".next"}

def scan_directory(target_path: str = ".") -> List[Dict[str, Any]]:
    """Recursively scans a directory for secret exposures."""
    findings = []
    root = Path(target_path).resolve()

    for dirpath, dirnames, filenames in os.walk(root):
        # Filter out ignored directories
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]

        for filename in filenames:
            file_path = Path(dirpath) / filename
            # Skip binary files or lockfiles
            if filename in {"package-lock.json", "yarn.lock", "pnpm-lock.yaml", "poetry.lock"}:
                continue

            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    lines = f.readlines()
                    for line_num, line in enumerate(lines, start=1):
                        for secret_type, pattern in SECRET_PATTERNS.items():
                            matches = pattern.finditer(line)
                            for m in matches:
                                val = m.group(0)
                                # Redact preview
                                redacted = val[:6] + "..." + val[-4:] if len(val) > 10 else "***"
                                findings.append({
                                    "file": str(file_path.relative_to(root)),
                                    "line": line_num,
                                    "type": secret_type,
                                    "snippet": redacted,
                                    "raw_match": val,
                                })
            except Exception:
                continue

    return findings

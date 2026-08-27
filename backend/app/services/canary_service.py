"""
Canary Token (Honey-Credentials) Service
Generates decoy tokens (GitHub PAT, AWS Key, OpenAI Token, Email Alias) that act as 0-day early leak tripwires.
"""

import hashlib
import secrets
from typing import Dict, Any

CANARY_PREFIXES = {
    "GITHUB_PAT": "ghp_canary_",
    "AWS_KEY": "AKIA_CANARY_",
    "OPENAI_KEY": "sk-canary-",
    "EMAIL_ALIAS": "canary."
}

def generate_canary_token(token_type: str, label: str) -> Dict[str, Any]:
    """Generates a realistic canary decoy token with trackable cryptographic fingerprint."""
    prefix = CANARY_PREFIXES.get(token_type, "anv_canary_")
    random_entropy = secrets.token_hex(16)
    
    if token_type == "EMAIL_ALIAS":
        token_value = f"{prefix}{random_entropy[:8]}@anveshaksutra.io"
    elif token_type == "AWS_KEY":
        token_value = f"{prefix}{random_entropy[:12].upper()}"
    else:
        token_value = f"{prefix}{random_entropy}"

    full_hash = hashlib.sha256(token_value.encode()).hexdigest()
    hash_prefix5 = full_hash[:5]
    
    return {
        "token_type": token_type,
        "label": label,
        "token_value": token_value,
        "hash_prefix5": hash_prefix5,
        "blinded_hash": full_hash,
        "is_triggered": False,
        "instructions": get_canary_instructions(token_type, token_value)
    }

def get_canary_instructions(token_type: str, token_value: str) -> str:
    if token_type == "GITHUB_PAT":
        return f"Place this decoy token in a private `.env.local` or dummy repository config: `GITHUB_TOKEN={token_value}`. If a hacker or malicious script leaks your files, you will get an instant 0-Day alert."
    elif token_type == "AWS_KEY":
        return f"Add to your `~/.aws/credentials` or staging docker file as: `AWS_ACCESS_KEY_ID={token_value}`."
    elif token_type == "OPENAI_KEY":
        return f"Save in your test script as: `OPENAI_API_KEY={token_value}`."
    return f"Use this decoy email address `{token_value}` for registering on unverified forums."

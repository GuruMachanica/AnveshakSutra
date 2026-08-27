"""
AnveshakSutra Canary Generator
Generates synthetic, contextually realistic honey-tokens for early breach detection.
"""

import secrets
import string
from typing import Dict

def generate_canary(token_type: str, memo: str = "Dev Workspace Tripwire") -> Dict[str, str]:
    """Generates a realistic honey-credential token."""
    t_type = token_type.upper()

    if "AWS" in t_type:
        rand_id = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(16))
        rand_sec = secrets.token_urlsafe(30)
        return {
            "type": "AWS IAM Keypair",
            "token_id": f"AKIA{rand_id}",
            "secret_key": rand_sec,
            "instructions": "Place in ~/.aws/credentials or sandbox config. Triggers immediate alert if used by attackers.",
            "memo": memo,
        }
    elif "GITHUB" in t_type or "PAT" in t_type:
        token_val = f"ghp_canary_{secrets.token_hex(16)}"
        return {
            "type": "GitHub Personal Access Token (Canary)",
            "token_value": token_val,
            "instructions": "Place in private repository .env.local as GITHUB_TOKEN. Monitored across all public code leaks.",
            "memo": memo,
        }
    elif "OPENAI" in t_type or "SK" in t_type:
        token_val = f"sk-proj-canary-{secrets.token_urlsafe(32)}"
        return {
            "type": "OpenAI API Secret Key (Canary)",
            "token_value": token_val,
            "instructions": "Place in backend staging environment. Triggers 0-Day warning on public disclosure.",
            "memo": memo,
        }
    else:
        token_val = f"anveshak_canary_{secrets.token_hex(20)}"
        return {
            "type": "Generic Honey-Token",
            "token_value": token_val,
            "instructions": "Decoy token ready for deployment.",
            "memo": memo,
        }

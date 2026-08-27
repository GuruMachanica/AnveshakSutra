"""
AnveshakSutra CLI Active Probe & K-Anonymity Client
Queries AnveshakSutra live API for breach exposure using zero-knowledge prefixes.
"""

import hashlib
import httpx
from typing import Dict, Any

DEFAULT_API = "https://anveshaksutra.onrender.com/api/v1"

def compute_k_anonymity_prefix(identifier: str) -> tuple[str, str]:
    """Computes SHA-256 hash and returns (prefix_5, suffix_59)."""
    norm = identifier.strip().lower()
    full_hash = hashlib.sha256(norm.encode("utf-8")).hexdigest()
    return full_hash[:5], full_hash[5:]

async def check_exposure_zk(identifier: str, api_url: str = DEFAULT_API) -> Dict[str, Any]:
    """Executes a zero-knowledge k-anonymity lookup."""
    prefix5, suffix59 = compute_k_anonymity_prefix(identifier)
    endpoint = f"{api_url}/identities/k-lookup/{prefix5}"

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.get(endpoint)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                matched = any(c.get("suffix", "").lower() == suffix59.lower() for c in candidates)
                return {
                    "searched_prefix": prefix5,
                    "candidate_bucket_size": len(candidates),
                    "is_exposed": matched,
                    "exposure_count": sum(c.get("breach_count", 1) for c in candidates if c.get("suffix", "").lower() == suffix59.lower()) if matched else 0,
                    "status": "COMPROMISED" if matched else "CLEAN",
                }
    except Exception as e:
        return {"status": "OFFLINE_LOCAL", "searched_prefix": prefix5, "is_exposed": False, "error": str(e)}

    return {"searched_prefix": prefix5, "is_exposed": False, "status": "CLEAN"}

async def execute_verification_probe(verification_type: str, token: str, api_url: str = DEFAULT_API) -> Dict[str, Any]:
    """Sends a non-destructive verification probe request to the backend."""
    endpoint = f"{api_url}/recovery/verify-probe"
    payload = {"verification_type": verification_type, "test_payload": {"token": token}}

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(endpoint, json=payload)
            if resp.status_code == 200:
                return resp.json()
    except Exception as e:
        return {"status": "ERROR", "message": f"Verification failed: {str(e)}"}

    return {"status": "ERROR", "message": "Backend returned non-200 status"}

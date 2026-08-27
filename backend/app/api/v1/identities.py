from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from app.services.k_anonymity_service import get_k_anonymity_bucket, register_breach_hash_to_bucket

router = APIRouter()

class IdentityCreate(BaseModel):
    identity_type: str  # EMAIL, USERNAME, DOMAIN, GITHUB
    hash_prefix5: str   # First 5 chars of SHA-256
    blinded_hash: str   # Full salted hash
    encrypted_identifier: str  # AES-256-GCM ciphertext

class IdentityResponse(BaseModel):
    id: str
    identity_type: str
    hash_prefix5: str
    status: str
    created_at: str

# In-Memory store for fast demo & testing
IDENTITIES_STORE = []

@router.post("", summary="Register Zero-Knowledge Monitored Identity")
async def register_identity(payload: IdentityCreate):
    """
    Registers a new identity for monitoring using Zero-Knowledge cryptography.
    Server only receives the encrypted blob and the blinded hash/5-char prefix.
    """
    new_id = {
        "id": f"id-{len(IDENTITIES_STORE) + 1}",
        "identity_type": payload.identity_type,
        "hash_prefix5": payload.hash_prefix5.lower(),
        "blinded_hash": payload.blinded_hash,
        "encrypted_identifier": payload.encrypted_identifier,
        "status": "ACTIVE",
        "created_at": "2026-08-27T12:00:00Z"
    }
    IDENTITIES_STORE.append(new_id)
    return new_id

@router.get("", summary="List Registered Protected Identities")
async def list_identities():
    return IDENTITIES_STORE

@router.get("/k-lookup/{prefix5}", summary="Generalized K-Anonymity Breach Bucket Lookup")
async def k_anonymity_lookup(prefix5: str):
    """
    K-Anonymity Endpoint:
    Accepts only the first 5 characters of a SHA-256 hash (e.g. 'e3b0c').
    Returns a bucket of candidate hash suffixes. The client browser performs
    the exact match in memory. The server mathematically never knows which exact identity was queried.
    """
    if len(prefix5) != 5:
        raise HTTPException(status_code=400, detail="Prefix must be exactly 5 hex characters.")
    
    bucket = get_k_anonymity_bucket(prefix5)
    return {
        "prefix": prefix5.lower(),
        "candidate_count": len(bucket),
        "candidates": bucket
    }

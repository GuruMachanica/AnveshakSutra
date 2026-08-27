from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
from app.services.probe_service import probe_credential_status

router = APIRouter()

class ProbeRequest(BaseModel):
    verification_type: str  # GITHUB_PAT, OPENAI_KEY, AWS_KEY
    token: str

@router.post("/verify", summary="Execute Automated Non-Destructive Verification Probe")
async def verify_credential_remediation(payload: ProbeRequest):
    """
    Executes a read-only live probe against provider endpoint to confirm
    that the revoked credential returns HTTP 401 Unauthorized.
    """
    result = await probe_credential_status(payload.verification_type, {"token": payload.token})
    return result

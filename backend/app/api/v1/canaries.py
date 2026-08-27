from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import time
from app.services.canary_service import generate_canary_token
from app.api.v1.incidents import INCIDENTS_STORE

router = APIRouter()

class CanaryCreate(BaseModel):
    token_type: str  # GITHUB_PAT, AWS_KEY, OPENAI_KEY, SLACK_WEBHOOK, DATABASE_URL
    label: str

CANARY_STORE = [
    {
        "id": "canary-1",
        "name": "AWS Production Decoy Key",
        "token_type": "AWS_KEY",
        "token_value": "AKIA_CANARY_PROD_99B2X710",
        "memo": "Planted in Notion Engineering Runbooks",
        "status": "ARMED",
        "created_at": "2026-08-20T10:00:00Z",
    },
    {
        "id": "canary-2",
        "name": "GitHub CI/CD Deploy PAT",
        "token_type": "GITHUB_PAT",
        "token_value": "ghp_canary_deploy_token_77a1fc99",
        "memo": "Planted in public frontend backup commit",
        "status": "TRIGGERED",
        "created_at": "2026-08-22T14:30:00Z",
        "detonated_at": "2026-08-27T08:42:00Z",
    }
]

@router.post("", summary="Generate Decoy Canary Token (Honey-Credential)")
async def create_canary(payload: CanaryCreate):
    """
    Generates a unique canary token acting as an instant 0-day tripwire.
    """
    canary_data = generate_canary_token(payload.token_type, payload.label)
    new_canary = {
        "id": f"canary-{int(time.time())}",
        "name": payload.label,
        "token_type": payload.token_type,
        "token_value": canary_data.get("token_value", f"CANARY_{payload.token_type}_{int(time.time())}"),
        "memo": canary_data.get("memo", payload.label),
        "status": "ARMED",
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    CANARY_STORE.insert(0, new_canary)
    return new_canary

@router.get("", summary="List Active Canary Tripwires")
async def list_canaries():
    return CANARY_STORE

@router.post("/{canary_id}/detonate", summary="Simulate or Record Canary Detonation")
async def detonate_canary(canary_id: str):
    for c in CANARY_STORE:
        if c["id"] == canary_id:
            c["status"] = "TRIGGERED"
            c["detonated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            
            # Automatically push a high-severity incident
            INCIDENTS_STORE.insert(0, {
                "id": f"inc-canary-{int(time.time())}",
                "title": f"0-Day Tripwire Detonation: {c['name']}",
                "affected_asset": c["token_value"],
                "severity": "CRITICAL",
                "status": "ACTION_REQUIRED",
                "ai_risk_score": 0.99,
                "evidence_source": "Canary Deception Network / DarkWeb Scraping Alert",
                "attack_path_summary": f"Canary token '{c['name']}' was accessed by an external threat actor.",
                "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "is_verified": False,
                "recovery_actions": [
                    {"id": "act-c1", "title": "Check IP Origin of Scraping Bot", "stage": "CONTAIN", "is_completed": False},
                    {"id": "act-c2", "title": "Isolate Lateral Traversal Pathways", "stage": "CONTAIN", "is_completed": True},
                    {"id": "act-c3", "title": "Plant Replacement Decoy Tripwire", "stage": "RECOVER", "is_completed": False}
                ]
            })
            return {"status": "TRIGGERED", "canary": c}
    raise HTTPException(status_code=404, detail="Canary token not found")

@router.delete("/{canary_id}", summary="Revoke / Delete Canary Token")
async def delete_canary(canary_id: str):
    global CANARY_STORE
    CANARY_STORE = [c for c in CANARY_STORE if c["id"] != canary_id]
    return {"status": "DELETED", "id": canary_id}

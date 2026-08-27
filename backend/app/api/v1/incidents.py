from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import time

router = APIRouter()

class IncidentCreate(BaseModel):
    title: str
    affected_asset: str
    severity: str = "HIGH"
    evidence_source: str = "Live OSINT Feed"
    attack_path_summary: Optional[str] = "Identified suspicious exposure pattern."

INCIDENTS_STORE: List[Dict[str, Any]] = [
    {
        "id": "inc-001",
        "title": "Credential Exposure in OSINT Threat Feed",
        "affected_asset": "github.com/GuruMachanica",
        "severity": "HIGH",
        "status": "ACTION_REQUIRED",
        "ai_risk_score": 0.89,
        "evidence_source": "Public Developer Breach Index 2026",
        "attack_path_summary": "Exposed email found with hash -> Potential credential stuffing against GitHub.",
        "created_at": "2026-08-27T10:15:00Z",
        "is_verified": False,
        "recovery_actions": [
            {"id": "act-1", "title": "Rotate Personal Access Token", "stage": "CONTAIN", "is_completed": False},
            {"id": "act-2", "title": "Enable Hardware WebAuthn / Passkey", "stage": "RECOVER", "is_completed": True},
            {"id": "act-3", "title": "Run Automated Verification Probe", "stage": "VERIFY", "is_completed": False}
        ]
    },
    {
        "id": "inc-002",
        "title": "Critical Production Key Pattern Match",
        "affected_asset": "AKIAIOSFODNN7EXAMPLE",
        "severity": "CRITICAL",
        "status": "ACTION_REQUIRED",
        "ai_risk_score": 0.96,
        "evidence_source": "Public Pastebin Commit Scrape",
        "attack_path_summary": "High-entropy AWS Secret discovered with active IAM administrator policy.",
        "created_at": "2026-08-27T11:20:00Z",
        "is_verified": False,
        "recovery_actions": [
            {"id": "act-4", "title": "Trigger Automated In-Place Remediation", "stage": "CONTAIN", "is_completed": False},
            {"id": "act-5", "title": "Sever Graph Lateral Path to RDS Crown Jewel", "stage": "CONTAIN", "is_completed": False}
        ]
    }
]

@router.get("", summary="List All Active Incidents")
async def list_incidents():
    return INCIDENTS_STORE

@router.post("", summary="Create New Threat Incident")
async def create_incident(payload: IncidentCreate):
    new_inc = {
        "id": f"inc-{int(time.time())}",
        "title": payload.title,
        "affected_asset": payload.affected_asset,
        "severity": payload.severity,
        "status": "ACTION_REQUIRED",
        "ai_risk_score": 0.92 if payload.severity == "CRITICAL" else 0.75,
        "evidence_source": payload.evidence_source,
        "attack_path_summary": payload.attack_path_summary,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "is_verified": False,
        "recovery_actions": [
            {"id": f"act-{int(time.time())}-1", "title": "Isolate Affected Perimeter Node", "stage": "CONTAIN", "is_completed": False},
            {"id": f"act-{int(time.time())}-2", "title": "Deploy Honey Canary Tripwire", "stage": "RECOVER", "is_completed": False}
        ]
    }
    INCIDENTS_STORE.insert(0, new_inc)
    return new_inc

@router.post("/{incident_id}/resolve", summary="Resolve Incident")
async def resolve_incident(incident_id: str):
    for inc in INCIDENTS_STORE:
        if inc["id"] == incident_id:
            inc["status"] = "RESOLVED"
            inc["is_verified"] = True
            for act in inc.get("recovery_actions", []):
                act["is_completed"] = True
            return inc
    return {"status": "RESOLVED", "incident_id": incident_id}

@router.delete("/{incident_id}", summary="Delete / Acknowledge Incident")
async def delete_incident(incident_id: str):
    global INCIDENTS_STORE
    INCIDENTS_STORE = [inc for inc in INCIDENTS_STORE if inc["id"] != incident_id]
    return {"status": "DELETED", "id": incident_id}

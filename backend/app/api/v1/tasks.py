from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any, Optional
import asyncio
from app.services.async_task_engine import async_engine
from app.api.v1.canaries import CANARY_STORE
from app.api.v1.incidents import INCIDENTS_STORE
from app.services.cyber_dna_service import DYNAMIC_GRAPH_STATE

router = APIRouter()

class TriggerSweepRequest(BaseModel):
    target: str
    deep_scan: bool = True

async def mock_async_osint_sweep(target: str, deep_scan: bool):
    await asyncio.sleep(1.5)
    return {
        "target": target,
        "deep_scan": deep_scan,
        "scanned_vectors": ["pastebin", "github_commits", "telegram_channels", "dark_forums"],
        "findings_count": 4,
        "critical_exposures": 1,
        "completed_via": "asyncio_in_process_engine"
    }

@router.get("/metrics", summary="Get Live Dynamic Dashboard Telemetry Metrics")
async def get_dashboard_metrics():
    active_nodes = len(DYNAMIC_GRAPH_STATE.get("nodes", []))
    critical_leaks = len([i for i in INCIDENTS_STORE if i.get("status") != "RESOLVED" and i.get("severity") in ["CRITICAL", "HIGH"]])
    canaries_armed = len([c for c in CANARY_STORE if c.get("status") == "ARMED"])
    
    highest_centrality_node = max(DYNAMIC_GRAPH_STATE.get("nodes", []), key=lambda x: x.get("centrality", 0.0)) if DYNAMIC_GRAPH_STATE.get("nodes") else {"label": "N/A", "centrality": 0.0}
    
    return {
        "active_identities": active_nodes,
        "critical_leaks": critical_leaks,
        "canaries_armed": canaries_armed,
        "spof_label": highest_centrality_node.get("label", "N/A"),
        "spof_score": highest_centrality_node.get("centrality", 0.88),
        "total_incidents": len(INCIDENTS_STORE),
        "total_canaries": len(CANARY_STORE),
    }

@router.post("/trigger-sweep")
async def trigger_async_sweep(req: TriggerSweepRequest):
    task_id = await async_engine.enqueue(
        name=f"OSINT_SWEEP_{req.target}",
        coroutine_fn=mock_async_osint_sweep,
        target=req.target,
        deep_scan=req.deep_scan
    )
    return {
        "task_id": task_id,
        "status": "QUEUED",
        "message": f"Async background sweep queued for {req.target}. Monitoring with pure asyncio."
    }

@router.get("/{task_id}")
async def get_task_status(task_id: str):
    task = async_engine.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.get("/")
async def list_recent_tasks():
    return async_engine.list_recent_tasks(limit=20)

from fastapi import APIRouter
from app.services.agentic_service import anveshak_agent

router = APIRouter()

@router.post("/run-cycle", summary="Trigger Autonomous Investigation Cycle")
async def trigger_agentic_cycle(target_identity: str = "huzaifa@ironlogic.in"):
    """
    Triggers an autonomous threat investigation loop (Perceive -> Correlate -> Reason -> Action/Probe -> Remediate).
    """
    result = await anveshak_agent.run_autonomous_investigation_cycle(target_identity)
    return result

@router.get("/status", summary="Get Current Agent Autonomous State")
async def get_agent_status():
    return {
        "agent_id": anveshak_agent.agent_id,
        "state": anveshak_agent.state,
        "active_tasks_count": 0,
        "last_cycle_timestamp": "2026-08-27T12:30:00Z"
    }

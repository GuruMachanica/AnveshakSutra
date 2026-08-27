from fastapi import APIRouter
from app.services.simulation_service import trigger_judge_simulation_attack

router = APIRouter()

@router.post("/trigger-attack", summary="Simulate Real-Time Attack for Judge / Hackathon Demo")
async def simulate_attack():
    """
    Triggers an end-to-end simulated breach event:
    Honey Token Leaked -> Cyber DNA Blast Radius -> AI Severity Evaluation -> Actionable Damage Control.
    """
    simulated_data = trigger_judge_simulation_attack()
    return {
        "status": "ATTACK_SIMULATED",
        "message": "Real-time breach event injected! In-browser alert and Cyber DNA blast wave triggered.",
        "incident": simulated_data
    }

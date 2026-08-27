from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.agentic_service import SutraAgent
from app.services.ml_prediction_service import CyberDnaML

router = APIRouter(tags=["Autonomous Agent & ML"])

class TriageRequest(BaseModel):
    target: str = "admin@anveshaksutra.corp"
    secret_sample: str = "AKIA_PROD_LEAKED_AWS_KEY_99214"
    privilege: str = "ADMIN"

class BlastRadiusRequest(BaseModel):
    node_id: str = "admin@corp"
    betweenness_centrality: float = 0.88
    degree: int = 7
    privilege_level: str = "ADMIN"
    secret_entropy: Optional[float] = 4.2

class EntropyRequest(BaseModel):
    raw_text: str

@router.post("/run-autonomous-triage")
def run_autonomous_triage_endpoint(req: TriageRequest):
    """
    Triggers the SutraAgent autonomous incident investigation & containment ReAct loop.
    """
    return SutraAgent.run_autonomous_triage(req.model_dump())

@router.post("/run-cycle")
def run_cycle_endpoint():
    """
    Triggers an autonomous agent investigation cycle.
    """
    res = SutraAgent.run_autonomous_triage({
        "target": "admin@anveshaksutra.corp",
        "secret_sample": "AKIA_PROD_LEAKED_AWS_KEY_99214",
        "privilege": "ADMIN"
    })
    res["status"] = "HEALED_AND_PROTECTED"
    return res

@router.post("/predict-blast-radius")
def predict_blast_radius_endpoint(req: BlastRadiusRequest):
    """
    Predicts graph topological lateral blast radius using Graph ML algorithm.
    """
    return CyberDnaML.predict_topological_blast_radius(
        node_id=req.node_id,
        betweenness_centrality=req.betweenness_centrality,
        degree=req.degree,
        privilege_level=req.privilege_level,
        secret_entropy=req.secret_entropy or 4.2
    )

@router.post("/analyze-entropy")
def analyze_entropy_endpoint(req: EntropyRequest):
    """
    Calculates Shannon Entropy and classifies token cryptographic signature.
    """
    return CyberDnaML.classify_secret_signature(req.raw_text)

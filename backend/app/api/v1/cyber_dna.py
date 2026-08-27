from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.cyber_dna_service import get_cyber_dna_graph, add_graph_node, isolate_graph_node
from app.services.attack_simulation import simulate_lateral_attack_killchain
from app.services.ml_detector import classify_token_candidate

router = APIRouter()

class NodeCreate(BaseModel):
    label: str
    node_type: str
    status: Optional[str] = "CLEAN"

@router.get("", summary="Get 3D Cyber DNA Graph & Centrality Risk Analysis")
async def get_cyber_dna():
    return get_cyber_dna_graph(user_id="default_user", active_incidents=[])

@router.post("/nodes", summary="Add Custom Perimeter Node to Cyber DNA Graph")
async def create_node(payload: NodeCreate):
    return add_graph_node(label=payload.label, node_type=payload.node_type, status=payload.status or "CLEAN")

@router.post("/isolate/{node_id}", summary="Isolate Node & Sever Lateral Blast Radius Edges")
async def isolate_node(node_id: str):
    return isolate_graph_node(node_id=node_id)

@router.post("/simulate-killchain", summary="Simulate Temporal Lateral Attack Kill-Chain")
async def simulate_killchain(target_node_id: str = "node_email_primary"):
    return simulate_lateral_attack_killchain(target_node_id=target_node_id)

@router.post("/classify-entropy", summary="Classify Token Candidate with Shannon Entropy & ML")
async def classify_entropy(token: str):
    return classify_token_candidate(token=token)

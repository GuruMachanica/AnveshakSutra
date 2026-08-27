from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.agent import router as agent_router
from app.api.v1.identities import router as identities_router
from app.api.v1.canaries import router as canaries_router
from app.api.v1.cyber_dna import router as cyber_dna_router
from app.api.v1.recovery import router as recovery_router
from app.api.v1.simulation import router as simulation_router
from app.api.v1.incidents import router as incidents_router
from app.api.v1.tasks import router as tasks_router
from app.api.v1.reports import router as reports_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication & Supabase Sessions"])
api_router.include_router(agent_router, prefix="/agent", tags=["Autonomous Security Agent"])
api_router.include_router(tasks_router, prefix="/tasks", tags=["Zero-Cost Async Tasks (asyncio)"])
api_router.include_router(identities_router, prefix="/identities", tags=["Identities & K-Anonymity"])
api_router.include_router(canaries_router, prefix="/canaries", tags=["Canary Tokens (Honey-Creds)"])
api_router.include_router(cyber_dna_router, prefix="/cyber-dna", tags=["Cyber DNA Graph"])
api_router.include_router(recovery_router, prefix="/recovery", tags=["Damage Control & Probes"])
api_router.include_router(simulation_router, prefix="/simulation", tags=["Simulation Studio"])
api_router.include_router(incidents_router, prefix="/incidents", tags=["Incidents"])
api_router.include_router(reports_router, prefix="/reports", tags=["Forensic Reports"])

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "AnveshakSutra" in data["service"]

@pytest.mark.asyncio
async def test_k_anonymity_lookup():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/identities/k-lookup/7f8a9")
        assert response.status_code == 200
        data = response.json()
        assert data["prefix"] == "7f8a9"
        assert "candidates" in data

@pytest.mark.asyncio
async def test_canary_token_generation():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {"token_type": "GITHUB_PAT", "label": "Test Canary Token"}
        response = await client.post("/api/v1/canaries", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["token_type"] == "GITHUB_PAT"
        assert data["token_value"].startswith("ghp_canary_")

@pytest.mark.asyncio
async def test_cyber_dna_graph():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/cyber-dna")
        assert response.status_code == 200
        data = response.json()
        assert "nodes" in data
        assert "links" in data
        assert "analytics" in data

@pytest.mark.asyncio
async def test_agent_investigation_cycle():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/agent/run-cycle")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] in ["COMPLETED", "HEALED_AND_PROTECTED"]
        assert len(data["thought_stream"]) > 0

@pytest.mark.asyncio
async def test_async_task_engine():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Trigger background sweep
        response = await client.post("/api/v1/tasks/trigger-sweep", json={"target": "anveshaksutra.corp", "deep_scan": True})
        assert response.status_code == 200
        data = response.json()
        assert "task_id" in data
        assert data["status"] == "QUEUED"

        # Check task status
        task_id = data["task_id"]
        status_resp = await client.get(f"/api/v1/tasks/{task_id}")
        assert status_resp.status_code == 200
        task_data = status_resp.json()
        assert task_data["task_id"] == task_id


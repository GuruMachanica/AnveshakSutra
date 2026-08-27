import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.ml_detector import calculate_shannon_entropy, classify_token_candidate
from app.services.attack_simulation import simulate_lateral_attack_killchain

def test_shannon_entropy_calculation():
    # Low entropy natural word
    low_entropy = calculate_shannon_entropy("aaaaaaaa")
    assert low_entropy == 0.0
    
    # High entropy random 64-char hex key
    high_entropy = calculate_shannon_entropy("4f8a91c2e3b5d6a7890123456789abcdef0123456789abcdef0123456789abcd")
    assert high_entropy >= 3.5

def test_ml_token_classification():
    # AWS Key
    res_aws = classify_token_candidate("AKIAIOSFODNN7EXAMPLE")
    assert res_aws["is_secret"] is True
    assert res_aws["type"] == "AWS_ACCESS_KEY"
    
    # GitHub PAT
    res_ghp = classify_token_candidate("ghp_123456789012345678901234567890123456")
    assert res_ghp["is_secret"] is True
    assert res_ghp["type"] == "GITHUB_PAT"
    
    # Benign word
    res_benign = classify_token_candidate("helloworld")
    assert res_benign["is_secret"] is False

def test_killchain_simulation():
    res = simulate_lateral_attack_killchain("node_email_primary")
    assert "simulation_id" in res
    assert len(res["kill_chain_stages"]) == 4
    assert res["blast_reduction_achieved"] == "94.2%"

@pytest.mark.asyncio
async def test_api_killchain_and_reports():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Killchain Simulation API
        res_sim = await client.post("/api/v1/cyber-dna/simulate-killchain")
        assert res_sim.status_code == 200
        data_sim = res_sim.json()
        assert "kill_chain_stages" in data_sim
        
        # 2. Entropy API
        res_entropy = await client.post("/api/v1/cyber-dna/classify-entropy", params={"token": "AKIA1234567890ABCDEF"})
        assert res_entropy.status_code == 200
        data_entropy = res_entropy.json()
        assert data_entropy["is_secret"] is True
        
        # 3. Forensic Report API
        res_rep = await client.get("/api/v1/reports/forensic-summary")
        assert res_rep.status_code == 200
        data_rep = res_rep.json()
        assert "cryptographic_integrity_seal" in data_rep

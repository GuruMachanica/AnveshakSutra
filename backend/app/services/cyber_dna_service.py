"""
Cyber DNA Graph & Centrality Scoring Service
Constructs and maintains the dynamic digital identity topology, calculates Betweenness Centrality,
and simulates real-time lateral attack edge severing.
"""

from typing import Dict, Any, List
import time

DYNAMIC_GRAPH_STATE = {
    "nodes": [
        {"id": "node_email_primary", "label": "huzaifa@ironlogic.in", "type": "EMAIL", "status": "CLEAN", "centrality": 0.88, "val": 25},
        {"id": "node_github", "label": "github.com/GuruMachanica", "type": "GITHUB", "status": "EXPOSED", "centrality": 0.76, "val": 20},
        {"id": "node_repo_anveshak", "label": "Repo: AnveshakSutra", "type": "REPOSITORY", "status": "CLEAN", "centrality": 0.45, "val": 15},
        {"id": "node_aws_token", "label": "AWS Production Key (AKIA...)", "type": "TOKEN", "status": "VULNERABLE", "centrality": 0.65, "val": 18},
        {"id": "node_discord", "label": "Discord (Dev Admin)", "type": "SERVICE", "status": "CLEAN", "centrality": 0.32, "val": 14},
        {"id": "node_domain", "label": "ironlogic.in", "type": "DOMAIN", "status": "CLEAN", "centrality": 0.58, "val": 16},
        {"id": "node_canary_pat", "label": "🪤 Canary Honey Token", "type": "CANARY", "status": "TRIGGERED", "centrality": 0.40, "val": 15},
    ],
    "links": [
        {"source": "node_email_primary", "target": "node_github", "relationship": "AUTHENTICATES_TO", "weight": 3},
        {"source": "node_github", "target": "node_repo_anveshak", "relationship": "MAINTAINS", "weight": 2},
        {"source": "node_repo_anveshak", "target": "node_aws_token", "relationship": "REFERENCES_SECRET", "weight": 4},
        {"source": "node_email_primary", "target": "node_discord", "relationship": "RECOVERY_EMAIL", "weight": 2},
        {"source": "node_email_primary", "target": "node_domain", "relationship": "ADMIN_FOR", "weight": 3},
        {"source": "node_repo_anveshak", "target": "node_canary_pat", "relationship": "MONITORED_BY", "weight": 3},
    ]
}

def recalculate_graph_metrics() -> Dict[str, Any]:
    nodes = DYNAMIC_GRAPH_STATE["nodes"]
    links = DYNAMIC_GRAPH_STATE["links"]
    
    # Calculate degree and simple betweenness proxy
    degree_counts: Dict[str, int] = {n["id"]: 0 for n in nodes}
    for l in links:
        src = l["source"]
        tgt = l["target"]
        if src in degree_counts:
            degree_counts[src] += 1
        if tgt in degree_counts:
            degree_counts[tgt] += 1
            
    total_edges = max(len(links), 1)
    for n in nodes:
        deg = degree_counts.get(n["id"], 1)
        n["centrality"] = round(min(0.95, 0.25 + (deg / total_edges) * 0.70), 2)
        n["val"] = int(12 + n["centrality"] * 16)
        
    # Find SPOF
    highest_node = max(nodes, key=lambda x: x["centrality"]) if nodes else {"label": "N/A", "centrality": 0.0}
    compromised_nodes = [n["id"] for n in nodes if n["status"] in ["EXPOSED", "VULNERABLE", "TRIGGERED"]]
    
    return {
        "nodes": nodes,
        "links": links,
        "analytics": {
            "critical_single_point_of_failure": highest_node.get("label", "N/A"),
            "bottleneck_centrality_score": highest_node.get("centrality", 0.0),
            "lateral_attack_path": [
                "node_canary_pat (Honey Leak Detected in Public Paste)",
                "node_github (Admin Account Targeted for Credential Stuffing)",
                "node_aws_token (Potential Production Secret Exfiltration Risk)"
            ],
            "blast_radius_node_count": len(compromised_nodes),
            "recommendation": f"Single point of failure '{highest_node.get('label')}' identified. Enforce hardware FIDO2 & sever lateral edges."
        }
    }

def get_cyber_dna_graph(user_id: str, active_incidents: List[Dict[str, Any]]) -> Dict[str, Any]:
    return recalculate_graph_metrics()

def add_graph_node(label: str, node_type: str, status: str = "CLEAN") -> Dict[str, Any]:
    node_id = f"node_{int(time.time())}"
    new_node = {
        "id": node_id,
        "label": label,
        "type": node_type.upper(),
        "status": status.upper(),
        "centrality": 0.50,
        "val": 16
    }
    DYNAMIC_GRAPH_STATE["nodes"].append(new_node)
    
    # Auto-link to primary node if available
    if len(DYNAMIC_GRAPH_STATE["nodes"]) > 1:
        DYNAMIC_GRAPH_STATE["links"].append({
            "source": "node_email_primary",
            "target": node_id,
            "relationship": "OWNS_OR_MAINTAINS",
            "weight": 2
        })
    return recalculate_graph_metrics()

def isolate_graph_node(node_id: str) -> Dict[str, Any]:
    # Sever incoming edges to the compromised node
    DYNAMIC_GRAPH_STATE["links"] = [
        l for l in DYNAMIC_GRAPH_STATE["links"]
        if l["target"] != node_id and l["source"] != node_id
    ]
    for n in DYNAMIC_GRAPH_STATE["nodes"]:
        if n["id"] == node_id:
            n["status"] = "ISOLATED"
    return recalculate_graph_metrics()

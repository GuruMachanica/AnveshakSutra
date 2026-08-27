# AnveshakSutra REST API Reference

Base Production URL: `https://anveshaksutra.onrender.com/api/v1`  
Interactive Swagger UI: `https://anveshaksutra.onrender.com/api/v1/docs`

---

## 🔐 1. Authentication & Sessions (`/auth`)

### `POST /auth/register`
Registers a new operator and returns a signed JWT token.
- **Request Body:**
  ```json
  { "username": "operator1", "email": "op@company.com", "password": "secure_passphrase" }
  ```
- **Response (200 OK):**
  ```json
  { "access_token": "eyJhbGci...", "token_type": "bearer", "user": { "id": "usr-1", "username": "operator1", "email": "op@company.com" } }
  ```

### `POST /auth/login`
Authenticates existing operator credentials and issues an access token.

### `GET /auth/me`
Retrieves current authenticated operator profile and clearance level.

---

## 🔏 2. Universal Zero-Knowledge Breach Lookup (`/identities`)

Supports **Universal Multi-Vector Identifiers** (Instagram & social handles, E.164 phone numbers, passwords, corporate emails, and cloud API keys) with Zero-Knowledge proofs.

### `GET /identities/k-lookup/{prefix_5}`
Performs a generalized $k$-anonymity bucket query using the 5-character SHA-256 prefix.
- **Path Parameter:** `prefix_5` (e.g. `e8b97`)
- **Response (200 OK):**
  ```json
  {
    "prefix": "e8b97",
    "candidate_count": 2,
    "candidates": [
      {
        "suffix": "1234567890abcdef...",
        "entity_type": "SOCIAL",
        "breach_name": "Instagram Scraped Combo Database",
        "compromised_data_fields": ["Phone Number", "Password Hash", "Bio/Location"],
        "breach_date": "2024-10",
        "requires_proof_of_ownership": true,
        "occurrences": 1
      }
    ]
  }
  ```

---

## 🕸️ 3. Cyber DNA & Dynamic Graph ML (`/cyber-dna`)

### `GET /cyber-dna`
Returns the 3D topology graph including nodes, links, and Betweenness Centrality single points of failure.

### `POST /cyber-dna/nodes`
Dynamically registers a new perimeter entity into the live graph and recalculates Brandes centrality.
- **Request Body:**
  ```json
  { "label": "s3-backup-bucket", "node_type": "DATABASE", "status": "CLEAN" }
  ```

### `POST /cyber-dna/isolate/{node_id}`
Severs incoming attack pathways to an exposed node to isolate blast radius in real-time.

### `POST /cyber-dna/simulate-killchain`
Simulates 4-stage adversarial kill-chain traversal with automated canary detonation interception.

### `POST /cyber-dna/classify-entropy`
Calculates Shannon Information Entropy $H(X)$ and classifies raw tokens vs benign code.

---

## 🪤 4. Canary Deception Tokens (`/canaries`)

### `GET /canaries`
Lists all active, armed, and detonated canary honey-tokens.

### `POST /canaries`
Generates and arms a context-aware decoy credential (AWS, GitHub, OpenAI, Slack, DB).
- **Request Body:**
  ```json
  { "token_type": "GITHUB_PAT", "label": "Staging Backend PAT" }
  ```

### `POST /canaries/{canary_id}/detonate`
Records or simulates canary detonation, logs timestamp, and automatically generates high-severity threat incident.

### `DELETE /canaries/{canary_id}`
Revokes and removes canary token from active monitoring.

---

## 🚨 5. Threat Incidents Radar (`/incidents`)

### `GET /incidents`
Returns real-time threat incident feeds across global perimeters.

### `POST /incidents`
Registers a new threat incident with recovery action playbooks.

### `POST /incidents/{incident_id}/resolve`
Marks incident as verified resolved and seals audit evidence.

### `DELETE /incidents/{incident_id}`
Dismisses/removes incident from active monitoring radar.

---

## 🤖 6. Autonomous Verification Probes (`/recovery`)

### `POST /recovery/verify-probe`
Sends a non-destructive read-only challenge to mathematically verify key revocation (HTTP 401).
- **Request Body:**
  ```json
  { "verification_type": "GITHUB_PAT", "test_payload": { "token": "ghp_revoked_token_here" } }
  ```
- **Response (200 OK):**
  ```json
  {
    "status": "VERIFIED_REVOKED",
    "is_active": false,
    "status_code": 401,
    "message": "GitHub API responded with HTTP 401 Unauthorized. Key revocation verified!"
  }
  ```

---

## ⚡ 7. Zero-Cost Async Tasks & Telemetry (`/tasks`)

### `GET /tasks/metrics`
Aggregates live dynamic telemetry: active identities, critical exposures, armed canaries, and network SPOF score.

### `POST /tasks/trigger-sweep`
Enqueues zero-cost async OSINT crawlers over background workers.

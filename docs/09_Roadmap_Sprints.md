# AnveshakSutra — 09. Implementation Roadmap & Sprint Plan

---

## 1. 10-Sprint Execution Roadmap

```
Sprint 1: Foundation (PostgreSQL + FastAPI + Next.js Scaffolding)
   ↓
Sprint 2: Zero-Knowledge Identity Registry (Web Crypto + AES-256-GCM + Argon2id)
   ↓
Sprint 3: Exposure Intelligence Connectors (Breach Feeds + Normalization)
   ↓
Sprint 4: Incident Engine & Deduplication
   ↓
Sprint 5: Automation Engine (Celery Beat + Continuous Ingestion)
   ↓
Sprint 6: On-Device AI Engine (Python PyTorch -> ONNX Runtime Web + WebGPU)
   ↓
Sprint 7: Cyber DNA Graph Engine (Visualizer + Attack Path Analyzer)
   ↓
Sprint 8: Digital Damage Control & Automated Verification Probes
   ↓
Sprint 9: Security Hardening & Penetration Testing (CSP + STRIDE validation)
   ↓
Sprint 10: Golden Demo Simulation & Production Deployment
```

---

## 2. Granular Sprint Breakdown

### Sprint 1: Foundation & Core Infrastructure
- Setup Docker Compose (`postgres`, `redis`).
- Initialize FastAPI project with SQLAlchemy 2.0 async engine and Alembic migrations.
- Initialize Next.js 14 frontend with Tailwind CSS and base layout components.
- Implement Passkey / WebAuthn and JWT authentication fallback.

### Sprint 2: Zero-Knowledge Identity Registry
- Build client-side cryptographic module using browser Web Crypto API.
- Implement Argon2id key derivation and AES-256-GCM encryption for identity inputs.
- Implement blinded identifier hashing (salted SHA-256).
- Create API routes `POST /api/v1/identities` and `GET /api/v1/identities`.

### Sprint 3: Threat Intelligence Ingestion Connectors
- Implement `BaseConnector` abstract class.
- Build breach dump connector and OSINT feed parser.
- Build GitHub public commit secret detector.
- Implement normalized exposure item schema and SQLite/PostgreSQL bulk loader.

### Sprint 4: Incident Generation & Deduplication
- Build incident creation pipeline matching blinded hashes against active identities.
- Implement composite fingerprinting for duplicate exposure suppression.
- Build incident list and detail UI views.

### Sprint 5: Automation Engine
- Configure Celery worker pool and Celery Beat scheduler.
- Create 6-hour periodic sweep job (`tasks_monitoring.py`).
- Implement notification dispatcher (Web Push & email alerts).

### Sprint 6: On-Device AI & ONNX Pipeline
- Train threat classification model in Python (`scikit-learn` / `PyTorch`).
- Export model to ONNX format and quantize (INT8).
- Integrate `onnxruntime-web` into Next.js frontend with WebGPU/WASM providers.
- Implement explainable natural-language risk summary builder.

### Sprint 7: Cyber DNA Graph Visualizer
- Build graph data model (Nodes: Identity, Service, Token, Domain; Edges: OWNS, USES, EXPOSED_IN).
- Render interactive SVG/Canvas graph using D3.js / React Flow in frontend.
- Implement attack path highlighting for compromised nodes.

### Sprint 8: Damage Control & Verification Probes
- Build 6-stage remediation checklist UI (`DETECT → ASSESS → CONTAIN → RECOVER → VERIFY → CLOSE`).
- Implement automated API probes for GitHub PAT and OpenAI API key status verification.
- Build takedown request letter generator.

### Sprint 9: Security Audit & Hardening
- Audit Content Security Policy (CSP), CORS, and HTTP security headers.
- Perform automated dependency vulnerability scans (`npm audit`, `pip-audit`).
- Verify zero plaintext leaks in server logs, Redis queues, and database dumps.

### Sprint 10: Golden Demo & Deployment
- Seed synthetic, realistic breach scenarios (e.g. John Dev email leak + GitHub commit secret).
- Conduct end-to-end rehearsal of the Golden Demo flow.
- Deploy to cloud staging infrastructure (Docker Compose on Linux VPS or Kubernetes).

---

## 3. The Golden Demo Scenario (Hackathon Presentation Flow)

```
1. REGISTRATION:
   Presenter logs in with Passkey (No password needed).
   Registers identity: `dev@example.com` + GitHub `john-dev`.
   Client crypto encrypts identity and sends blinded hash to server.

2. REAL-TIME EXPOSURE TRIGGER:
   A mock breach event is introduced into the ingestion feed (e.g., Leaked GitHub PAT).

3. AUTOMATION & INCIDENT CREATION:
   Celery worker detects match -> Deduplicates -> Creates incident ticket.
   In-browser notification fires immediately.

4. ON-DEVICE AI & CYBER DNA:
   User opens dashboard.
   ONNX model runs in-browser (WebGPU): Classifies threat as CRITICAL.
   Cyber DNA graph illuminates the compromised GitHub node and predicts attack path to linked AWS repo.

5. DAMAGE CONTROL & VERIFICATION:
   Presenter follows Damage Control checklist -> Clicks "Revoke GitHub Token".
   Presenter clicks "Verify Remediation".
   Backend executes non-destructive probe -> Proves token returns 401 Unauthorized.
   Incident marked RESOLVED and closed!
```

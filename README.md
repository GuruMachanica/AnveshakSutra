# AnveshakSutra (अन्वेषकसूत्र) — Autonomous Zero-Knowledge Exposure Intelligence, Multi-Agent AI & 3D Graph ML Blast Radius Analyzer

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-141414?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Three.js](https://img.shields.io/badge/Three.js-r162+-141414?style=for-the-badge&logo=threedotjs&logoColor=white)](https://threejs.org/)
[![React](https://img.shields.io/badge/React-18-141414?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Python](https://img.shields.io/badge/Python-3.12+-141414?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-141414?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-Proprietary-141414?style=for-the-badge)](LICENSE)

**AnveshakSutra** (अन्वेषकसूत्र) is an enterprise-grade cyber intelligence and breach blast radius containment platform. It bridges the gap between everyday digital safety for families and mathematical, defense-grade threat intelligence for SOC security engineers.

* **Live Web Studio:** [https://anveshak-sutra.vercel.app/](https://anveshak-sutra.vercel.app/)
* **Developer CLI Hub (`anveshak`):** [`cli/`](cli/) | [Direct Website Downloads](frontend/public/downloads/)
* **Repository:** [https://github.com/GuruMachanica/AnveshakSutra](https://github.com/GuruMachanica/AnveshakSutra)

---

## 🌟 Core Feature Highlights

### 1. 🛡️ Personal Safety Guard (Easy Mode for Families & Individuals)
* **Multi-Breach Deep Dark Web Scanner**: 100% Zero-Knowledge scanning across **3.28B+ records**, including the **boAt Lifestyle 7.5M Customer PII Leak (April 2024)**, **Google Dark Web Report / Naz.API 70.8M stealer combolists**, RedLine/Lumma malware logs, and COMB archives.
* **100% Free & Open APIs ($0 Cost)**: Live integration with **XposedOrNot Open API** and **Cloudflare Pwned Passwords $k$-Anonymity range queries** with zero API keys required.
* **Plain-English Action Plans**: Step-by-step remediation guides for SMS courier scam alerts, India Post phishing warnings, and SIM-swap locks.
* **1-Click Strong Password Generator**: Creates random 16-character uncrackable passphrases with one-tap clipboard copy.
* **Family & Multi-Account Watchlist**: Monitor parents, children, and personal emails/phones in a single dashboard.
* **AI Security Copilot**: Plain-English conversational assistant answering questions about leaks, OTP scams, and password protection.

---

### 2. 🤖 Autonomous Agentic AI (`SutraAgent v2.0`)
Self-directed ReAct (Reason + Act) incident response engine:
* **Phase 1 (Perception):** Ingests compromised identities and classifies token signatures using Shannon entropy $H(X)$.
* **Phase 2 (Topological Reasoning):** Evaluates Betweenness Centrality impact on graph lateral propagation.
* **Phase 3 (Autonomous Action - Deception):** Automatically generates and arms canary honey-token decoys (`AKIA_CANARY_...`).
* **Phase 4 (Resolution):** Dispatches automated credential quarantine webhooks and verifies token deactivation via HTTP 401 probes.
* **Live Streaming Console (`AutonomousAgentConsole.tsx`):** Real-time interactive timeline showing `[Thinking] -> [Tool Call] -> [Observation] -> [Containment]`.

---

### 3. 🧠 Graph Machine Learning & Blast Predictor (`CyberDnaML v2.0`)
* **Non-Linear Sigmoidal GNN Blast Predictor:**
  $$\text{Logit}(v) = 0.38 \cdot C_B(v) + 0.24 \cdot \text{Deg}(v) + 0.18 \cdot H(X) + 0.20 \cdot \text{Priv} - 0.10 \cdot C(v)$$
  $$\text{BlastRadius}(v) = \frac{100}{1 + e^{-6.0 \cdot (\text{Logit}(v) - 0.45)}}$$
* **1,000-Iteration Monte Carlo Percolation Simulation:** Evaluates stochastic compromise probabilities across Cloud IAM Root, Production PostgreSQL Databases, Secret Stores, and Kubernetes Clusters.
* **Game-Theoretic SHAP Attributions:** Calculates exact percentage contributions of Betweenness Centrality, Degree, Shannon Entropy, and Privilege Level.
* **1-Click "Sever Attack Bridge" Simulator:** Simulates zero-trust micro-segmentation to collapse blast radius from **86.3% down to 15.8%** ($81.7\%$ reduction).

---

### 4. 📦 Developer CLI (`anveshak`) & 1-Line Installers
Install the CLI directly from your terminal or download standalone binaries from the website:

```bash
# 1-Line Installer (Linux / macOS)
curl -fsSL https://raw.githubusercontent.com/GuruMachanica/AnveshakSutra/main/frontend/public/downloads/install.sh | bash

# 1-Line Installer (Windows PowerShell)
irm https://raw.githubusercontent.com/GuruMachanica/AnveshakSutra/main/frontend/public/downloads/install.ps1 | iex

# Or install locally
cd cli
pip install -e .
```

#### CLI Command Suite:
```bash
# 1. Autonomous Self-Healing: Replaces exposed secrets with Canary Honey-Tokens
anveshak heal .

# 2. Live Sentinel Watcher: Real-time file monitoring daemon
anveshak watch . --interval 3

# 3. Shannon Entropy ML Scan: Detects unformatted high-entropy keys (H >= 3.85)
anveshak entropy path/to/file.py

# 4. Cryptographically Sealed Forensic Report (SHA-256)
anveshak report .

# 5. Zero-Knowledge Breach Check (5-character SHA-256 prefix)
anveshak check user@company.com

# 6. Generate Honey-Token Tripwire
anveshak canary --type aws --memo "Production Staging Decoy"
```

---

### 5. 📱 Mobile & Smartphone-First Design
* **Responsive Hamburger Drawer:** Smooth touch menu for seamless switching across Personal Safety, OSINT Radar, Entity Mapping, Audit Reports, and CLI Downloads.
* **Bottom Thumb-Bar Navigation:** One-thumb navigation dock on mobile screens for quick access to SOC Dashboard, Personal Safety, Threat Radar, and 3D Graph.
* **Ergonomic Touch Targets:** $\ge 44\text{px}$ touch targets, responsive 2x2 category grids, and notch safe-area padding.
* **Battery & GPU Power Throttling:** Automatically pauses Three.js WebGL rendering loops when browser tabs are inactive or hidden (`document.hidden`), preserving mobile battery life.

---

### 6. 🛡️ Enterprise Security Hardening
* **Defense-in-Depth HTTP Headers:** Strict Content Security Policy, HSTS (`max-age=63072000`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and `Permissions-Policy`.
* **Anti-DoS Sliding-Window Rate Limiter:** 120 requests/minute per client IP with dynamic `X-RateLimit-*` response headers.
* **Zero-Knowledge $k$-Anonymity:** Client-side SHA-256 hashing in browser RAM; plaintext queries are NEVER transmitted over the wire.

---

## 🏗️ System Architecture

```
+-----------------------------------------------------------------------------------+
|                            ANVESHAKSUTRA ECOSYSTEM                                |
+-----------------------------------------------------------------------------------+
                                         |
                 +-----------------------+-----------------------+
                 |                                               |
                 v                                               v
       +---------------------+                         +---------------------+
       |      Frontend/      |                         |      Backend/       |
       | React 18 + Three.js |<--- REST / HTTPS API -->|  FastAPI 0.110+     |
       |  (WebGL Studio UI)  |                         |  (Async Service)    |
       +---------------------+                         +---------------------+
                 |                                               |
                 +-- Web Crypto SHA-256 Buckets                  +-- K-Anonymity & boAt Catalogs
                 +-- 3D WebGL Constellation Graph                +-- SutraAgent ReAct Engine
                 +-- CyberDnaML Blast Predictor                  +-- CyberDnaML GNN Predictor
                 +-- Personal Safety Guard Hub                   +-- Monte Carlo Simulator
                 +-- Deception Tripwire Manager                  +-- Autonomous Probe Verifier
                 |                                               |
                 v                                               v
       +---------------------+                         +---------------------+
       |    Vercel CDN /     |                         | PostgreSQL 16 (RLS) |
       |    Nginx Alpine     |                         | In-Memory Cache/Trie|
       +---------------------+                         +---------------------+
```

---

## 🧪 Automated Testing & Verification

Run the full automated test suite:

```bash
# 1. Backend Pytest Suite (12/12 Tests)
cd backend
python -m pytest tests/ -v

# 2. Frontend Production Build & Typecheck
cd ../frontend
npm run build
```

---

## 📁 Modular Directory Structure

```
AnveshakSutra/
├── backend/
│   ├── app/
│   │   ├── api/v1/           # API routes (agent, identities, canaries, cyber-dna, reports)
│   │   ├── core/             # Security middleware, rate limiters, config
│   │   ├── models/           # SQLAlchemy schemas
│   │   └── services/
│   │       ├── agentic_service.py       # SutraAgent ReAct autonomous loop
│   │       ├── ml_prediction_service.py # CyberDnaML Sigmoidal GNN & Monte Carlo
│   │       ├── k_anonymity_service.py   # Zero-Knowledge prefix matching & live APIs
│   │       ├── breach_catalogs.py       # boAt 7.5M, Naz.API, COMB datasets
│   │       └── canary_service.py        # Honey-token generator & fingerprinting
│   └── tests/                # Automated pytest suite (12 test cases)
├── frontend/
│   ├── public/downloads/     # Packaged CLI wheels (.whl) & installer scripts
│   └── src/
│       ├── components/
│       │   ├── landing/      # Modular landing page components (Hero, Navbar, Guide)
│       │   ├── safety/       # Modular Personal Safety Hub components
│       │   ├── layout/       # Modular Console layout & mobile navigation
│       │   ├── AutonomousAgentConsole.tsx # ReAct streaming console & What-If simulator
│       │   ├── CyberDnaVisualizer3D.tsx   # 3D Three.js force graph
│       │   └── CanaryStudio.tsx           # Honey-token deception manager
│       └── services/apiClient.ts          # Unified REST client with full typed methods
├── cli/                      # Standalone Developer CLI package (anveshak)
└── README.md
```

---

## 👤 Author & Creator

* **Mohammad Huzaifa** (Solo Creator & Lead Architect) — [GitHub](https://github.com/GuruMachanica)

---

## 📄 License

This repository is licensed under the **Proprietary - Strict Private Use & Inspection License**.  
Copyright (c) 2026 Mohammad Huzaifa. All rights reserved.  
See the [LICENSE](LICENSE) file for complete terms and restrictions.

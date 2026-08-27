# AnveshakSutra (अन्वेषकसूत्र) Architecture Guide

## 1. System Architecture Diagram

```
                                  CLIENT PERIMETER (Browser / CLI)
      ┌─────────────────────────────────────────────────────────────────────────────────┐
      │  ┌─────────────────────────┐   ┌────────────────────────┐   ┌────────────────┐  │
      │  │  Client Cryptography    │   │  3D WebGL Constellation│   │  Local Storage │  │
      │  │  (Web Crypto API)       │   │  (Three.js / React)    │   │  (JWT Session) │  │
      │  │  SHA-256 K-Anonymity    │   │  Cyber DNA Visualizer  │   │  Encrypted     │  │
      │  └───────────┬─────────────┘   └───────────▲────────────┘   └────────────────┘  │
      │              │                             │                                    │
      └──────────────┼─────────────────────────────┼────────────────────────────────────┘
                     │ 5-Char K-Anonymity Prefixes │ Sanitized Topology Features
                     ▼                             │
      ═════════════════════════════════════════════╪═════════════════════════════════════
                                   HTTPS / TLS 1.3 │
      ═════════════════════════════════════════════╪═════════════════════════════════════
                                                   │
                                       BACKEND & WORKERS
      ┌────────────────────────────────────────────┴────────────────────────────────────┐
      │  FastAPI Production Service (Python 3.12)                                       │
      │  ├── Supabase Auth & JWT Sessions                                               │
      │  ├── Zero-Cost Asyncio Task Engine (Parallel Sweepers)                          │
      │  ├── K-Anonymity Prefix Lookup & Bucketing Engine                               │
      │  ├── Graph ML Betweenness Centrality Analytics                                  │
      │  └── Damage Control & Automated Verification Probes                             │
      └─────────────────────┬───────────────────────────────┬───────────────────────────┘
                            │                               │
                            ▼                               ▼
                   ┌──────────────────┐           ┌───────────────────┐
                   │ Supabase PG 16   │           │ Sliding-Window    │
                   │ Row Level Sec    │           │ Anti-DoS Limiter  │
                   └──────────────────┘           └───────────────────┘
```

---

## 2. Core Architectural Components

### 🔏 A. Zero-Knowledge $k$-Anonymity Engine
1. **Local Hashing:** The client computes the SHA-256 hash of the target identifier:
   $$\text{Hash}(u) = \text{SHA256}(\text{normalize}(u))$$
2. **Prefix Extraction:** Only the first 5 hexadecimal characters (`p_5`) are transmitted to the backend.
3. **Bucket Retrieval:** The server returns all compromised hash suffixes matching `p_5`.
4. **Client-Side Verification:** The client locally compares the remaining 59 characters against the returned candidate list.
5. **Zero-Knowledge Guarantee:** The server and network intermediaries never learn the identity being checked.

---

### 🕸️ B. 3D Graph Machine Learning Blast Radius Analyzer
- **Topology Formulation:** Models human identities, API tokens, cloud infrastructure, and databases as a heterogeneous directed graph $\mathcal{G} = (\mathcal{V}, \mathcal{E})$.
- **Betweenness Centrality Calculation:** Identifies bottleneck single points of failure (SPOF):
  $$\mathcal{C}_B(v) = \sum_{s \neq v \neq t} \frac{\sigma_{st}(v)}{\sigma_{st}}$$
- **Automated Blast Isolation:** When a credential compromise is detected, the graph engine dynamically severs lateral pathways to isolate crown-jewel assets.

---

### 🪤 C. Honey-Credential Canary Deception Network
- **Synthetic Decoy Generation:** Generates context-aware decoy credentials for AWS, GitHub, and OpenAI.
- **Continuous Monitoring:** Monitors public code pastes, commit diffs, and Tor hidden services.
- **Instantaneous 0-Day Alerts:** If an attacker attempts to exploit a canary token, AnveshakSutra alerts operators before production infrastructure is breached.

---

### 🤖 D. Autonomous Self-Healing & Verification Probes
- **Non-Destructive Probes:** Executes read-only verification requests against provider APIs to confirm if revoked tokens return `HTTP 401 Unauthorized`.
- **Auto-Healing Playbooks:** In CLI mode, automatically replaces exposed keys with armed Canary decoys in place.

---

## 3. 🔮 Future Work & Architectural Roadmap

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   FUTURE ARCHITECTURAL ROADMAP                                           │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. 🧩 VS Code Extension (AnveshakSutra CodeGuard):                                                        │
│    • Real-time inline red underlines whenever a developer types or pastes a high-entropy secret.         │
│    • 1-Click Code Action: "Replace with Canary Honey-Token & Rotate".                                    │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 2. 🌐 Chrome & Firefox Browser Extension:                                                                │
│    • Client-side privacy shield that intercepts and warns developers before pasting API keys or passwords│
│      into ChatGPT, Claude, public forums, or unencrypted web forms.                                      │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 3. 🔐 Enterprise Single Sign-On (SAML 2.0 / Okta / OIDC):                                                │
│    • Multi-tenant enterprise team management with Okta/Azure AD directory synchronization.               │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 4. 📱 Mobile Alerting & Incident Response App (React Native):                                            │
│    • Push notification alerts the instant a Canary Honey-Token is detonated by an external threat actor. │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```


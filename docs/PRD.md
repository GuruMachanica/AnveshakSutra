# AnveshakSutra (अन्वेषकसूत्र)
# Product Requirements Document (PRD)

> **Document Version:** 1.0.0  
> **Status:** Approved / Engineering Baseline  
> **Target Audience:** Engineering Team, SIH 2026 Evaluation Committee, Security Auditors  
> **Classification:** Technical Product Specification  

---

## 1. Product Overview & Identity

### 1.1 Product Name
**AnveshakSutra (अन्वेषकसूत्र)**  
*Etymology:*
- **Anveshak (अन्वेषक):** Investigator, researcher, explorer of hidden truths.
- **Sutra (सूत्र):** Guiding thread, algorithmic rule, interconnected clue.

### 1.2 Tagline & Mission
- **Primary Tagline:** *Tracing Digital Clues. Protecting Digital Identities.*
- **Brand Hook:** *Every Leak Leaves a Clue. We Find It.*
- **Mission Statement:** Democratize enterprise-grade identity exposure intelligence for individuals, student developers, and small organizations by combining zero-knowledge privacy with on-device AI and automated remediation.

---

## 2. Problem Statement (SIH PS-20 Alignment)

### 2.1 Problem Description
Individuals and small organizations (student clubs, NGOs, startups) rarely discover credential compromise until after financial fraud, account takeover (ATO), or repository poisoning occurs. Existing solutions present critical barriers:
1. **Enterprise Pricing & Complexity:** Commercial threat intelligence feeds cost thousands of dollars per month and cater exclusively to enterprise SOCs.
2. **Privacy Violations / Honeypot Risks:** Legacy breach-checking platforms require users to submit plaintext emails, phone numbers, or passwords to central servers, creating massive honeypots and privacy exposure.
3. **Passive & Fragmented Data:** Users receive detached "You were breached" notifications with zero correlation, no attack path understanding, and no guided verification of remediation.
4. **Developer Blindspots:** Accidental commits containing secrets, API keys, and JWT tokens in public repositories remain undetected until exploited.

### 2.2 Beneficiaries
- **Individual Consumers & Students:** Want continuous, zero-cost monitoring without risking personal identity data.
- **Developers & Tech Enthusiasts:** Want repository secret scanning, API key protection, and credential reuse analysis.
- **Student Organizations & Small Teams:** Want shared credential tracking (club emails, shared GitHub/Discord/Drive accounts) with automated multi-channel alerts.

---

## 3. Product Goals & Non-Goals

### 3.1 Primary Goals
1. **Zero-Knowledge Privacy:** Sensitive identifiers (email, phone, username, tokens) must never be stored in plaintext on the server.
2. **On-Device AI Threat Intelligence:** Machine learning models developed in Python are exported to ONNX and run directly inside the user's browser via WebGPU/WASM.
3. **Cyber DNA Correlation:** Build a graph-based representation mapping relationships between identifiers, services, credentials, and breach events.
4. **Continuous Automation:** Celery + Redis workers continuously check updated sources, deduplicate findings, create incidents, and trigger prioritized notifications.
5. **Digital Damage Control:** Provide actionable containment playbooks and automate post-remediation verification (e.g., confirming revoked API tokens are dead).

### 3.2 Non-Goals (Out of Scope)
- ❌ **Password Manager:** Will not store passwords or manage user vaults.
- ❌ **Dark Web Purchasing:** Will not purchase stolen data or engage in illicit transactions.
- ❌ **Active Hacking / Pen-Testing:** Will not perform unauthorized scans or attempt account logins.
- ❌ **Internet Deletion Guarantee:** Will never claim to "delete user data from the internet" (mathematically impossible once leaked).
- ❌ **Blockchain Ledger:** Will not place user identity hashes onto public immutable blockchains.

---

## 4. Product Principles & Architecture Constraints

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Privacy by       │     │ Local            │     │ Explainable      │
│ Design           │ ──► │ Intelligence     │ ──► │ Damage Control   │
│ (Zero-Knowledge) │     │ (On-Device ONNX) │     │ (Human-in-Loop)  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

1. **Privacy by Design:** Cryptography is client-side. Server acts as a blinded matching coordinator.
2. **Local First AI:** Heavy analysis on sensitive payload occurs in the user's browser runtime.
3. **Data Minimization:** Only hashed/blinded identifiers and normalized breach metadata are persisted.
4. **Explainability Over Black-Box Scoring:** Avoid arbitrary single scores (e.g. "18/100"). Present structured factors: **Severity**, **Attack Probability**, **Evidence**, and **Actionable Next Steps**.
5. **Human-Controlled Action:** High-consequence actions (credential revocation, takedown notices) require explicit human confirmation.

---

## 5. Functional Requirements (FR)

### Module 1: Identity Registry
- **FR-001 (Register Identifier):** Users can register email addresses, usernames, domains, and GitHub handles.
- **FR-002 (Client-Side Encryption):** Identity data is encrypted with AES-256-GCM using keys derived via Argon2id before transmission to storage.
- **FR-003 (Protected Identifier Derivation):** System computes blinded matching hashes (e.g., SHA-256 with source-specific salt or k-anonymity prefixes) for lookup.
- **FR-004 (Identity Status Management):** Support states: `ACTIVE`, `PAUSED`, `VERIFICATION_REQUIRED`, `REMOVED`.

### Module 2: Exposure Intelligence Engine
- **FR-005 (Source Connectors):** Standardized connectors for public breach dumps, threat intelligence feeds, OSINT databases, and GitHub secret scanners.
- **FR-006 (Normalization & Deduplication):** Ingested feeds are sanitized, validated, normalized into standard schema, and deduplicated using composite source fingerprints.
- **FR-007 (Source Reliability Index):** Classify source confidence (`OFFICIAL_DISCLOSURE`, `ESTABLISHED_FEED`, `UNVERIFIED_OSINT`) to weight incident severity.

### Module 3: Identity Intelligence & Cyber DNA Engine
- **FR-008 (Cyber DNA Graph Construction):** Maintain dynamic graph nodes (`Identity`, `Service`, `Account`, `Repository`, `API_Key`, `Token`, `Exposure`) and edges (`OWNS`, `USES`, `BELONGS_TO`, `EXPOSED_IN`, `DEPENDS_ON`).
- **FR-009 (Attack Path Prediction):** Traverse graph to predict cascading attack vectors (e.g., Leaked Email → Paired Username → Shared Service → Credential Stuffing Vulnerability).
- **FR-010 (Risk Matrix Evaluation):** Evaluate composite risk based on exposure recency, data sensitivity (plaintext password vs metadata), and graph centrality.

### Module 4: Privacy & Cryptography Engine
- **FR-011 (Web Crypto Integration):** Implement cryptographic operations using browser-native Web Crypto API (`SubtleCrypto`).
- **FR-012 (Passkey / WebAuthn Authentication):** Support passwordless authentication via WebAuthn / Passkeys, backed by secure session tokens.
- **FR-013 (Zero-Knowledge Lookup):** Ensure search queries to the backend do not reveal raw identity strings to network observers or database admins.

### Module 5: On-Device AI Engine
- **FR-014 (ONNX Browser Inference):** Run pre-trained Python models inside the browser using ONNX Runtime Web.
- **FR-015 (Hardware Acceleration):** Support WebGPU and WebAssembly backends with graceful CPU fallback.
- **FR-016 (Hybrid Analysis):** Combine deterministic rule-based severity bounds with machine learning classification for attack categorization and natural-language risk explanation.
- **FR-017 (Fail-Safe Offline Mode):** If the model fails to load or device is resource-constrained, fallback to deterministic security rules without leaking data to cloud LLMs.

### Module 6: Automation Engine
- **FR-018 (Continuous Scheduler):** Celery Beat orchestrates periodic background sweeps across active connectors at configurable intervals (e.g., every 6 hours).
- **FR-019 (Incremental Processing):** Track connector sync cursors to process only new and modified records.
- **FR-020 (Automated Incident Generation):** Automatically match findings against protected identifiers, deduplicate, and spawn structured incident records.
- **FR-021 (Intelligent Notification Engine):** Dispatch prioritized alerts (Immediate for Critical/High, Digest for Medium/Low) across web push and email.

### Module 7: Digital Damage Control Engine
- **FR-022 (6-Stage Incident Lifecycle):** Enforce state machine transitions: `DETECT → ASSESS → CONTAIN → RECOVER → VERIFY → CLOSE`.
- **FR-023 (Containment Playbooks):** Generate tailored immediate containment checklists (token revocation, password reset, MFA enforcement).
- **FR-024 (Automated Remediation Verification):** For supported credentials (e.g. GitHub PAT, OpenAI API Key), perform non-destructive API probes to verify that the revoked key is truly invalid before closing the incident.
- **FR-025 (Takedown & Removal Assistance):** Provide structured evidence templates and official reporting URLs for legitimate DMCA/privacy removal requests.

---

## 6. Non-Functional Requirements (NFR)

| Category | Requirement | Metric / Specification |
| :--- | :--- | :--- |
| **Performance** | Initial Dashboard Load | `< 1.2s` on standard broadband |
| **Performance** | On-Device Inference Latency | `< 150ms` per incident classification on WebGPU / `< 400ms` on WASM |
| **Model Footprint** | Quantized ONNX Model Size | `< 25MB` total download footprint |
| **Security** | At-Rest Encryption | AES-256-GCM for sensitive table columns |
| **Security** | In-Transit Encryption | TLS 1.3 mandatory with strict HSTS headers |
| **Privacy** | Server-Side Plaintext Storage | **0 plaintext passwords, emails, or tokens persisted** |
| **Reliability** | Worker Idempotency | 100% deduplication of re-processed breach feeds |
| **Scalability** | Background Processing | Support 100,000+ protected identity lookups per worker node |

---

## 7. Data Classification Matrix

| Data Classification | Description | Examples | Storage Rule |
| :--- | :--- | :--- | :--- |
| **PUBLIC** | Openly accessible metadata | Source names, breach publication dates, CVE numbers | Unencrypted in PostgreSQL |
| **SENSITIVE** | User identifiers | Email addresses, usernames, phone numbers, domain names | Encrypted with AES-256-GCM on client |
| **HIGHLY SENSITIVE**| Exposed credentials & tokens | Leaked password hashes, exposed API keys, session tokens | Never stored unencrypted; masked client-side |
| **DERIVED** | Computed analytical metrics | Risk classifications, Cyber DNA graph edge weights | Stored associated with pseudonymized User ID |

---

## 8. Definition of Done (DoD) & Acceptance Criteria

A feature or sprint is considered complete when:
1. All associated Functional Requirements have passing automated unit and integration tests.
2. Zero plaintext sensitive data is transmitted across API boundaries or stored in backend logs/databases.
3. On-device ONNX inference executes successfully on supported browser environments (Chromium, Firefox, Safari).
4. Code passes strict linting, type-checking (TypeScript strict mode, Python mypy/ruff), and security audits.
5. End-to-end user workflow is verified through the **Golden Demo Scenario**.

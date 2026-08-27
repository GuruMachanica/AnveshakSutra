# AnveshakSutra — 06. Digital Damage Control Engine

---

## 1. Purpose & Incident Remediation Lifecycle

Traditional breach notifications stop at alerting the user, leaving them overwhelmed and unsure of how to contain the damage.

The **Digital Damage Control Engine** transforms every confirmed exposure into a structured, step-by-step incident response playbook governed by a **6-stage lifecycle**:

```
 ┌──────────┐     ┌──────────┐     ┌──────────┐
 │  DETECT  │ ──► │  ASSESS  │ ──► │  CONTAIN │
 │ (Match)  │     │ (AI Risk)│     │(Isolate) │
 └──────────┘     └──────────┘     └────┬─────┘
                                        │
 ┌──────────┐     ┌──────────┐          │
 │  CLOSE   │ ◄── │  VERIFY  │ ◄────────┴─────┐
 │(Resolved)│     │ (Probes) │                │
 └──────────┘     └──────────┘                ▼
                                       ┌──────────┐
                                       │ RECOVER  │
                                       │ (Rotate) │
                                       └──────────┘
```

---

## 2. Stage Breakdown & Operational Protocol

### Stage 1: DETECT
- Exposure identified by continuous ingestion worker.
- Incident ticket generated in state `NEW`.
- Evidence metadata encrypted and linked.

### Stage 2: ASSESS
- Local AI model evaluates severity tier (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`).
- Attack path identified via Cyber DNA graph (e.g. credential reuse on secondary accounts).
- State transitions to `ACTION_REQUIRED`.

### Stage 3: CONTAIN (Immediate Threat Neutralization)
- **Goal:** Stop active exploitation within minutes of alert.
- **Actions:**
  - Revoke active API keys / Personal Access Tokens.
  - Terminate active web sessions / OAuth authorizations.
  - Temporarily lock or freeze compromised developer credentials.

### Stage 4: RECOVER (Long-Term Resilience)
- **Goal:** Restore normal operations with strengthened security postures.
- **Actions:**
  - Issue replacement credentials with least-privilege scoping.
  - Enforce hardware MFA (WebAuthn / Passkeys / TOTP).
  - Clean repository history (e.g., using `git-filter-repo` / BFG Repo-Cleaner if committed to Git).
  - Submit authorized DMCA or privacy removal requests using standardized templates.

### Stage 5: VERIFY (Cryptographic & API Proof)
- **Goal:** Objectively prove remediation succeeded before closing.
- **Actions:**
  - Automated probe against provider endpoint (e.g. GitHub/OpenAI returns HTTP 401).
  - User attestation check for non-probeable services (e.g., manual banking password change).

### Stage 6: CLOSE
- State transitions to `RESOLVED` or `CLOSED`.
- Append resolution log to immutable audit trail.
- Update Cyber DNA graph node status to `CLEAN`.

---

## 3. Incident State Machine

```
                                  ┌─────────────┐
                                  │     NEW     │
                                  └──────┬──────┘
                                         │
                                         ▼
                                  ┌─────────────┐
                    ┌────────────►│   TRIAGED   │◄────────────┐
                    │             └──────┬──────┘             │
                    │                    │                    │
                    │                    ▼                    │
                    │             ┌─────────────┐             │
                    │             │ACTION_REQ'D │             │
                    │             └──────┬──────┘             │
                    │                    │                    │
                    │                    ▼                    │
                    │             ┌─────────────┐             │
                    │             │ IN_PROGRESS │             │
                    │             └──────┬──────┘             │
                    │                    │                    │
                    │                    ▼                    │
                    │             ┌─────────────┐             │
                    │             │AWAIT_VERIFY │             │
                    │             └──────┬──────┘             │
                    │                    │                    │
                    │     Verification   │   Verification     │
                    │        Failed      ▼      Passed        │
                    │             ┌─────────────┐             │
                    └─────────────┤  RESOLVED   ├─────────────┘
                                  └──────┬──────┘
                                         │
                                         ▼
                                  ┌─────────────┐
                                  │   CLOSED    │
                                  └─────────────┘
```

---

## 4. Takedown & Privacy Removal Assistance

AnveshakSutra enforces a strict realism boundary: **We never promise to "delete data from the entire internet."** Once data is public, copies exist.

Instead, the platform provides automated tooling for legitimate remediation:
1. **Automated DMCA / Removal Notice Generator:** Generates legally structured removal requests containing exact URLs and commit SHAs for hosting providers (Pastebin, GitHub, Cloudflare, hosters).
2. **Official Reporting Route Mapping:** Direct deep-links to abuse reporting desks for verified cloud providers.
3. **Removal Request Status Tracking:** Dashboard tracking for sent takedown notices.

# AnveshakSutra — 00. Product Vision & Differentiators

> **"Tracing Digital Clues. Protecting Digital Identities."**  
> *Every Leak Leaves a Clue. We Find It.*

---

## 1. The Real-World Dilemma

In today’s hyper-connected ecosystem, individual users and small teams leave hundreds of digital footprints across SaaS services, open-source repositories, developer forums, and online platforms. When a third-party platform experiences a breach or a developer accidentally commits a private key, the victim rarely finds out immediately. 

Typically, discovery happens weeks or months later—**after** an account takeover, unauthorized API billing spike, or identity theft has already occurred.

```
       BREACH TIMELINE IN LEGACY SYSTEMS (Months of Lag)
───────────────────────────────────────────────────────────────────►
  Breach Occurs       Credentials Leaked       Attacker Exploits
  (Day 0)             on Forums (Day 30)       (Day 60)
                             ▲                      │
                             │                      ▼
                             │                 User Discovers
                             └──────────────── (Day 90: ATO & Fraud)
```

Existing enterprise solutions (CrowdStrike, Recorded Future, Palo Alto Networks) are designed for Fortune 500 SOC teams with 6-figure budgets. Consumer tools (HaveIBeenPwned, basic browser alerts) are passive, superficial, and provide zero contextual guidance or remediation automation.

---

## 2. The AnveshakSutra Solution

**AnveshakSutra (अन्वेषकसूत्र)** bridges this gap by acting as an **autonomous, privacy-preserving digital investigator**. It continuously traces leaked digital clues, connects them to a unified **Cyber DNA** graph, runs machine learning models locally on the user’s device, and executes an automated damage-control workflow.

```
              ANVESHAKSUTRA REAL-TIME REMEDIATION LIFECYCLE
───────────────────────────────────────────────────────────────────►
  Leak Occurs         Continuous Ingestion      On-Device AI Alerts
  (Day 0)             & Matching (Hour 1)       & Cyber DNA (Hour 2)
                                                    │
                                                    ▼
                                          Damage Control Verified
                                          & Closed (Hour 3)
```

---

## 3. Four Core Pillars of Innovation

### 🧬 Pillar 1: Cyber DNA — Topological Threat Correlation
Legacy tools treat breaches as isolated rows in a table: *"Your email was in Adobe 2013."*  
AnveshakSutra models identities as a living, interconnected graph (**Cyber DNA**):
- Connects emails, handles, developer tokens, repos, domains, and phone numbers.
- Identifies **lateral attack vectors** (e.g., if a personal Gmail was exposed in a forum leak, and that email is the recovery address for a GitHub admin account holding AWS keys, the system predicts the cascading threat).

### 🛡️ Pillar 2: Zero-Knowledge Privacy Architecture
Legacy breach checkers require users to trust the platform with their raw emails, usernames, and passwords. AnveshakSutra inverts the trust model:
- All sensitive identifiers are encrypted client-side using `AES-256-GCM` with keys derived via `Argon2id`.
- Lookups use protected, blinded hashes and k-anonymity prefixes.
- **The backend server never learns the user's plaintext identity.**

### 🧠 Pillar 3: On-Device AI Engine via ONNX Runtime Web
Sending sensitive breach intelligence to third-party cloud LLMs (OpenAI, Anthropic) introduces severe privacy and compliance risks.
- We develop and train our threat classification and attack prediction models in **Python** (`PyTorch`, `scikit-learn`, `Sentence Transformers`).
- Models are exported to **ONNX** format, quantized, and downloaded to the client browser.
- **ONNX Runtime Web** executes inference locally with **WebGPU/WebAssembly** acceleration—guaranteeing zero server-side exposure of analysis.

### ⚙️ Pillar 4: Autonomous Automation & Damage Control Engine
AnveshakSutra does not stop at detection:
- **Continuous Monitoring:** Celery + Redis workers query threat connectors periodically.
- **Incident Automation:** Auto-generates deduplicated incident tickets with evidence links.
- **Damage Control Engine:** Provides a 6-stage structured containment workflow (`DETECT → ASSESS → CONTAIN → RECOVER → VERIFY → CLOSE`).
- **Automated Verification:** Probes external APIs (e.g., GitHub PAT, OpenAI keys) to verify invalidation before resolving incidents.

---

## 4. Problem Statement Alignment (SIH PS-20)

| SIH PS-20 Challenge | AnveshakSutra Solution & Advantage |
| :--- | :--- |
| **Enterprise-Priced Tools** | Free/Open-Core browser-first PWA accessible to students, clubs, and individuals. |
| **Lack of Actionable Insights** | Step-by-step containment playbooks and automated verification rather than static alert emails. |
| **Accidental Secret Leaks** | Continuous GitHub & repository scanning for JWTs, AWS credentials, and API tokens. |
| **Shared Organization Accounts** | Multi-identifier tracking for student clubs, robotics teams, and startup founders. |
| **User Privacy Concerns** | Zero-knowledge client-side encryption; zero plaintext server persistence. |

---

## 5. Target User Personas

```
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│ 👨‍💻 Student Developer   │  │ 🧑 Everyday Individual   │  │ 👥 Student Club / NGO   │
│ • Accidental Git secrets│  │ • Password reuse fears  │  │ • Shared admin emails   │
│ • Leaked API keys       │  │ • Dark web leak checks  │  │ • Shared Discord/Drive  │
│ • HackerOne / BugBounty │  │ • Phishing protection   │  │ • Multi-member alerts   │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
```

---

## 6. What We Are NOT (Clear Boundaries)

To ensure laser focus and engineering excellence:
1. **Not a Password Manager:** We monitor exposure; we do not store password vaults.
2. **Not a Dark Web Market Buyer:** We index legal OSINT and disclosure feeds; we never purchase illicit data.
3. **Not an Attack Tool:** We strictly perform defensive threat intelligence and authorized verification probes.
4. **Not a Generic LLM Wrapper:** Our intelligence engine combines deterministic security rules with dedicated, specialized ONNX models running client-side.

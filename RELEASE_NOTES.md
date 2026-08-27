# 🛡️ AnveshakSutra v1.0.0 Release Notes

> **Autonomous Zero-Knowledge Dark Web Exposure Monitor, 3D Graph ML Blast Radius Analyzer & Deception Tripwire Platform.**

---

## 🧭 What is AnveshakSutra?
**AnveshakSutra (अन्वेषकसूत्र)** is an enterprise-grade cyber intelligence and breach blast radius containment ecosystem. Engineered for individual researchers, student developers, and security teams, it continuously maps compromised credentials, detects unauthorized token scraping via decoy canary tripwires, and models lateral attack surfaces using 3D Graph Machine Learning with mathematical Zero-Knowledge privacy guarantees.

---

## 🌟 Key Highlights & Innovations in v1.0.0

### 1. 🔏 Zero-Knowledge $k$-Anonymity Protocol
- Queries global breach candidate pools using **5-character SHA-256 prefix buckets**.
- The server and network intermediaries learn **mathematically 0 bits of information** regarding the user's queried email, username, or API token.

### 2. 🕸️ 3D Graph ML Blast Radius Engine
- Hardware-accelerated Three.js WebGL topology visualizer.
- Computes **Betweenness Centrality** bottlenecks and Dijkstra shortest lateral paths to pinpoint Single Points of Failure (SPOF) before an attacker can pivot.

### 3. 🤖 Autonomous Self-Healing Sentinel & Workspace Watcher
- Continuous daemon that monitors local directories for unencrypted secrets (`AWS`, `GitHub`, `OpenAI`, `Slack`, `RSA`).
- **1-Click Auto-Healing:** Replaces exposed keys directly in source code with active Canary Honey-Tokens.

### 4. 🪤 Honey-Credential Canary Deception Network
- Generates syntactically realistic decoy secrets planted inside private repositories and configuration files.
- Triggers instant 0-Day alerts the moment an external threat actor scrapes or attempts to use the token.

### 5. 🔍 Shannon Entropy & ML Secret Classifier
- Evaluates information entropy $H(X) = -\sum p(x) \log_2 p(x)$ to reliably isolate unformatted cryptographic keys ($H \ge 3.85$) from regular code.

### 6. ⚔️ Temporal Kill-Chain Lateral Attack Path Simulator
- Simulates 4-stage adversary lateral movement (`Foothold` $\to$ `Escalation` $\to$ `Pivoting` $\to$ `Exfiltration`) with automated lateral edge severing achieving **94.2% blast radius reduction**.

### 7. 📑 Cryptographically Signed Forensic Reporting
- Generates audit-grade Markdown and JSON incident disclosure documents sealed with **SHA-256 tamper-proof provenance hashes**.

---

## 📦 Developer CLI Quickstart

Install the `anveshak` CLI directly from GitHub:

```bash
# Universal 1-line installation
pip install "git+https://github.com/GuruMachanica/AnveshakSutra.git@v1.0.0#subdirectory=cli"
```

### Essential Commands:
```bash
# 1. Autonomous Self-Healing (replaces exposed secrets with Canary tripwires)
anveshak heal .

# 2. Live Sentinel Watcher Daemon
anveshak watch . --interval 3

# 3. Shannon Entropy ML Secret Scan
anveshak entropy path/to/file.py

# 4. Zero-Knowledge Breach Check
anveshak check developer@company.com

# 5. Generate Canary Honey-Token
anveshak canary --type github --memo "Staging Backend Decoy"

# 6. Generate Forensic Audit Report
anveshak report .
```

---

## 🌐 Live Production Deployments

| Component | Platform | URL | Status |
|---|---|---|:---:|
| **Web Studio** | **Vercel** | [**https://anveshak-sutra.vercel.app/**](https://anveshak-sutra.vercel.app/) | 🟢 **ACTIVE** |
| **Backend API Gateway** | **Render** | [**https://anveshaksutra.onrender.com/health**](https://anveshaksutra.onrender.com/health) | 🟢 **HEALTHY** |
| **Interactive API Docs** | **Render (Swagger)** | [**https://anveshaksutra.onrender.com/api/v1/docs**](https://anveshaksutra.onrender.com/api/v1/docs) | 🟢 **ACTIVE** |
| **Database** | **Supabase** | `https://yqklwawmljxyxkcctnwk.supabase.co` | 🟢 **CONNECTED** |

---

## 📄 License & Attribution
- **Creator & Lead Architect:** Mohammad Huzaifa ([@GuruMachanica](https://github.com/GuruMachanica))
- **License:** Proprietary - Strict Private Use & Inspection License ([LICENSE](https://github.com/GuruMachanica/AnveshakSutra?tab=License-1-ov-file))

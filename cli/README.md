# AnveshakSutra Developer CLI (`anveshak`)
> **Autonomous Zero-Knowledge Secret Scanner, K-Anonymity Breach Checker & Honey-Token Generator.**

---

## 📦 Installation

```bash
# Install locally in editable mode
cd cli
pip install -e .
```

---

## ⚡ CLI Usage & Commands

### 1. 🔍 Scan Local Directory for Exposed Secrets
Recursively scans code repositories, commit diffs, and `.env` files for unencrypted AWS keys, GitHub PATs, OpenAI secrets, and private RSA keys:
```bash
anveshak scan .
```
To fail the build in CI/CD if a secret is found:
```bash
anveshak scan . --fail-on-leak
```

---

### 2. 🔐 Zero-Knowledge $k$-Anonymity Breach Check
Queries the live threat monitoring pools using mathematical 5-character SHA-256 prefix buckets without transmitting plaintext credentials:
```bash
anveshak check developer@company.com
```

---

### 3. 🪤 Generate Honey-Credential Canary Tripwires
Generates context-aware decoy credentials for early breach detection:
```bash
anveshak canary --type github --memo "Staging Backend Secret"
anveshak canary --type aws --memo "Notion Engineering Runbook"
```

---

### 4. 🤖 Execute Non-Destructive Active Verification Probe
Mathematically verifies if a revoked key returns `HTTP 401 Unauthorized`:
```bash
anveshak verify --type GITHUB_PAT --token ghp_revoked_token_test_123
```

---

## 🐙 GitHub Action CI/CD Integration

Add `.github/workflows/anveshak-scan.yml` to your repository:

```yaml
name: AnveshakSutra Secret Scan

on: [push, pull_request]

jobs:
  security-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - name: Install Anveshak CLI
        run: |
          pip install ./cli
      - name: Scan Repository for Secrets
        run: |
          anveshak scan . --fail-on-leak
```

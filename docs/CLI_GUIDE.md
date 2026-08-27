# AnveshakSutra Developer CLI Guide (`anveshak`)

The **AnveshakSutra Developer CLI** brings enterprise-grade secret scanning, zero-knowledge breach monitoring, and autonomous self-healing directly to your local terminal and CI/CD pipelines.

---

## 📦 Installation

### Option 1: 1-Line Global Install (Recommended)
```bash
# Linux / macOS
pip install "git+https://github.com/GuruMachanica/AnveshakSutra.git#subdirectory=cli"

# Or install from GitHub Release Wheel (.whl)
pip install anveshak_cli-1.0.0-py3-none-any.whl
```

### Option 2: Local Editable Mode
```bash
# Clone the repository
git clone https://github.com/GuruMachanica/AnveshakSutra.git
cd AnveshakSutra/cli
pip install -e .
```

---

## ⚡ CLI Commands Reference

### 1. `anveshak scan [path]`
Recursively scans local workspace, git history, and `.env` files for unencrypted secrets (AWS keys, GitHub PATs, OpenAI tokens, Slack Webhooks, RSA keys).
```bash
# Scan current directory
anveshak scan .

# Scan specific folder
anveshak scan ./backend/app

# Fail with non-zero exit code on leak (CI/CD mode)
anveshak scan . --fail-on-leak
```

---

### 2. `anveshak heal [path]`
**Autonomous Self-Healing:** Automatically identifies exposed secrets in code, scrubs them, and plants context-aware **Canary Honey-Tokens** in their place.
```bash
anveshak heal .
```

---

### 3. `anveshak watch [path]`
Runs a live sentinel daemon in your terminal that continuously monitors your workspace every few seconds for secret exposures as you write code.
```bash
anveshak watch . --interval 3
```

---

### 4. `anveshak check <identifier>`
Executes a mathematical **Zero-Knowledge $k$-Anonymity** breach check against global exposure datasets without sending plaintext emails or keys.
```bash
anveshak check developer@company.com
anveshak check ghp_my_production_token
```

---

### 5. `anveshak canary`
Generates syntactically realistic honey-token tripwires for early intrusion detection.
```bash
# GitHub PAT Canary
anveshak canary --type github --memo "Staging Backend Decoy"

# AWS IAM Canary
anveshak canary --type aws --memo "Notion Runbook Honey Key"

# OpenAI Key Canary
anveshak canary --type openai --memo "Staging AI Model Key"
```

---

### 6. `anveshak verify`
Sends a non-destructive challenge probe to verify whether a revoked credential is confirmed dead (`HTTP 401 Unauthorized`).
```bash
anveshak verify --type GITHUB_PAT --token ghp_revoked_test_key_123
```

---

## 🐙 GitHub Actions CI/CD Integration

Create `.github/workflows/security-audit.yml`:

```yaml
name: AnveshakSutra Secret Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - name: Install Anveshak CLI
        run: pip install ./cli
      - name: Execute Secret Scan
        run: anveshak scan . --fail-on-leak
```

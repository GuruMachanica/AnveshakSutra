# AnveshakSutra — 04. Security Architecture & Threat Model

---

## 1. Cryptographic Design & Primitives

AnveshakSutra follows a strict **No Custom Cryptography** mandate. All cryptographic operations use standardized, vetted algorithms implemented through the browser's native **Web Crypto API** (`crypto.subtle`) and standard Python `cryptography` libraries.

```
┌──────────────────────────┬──────────────────────────┬───────────────────────────────────────┐
│ Primitive                │ Standard / Algorithm     │ Implementation Purpose                │
├──────────────────────────┼──────────────────────────┼───────────────────────────────────────┤
│ **Symmetric Encryption** │ AES-256-GCM (256-bit key)│ Client-side encryption of identities  │
│ **Key Derivation (KDF)** │ Argon2id (v=19, m=64MB,  │ Master password key stretching &      │
│                          │ t=3, p=4)                │ credential salt generation            │
│ **Protected Hashes**     │ SHA-256 (HMAC/Salted)    │ Blinded search tokens for lookups     │
│ **Authentication**       │ WebAuthn / Passkeys      │ Phishing-resistant FIDO2 credentials  │
│ **Transport Security**   │ TLS 1.3 Strict           │ Secure in-transit HTTPS API transport │
└──────────────────────────┴──────────────────────────┴───────────────────────────────────────┘
```

---

## 2. Zero-Knowledge Key Hierarchy

```
                            USER MASTER SECRET / PASSKEY
                                         │
                                         ▼
                               Argon2id Key Derivation
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
       Client Encryption Key (CEK)               Protected Search Salt (PSS)
       [AES-256-GCM]                             [HMAC-SHA-256]
                    │                                         │
                    ▼                                         ▼
       Encrypts raw identifiers                  Computes Blinded Identifier
       (e.g., "alice@example.com")               (e.g., "7f9a1b...d4e8")
                    │                                         │
                    └────────────────────┬────────────────────┘
                                         │
                                         ▼
                            Persisted to PostgreSQL
                      (Ciphertext Blob + Blinded Hash)
```

**Key Security Guarantees:**
1. **Server Blindness:** The backend receives `ciphertext` and `blinded_hash`. Without the client-side `CEK`, the server or an attacker dumping the database cannot decrypt the email or username.
2. **Deterministic Lookups:** When a breach dump containing `target_identifier` is ingested, the worker computes the same salt-derived `blinded_hash` and matches records in `O(1)` without knowing who it belongs to.

---

## 3. STRIDE Threat Model & Mitigations

| STRIDE Category | Threat Scenario | Impact | AnveshakSutra Mitigation |
| :--- | :--- | :--- | :--- |
| **Spoofing** | Attacker attempts to register/query someone else's identity to monitor them. | Unauthorized surveillance of victim's exposures. | Mandatory ownership verification (email token / DNS challenge / GitHub OAuth proof) for active monitoring. |
| **Tampering** | Malicious data injection into threat feed connectors. | False-positive incident flooding or parser exploit. | Feed isolation parsers, strict Pydantic input schemas, non-executable content sanitization. |
| **Repudiation** | User denies performing remediation or revoking access. | Audit trail confusion. | Append-only cryptographically hashed audit log (`audit_events` table). |
| **Information Disclosure** | Complete PostgreSQL database compromise / leak. | Exposure of all monitored user identities. | **Zero Plaintext Storage:** Identities stored as AES-256-GCM ciphertexts; keys exist only in client browser memory. |
| **Denial of Service** | Flooding ingestion workers with massive synthetic dumps. | Queue starvation & delayed alerts. | Worker queue partitioning (`high_priority`, `matching`, `ingestion`), Redis rate limiting, feed deduplication. |
| **Elevation of Privilege** | Attacker accesses another user's incidents (`GET /incidents/{id}`). | Exposure of breach reports. | Strict row-level tenant enforcement in FastAPI dependencies (`WHERE user_id == current_user.id`). |

---

## 4. Web Application Security Controls

1. **Content Security Policy (CSP):**
   ```http
   Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.anveshaksutra.io; img-src 'self' data:; object-src 'none'; frame-ancestors 'none';
   ```
2. **Cross-Origin & Frame Protection:**
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
3. **Session Cookie Hardening:**
   - `HttpOnly; Secure; SameSite=Strict`
4. **Supply Chain & Model Integrity:**
   - Pinned npm & pip dependencies with integrity lockfiles (`package-lock.json`, `poetry.lock`).
   - SHA-256 verification of ONNX model files prior to loading in `onnxruntime-web`.

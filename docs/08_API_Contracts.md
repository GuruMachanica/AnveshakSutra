# AnveshakSutra — 08. API Contracts & Endpoints

---

## 1. REST API Standards

- **Base URL:** `/api/v1`
- **Content-Type:** `application/json`
- **Authentication:** `Authorization: Bearer <session_jwt_or_passkey_token>`
- **Errors:** RFC 7807 Problem Details compliant format.

---

## 2. Authentication Endpoints (`/api/v1/auth`)

### 1. Start Passkey Registration
- **Endpoint:** `POST /api/v1/auth/passkey/register/start`
- **Request Body:**
  ```json
  {
    "username": "alice",
    "email_hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    "encrypted_email": "eyJpdiI6IC4uLiwgImNpcGhlciI6IC4uLn0="
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "challenge": "dGhpcyBpcyBhIHJhbmRvbSBjaGFsbGVuZ2U...",
    "rp": { "name": "AnveshakSutra", "id": "anveshaksutra.io" },
    "user": { "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", "name": "alice", "displayName": "alice" },
    "pubKeyCredParams": [{ "type": "public-key", "alg": -7 }]
  }
  ```

### 2. Complete Passkey Registration
- **Endpoint:** `POST /api/v1/auth/passkey/register/finish`
- **Request Body:** WebAuthn Attestation Object
- **Response (201 Created):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 86400
  }
  ```

---

## 3. Identity Registry Endpoints (`/api/v1/identities`)

### 1. Register Monitored Identity
- **Endpoint:** `POST /api/v1/identities`
- **Request Body:**
  ```json
  {
    "identity_type": "EMAIL",
    "blinded_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "encrypted_identifier": "U2FsdGVkX1+...encrypted_aes_gcm_payload..."
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "c4ca4238-a0b9-4ae8-97ff-2e8d64c11f42",
    "identity_type": "EMAIL",
    "status": "ACTIVE",
    "created_at": "2026-08-27T10:00:00Z"
  }
  ```

### 2. List User's Monitored Identities
- **Endpoint:** `GET /api/v1/identities`
- **Response (200 OK):**
  ```json
  [
    {
      "id": "c4ca4238-a0b9-4ae8-97ff-2e8d64c11f42",
      "identity_type": "EMAIL",
      "encrypted_identifier": "U2FsdGVkX1+...",
      "status": "ACTIVE",
      "created_at": "2026-08-27T10:00:00Z"
    }
  ]
  ```

---

## 4. Incident & Exposure Endpoints (`/api/v1/incidents`)

### 1. List Active Incidents
- **Endpoint:** `GET /api/v1/incidents`
- **Query Params:** `status=ACTION_REQUIRED&severity=CRITICAL`
- **Response (200 OK):**
  ```json
  {
    "total": 1,
    "items": [
      {
        "id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
        "identity_id": "c4ca4238-a0b9-4ae8-97ff-2e8d64c11f42",
        "severity": "CRITICAL",
        "status": "ACTION_REQUIRED",
        "encrypted_summary": "EncryptedSummaryBlob...",
        "ai_risk_score": 0.94,
        "created_at": "2026-08-27T11:30:00Z"
      }
    ]
  }
  ```

### 2. Get Incident Details with Evidence
- **Endpoint:** `GET /api/v1/incidents/{incident_id}`
- **Response (200 OK):**
  ```json
  {
    "id": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
    "severity": "CRITICAL",
    "status": "ACTION_REQUIRED",
    "evidence": [
      {
        "source_name": "GitHub Public Secret Scanner",
        "affected_service": "GitHub",
        "exposure_category": "API_KEY",
        "discovered_at": "2026-08-27T11:28:00Z",
        "evidence_metadata": {
          "repo_name": "demo-project",
          "commit_sha": "4a7b3c2d...",
          "token_prefix": "ghp_live_"
        }
      }
    ],
    "recovery_actions": [
      {
        "id": "act-1",
        "action_type": "REVOKE_TOKEN",
        "description": "Revoke exposed GitHub Personal Access Token",
        "is_completed": false,
        "verification_probe_type": "GITHUB_PAT"
      }
    ]
  }
  ```

---

## 5. Recovery & Verification Endpoints (`/api/v1/recovery`)

### 1. Trigger Automated Verification Probe
- **Endpoint:** `POST /api/v1/recovery/{action_id}/verify`
- **Response (202 Accepted):**
  ```json
  {
    "task_id": "celery-task-8849-2910",
    "status": "PROBING",
    "message": "Automated verification probe initiated. You will receive an alert once complete."
  }
  ```

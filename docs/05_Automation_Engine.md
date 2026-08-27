# AnveshakSutra — 05. Automation Engine

---

## 1. Automation Overview & Objectives

The **Automation Engine** transforms AnveshakSutra from a manual, one-off lookup tool into an autonomous, 24/7 identity monitoring and incident response system.

Key automation capabilities include:
1. **Continuous Incremental Ingestion:** Periodically polls threat feeds, public leak archives, and GitHub repos.
2. **Automated Incident Creation & Deduplication:** Generates incident tickets when protected identity matches occur and merges multi-source duplicates into single unified incidents.
3. **Notification Throttling & Priority Routing:** Dispatches immediate push/email alerts for critical events while batching low-severity findings into daily digests.
4. **Autonomous Remediation Verification:** Probes third-party APIs to verify whether revoked keys or credentials are truly inactive.

```
                            CELERY BEAT SCHEDULER
                                      │
                                      ▼
                        Periodic Tasks Dispatcher
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
  Sweep Connectors            Dedupe & Match             Dispatch Digests
  (Every 6 Hours)             (Real-time Ingest)         (Daily @ 08:00 UTC)
          │                           │                           │
          ▼                           ▼                           ▼
  Fetch New Feed Rows        Query Protected IDs         Send Aggregated Summary
```

---

## 2. Ingestion & Deduplication Pipeline

When the same breach data appears across multiple breach archives or paste sites, the Automation Engine prevents alert fatigue by merging findings into a single logical incident.

```
                          INGESTED SOURCE RECORD
                                    │
                                    ▼
                ┌───────────────────────────────────────┐
                │ Calculate Composite Hash Fingerprint   │
                │ hash(service + category + raw_hash)   │
                └───────────────────┬───────────────────┘
                                    │
                                    ▼
                ┌───────────────────────────────────────┐
                │ Query Redis Deduplication Cache       │
                └───────────────────┬───────────────────┘
                                    │
                       ┌────────────┴────────────┐
                       ▼                         ▼
                  ALREADY SEEN                NEW ITEM
                       │                         │
                       ▼                         ▼
            Append Evidence Reference     Create Incident Record
            to Existing Incident          Status: NEW
            (No Duplicate Alert)          Dispatch Alert to User
```

---

## 3. Celery Task Definitions

### A. Continuous Sync Sweep (`tasks_monitoring.py`)
```python
@celery_app.task(bind=True, max_retries=3, default_retry_delay=300)
def sweep_active_connectors(self):
    """
    Triggered periodically by Celery Beat.
    Iterates through all registered connectors and pulls incremental changes.
    """
    logger.info("Starting scheduled connector sweep.")
    connectors = get_active_connectors()
    for conn in connectors:
        cursor = get_last_sync_cursor(conn.source_id)
        try:
            raw_records = conn.fetch(cursor=cursor)
            if raw_records:
                process_feed_batch.delay(conn.source_id, raw_records)
                update_connector_cursor(conn.source_id, raw_records[-1].get("id"))
        except Exception as exc:
            logger.error(f"Error sweeping connector {conn.source_id}: {exc}")
            self.retry(exc=exc)
```

### B. Matching & Incident Generation (`tasks_matching.py`)
```python
@celery_app.task
def process_feed_batch(source_id: str, raw_records: list):
    """
    Normalizes feed items and matches against active protected identity hashes.
    """
    connector = get_connector_by_id(source_id)
    for raw in raw_records:
        item = connector.normalize(raw)
        if not connector.validate(item):
            continue
        
        # Check matching protected identities
        matched_user_ids = query_matching_identities(item.protected_identifier_hash)
        for user_id in matched_user_ids:
            create_or_update_incident.delay(user_id, item.dict())
```

---

## 4. Automated Verification Engine (`tasks_verification.py`)

When a user marks a remediation task as complete (e.g., *"I revoked my GitHub Personal Access Token"*), the Automation Engine autonomously executes a non-destructive verification probe:

```python
@celery_app.task(bind=True, max_retries=5, default_retry_delay=60)
def verify_credential_revocation(self, incident_id: str, probe_type: str, test_payload: dict):
    """
    Probes third-party API to ensure revoked token returns HTTP 401 Unauthorized.
    """
    if probe_type == "GITHUB_PAT":
        token_prefix = test_payload.get("token_prefix")
        is_active = probe_github_token_status(token_prefix)
        
        if not is_active:
            # Token successfully revoked!
            mark_incident_verified(incident_id)
            dispatch_notification(incident_id, "Verification Successful: Token is confirmed inactive. Incident closed.")
        else:
            # Token still active!
            mark_verification_failed(incident_id)
            dispatch_notification(incident_id, "Warning: Token still appears active. Please ensure revocation succeeded.")
```

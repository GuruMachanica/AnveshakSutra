# AnveshakSutra — 02. Backend & Worker Architecture

---

## 1. Backend Overview & Technology Stack

The AnveshakSutra backend provides a resilient, asynchronous, high-throughput microservices-ready architecture powered by:
- **Framework:** FastAPI 0.110+ (Python 3.11+) with async/await native endpoints.
- **ORM / Migrations:** SQLAlchemy 2.0 (Asyncpg driver) + Alembic.
- **Data Validation:** Pydantic v2.
- **Task Queue & Scheduler:** Celery 5.3+ with Redis 7+ backend.
- **Authentication:** WebAuthn (Passkeys) + Argon2id password-fallback session tokens.

---

## 2. Directory Layout

```
backend/
├── app/
│   ├── main.py                  # Application entrypoint & middleware configuration
│   ├── core/                    # Core configs, security primitives, database sessions
│   │   ├── config.py            # Environment settings (Pydantic Settings)
│   │   ├── database.py          # Async SQLAlchemy engine & session factory
│   │   ├── security.py          # Session hashing, JWT/token handling, rate limiting
│   │   └── logging.py           # Structured JSON logger
│   │
│   ├── api/                     # REST API versioned routes
│   │   ├── v1/
│   │   │   ├── api.py           # Master router aggregator
│   │   │   ├── auth.py          # Passkey registration, login, session refresh
│   │   │   ├── identities.py    # Protected identity registration, list, pause, delete
│   │   │   ├── incidents.py     # Incident status, evidence queries, state transitions
│   │   │   ├── cyber_dna.py     # Graph node & edge state queries
│   │   │   ├── recovery.py      # Damage control actions & verification triggers
│   │   │   ├── notifications.py # Alert preferences and notification delivery
│   │   │   └── monitoring.py    # Health checks, connector status, manual scans
│   │
│   ├── models/                  # SQLAlchemy declarative ORM models
│   │   ├── user.py              # User account & credential state
│   │   ├── identity.py          # Encrypted identities & protected search hashes
│   │   ├── source.py            # External threat intelligence connector metadata
│   │   ├── exposure.py          # Raw normalized exposure records
│   │   ├── incident.py          # User-associated incident tickets
│   │   ├── cyber_dna.py         # Cyber DNA graph nodes & relationship edges
│   │   ├── recovery.py          # Damage control action tracking & verification state
│   │   └── audit.py             # Security audit logs
│   │
│   ├── schemas/                 # Pydantic request/response validation schemas
│   │   ├── auth.py
│   │   ├── identity.py
│   │   ├── incident.py
│   │   ├── cyber_dna.py
│   │   ├── recovery.py
│   │   └── common.py
│   │
│   ├── services/                # Business logic & orchestrators
│   │   ├── auth_service.py
│   │   ├── identity_service.py
│   │   ├── incident_service.py
│   │   ├── cyber_dna_service.py
│   │   └── recovery_service.py
│   │
│   └── workers/                 # Celery task definitions & background jobs
│       ├── celery_app.py        # Celery instance configuration & Beat schedules
│       ├── tasks_monitoring.py  # Periodic source synchronization sweeps
│       ├── tasks_matching.py    # Ingested feed to protected identity matching
│       ├── tasks_incidents.py   # Incident creation & deduplication
│       ├── tasks_notifications.py# Email and Web Push dispatcher
│       └── tasks_verification.py# Automated token/secret invalidation probes
│
├── connectors/                  # Ingestion connectors for external threat sources
│   ├── base.py                  # Abstract connector interface
│   ├── breach_dump.py           # Standard breach dump parser
│   ├── threat_feed.py           # OSINT & pastebin connector
│   └── github_scanner.py        # GitHub public repository secret detector
│
├── alembic/                     # Database migration scripts
│   ├── env.py
│   └── versions/
│
├── tests/                       # Unit & integration tests
│   ├── test_auth.py
│   ├── test_identities.py
│   ├── test_matching.py
│   └── test_workers.py
│
├── requirements.txt
└── Dockerfile
```

---

## 3. Worker Tasks & Queue Architecture

Celery tasks are partitioned into dedicated queues to prevent high-volume ingestion sweeps from starving high-priority user actions:

```
                                      REDIS BROKER
                 ┌─────────────────────────────────────────────────────┐
                 │                                                     │
                 │  Queue: 'high_priority'                             │
                 │  • Immediate critical alerts                        │
                 │  • Real-time user manual verification probes        │
                 │                                                     │
                 │  Queue: 'matching'                                  │
                 │  • Entity-to-Protected-Identifier lookup            │
                 │  • Incident deduplication & generation             │
                 │                                                     │
                 │  Queue: 'ingestion'                                 │
                 │  • Periodic breach feed downloading & parsing       │
                 │  • GitHub repo scanning                             │
                 │                                                     │
                 └─────────────────────────┬───────────────────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
             Worker Pool A (Fast)                  Worker Pool B (Batch)
             --queues=high_priority,matching       --queues=ingestion
             (Concurrency: 8)                      (Concurrency: 4)
```

---

## 4. Source Connector Interface (`connectors/base.py`)

All threat intelligence feeds must implement the standardized `BaseConnector` interface:

```python
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel

class NormalizedExposureItem(BaseModel):
    source_id: str
    source_reference: str
    affected_service: str
    exposure_category: str  # e.g., 'CREDENTIAL', 'API_KEY', 'PERSONAL_DATA'
    protected_identifier_hash: str  # SHA-256 hash of target identifier
    evidence_metadata: Dict[str, Any]
    discovered_at: datetime
    published_at: Optional[datetime] = None
    confidence_score: float  # 0.0 to 1.0

class BaseConnector(ABC):
    def __init__(self, source_id: str, name: str, source_type: str):
        self.source_id = source_id
        self.name = name
        self.source_type = source_type

    @abstractmethod
    async def fetch(self, cursor: Optional[str] = None) -> List[Dict[str, Any]]:
        """Fetch raw batch records from external feed."""
        pass

    @abstractmethod
    def normalize(self, raw_record: Dict[str, Any]) -> NormalizedExposureItem:
        """Sanitize and map raw feed record to standard NormalizedExposureItem."""
        pass

    @abstractmethod
    def validate(self, normalized_item: NormalizedExposureItem) -> bool:
        """Validate integrity and format of normalized item."""
        pass
```

---

## 5. Caching & Performance Strategies

1. **Protected Identifier Filter in Redis:**
   - Active protected hashes are maintained in a Redis Set / Bloom Filter for `O(1)` sub-millisecond matching checks during high-volume feed ingestion before hitting PostgreSQL.
2. **Session & Rate-Limiting:**
   - Redis token bucket rate limiting applied per IP and per authenticated user.
3. **Database Connection Pooling:**
   - `Asyncpg` connection pool with automatic recycling to avoid connection exhaustion under burst loads.

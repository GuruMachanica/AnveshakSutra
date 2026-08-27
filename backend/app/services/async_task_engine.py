"""
AnveshakSutra - High-Performance Async Task Engine
Zero-Cost, In-Process Asynchronous Background Task & Scheduling Engine using pure Python asyncio.
Eliminates Celery & Redis dependencies for 100% free hosting on Render, Vercel, and Netlify.
"""

import asyncio
import logging
from typing import Callable, Any, Dict, List, Optional
from datetime import datetime, timezone
import uuid

logger = logging.getLogger("anveshaksutra.async_tasks")

class AsyncTaskRecord:
    def __init__(self, task_id: str, name: str, payload: Dict[str, Any]):
        self.task_id = task_id
        self.name = name
        self.payload = payload
        self.status = "QUEUED"  # QUEUED, RUNNING, COMPLETED, FAILED
        self.created_at = datetime.now(timezone.utc).isoformat()
        self.started_at: Optional[str] = None
        self.completed_at: Optional[str] = None
        self.result: Optional[Any] = None
        self.error: Optional[str] = None

class InMemoryCache:
    """
    Lightweight, thread-safe asynchronous in-memory TTL cache.
    Replaces Redis key-value caching with 0 external infrastructure cost.
    """
    def __init__(self):
        self._store: Dict[str, Dict[str, Any]] = {}
        self._lock = asyncio.Lock()

    async def set(self, key: str, value: Any, ttl_seconds: int = 3600):
        async with self._lock:
            expires_at = datetime.now(timezone.utc).timestamp() + ttl_seconds
            self._store[key] = {
                "val": value,
                "exp": expires_at
            }

    async def get(self, key: str) -> Optional[Any]:
        async with self._lock:
            entry = self._store.get(key)
            if not entry:
                return None
            if datetime.now(timezone.utc).timestamp() > entry["exp"]:
                del self._store[key]
                return None
            return entry["val"]

    async def delete(self, key: str):
        async with self._lock:
            if key in self._store:
                del self._store[key]

    async def clear(self):
        async with self._lock:
            self._store.clear()


class AsyncTaskEngine:
    """
    Core Asyncio Background Task Engine.
    Handles non-blocking background executions, recurring scheduler loops, and task tracking.
    """
    def __init__(self):
        self.tasks: Dict[str, AsyncTaskRecord] = {}
        self.cache = InMemoryCache()
        self._running_loops: List[asyncio.Task] = []
        self._is_running = False

    async def enqueue(self, name: str, coroutine_fn: Callable, *args, **kwargs) -> str:
        """
        Enqueues and immediately spawns a background asyncio task.
        """
        task_id = f"task_{uuid.uuid4().hex[:12]}"
        payload = {"args": [str(a) for a in args], "kwargs": {k: str(v) for k, v in kwargs.items()}}
        record = AsyncTaskRecord(task_id=task_id, name=name, payload=payload)
        self.tasks[task_id] = record

        # Spawn non-blocking execution in the active asyncio event loop
        asyncio.create_task(self._execute_wrapper(record, coroutine_fn, *args, **kwargs))
        return task_id

    async def _execute_wrapper(self, record: AsyncTaskRecord, coroutine_fn: Callable, *args, **kwargs):
        record.status = "RUNNING"
        record.started_at = datetime.now(timezone.utc).isoformat()
        try:
            res = await coroutine_fn(*args, **kwargs)
            record.status = "COMPLETED"
            record.result = res
        except Exception as exc:
            logger.error(f"Task {record.task_id} ({record.name}) failed: {exc}", exc_info=True)
            record.status = "FAILED"
            record.error = str(exc)
        finally:
            record.completed_at = datetime.now(timezone.utc).isoformat()

    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        record = self.tasks.get(task_id)
        if not record:
            return None
        return {
            "task_id": record.task_id,
            "name": record.name,
            "status": record.status,
            "created_at": record.created_at,
            "started_at": record.started_at,
            "completed_at": record.completed_at,
            "result": record.result,
            "error": record.error,
        }

    def list_recent_tasks(self, limit: int = 20) -> List[Dict[str, Any]]:
        sorted_tasks = sorted(self.tasks.values(), key=lambda t: t.created_at, reverse=True)
        return [self.get_task(t.task_id) for t in sorted_tasks[:limit] if self.get_task(t.task_id)]


# Global Engine Singleton Instance
async_engine = AsyncTaskEngine()

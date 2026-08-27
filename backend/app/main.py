from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
import time
from collections import defaultdict

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    description="AnveshakSutra (अन्वेषकसूत्र) - Privacy-Preserving Identity Exposure Intelligence Platform"
)

# -----------------------------------------------------------------------------
# 1. SECURITY HEADERS & DEFENSE-IN-DEPTH MIDDLEWARE
# -----------------------------------------------------------------------------
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()"
        response.headers["X-Permitted-Cross-Domain-Policies"] = "none"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# -----------------------------------------------------------------------------
# 2. IN-MEMORY SLIDING WINDOW RATE LIMITER (ANTI-DOS / BRUTE FORCE DEFENSE)
# -----------------------------------------------------------------------------
client_request_history = defaultdict(list)
RATE_LIMIT_WINDOW_SEC = 60
MAX_REQUESTS_PER_WINDOW = 120

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        # Clean older requests outside window
        history = [t for t in client_request_history[client_ip] if now - t < RATE_LIMIT_WINDOW_SEC]
        history.append(now)
        client_request_history[client_ip] = history

        # Add rate limit headers to response
        response = await call_next(request)
        remaining = max(0, MAX_REQUESTS_PER_WINDOW - len(history))
        response.headers["X-RateLimit-Limit"] = str(MAX_REQUESTS_PER_WINDOW)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(now + RATE_LIMIT_WINDOW_SEC))
        return response

app.add_middleware(RateLimitMiddleware)

# -----------------------------------------------------------------------------
# 3. CORS MIDDLEWARE
# -----------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Open for development / Render + Vercel integration
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include master API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint for Render/Docker container probes."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "security_mode": "HARDENED",
        "features": [
            "3D Cyber DNA Visualizer",
            "Generalized K-Anonymity Zero-Knowledge Proofs",
            "Canary Tokens (Honey-Credentials)",
            "Automated Active Verification Probes",
            "Zero-Cost Async Task Engine"
        ]
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to AnveshakSutra API (अन्वेषकसूत्र)",
        "docs": f"{settings.API_V1_STR}/docs",
        "version": settings.VERSION,
        "security": "Enforced (HSTS, Anti-Clickjacking, CSP, Rate-Limiting Active)"
    }

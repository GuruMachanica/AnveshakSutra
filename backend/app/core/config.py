from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "AnveshakSutra API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://anveshak-sutra.vercel.app",
        "https://anveshaksutra.vercel.app",
        "https://anveshaksutra.netlify.app"
    ]
    
    # Database - Supabase PostgreSQL Connection
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    SUPABASE_PUBLISHABLE_KEY: Optional[str] = None
    SUPABASE_SECRET_KEY: Optional[str] = None
    SUPABASE_JWKS_URL: Optional[str] = None
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://postgres:postgres_secret@localhost:5432/postgres"
    )
    
    # Zero-Cost Async Engine (Replaces Celery & Redis with pure Asyncio & In-Memory TTL Cache)
    ASYNC_ENGINE_WORKERS: int = 4
    IN_MEMORY_CACHE_TTL: int = 3600  # 1 Hour TTL
    
    # Security & JWT
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "super_secret_jwt_key_for_anveshaksutra_2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days

    # External Provider Verification APIs (Configurable via .env)
    GITHUB_API_URL: str = os.getenv("GITHUB_API_URL", "https://api.github.com/user")
    OPENAI_API_URL: str = os.getenv("OPENAI_API_URL", "https://api.openai.com/v1/models")

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        extra="ignore"
    )

settings = Settings()

"""
Configuration management for DeckSnap backend
Follows DRY principle: single source of truth for all settings
"""
from typing import Optional

from pydantic import Field, PostgresDsn, RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    Following KISS principle: flat structure, clear naming
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = Field(default="DeckSnap API", description="Application name")
    app_version: str = Field(default="0.1.0", description="Application version")
    debug: bool = Field(default=False, description="Debug mode")
    environment: str = Field(default="development", description="Environment: development/production")

    # API Server
    api_host: str = Field(default="0.0.0.0", description="API host")
    api_port: int = Field(default=8000, description="API port")
    api_workers: int = Field(default=1, description="Number of uvicorn workers")
    cors_origins: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"],
        description="Allowed CORS origins",
    )

    # Database (PostgreSQL)
    database_url: PostgresDsn = Field(
        default="postgresql://decksnap:decksnap@localhost:5433/decksnap",
        description="PostgreSQL connection URL",
    )
    database_pool_size: int = Field(default=5, description="Database connection pool size")
    database_max_overflow: int = Field(default=10, description="Max overflow connections")
    database_echo: bool = Field(default=False, description="Echo SQL queries")

    # Redis
    redis_url: RedisDsn = Field(
        default="redis://localhost:6381/0",
        description="Redis connection URL",
    )
    redis_max_connections: int = Field(default=10, description="Max Redis connections")

    # Celery
    celery_broker_url: str = Field(
        default="redis://localhost:6381/0",
        description="Celery broker URL",
    )
    celery_result_backend: str = Field(
        default="redis://localhost:6381/1",
        description="Celery result backend URL",
    )
    celery_task_time_limit: int = Field(
        default=3600,
        description="Task time limit in seconds (1 hour)",
    )
    celery_task_soft_time_limit: int = Field(
        default=3300,
        description="Soft time limit in seconds (55 minutes)",
    )

    # Security
    secret_key: str = Field(
        default="change-this-in-production-to-a-secure-random-key",
        description="Secret key for JWT tokens",
    )
    jwt_algorithm: str = Field(default="HS256", description="JWT algorithm")
    access_token_expire_minutes: int = Field(
        default=30,
        description="Access token expiration time",
    )

    # Image Storage Provider
    storage_provider: Optional[str] = Field(
        default=None,
        description="Image storage provider: 's3', 'cloudinary', or 'local'. Auto-detected if not set.",
    )

    # S3 (Image Storage)
    aws_access_key_id: Optional[str] = Field(
        default=None,
        description="AWS Access Key ID",
    )
    aws_secret_access_key: Optional[str] = Field(
        default=None,
        description="AWS Secret Access Key",
    )
    aws_s3_bucket: str = Field(
        default="decksnap-images",
        description="S3 bucket name",
    )
    aws_region: str = Field(
        default="us-east-1",
        description="AWS region",
    )

    # Cloudinary (Alternative image storage)
    cloudinary_cloud_name: Optional[str] = Field(
        default=None,
        description="Cloudinary cloud name",
    )
    cloudinary_api_key: Optional[str] = Field(
        default=None,
        description="Cloudinary API key",
    )
    cloudinary_api_secret: Optional[str] = Field(
        default=None,
        description="Cloudinary API secret",
    )

    # AI / Gemini
    gemini_api_key: str = Field(
        default="",
        description="Gemini API key for image generation",
    )

    # Rate Limiting
    rate_limit_enabled: bool = Field(default=True, description="Enable rate limiting")
    rate_limit_requests: int = Field(
        default=100,
        description="Max requests per minute",
    )

    # Logging
    log_level: str = Field(default="INFO", description="Logging level")
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        description="Log format",
    )

    def get_database_url_str(self) -> str:
        """Get database URL as string"""
        return str(self.database_url)

    def get_redis_url_str(self) -> str:
        """Get Redis URL as string"""
        return str(self.redis_url)


# Singleton instance (DRY principle - single source of truth)
settings = Settings()

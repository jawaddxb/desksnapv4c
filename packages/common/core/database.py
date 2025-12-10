"""
Database configuration and session management
Follows SOLID-D principle: depends on abstractions (SQLAlchemy engine)
"""
from contextlib import contextmanager
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from packages.common.core.config import settings
from packages.common.models.base import Base

# Create database engine
# Following KISS principle: simple connection pooling configuration
engine = create_engine(
    settings.get_database_url_str(),
    pool_size=settings.database_pool_size,
    max_overflow=settings.database_max_overflow,
    echo=settings.database_echo,
    pool_pre_ping=True,  # Verify connections before using
    pool_recycle=3600,  # Recycle connections after 1 hour
)

# Create session factory
# Following SOLID-S principle: SessionLocal has single responsibility (create sessions)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)

# Re-export Base for backward compatibility
__all__ = ["Base", "engine", "SessionLocal", "get_db", "get_db_context"]


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function for FastAPI routes
    Automatically handles session lifecycle

    Usage:
        @app.get("/items")
        def get_items(db: Session = Depends(get_db)):
            return db.query(Item).all()

    Follows SOLID-S: Single responsibility (provide DB session)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_context() -> Generator[Session, None, None]:
    """
    Context manager for database sessions
    Use in services and tasks that don't use FastAPI Depends

    Usage:
        with get_db_context() as db:
            user = db.query(User).first()

    Follows KISS principle: simple context manager pattern
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def create_tables() -> None:
    """
    Create all database tables
    Used in initialization scripts and tests

    Follows SOLID-S: Single responsibility (create tables)
    """
    Base.metadata.create_all(bind=engine)


def drop_tables() -> None:
    """
    Drop all database tables
    Used in tests and development

    WARNING: This will delete all data!
    """
    Base.metadata.drop_all(bind=engine)

"""
FastAPI Dependencies
Reusable dependencies for route handlers
Follows SOLID-D: Dependency injection pattern
"""
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from packages.common.core.database import get_db
from packages.common.models.user import User
from packages.common.services.auth_service import (
    AuthError,
    get_current_user_from_token,
)

# Security scheme for Swagger docs
security = HTTPBearer(auto_error=False)


def get_current_user(
    db: Annotated[Session, Depends(get_db)],
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
) -> User:
    """
    Get the current authenticated user from the JWT token

    Raises:
        HTTPException: 401 if not authenticated
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user = get_current_user_from_token(db, credentials.credentials)
        return user
    except AuthError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.message,
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_optional(
    db: Annotated[Session, Depends(get_db)],
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
) -> User | None:
    """
    Get the current user if authenticated, or None if not

    Use for endpoints that work both authenticated and unauthenticated
    """
    if not credentials:
        return None

    try:
        return get_current_user_from_token(db, credentials.credentials)
    except AuthError:
        return None


# Type aliases for cleaner route signatures
CurrentUser = Annotated[User, Depends(get_current_user)]
OptionalUser = Annotated[User | None, Depends(get_current_user_optional)]
DbSession = Annotated[Session, Depends(get_db)]

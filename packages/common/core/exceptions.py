"""
Base Exception Classes

Unified exception hierarchy for consistent error handling across the application.
All service-level exceptions should inherit from ApplicationError.
"""

import uuid
from typing import Any


class ApplicationError(Exception):
    """
    Base exception for all application errors.

    Provides consistent error structure with:
    - status_code: HTTP status code to return
    - error_code: Machine-readable error identifier
    - message: Human-readable error message
    - details: Optional additional context
    """

    def __init__(
        self,
        message: str,
        status_code: int = 400,
        error_code: str = "APPLICATION_ERROR",
        details: dict[str, Any] | None = None,
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}
        self.error_id = str(uuid.uuid4())[:8]  # Short ID for tracking
        super().__init__(message)

    def to_dict(self) -> dict[str, Any]:
        """Convert exception to dictionary for JSON response."""
        return {
            "error_id": self.error_id,
            "error_code": self.error_code,
            "message": self.message,
            "details": self.details,
        }


class AuthenticationError(ApplicationError):
    """Raised when authentication fails (invalid credentials, expired token)."""

    def __init__(self, message: str = "Authentication failed", details: dict[str, Any] | None = None):
        super().__init__(
            message=message,
            status_code=401,
            error_code="AUTHENTICATION_ERROR",
            details=details,
        )


class AuthorizationError(ApplicationError):
    """Raised when user lacks permission for an action."""

    def __init__(self, message: str = "Not authorized", details: dict[str, Any] | None = None):
        super().__init__(
            message=message,
            status_code=403,
            error_code="AUTHORIZATION_ERROR",
            details=details,
        )


class NotFoundError(ApplicationError):
    """Raised when a requested resource doesn't exist."""

    def __init__(
        self,
        message: str = "Resource not found",
        resource_type: str | None = None,
        resource_id: str | None = None,
    ):
        details = {}
        if resource_type:
            details["resource_type"] = resource_type
        if resource_id:
            details["resource_id"] = resource_id

        super().__init__(
            message=message,
            status_code=404,
            error_code="NOT_FOUND_ERROR",
            details=details,
        )


class ValidationError(ApplicationError):
    """Raised when input validation fails."""

    def __init__(
        self,
        message: str = "Validation failed",
        field: str | None = None,
        details: dict[str, Any] | None = None,
    ):
        error_details = details or {}
        if field:
            error_details["field"] = field

        super().__init__(
            message=message,
            status_code=422,
            error_code="VALIDATION_ERROR",
            details=error_details,
        )


class ConflictError(ApplicationError):
    """Raised when an action conflicts with existing state (e.g., duplicate email)."""

    def __init__(self, message: str = "Resource conflict", details: dict[str, Any] | None = None):
        super().__init__(
            message=message,
            status_code=409,
            error_code="CONFLICT_ERROR",
            details=details,
        )


class RateLimitError(ApplicationError):
    """Raised when rate limit is exceeded."""

    def __init__(
        self,
        message: str = "Rate limit exceeded",
        retry_after: int | None = None,
    ):
        details = {}
        if retry_after:
            details["retry_after_seconds"] = retry_after

        super().__init__(
            message=message,
            status_code=429,
            error_code="RATE_LIMIT_ERROR",
            details=details,
        )


class ExternalServiceError(ApplicationError):
    """Raised when an external service (S3, Cloudinary, etc.) fails."""

    def __init__(
        self,
        message: str = "External service error",
        service_name: str | None = None,
        details: dict[str, Any] | None = None,
    ):
        error_details = details or {}
        if service_name:
            error_details["service"] = service_name

        super().__init__(
            message=message,
            status_code=502,
            error_code="EXTERNAL_SERVICE_ERROR",
            details=error_details,
        )


# Backwards compatibility aliases for existing code
# These will be removed in a future version
AuthError = AuthenticationError
PresentationError = ApplicationError

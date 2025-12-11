"""
Schemas Package
Pydantic models for request/response validation
"""
from packages.common.schemas.auth import (
    UserRegister,
    UserLogin,
    PasswordChange,
    TokenRefresh,
    UserResponse,
    TokenResponse,
    AuthResponse,
    MessageResponse,
)
from packages.common.schemas.presentation import (
    SlideCreate,
    SlideUpdate,
    SlideResponse,
    PresentationCreate,
    PresentationUpdate,
    PresentationResponse,
    PresentationDetailResponse,
    PresentationListResponse,
    PresentationImport,
    PresentationExport,
)
from packages.common.schemas.presentation_version import (
    VersionCreate,
    VersionResponse,
    VersionDetailResponse,
    VersionListResponse,
)

__all__ = [
    # Auth
    "UserRegister",
    "UserLogin",
    "PasswordChange",
    "TokenRefresh",
    "UserResponse",
    "TokenResponse",
    "AuthResponse",
    "MessageResponse",
    # Presentation
    "SlideCreate",
    "SlideUpdate",
    "SlideResponse",
    "PresentationCreate",
    "PresentationUpdate",
    "PresentationResponse",
    "PresentationDetailResponse",
    "PresentationListResponse",
    "PresentationImport",
    "PresentationExport",
    # Presentation Version
    "VersionCreate",
    "VersionResponse",
    "VersionDetailResponse",
    "VersionListResponse",
]

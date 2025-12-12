"""
User Model
Handles user accounts and authentication
"""
from enum import Enum

from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.common.models.base import BaseModel


class AuthProvider(str, Enum):
    """Authentication provider types"""

    EMAIL = "email"
    GOOGLE = "google"
    GITHUB = "github"


class User(BaseModel):
    """
    User model for authentication and ownership
    """

    __tablename__ = "users"

    # Email and authentication
    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )
    password_hash: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,  # Nullable for OAuth users
    )

    # Profile information
    name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    avatar_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # OAuth fields
    auth_provider: Mapped[str] = mapped_column(
        String(50),
        default=AuthProvider.EMAIL.value,
        nullable=False,
    )
    auth_provider_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    # Account status
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # Relationships
    presentations = relationship(
        "Presentation",
        back_populates="owner",
        cascade="all, delete-orphan",
    )
    ideation_sessions = relationship(
        "IdeationSession",
        back_populates="owner",
        cascade="all, delete-orphan",
    )
    rough_drafts = relationship(
        "RoughDraft",
        back_populates="owner",
        cascade="all, delete-orphan",
    )
    beautify_sessions = relationship(
        "BeautifySession",
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<User {self.email}>"

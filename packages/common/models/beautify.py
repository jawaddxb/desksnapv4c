"""
Beautify Session Models
Models for PPTX beautification sessions (Make My Ugly Deck Beautiful)
"""
import uuid
from typing import Optional

from sqlalchemy import String, Integer, Float, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.common.models.base import BaseModel


class BeautifySession(BaseModel):
    """
    Beautify session model for tracking PPTX beautification.
    Stores original file info, analysis results, and transformed slides.
    """

    __tablename__ = "beautify_sessions"

    # Owner relationship
    owner_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # File information
    file_name: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )
    file_size: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    original_file_key: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # Processing status
    # uploading -> parsing -> analyzing -> ready -> transforming -> done | error
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="uploading",
    )
    progress: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Analysis results (populated during parsing/analyzing)
    overall_mess_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
        default=0.0,
    )
    slides_data: Mapped[dict | None] = mapped_column(
        JSONB,
        nullable=True,
        default=list,
    )

    # Transform configuration (set when user triggers transform)
    theme_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    intensity: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )
    transformed_slides: Mapped[dict | None] = mapped_column(
        JSONB,
        nullable=True,
    )

    # Sharing
    share_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        unique=True,
        index=True,
    )
    is_public: Mapped[bool] = mapped_column(
        nullable=False,
        default=False,
    )

    # Relationships
    owner = relationship("User", back_populates="beautify_sessions")

    def __repr__(self) -> str:
        return f"<BeautifySession {self.file_name} ({self.status})>"

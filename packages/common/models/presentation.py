"""
Presentation Model
Core model for user presentations
"""
import uuid
from typing import Optional

from sqlalchemy import String, Boolean, Text, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.common.models.base import BaseModel


class Presentation(BaseModel):
    """
    Presentation model for storing user presentations
    Maps to the frontend Presentation interface
    """

    __tablename__ = "presentations"

    # Owner relationship
    owner_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Presentation metadata
    topic: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )
    theme_id: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    visual_style: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    wabi_sabi_layout: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )
    view_mode: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
        default="standard",
    )

    # Image and sharing
    thumbnail_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    is_public: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # Version for optimistic concurrency control (real-time sync)
    version: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )

    # Source references (for traceability)
    ideation_session_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("ideation_sessions.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    source_rough_draft_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("rough_drafts.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Relationships
    owner = relationship("User", back_populates="presentations")
    ideation_session = relationship("IdeationSession", foreign_keys=[ideation_session_id])
    source_rough_draft = relationship("RoughDraft", foreign_keys=[source_rough_draft_id])
    slides = relationship(
        "Slide",
        back_populates="presentation",
        cascade="all, delete-orphan",
        order_by="Slide.position",
    )
    versions = relationship(
        "PresentationVersion",
        back_populates="presentation",
        cascade="all, delete-orphan",
        order_by="PresentationVersion.version_number.desc()",
    )

    def __repr__(self) -> str:
        return f"<Presentation {self.topic[:30]}>"

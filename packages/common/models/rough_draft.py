"""
Rough Draft Models
Models for rough draft presentations before approval
"""
import uuid
from typing import Optional

from sqlalchemy import String, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.common.models.base import BaseModel


class RoughDraft(BaseModel):
    """
    Rough draft model for storing draft presentations before approval.
    Links to ideation sessions and can be converted to presentations.
    """

    __tablename__ = "rough_drafts"

    # Owner relationship
    owner_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Source ideation (optional - rough draft can come from ideation or direct creation)
    ideation_session_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("ideation_sessions.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Resulting presentation (set when approved)
    presentation_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("presentations.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Draft metadata
    topic: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )
    theme_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    visual_style: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="in_progress",  # in_progress, ready, approved, discarded
    )

    # Relationships
    owner = relationship("User", back_populates="rough_drafts")
    ideation_session = relationship("IdeationSession", back_populates="rough_drafts")
    presentation = relationship("Presentation", foreign_keys=[presentation_id])
    slides = relationship(
        "RoughDraftSlide",
        back_populates="rough_draft",
        cascade="all, delete-orphan",
        order_by="RoughDraftSlide.position",
    )

    def __repr__(self) -> str:
        return f"<RoughDraft {self.topic[:30]} ({self.status})>"


class RoughDraftSlide(BaseModel):
    """
    Rough draft slide model for individual slides in a rough draft.
    Similar to Slide but with approval tracking.
    """

    __tablename__ = "rough_draft_slides"

    # Parent rough draft
    rough_draft_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("rough_drafts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Position in draft (0-indexed)
    position: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    # Content
    title: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    content: Mapped[dict | None] = mapped_column(
        JSONB,
        nullable=True,
        default=list,
    )
    speaker_notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Image generation
    image_prompt: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    image_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Layout configuration
    layout_type: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )
    alignment: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    # Approval tracking
    approval_state: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="pending",  # pending, approved, modified
    )

    # Relationship
    rough_draft = relationship("RoughDraft", back_populates="slides")

    def __repr__(self) -> str:
        return f"<RoughDraftSlide {self.position}: {self.title or 'Untitled'}>"

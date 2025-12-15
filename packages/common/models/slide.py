"""
Slide Model
Individual slide within a presentation
"""
import uuid

from sqlalchemy import String, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.common.models.base import BaseModel


class Slide(BaseModel):
    """
    Slide model for individual slides in a presentation
    Maps to the frontend Slide interface
    """

    __tablename__ = "slides"

    # Parent presentation
    presentation_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("presentations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Position in deck (0-indexed)
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
    # Rich content blocks (charts, statistics, quotes, etc.)
    content_blocks: Mapped[dict | None] = mapped_column(
        JSONB,
        nullable=True,
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
        Text,  # Changed to Text for longer CDN URLs
        nullable=True,
    )
    image_task_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        index=True,
    )
    image_storage_key: Mapped[str | None] = mapped_column(
        String(500),
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
    font_scale: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )
    layout_variant: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    # Style overrides (for custom styling)
    style_overrides: Mapped[dict | None] = mapped_column(
        JSONB,
        nullable=True,
    )

    # Version for optimistic concurrency control (real-time sync)
    version: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )

    # Relationship
    presentation = relationship("Presentation", back_populates="slides")

    def __repr__(self) -> str:
        return f"<Slide {self.position}: {self.title or 'Untitled'}>"

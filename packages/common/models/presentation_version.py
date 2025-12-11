"""
Presentation Version Model
Stores version history snapshots for presentations
"""
import uuid

from sqlalchemy import String, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.common.models.base import BaseModel


class PresentationVersion(BaseModel):
    """
    Version snapshot for a presentation.
    Stores complete state at a point in time for manual checkpoints.
    """

    __tablename__ = "presentation_versions"
    __table_args__ = (
        UniqueConstraint(
            "presentation_id", "version_number", name="uq_presentation_version"
        ),
    )

    # Foreign key to presentation
    presentation_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("presentations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Version metadata
    version_number: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    label: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    thumbnail_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # Full snapshot of presentation state (JSONB)
    snapshot: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
    )

    # Relationship
    presentation = relationship("Presentation", back_populates="versions")

    def __repr__(self) -> str:
        return f"<PresentationVersion v{self.version_number} of {self.presentation_id}>"

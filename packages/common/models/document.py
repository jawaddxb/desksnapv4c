"""
Document Model
Stores uploaded documents for use as AI reference material in ideation.
"""
import uuid

from sqlalchemy import String, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.common.models.base import BaseModel
from packages.common.models.ideation import ideation_session_documents


class Document(BaseModel):
    """
    Document model for storing uploaded reference documents.
    Text is extracted async via Celery for AI context injection.
    """

    __tablename__ = "documents"

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
    file_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )
    file_size: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    storage_key: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # Extracted content
    extracted_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    token_count: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    # Metadata
    title: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )
    tags: Mapped[list | None] = mapped_column(
        JSONB,
        nullable=True,
        default=list,
    )

    # Processing status: processing, ready, error
    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="processing",
    )
    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Relationships
    owner = relationship("User", back_populates="documents")
    ideation_sessions = relationship(
        "IdeationSession",
        secondary=ideation_session_documents,
        back_populates="documents",
    )

    def __repr__(self) -> str:
        return f"<Document {self.file_name} ({self.status})>"

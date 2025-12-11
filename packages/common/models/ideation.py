"""
Ideation Models
Models for the ideation/brainstorming system
"""
import uuid
from typing import List, Optional

from sqlalchemy import String, Integer, Text, Boolean, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from packages.common.models.base import BaseModel


class IdeationSession(BaseModel):
    """
    Ideation session model for storing brainstorming sessions.
    Maps to the frontend IdeationSession interface.
    """

    __tablename__ = "ideation_sessions"

    # Owner relationship
    owner_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Session metadata
    topic: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )
    stage: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="brainstorming",
    )
    source_content: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    archetype: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    # Relationships
    owner = relationship("User", back_populates="ideation_sessions")
    notes = relationship(
        "IdeaNote",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="IdeaNote.created_at",
    )
    connections = relationship(
        "NoteConnection",
        back_populates="session",
        cascade="all, delete-orphan",
    )
    journal_entries = relationship(
        "IdeationJournalEntry",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="IdeationJournalEntry.created_at",
    )


class IdeaNote(BaseModel):
    """
    Idea note model for individual notes in an ideation session.
    """

    __tablename__ = "idea_notes"

    # Session relationship
    session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("ideation_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Note content
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    note_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="insight",
    )
    source_url: Mapped[Optional[str]] = mapped_column(
        String(1000),
        nullable=True,
    )
    parent_id: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
    )

    # Position on canvas
    column_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    row_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )
    color: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
    )

    # Status
    approved: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    # Relationships
    session = relationship("IdeationSession", back_populates="notes")


class NoteConnection(BaseModel):
    """
    Connection between two notes in an ideation session.
    """

    __tablename__ = "note_connections"

    # Session relationship
    session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("ideation_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Connection endpoints (stored as string IDs to match frontend)
    from_note_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    to_note_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    # Relationships
    session = relationship("IdeationSession", back_populates="connections")


class IdeationJournalEntry(BaseModel):
    """
    Creative journal entry for an ideation session.
    Tracks the AI's decision-making process.
    """

    __tablename__ = "ideation_journal_entries"

    # Session relationship
    session_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("ideation_sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Journal entry content
    stage: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )
    narrative: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    decision: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    confidence: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )

    # Related entities (stored as JSON arrays of IDs)
    related_note_ids: Mapped[Optional[List[str]]] = mapped_column(
        JSON,
        nullable=True,
        default=list,
    )
    related_slide_ids: Mapped[Optional[List[str]]] = mapped_column(
        JSON,
        nullable=True,
        default=list,
    )

    # Relationships
    session = relationship("IdeationSession", back_populates="journal_entries")

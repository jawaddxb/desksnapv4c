"""
Models Package
Import all models here for Alembic to discover them
"""
from packages.common.models.base import Base, BaseModel
from packages.common.models.user import User, AuthProvider
from packages.common.models.presentation import Presentation
from packages.common.models.presentation_version import PresentationVersion
from packages.common.models.slide import Slide
from packages.common.models.ideation import (
    IdeationSession,
    IdeaNote,
    NoteConnection,
    IdeationJournalEntry,
    ideation_session_documents,
)
from packages.common.models.rough_draft import RoughDraft, RoughDraftSlide
from packages.common.models.beautify import BeautifySession
from packages.common.models.document import Document

__all__ = [
    "Base",
    "BaseModel",
    "User",
    "AuthProvider",
    "Presentation",
    "PresentationVersion",
    "Slide",
    "IdeationSession",
    "IdeaNote",
    "NoteConnection",
    "IdeationJournalEntry",
    "ideation_session_documents",
    "RoughDraft",
    "RoughDraftSlide",
    "BeautifySession",
    "Document",
]

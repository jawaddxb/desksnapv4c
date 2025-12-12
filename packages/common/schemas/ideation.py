"""
Ideation Schemas
Pydantic models for ideation requests and responses
"""
import uuid
from datetime import datetime

from pydantic import BaseModel, Field


# Note Schemas
class IdeaNoteBase(BaseModel):
    """Base note fields"""

    content: str = Field(..., min_length=1)
    note_type: str = Field(default="insight", alias="type")  # insight, question, data, story
    source_url: str | None = None
    parent_id: str | None = None
    column_index: int = Field(default=0, alias="column")
    row_index: int = Field(default=0, alias="row")
    color: str | None = None
    approved: bool = False

    model_config = {"populate_by_name": True}


class IdeaNoteCreate(IdeaNoteBase):
    """Create a new note"""

    pass


class IdeaNoteUpdate(BaseModel):
    """Update an existing note"""

    content: str | None = None
    note_type: str | None = None
    source_url: str | None = None
    parent_id: str | None = None
    column_index: int | None = None
    row_index: int | None = None
    color: str | None = None
    approved: bool | None = None


class IdeaNoteResponse(IdeaNoteBase):
    """Note response"""

    id: uuid.UUID
    session_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True, "populate_by_name": True, "by_alias": True}


# Connection Schemas
class NoteConnectionBase(BaseModel):
    """Base connection fields"""

    from_note_id: str
    to_note_id: str


class NoteConnectionCreate(NoteConnectionBase):
    """Create a new connection"""

    pass


class NoteConnectionResponse(NoteConnectionBase):
    """Connection response"""

    id: uuid.UUID
    session_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# Journal Entry Schemas
class JournalEntryBase(BaseModel):
    """Base journal entry fields"""

    stage: str  # analyzing, exploring, deciding, creating, refining
    title: str = Field(..., max_length=200)
    narrative: str
    decision: str | None = None
    confidence: int | None = Field(None, ge=0, le=100)
    related_note_ids: list[str] = []
    related_slide_ids: list[str] = []


class JournalEntryCreate(JournalEntryBase):
    """Create a new journal entry"""

    pass


class JournalEntryResponse(JournalEntryBase):
    """Journal entry response"""

    id: uuid.UUID
    session_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# Session Schemas
class IdeationSessionBase(BaseModel):
    """Base session fields"""

    topic: str = Field(..., min_length=1, max_length=500)
    stage: str = "brainstorming"  # brainstorming, organizing, refining
    source_content: str | None = None
    archetype: str | None = None


class IdeationSessionCreate(IdeationSessionBase):
    """Create a new ideation session"""

    notes: list[IdeaNoteCreate] = []
    connections: list[NoteConnectionCreate] = []
    journal_entries: list[JournalEntryCreate] = []


class IdeationSessionUpdate(BaseModel):
    """Update an existing session"""

    topic: str | None = Field(None, min_length=1, max_length=500)
    stage: str | None = None
    source_content: str | None = None
    archetype: str | None = None
    notes: list[IdeaNoteCreate] | None = None
    connections: list[NoteConnectionCreate] | None = None


class IdeationSessionResponse(IdeationSessionBase):
    """Session response with notes for list display"""

    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    notes: list[IdeaNoteResponse] = []

    model_config = {"from_attributes": True}


class IdeationSessionDetailResponse(IdeationSessionResponse):
    """Session response with all nested data"""

    notes: list[IdeaNoteResponse] = []
    connections: list[NoteConnectionResponse] = []
    journal_entries: list[JournalEntryResponse] = []


class IdeationSessionListResponse(BaseModel):
    """Paginated list of sessions"""

    items: list[IdeationSessionResponse]
    total: int
    page: int
    page_size: int

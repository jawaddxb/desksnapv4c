"""
Rough Draft Schemas
Pydantic models for rough draft requests and responses
"""
import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


# Slide Schemas
class RoughDraftSlideBase(BaseModel):
    """Base slide fields"""

    position: int = 0
    title: str | None = None
    content: list[Any] | None = None
    speaker_notes: str | None = None
    image_prompt: str | None = None
    image_url: str | None = None
    layout_type: str | None = None
    alignment: str | None = None
    approval_state: str = "pending"  # pending, approved, modified


class RoughDraftSlideCreate(RoughDraftSlideBase):
    """Create a new slide"""

    pass


class RoughDraftSlideUpdate(BaseModel):
    """Update an existing slide"""

    position: int | None = None
    title: str | None = None
    content: list[Any] | None = None
    speaker_notes: str | None = None
    image_prompt: str | None = None
    image_url: str | None = None
    layout_type: str | None = None
    alignment: str | None = None
    approval_state: str | None = None


class RoughDraftSlideResponse(RoughDraftSlideBase):
    """Slide response"""

    id: uuid.UUID
    rough_draft_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# Draft Schemas
class RoughDraftBase(BaseModel):
    """Base draft fields"""

    topic: str = Field(..., min_length=1, max_length=500)
    theme_id: str = Field(..., min_length=1, max_length=100)
    visual_style: str | None = None
    status: str = "in_progress"  # in_progress, ready, approved, discarded


class RoughDraftCreate(RoughDraftBase):
    """Create a new rough draft"""

    ideation_session_id: uuid.UUID | None = None
    slides: list[RoughDraftSlideCreate] = []


class RoughDraftUpdate(BaseModel):
    """Update an existing rough draft"""

    topic: str | None = Field(None, min_length=1, max_length=500)
    theme_id: str | None = None
    visual_style: str | None = None
    status: str | None = None


class RoughDraftResponse(RoughDraftBase):
    """Draft response without nested data"""

    id: uuid.UUID
    owner_id: uuid.UUID
    ideation_session_id: uuid.UUID | None = None
    presentation_id: uuid.UUID | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class RoughDraftDetailResponse(RoughDraftResponse):
    """Draft response with all slides"""

    slides: list[RoughDraftSlideResponse] = []


class RoughDraftListResponse(BaseModel):
    """Paginated list of drafts"""

    items: list[RoughDraftResponse]
    total: int
    page: int
    page_size: int


class RoughDraftApproveRequest(BaseModel):
    """Request to approve a rough draft and convert to presentation"""

    # Optional overrides for the resulting presentation
    topic: str | None = None
    theme_id: str | None = None
    visual_style: str | None = None

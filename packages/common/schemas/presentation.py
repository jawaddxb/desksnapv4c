"""
Presentation Schemas
Pydantic models for presentation requests and responses
"""
import uuid
from datetime import datetime

from pydantic import BaseModel, Field


# Slide Schemas
class SlideBase(BaseModel):
    """Base slide fields"""

    title: str | None = None
    content: list | None = None
    content_blocks: list | None = None  # Rich content blocks (charts, stats, etc.)
    speaker_notes: str | None = None
    image_prompt: str | None = None
    image_url: str | None = None
    image_task_id: str | None = None
    image_storage_key: str | None = None
    layout_type: str | None = None
    alignment: str | None = None
    font_scale: str | None = None
    layout_variant: str | None = None
    style_overrides: dict | None = None


class SlideCreate(SlideBase):
    """Create a new slide"""

    position: int = 0


class SlideUpdate(SlideBase):
    """Update an existing slide"""

    position: int | None = None


class SlideResponse(SlideBase):
    """Slide response"""

    id: uuid.UUID
    presentation_id: uuid.UUID
    position: int
    version: int = 1  # For optimistic concurrency control
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# Presentation Schemas
class PresentationBase(BaseModel):
    """Base presentation fields"""

    topic: str = Field(..., min_length=1, max_length=500)
    theme_id: str | None = None
    visual_style: str | None = None
    wabi_sabi_layout: str | None = None
    view_mode: str | None = None  # 'standard' or 'wabi-sabi'
    thumbnail_url: str | None = None
    is_public: bool = False


class PresentationCreate(PresentationBase):
    """Create a new presentation"""

    slides: list[SlideCreate] = []


class PresentationUpdate(BaseModel):
    """Update an existing presentation"""

    topic: str | None = Field(None, min_length=1, max_length=500)
    theme_id: str | None = None
    visual_style: str | None = None
    wabi_sabi_layout: str | None = None
    view_mode: str | None = None  # 'standard' or 'wabi-sabi'
    thumbnail_url: str | None = None
    is_public: bool | None = None


class PresentationResponse(PresentationBase):
    """Presentation response without slides"""

    id: uuid.UUID
    owner_id: uuid.UUID
    version: int = 1  # For optimistic concurrency control
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class PresentationDetailResponse(PresentationResponse):
    """Presentation response with slides"""

    slides: list[SlideResponse] = []


class PresentationListResponse(BaseModel):
    """List of presentations with pagination"""

    items: list[PresentationDetailResponse]
    total: int
    page: int
    page_size: int
    pages: int


# Import/Export schemas (compatible with frontend)
class SlideImport(BaseModel):
    """Slide for import (matches frontend export format)"""

    id: str | None = None
    title: str | None = None
    content: list | None = None
    contentBlocks: list | None = None  # Rich content blocks (charts, stats, etc.)
    speakerNotes: str | None = None
    imagePrompt: str | None = None
    imageUrl: str | None = None
    layoutType: str | None = None
    alignment: str | None = None
    fontScale: str | None = None
    layoutVariant: str | None = None
    styleOverrides: dict | None = None


class PresentationImport(BaseModel):
    """Presentation for import (matches frontend export format)"""

    id: str | None = None
    topic: str
    themeId: str | None = None
    visualStyle: str | None = None
    wabiSabiLayout: str | None = None
    viewMode: str | None = None  # 'standard' or 'wabi-sabi'
    slides: list[SlideImport] = []


class PresentationExport(BaseModel):
    """Presentation export format (camelCase for frontend)"""

    id: str
    topic: str
    themeId: str | None = None
    visualStyle: str | None = None
    wabiSabiLayout: str | None = None
    viewMode: str | None = None  # 'standard' or 'wabi-sabi'
    slides: list[dict]
    createdAt: str
    updatedAt: str

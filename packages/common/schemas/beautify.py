"""
Beautify Schemas
Pydantic models for beautify requests and responses
"""
import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


# Enums as literal types for simplicity
SLIDE_TYPES = ["title", "bullets", "two-column", "chart", "image-focus", "quote", "unknown"]
TRANSFORM_INTENSITIES = ["cleanup", "redesign", "rebuild"]
SESSION_STATUSES = ["uploading", "parsing", "analyzing", "ready", "transforming", "done", "error"]


# Original content from PPTX
class OriginalSlideContent(BaseModel):
    """Original slide content extracted from PPTX"""

    texts: list[dict[str, Any]] = []  # {value, font_size, is_title, position}
    images: list[dict[str, Any]] = []  # {data_url, width, height}
    notes: str | None = None
    background_color: str | None = None


# Slide Intermediate Representation
class SlideIR(BaseModel):
    """Slide intermediate representation - bridge between original and transformed"""

    id: str
    position: int
    type: str  # SlideType
    type_confidence: float = Field(ge=0, le=1)
    title: str
    content: list[str] = []
    notes: str = ""
    image_url: str | None = None
    mess_score: float = Field(ge=0, le=100)
    mess_issues: list[str] = []
    suggested_layout: str
    suggested_alignment: str
    original: OriginalSlideContent


# Session response schemas
class BeautifySessionBase(BaseModel):
    """Base session fields"""

    file_name: str
    file_size: int
    status: str = "uploading"
    progress: int = 0


class BeautifySessionResponse(BeautifySessionBase):
    """Session response with all data"""

    id: uuid.UUID
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    slides: list[SlideIR] = []
    intensity: str | None = None
    theme_id: str | None = None
    overall_mess_score: float = 0.0
    error_message: str | None = None
    share_id: str | None = None

    model_config = {"from_attributes": True}


class BeautifySessionListResponse(BaseModel):
    """Paginated list of sessions"""

    items: list[BeautifySessionResponse]
    total: int
    page: int
    page_size: int


# Transform request
class TransformRequest(BaseModel):
    """Request to transform slides"""

    theme_id: str = Field(..., min_length=1, max_length=100)
    intensity: str = Field(..., pattern="^(cleanup|redesign|rebuild)$")


# Transform response
class TransformResponse(BaseModel):
    """Response with transformed slides"""

    slides: list[dict[str, Any]]  # Slide format matching frontend types


# Share schemas
class ShareResponse(BaseModel):
    """Response when creating a share link"""

    share_id: str
    share_url: str


class ShareViewData(BaseModel):
    """Public share view data"""

    file_name: str
    before_slides: list[SlideIR]
    after_slides: list[dict[str, Any]]
    theme_id: str
    created_at: datetime


# Upload response
class UploadResponse(BaseModel):
    """Response after uploading PPTX"""

    session_id: uuid.UUID
    status: str = "uploading"

"""
Presentation Version Schemas
Pydantic models for version history requests and responses
"""
import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class VersionCreate(BaseModel):
    """Create a new version checkpoint"""

    label: str | None = Field(None, max_length=255)


class VersionResponse(BaseModel):
    """Version list item response"""

    id: uuid.UUID
    version_number: int
    label: str | None
    thumbnail_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class VersionDetailResponse(VersionResponse):
    """Version with full snapshot"""

    snapshot: dict


class VersionListResponse(BaseModel):
    """List of versions"""

    items: list[VersionResponse]
    total: int

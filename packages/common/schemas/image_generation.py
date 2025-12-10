"""
Image Generation Schemas
Pydantic models for image generation requests and responses
"""
import uuid

from pydantic import BaseModel, Field


class BatchImageGenerationRequest(BaseModel):
    """Request to generate images for multiple slides"""

    slide_ids: list[uuid.UUID] = Field(default_factory=list)
    # If empty, generate for all slides with prompts but no images


class ImageTaskStatus(BaseModel):
    """Status of an image generation task"""

    task_id: str
    status: str  # PENDING, STARTED, SUCCESS, FAILURE, RETRY, NONE, COMPLETE
    slide_id: str | None = None
    image_url: str | None = None
    error: str | None = None


class ImageGenerationResponse(BaseModel):
    """Response when image generation is triggered"""

    task_id: str
    slide_id: str
    status: str = "PENDING"


class BatchImageGenerationResponse(BaseModel):
    """Response when batch image generation is triggered"""

    tasks: dict[str, str]  # slide_id -> task_id
    total_slides: int


class BatchStatusResponse(BaseModel):
    """Status of all image generation tasks for a presentation"""

    slide_statuses: dict[str, ImageTaskStatus]  # slide_id -> status
    completed: int
    total: int
    all_complete: bool

"""
Document Schemas
Pydantic models for document requests and responses
"""
import uuid
from datetime import datetime

from pydantic import BaseModel, Field


# Status constants
DOCUMENT_STATUSES = ["processing", "ready", "error"]
DOCUMENT_TYPES = ["pdf", "docx", "xlsx", "csv", "txt", "md"]


class DocumentBase(BaseModel):
    """Base document fields"""

    file_name: str = Field(..., alias="fileName")
    file_type: str = Field(..., alias="fileType")
    file_size: int = Field(..., alias="fileSize")


class DocumentResponse(DocumentBase):
    """Document response with all data"""

    id: uuid.UUID
    owner_id: uuid.UUID = Field(..., alias="ownerId")
    title: str | None = None
    tags: list[str] = []
    status: str = "processing"
    token_count: int = Field(default=0, alias="tokenCount")
    error_message: str | None = Field(default=None, alias="errorMessage")
    created_at: datetime = Field(..., alias="createdAt")
    updated_at: datetime = Field(..., alias="updatedAt")

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }


class DocumentWithTextResponse(DocumentResponse):
    """Document response including extracted text (for detail view)"""

    extracted_text: str | None = Field(default=None, alias="extractedText")


class DocumentListResponse(BaseModel):
    """Paginated list of documents"""

    items: list[DocumentResponse]
    total: int
    page: int = Field(default=1)
    page_size: int = Field(default=20, alias="pageSize")

    model_config = {"populate_by_name": True}


class DocumentUpdateRequest(BaseModel):
    """Request to update document metadata"""

    title: str | None = None
    tags: list[str] | None = None


class UploadResponse(BaseModel):
    """Response after uploading document"""

    id: uuid.UUID
    status: str = "processing"


class DocumentContextItem(BaseModel):
    """Document context for AI injection"""

    id: uuid.UUID
    title: str
    file_name: str = Field(..., alias="fileName")
    content: str
    token_count: int = Field(default=0, alias="tokenCount")

    model_config = {"populate_by_name": True}

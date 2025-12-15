"""
Documents API Endpoints
Upload, manage, and retrieve documents for ideation context.
"""
import os
import tempfile
import uuid

from fastapi import APIRouter, UploadFile, File, Query, status

from apps.public_api.dependencies import CurrentUser, DbSession
from packages.common.schemas.document import (
    UploadResponse,
    DocumentResponse,
    DocumentWithTextResponse,
    DocumentListResponse,
    DocumentUpdateRequest,
)
from packages.common.schemas.auth import MessageResponse
from packages.common.services.document_service import (
    create_document,
    get_document,
    get_documents,
    update_document,
    delete_document,
)
from packages.common.services.document_parser import get_file_type
from packages.common.tasks.document_tasks import process_document_upload
from packages.common.core.exceptions import ValidationError

router = APIRouter()


@router.post(
    "/upload",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload document",
    description="Upload a document for text extraction",
)
async def upload_document(
    file: UploadFile = File(...),
    current_user: CurrentUser = None,
    db: DbSession = None,
) -> UploadResponse:
    """Upload document for processing. Returns document ID."""
    # Get file type from extension
    if not file.filename:
        raise ValidationError(
            message="Filename is required",
            field="file",
        )

    file_type = get_file_type(file.filename)
    if not file_type:
        raise ValidationError(
            message="Unsupported file type. Supported: pdf, docx, xlsx, csv, txt, md",
            field="file",
        )

    # Read and validate file size
    max_size = 50 * 1024 * 1024  # 50MB
    content = await file.read()
    if len(content) > max_size:
        raise ValidationError(
            message="File too large. Maximum size is 50MB",
            field="file",
        )

    # Create document record
    document = create_document(
        db=db,
        user=current_user,
        file_name=file.filename,
        file_type=file_type,
        file_size=len(content),
    )

    # Save file temporarily
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, f"document_{document.id}.{file_type}")

    with open(file_path, "wb") as f:
        f.write(content)

    # Trigger async processing
    process_document_upload.delay(str(document.id), file_path)

    return UploadResponse(
        id=document.id,
        status="processing",
    )


@router.get(
    "",
    response_model=DocumentListResponse,
    summary="List documents",
    description="Get user's documents with pagination",
)
def list_documents(
    current_user: CurrentUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100, alias="pageSize"),
    status: str | None = Query(None),
) -> DocumentListResponse:
    """List user's documents."""
    documents, total = get_documents(
        db=db,
        user=current_user,
        page=page,
        page_size=page_size,
        status=status,
    )

    return DocumentListResponse(
        items=[_to_response(doc) for doc in documents],
        total=total,
        page=page,
        pageSize=page_size,
    )


@router.get(
    "/{document_id}",
    response_model=DocumentWithTextResponse,
    summary="Get document",
    description="Get document details including extracted text",
)
def get_document_detail(
    document_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> DocumentWithTextResponse:
    """Get document details with extracted text."""
    document = get_document(db, document_id, current_user)
    return _to_response_with_text(document)


@router.patch(
    "/{document_id}",
    response_model=DocumentResponse,
    summary="Update document",
    description="Update document metadata (title, tags)",
)
def update_document_metadata(
    document_id: uuid.UUID,
    data: DocumentUpdateRequest,
    current_user: CurrentUser,
    db: DbSession,
) -> DocumentResponse:
    """Update document metadata."""
    document = update_document(
        db=db,
        document_id=document_id,
        user=current_user,
        title=data.title,
        tags=data.tags,
    )
    return _to_response(document)


@router.delete(
    "/{document_id}",
    response_model=MessageResponse,
    summary="Delete document",
    description="Delete a document",
)
def delete_document_endpoint(
    document_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> MessageResponse:
    """Delete a document."""
    delete_document(db, document_id, current_user)
    return MessageResponse(message="Document deleted successfully")


def _to_response(document) -> DocumentResponse:
    """Convert Document model to response schema."""
    return DocumentResponse(
        id=document.id,
        ownerId=document.owner_id,
        fileName=document.file_name,
        fileType=document.file_type,
        fileSize=document.file_size,
        title=document.title,
        tags=document.tags or [],
        status=document.status,
        tokenCount=document.token_count,
        errorMessage=document.error_message,
        createdAt=document.created_at,
        updatedAt=document.updated_at,
    )


def _to_response_with_text(document) -> DocumentWithTextResponse:
    """Convert Document model to response schema with text."""
    return DocumentWithTextResponse(
        id=document.id,
        ownerId=document.owner_id,
        fileName=document.file_name,
        fileType=document.file_type,
        fileSize=document.file_size,
        title=document.title,
        tags=document.tags or [],
        status=document.status,
        tokenCount=document.token_count,
        errorMessage=document.error_message,
        extractedText=document.extracted_text,
        createdAt=document.created_at,
        updatedAt=document.updated_at,
    )

"""
Document Service
CRUD operations for document management.
KISS: Simple service functions following existing patterns.
"""
import logging
import uuid

from sqlalchemy.orm import Session

from packages.common.models.document import Document
from packages.common.models.user import User
from packages.common.core.exceptions import NotFoundError, AuthorizationError, ValidationError

logger = logging.getLogger(__name__)

# Supported file types
SUPPORTED_TYPES = {"pdf", "docx", "xlsx", "csv", "txt", "md"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB


def create_document(
    db: Session,
    user: User,
    file_name: str,
    file_type: str,
    file_size: int,
    storage_key: str | None = None,
) -> Document:
    """
    Create a new document record.

    Args:
        db: Database session
        user: Document owner
        file_name: Original filename
        file_type: File extension (pdf, docx, etc.)
        file_size: File size in bytes
        storage_key: Optional storage location key

    Returns:
        Created Document instance
    """
    # Validate file type
    file_type = file_type.lower()
    if file_type not in SUPPORTED_TYPES:
        raise ValidationError(
            message=f"Unsupported file type: {file_type}",
            field="file_type",
            details={"supported": list(SUPPORTED_TYPES)},
        )

    # Validate file size
    if file_size > MAX_FILE_SIZE:
        raise ValidationError(
            message=f"File too large. Max size: {MAX_FILE_SIZE // (1024*1024)}MB",
            field="file_size",
            details={"max_bytes": MAX_FILE_SIZE},
        )

    document = Document(
        owner_id=user.id,
        file_name=file_name,
        file_type=file_type,
        file_size=file_size,
        storage_key=storage_key,
        status="processing",
        title=file_name.rsplit(".", 1)[0],  # Default title from filename
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


def get_document(
    db: Session,
    document_id: uuid.UUID,
    user: User | None = None,
) -> Document:
    """
    Get document by ID with optional authorization check.

    Args:
        db: Database session
        document_id: Document UUID
        user: Optional user for ownership check

    Returns:
        Document instance

    Raises:
        NotFoundError: If document doesn't exist
        AuthorizationError: If user doesn't own the document
    """
    document = db.query(Document).filter(Document.id == document_id).first()

    if not document:
        raise NotFoundError(
            message="Document not found",
            resource_type="Document",
            resource_id=str(document_id),
        )

    if user and document.owner_id != user.id:
        raise AuthorizationError("You do not have access to this document")

    return document


def get_documents(
    db: Session,
    user: User,
    page: int = 1,
    page_size: int = 20,
    status: str | None = None,
) -> tuple[list[Document], int]:
    """
    Get user's documents with pagination.

    Args:
        db: Database session
        user: Document owner
        page: Page number (1-indexed)
        page_size: Items per page
        status: Optional status filter

    Returns:
        Tuple of (documents list, total count)
    """
    query = db.query(Document).filter(Document.owner_id == user.id)

    if status:
        query = query.filter(Document.status == status)

    total = query.count()

    documents = (
        query.order_by(Document.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return documents, total


def update_document(
    db: Session,
    document_id: uuid.UUID,
    user: User,
    title: str | None = None,
    tags: list[str] | None = None,
) -> Document:
    """
    Update document metadata.

    Args:
        db: Database session
        document_id: Document UUID
        user: Document owner
        title: Optional new title
        tags: Optional new tags

    Returns:
        Updated Document instance
    """
    document = get_document(db, document_id, user)

    if title is not None:
        document.title = title
    if tags is not None:
        document.tags = tags

    db.commit()
    db.refresh(document)
    return document


def delete_document(
    db: Session,
    document_id: uuid.UUID,
    user: User,
) -> None:
    """
    Delete a document.

    Args:
        db: Database session
        document_id: Document UUID
        user: Document owner
    """
    document = get_document(db, document_id, user)

    # TODO: Delete from storage if storage_key exists

    db.delete(document)
    db.commit()


def get_documents_for_ideation(
    db: Session,
    document_ids: list[uuid.UUID],
    user: User,
) -> list[Document]:
    """
    Get multiple documents by IDs for ideation context.
    Only returns documents owned by the user with 'ready' status.

    Args:
        db: Database session
        document_ids: List of document UUIDs
        user: Document owner

    Returns:
        List of Document instances with extracted text
    """
    if not document_ids:
        return []

    documents = (
        db.query(Document)
        .filter(
            Document.id.in_(document_ids),
            Document.owner_id == user.id,
            Document.status == "ready",
        )
        .all()
    )

    return documents


def get_total_tokens(documents: list[Document]) -> int:
    """Calculate total token count for a list of documents."""
    return sum(doc.token_count or 0 for doc in documents)

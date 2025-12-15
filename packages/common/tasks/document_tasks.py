"""
Document Celery Tasks

Handles async document processing:
- Extract text from uploaded documents
- Estimate token counts
- Update document status
"""
import logging
import os
import tempfile

from celery import shared_task
from celery.exceptions import MaxRetriesExceededError

from packages.common.core.database import get_db_context
from packages.common.models.document import Document
from packages.common.services.document_parser import extract_text, estimate_tokens

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    name="packages.common.tasks.document_tasks.process_document_upload",
    max_retries=2,
    default_retry_delay=5,
)
def process_document_upload(
    self,
    document_id: str,
    file_path: str,
) -> dict:
    """
    Background processing of uploaded document.

    Steps:
    1. Extract text from document
    2. Estimate token count
    3. Update document with extracted text
    4. Update status to 'ready'

    Args:
        document_id: UUID of the document
        file_path: Path to uploaded document file

    Returns:
        dict with keys: success, token_count, document_id, error
    """
    try:
        logger.info(f"Processing document {document_id}: {file_path}")

        # Verify file exists
        if not os.path.exists(file_path):
            logger.error(f"Document file not found: {file_path}")
            _update_document_status(document_id, "error", error_message="File not found")
            return {
                "success": False,
                "error": "File not found",
                "document_id": document_id,
            }

        # Get document from DB
        with get_db_context() as db:
            document = db.query(Document).filter(Document.id == document_id).first()
            if not document:
                logger.error(f"Document not found in DB: {document_id}")
                return {
                    "success": False,
                    "error": "Document not found in database",
                    "document_id": document_id,
                }

            file_type = document.file_type

        # Extract text
        try:
            text = extract_text(file_path, file_type)
            token_count = estimate_tokens(text)
        except Exception as e:
            logger.error(f"Text extraction failed: {e}")
            _update_document_status(document_id, "error", error_message=str(e))
            return {
                "success": False,
                "error": f"Text extraction failed: {str(e)}",
                "document_id": document_id,
            }

        # Update document with extracted text
        with get_db_context() as db:
            document = db.query(Document).filter(Document.id == document_id).first()
            if document:
                document.extracted_text = text
                document.token_count = token_count
                document.status = "ready"
                db.commit()

        logger.info(f"Successfully processed document {document_id}: {token_count} tokens")

        # Clean up temp file
        if file_path.startswith(tempfile.gettempdir()):
            try:
                os.remove(file_path)
                logger.info(f"Cleaned up temp file: {file_path}")
            except Exception as e:
                logger.warning(f"Could not clean up temp file: {e}")

        return {
            "success": True,
            "token_count": token_count,
            "document_id": document_id,
        }

    except MaxRetriesExceededError:
        logger.error(f"Max retries exceeded for document {document_id}")
        _update_document_status(document_id, "error", error_message="Processing failed after retries")
        return {
            "success": False,
            "error": "Max retries exceeded",
            "document_id": document_id,
        }
    except Exception as e:
        logger.error(f"Document processing failed for {document_id}: {e}")
        _update_document_status(document_id, "error", error_message=str(e))
        raise


def _update_document_status(
    document_id: str,
    status: str,
    error_message: str | None = None,
) -> None:
    """Helper to update document status."""
    with get_db_context() as db:
        document = db.query(Document).filter(Document.id == document_id).first()
        if document:
            document.status = status
            document.error_message = error_message
            db.commit()


@shared_task(
    name="packages.common.tasks.document_tasks.cleanup_failed_documents",
)
def cleanup_failed_documents(max_age_hours: int = 24) -> dict:
    """
    Clean up failed document uploads.

    Args:
        max_age_hours: Documents older than this with error status are deleted

    Returns:
        dict with cleanup stats
    """
    from datetime import datetime, timedelta

    cutoff = datetime.utcnow() - timedelta(hours=max_age_hours)
    deleted_count = 0

    with get_db_context() as db:
        failed_docs = db.query(Document).filter(
            Document.created_at < cutoff,
            Document.status.in_(["error", "processing"]),
        ).all()

        for doc in failed_docs:
            # TODO: Delete stored files if using cloud storage
            db.delete(doc)
            deleted_count += 1

        db.commit()

    logger.info(f"Cleaned up {deleted_count} failed documents")
    return {
        "deleted_count": deleted_count,
        "cutoff": cutoff.isoformat(),
    }

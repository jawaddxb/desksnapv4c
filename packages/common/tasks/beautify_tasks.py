"""
Beautify Celery Tasks

Handles async PPTX processing:
- Parse uploaded PPTX files
- Classify slides and analyze mess scores
- Update session status throughout
"""
import logging
import os
import tempfile

from celery import shared_task
from celery.exceptions import MaxRetriesExceededError

from packages.common.core.database import get_db_context
from packages.common.services.beautify_service import (
    process_pptx_file,
    update_session_status,
)

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    name="packages.common.tasks.beautify_tasks.process_pptx_upload",
    max_retries=2,
    default_retry_delay=5,
)
def process_pptx_upload(
    self,
    session_id: str,
    file_path: str,
) -> dict:
    """
    Background processing of uploaded PPTX.

    Steps:
    1. Update status to 'parsing'
    2. Parse PPTX → raw slides
    3. Update status to 'analyzing'
    4. Classify each slide
    5. Calculate mess scores
    6. Update status to 'ready' with slides_data

    Args:
        session_id: UUID of the beautify session
        file_path: Path to uploaded PPTX file

    Returns:
        dict with keys: success, slide_count, session_id, error
    """
    try:
        logger.info(f"Processing PPTX for session {session_id}: {file_path}")

        # Verify file exists
        if not os.path.exists(file_path):
            logger.error(f"PPTX file not found: {file_path}")
            with get_db_context() as db:
                update_session_status(db, session_id, "error", 0, "File not found")
            return {
                "success": False,
                "error": "File not found",
                "session_id": session_id,
            }

        # Process the file
        with get_db_context() as db:
            slides_ir = process_pptx_file(db, session_id, file_path)

        slide_count = len(slides_ir)
        logger.info(f"Successfully processed {slide_count} slides for session {session_id}")

        # Clean up temp file if it's in temp directory
        if file_path.startswith(tempfile.gettempdir()):
            try:
                os.remove(file_path)
                logger.info(f"Cleaned up temp file: {file_path}")
            except Exception as e:
                logger.warning(f"Could not clean up temp file: {e}")

        return {
            "success": True,
            "slide_count": slide_count,
            "session_id": session_id,
        }

    except MaxRetriesExceededError:
        logger.error(f"Max retries exceeded for session {session_id}")
        with get_db_context() as db:
            update_session_status(db, session_id, "error", 0, "Processing failed after retries")
        return {
            "success": False,
            "error": "Max retries exceeded",
            "session_id": session_id,
        }
    except Exception as e:
        logger.error(f"PPTX processing failed for session {session_id}: {e}")
        with get_db_context() as db:
            update_session_status(db, session_id, "error", 0, str(e))
        # Re-raise to trigger Celery retry for transient errors
        raise


@shared_task(
    name="packages.common.tasks.beautify_tasks.cleanup_expired_sessions",
)
def cleanup_expired_sessions(max_age_hours: int = 24) -> dict:
    """
    Clean up old beautify sessions and their files.

    Args:
        max_age_hours: Sessions older than this are deleted

    Returns:
        dict with cleanup stats
    """
    from datetime import datetime, timedelta

    from packages.common.models.beautify import BeautifySession

    cutoff = datetime.utcnow() - timedelta(hours=max_age_hours)
    deleted_count = 0

    with get_db_context() as db:
        # Find old sessions
        old_sessions = db.query(BeautifySession).filter(
            BeautifySession.created_at < cutoff,
            BeautifySession.status.in_(["error", "uploading"]),  # Only cleanup failed/stale
        ).all()

        for session in old_sessions:
            # TODO: Delete stored files if using cloud storage
            db.delete(session)
            deleted_count += 1

        db.commit()

    logger.info(f"Cleaned up {deleted_count} expired beautify sessions")
    return {
        "deleted_count": deleted_count,
        "cutoff": cutoff.isoformat(),
    }

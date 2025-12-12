"""
Beautify Service
Main orchestrator for PPTX beautification workflow
KISS: Simple service functions following existing patterns
"""
import logging
import uuid
import secrets
from typing import Any

from sqlalchemy.orm import Session

from packages.common.models.beautify import BeautifySession
from packages.common.models.user import User
from packages.common.core.exceptions import NotFoundError, AuthorizationError
from packages.common.services.pptx_parser import parse_pptx
from packages.common.services.slide_classifier import (
    classify_slide,
    get_suggested_layout,
    get_suggested_alignment,
)
from packages.common.services.mess_analyzer import analyze_mess, calculate_overall_mess_score
from packages.common.services.beautify_transform import transform_slides

logger = logging.getLogger(__name__)


def create_session(
    db: Session,
    user: User,
    file_name: str,
    file_size: int,
    file_key: str | None = None,
) -> BeautifySession:
    """
    Create a new beautify session.
    """
    session = BeautifySession(
        owner_id=user.id,
        file_name=file_name,
        file_size=file_size,
        original_file_key=file_key,
        status="uploading",
        progress=0,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_session(
    db: Session,
    session_id: uuid.UUID,
    user: User | None = None,
) -> BeautifySession:
    """
    Get session with optional authorization check.
    """
    session = db.query(BeautifySession).filter(
        BeautifySession.id == session_id
    ).first()

    if not session:
        raise NotFoundError(
            message="Beautify session not found",
            resource_type="BeautifySession",
            resource_id=str(session_id),
        )

    if user and session.owner_id != user.id:
        raise AuthorizationError("You do not have access to this session")

    return session


def update_session_status(
    db: Session,
    session_id: uuid.UUID,
    status: str,
    progress: int = 0,
    error_message: str | None = None,
) -> None:
    """
    Update session status and progress.
    """
    session = db.query(BeautifySession).filter(
        BeautifySession.id == session_id
    ).first()

    if session:
        session.status = status
        session.progress = progress
        if error_message:
            session.error_message = error_message
        db.commit()


def process_pptx_file(
    db: Session,
    session_id: uuid.UUID,
    file_path: str,
) -> list[dict[str, Any]]:
    """
    Process uploaded PPTX file:
    1. Parse PPTX to extract raw slides
    2. Classify each slide
    3. Analyze mess scores
    4. Build SlideIR list

    Returns list of SlideIR dicts.
    """
    # Update status: parsing
    update_session_status(db, session_id, "parsing", 10)

    try:
        # Parse PPTX
        raw_slides = parse_pptx(file_path)
        total_slides = len(raw_slides)

        if total_slides == 0:
            raise ValueError("No slides found in PPTX file")

        update_session_status(db, session_id, "analyzing", 30)

        # Process each slide
        slides_ir = []
        for idx, raw_slide in enumerate(raw_slides):
            # Classify slide
            slide_type, confidence = classify_slide(raw_slide)

            # Analyze mess
            mess_score, mess_issues = analyze_mess(raw_slide)

            # Get suggestions
            suggested_layout = get_suggested_layout(slide_type)
            suggested_alignment = get_suggested_alignment(slide_type)

            # Extract title and content
            title = extract_title(raw_slide)
            content = extract_content(raw_slide)

            # Get first image URL if exists
            images = raw_slide.get("images", [])
            image_url = images[0].get("data_url") if images else None

            # Build SlideIR
            slide_ir = {
                "id": str(uuid.uuid4()),
                "position": idx,
                "type": slide_type,
                "typeConfidence": confidence,
                "title": title,
                "content": content,
                "notes": raw_slide.get("notes", ""),
                "imageUrl": image_url,
                "messScore": mess_score,
                "messIssues": mess_issues,
                "suggestedLayout": suggested_layout,
                "suggestedAlignment": suggested_alignment,
                "original": {
                    "texts": raw_slide.get("texts", []),
                    "images": [
                        {"width": img.get("width"), "height": img.get("height")}
                        for img in images
                    ],  # Don't store full base64 in DB
                    "notes": raw_slide.get("notes"),
                    "backgroundColor": raw_slide.get("background_color"),
                },
            }
            slides_ir.append(slide_ir)

            # Update progress
            progress = 30 + int((idx + 1) / total_slides * 60)
            update_session_status(db, session_id, "analyzing", progress)

        # Calculate overall mess score
        overall_mess = calculate_overall_mess_score(raw_slides)

        # Update session with results
        session = get_session(db, session_id)
        session.slides_data = slides_ir
        session.overall_mess_score = overall_mess
        session.status = "ready"
        session.progress = 100
        db.commit()

        return slides_ir

    except Exception as e:
        logger.error(f"Error processing PPTX: {e}")
        update_session_status(db, session_id, "error", 0, str(e))
        raise


def transform_session(
    db: Session,
    session_id: uuid.UUID,
    user: User,
    theme_id: str,
    intensity: str,
) -> list[dict[str, Any]]:
    """
    Transform session slides with selected style and intensity.
    """
    session = get_session(db, session_id, user)

    if session.status not in ["ready", "done"]:
        raise ValueError(f"Session not ready for transform. Status: {session.status}")

    slides_ir = session.slides_data or []
    if not slides_ir:
        raise ValueError("No slides to transform")

    # Update status
    session.status = "transforming"
    db.commit()

    try:
        # Transform slides
        transformed = transform_slides(slides_ir, theme_id, intensity)

        # Save results
        session.theme_id = theme_id
        session.intensity = intensity
        session.transformed_slides = transformed
        session.status = "done"
        db.commit()

        return transformed

    except Exception as e:
        logger.error(f"Error transforming slides: {e}")
        session.status = "error"
        session.error_message = str(e)
        db.commit()
        raise


def create_share_link(
    db: Session,
    session_id: uuid.UUID,
    user: User,
) -> tuple[str, str]:
    """
    Generate unique share ID and URL.
    """
    session = get_session(db, session_id, user)

    if session.status != "done":
        raise ValueError("Session must be completed before sharing")

    # Generate share ID if not exists
    if not session.share_id:
        session.share_id = secrets.token_urlsafe(12)
        session.is_public = True
        db.commit()

    # Generate share URL (frontend will handle the actual URL)
    share_url = f"/share/beautify/{session.share_id}"

    return session.share_id, share_url


def get_share_data(
    db: Session,
    share_id: str,
) -> dict[str, Any]:
    """
    Get public share view data.
    """
    session = db.query(BeautifySession).filter(
        BeautifySession.share_id == share_id,
        BeautifySession.is_public == True,
    ).first()

    if not session:
        raise NotFoundError(
            message="Share link not found or expired",
            resource_type="BeautifySession",
            resource_id=share_id,
        )

    return {
        "file_name": session.file_name,
        "before_slides": session.slides_data or [],
        "after_slides": session.transformed_slides or [],
        "theme_id": session.theme_id or "executive",
        "created_at": session.created_at,
    }


def extract_title(raw_slide: dict[str, Any]) -> str:
    """Extract title from raw slide data."""
    texts = raw_slide.get("texts", [])

    # Find text marked as title
    for text in texts:
        if text.get("is_title"):
            return text.get("value", "").strip()

    # Fall back to largest font
    if texts:
        largest = max(texts, key=lambda t: t.get("font_size", 0))
        return largest.get("value", "").strip()[:200]  # Limit length

    return "Untitled"


def extract_content(raw_slide: dict[str, Any]) -> list[str]:
    """Extract content bullets from raw slide data."""
    texts = raw_slide.get("texts", [])
    content = []

    for text in texts:
        if text.get("is_title"):
            continue

        value = text.get("value", "").strip()
        if not value:
            continue

        # Split by newlines if present
        if "\n" in value:
            lines = [line.strip() for line in value.split("\n") if line.strip()]
            content.extend(lines)
        else:
            content.append(value)

    return content[:20]  # Limit to 20 items


def delete_session(
    db: Session,
    session_id: uuid.UUID,
    user: User,
) -> None:
    """Delete a beautify session."""
    session = get_session(db, session_id, user)
    db.delete(session)
    db.commit()

"""
Beautify API Endpoints
Upload PPTX, transform, and share beautified presentations
"""
import os
import tempfile
import uuid

from fastapi import APIRouter, UploadFile, File, status

from apps.public_api.dependencies import CurrentUser, DbSession
from packages.common.schemas.beautify import (
    UploadResponse,
    BeautifySessionResponse,
    TransformRequest,
    TransformResponse,
    ShareResponse,
    ShareViewData,
    SlideIR,
)
from packages.common.schemas.auth import MessageResponse
from packages.common.services.beautify_service import (
    create_session,
    get_session,
    transform_session,
    create_share_link,
    get_share_data,
    delete_session,
)
from packages.common.tasks.beautify_tasks import process_pptx_upload
from packages.common.core.exceptions import ValidationError

router = APIRouter()


@router.post(
    "/upload",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload PPTX",
    description="Upload a PPTX file for beautification",
)
async def upload_pptx(
    file: UploadFile = File(...),
    current_user: CurrentUser = None,
    db: DbSession = None,
) -> UploadResponse:
    """Upload PPTX for beautification. Returns session_id."""
    # Validate file type
    if not file.filename or not file.filename.lower().endswith((".pptx", ".ppt")):
        raise ValidationError(
            message="Invalid file type. Please upload a .pptx file",
            field="file",
        )

    # Validate file size (max 50MB)
    max_size = 50 * 1024 * 1024  # 50MB
    content = await file.read()
    if len(content) > max_size:
        raise ValidationError(
            message="File too large. Maximum size is 50MB",
            field="file",
        )

    # Create session
    session = create_session(
        db=db,
        user=current_user,
        file_name=file.filename,
        file_size=len(content),
    )

    # Save file temporarily
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, f"beautify_{session.id}.pptx")

    with open(file_path, "wb") as f:
        f.write(content)

    # Trigger async processing
    process_pptx_upload.delay(str(session.id), file_path)

    return UploadResponse(
        session_id=session.id,
        status="uploading",
    )


@router.get(
    "/{session_id}",
    response_model=BeautifySessionResponse,
    summary="Get session",
    description="Get beautify session status and slides",
)
def get_beautify_session(
    session_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> BeautifySessionResponse:
    """Get session status and slides."""
    session = get_session(db, session_id, current_user)

    # Convert slides_data to SlideIR objects
    slides = []
    if session.slides_data:
        for slide_data in session.slides_data:
            slides.append(SlideIR(**slide_data))

    return BeautifySessionResponse(
        id=session.id,
        owner_id=session.owner_id,
        file_name=session.file_name,
        file_size=session.file_size,
        created_at=session.created_at,
        updated_at=session.updated_at,
        slides=slides,
        intensity=session.intensity,
        theme_id=session.theme_id,
        overall_mess_score=session.overall_mess_score,
        status=session.status,
        progress=session.progress,
        error_message=session.error_message,
        share_id=session.share_id,
    )


@router.post(
    "/{session_id}/transform",
    response_model=TransformResponse,
    summary="Transform deck",
    description="Transform slides with selected style and intensity",
)
def transform_deck(
    session_id: uuid.UUID,
    data: TransformRequest,
    current_user: CurrentUser,
    db: DbSession,
) -> TransformResponse:
    """Transform slides with selected style and intensity."""
    transformed = transform_session(
        db=db,
        session_id=session_id,
        user=current_user,
        theme_id=data.theme_id,
        intensity=data.intensity,
    )

    return TransformResponse(slides=transformed)


@router.post(
    "/{session_id}/share",
    response_model=ShareResponse,
    summary="Create share link",
    description="Create a shareable before/after link",
)
def create_share(
    session_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> ShareResponse:
    """Create shareable before/after link."""
    share_id, share_url = create_share_link(db, session_id, current_user)

    return ShareResponse(
        share_id=share_id,
        share_url=share_url,
    )


@router.get(
    "/share/{share_id}",
    response_model=ShareViewData,
    summary="Get share view",
    description="Get public share view data (no auth required)",
)
def get_share_view(
    share_id: str,
    db: DbSession,
) -> ShareViewData:
    """Get public share view data."""
    data = get_share_data(db, share_id)

    return ShareViewData(
        file_name=data["file_name"],
        before_slides=[SlideIR(**s) for s in data["before_slides"]],
        after_slides=data["after_slides"],
        theme_id=data["theme_id"],
        created_at=data["created_at"],
    )


@router.delete(
    "/{session_id}",
    response_model=MessageResponse,
    summary="Delete session",
    description="Delete a beautify session",
)
def delete_beautify_session(
    session_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> MessageResponse:
    """Delete a beautify session."""
    delete_session(db, session_id, current_user)
    return MessageResponse(message="Beautify session deleted successfully")

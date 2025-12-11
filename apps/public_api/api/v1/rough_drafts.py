"""
Rough Drafts API Endpoints
CRUD operations for rough draft presentations
"""
import uuid

from fastapi import APIRouter, Query, status

from apps.public_api.dependencies import CurrentUser, DbSession
from packages.common.schemas.rough_draft import (
    RoughDraftCreate,
    RoughDraftUpdate,
    RoughDraftResponse,
    RoughDraftDetailResponse,
    RoughDraftListResponse,
    RoughDraftSlideCreate,
    RoughDraftSlideUpdate,
    RoughDraftSlideResponse,
    RoughDraftApproveRequest,
)
from packages.common.schemas.auth import MessageResponse
from packages.common.schemas.presentation import PresentationDetailResponse
from packages.common.models.rough_draft import RoughDraft, RoughDraftSlide
from packages.common.models.presentation import Presentation
from packages.common.models.slide import Slide
from packages.common.core.exceptions import NotFoundError, AuthorizationError

router = APIRouter()


# Helper functions
def get_draft_by_id(db, draft_id: uuid.UUID) -> RoughDraft:
    """Get a draft by ID or raise NotFoundError"""
    draft = db.query(RoughDraft).filter(RoughDraft.id == draft_id).first()
    if not draft:
        raise NotFoundError(
            message="Rough draft not found",
            resource_type="RoughDraft",
            resource_id=str(draft_id),
        )
    return draft


def require_draft_ownership(draft: RoughDraft, user) -> RoughDraft:
    """Verify user owns the draft or raise AuthorizationError"""
    if draft.owner_id != user.id:
        raise AuthorizationError("You do not have access to this draft")
    return draft


# Draft CRUD
@router.get(
    "",
    response_model=RoughDraftListResponse,
    summary="List rough drafts",
    description="Get all rough drafts for the current user",
)
def list_drafts(
    current_user: CurrentUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    status_filter: str | None = Query(None, description="Filter by status"),
) -> RoughDraftListResponse:
    """List user's rough drafts with pagination"""
    query = db.query(RoughDraft).filter(
        RoughDraft.owner_id == current_user.id
    )

    # Apply status filter if provided
    if status_filter:
        query = query.filter(RoughDraft.status == status_filter)

    query = query.order_by(RoughDraft.updated_at.desc())

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return RoughDraftListResponse(
        items=[RoughDraftResponse.model_validate(d) for d in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post(
    "",
    response_model=RoughDraftDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create rough draft",
    description="Create a new rough draft with optional slides",
)
def create_draft(
    data: RoughDraftCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> RoughDraftDetailResponse:
    """Create a new rough draft"""
    # Create draft
    draft = RoughDraft(
        owner_id=current_user.id,
        ideation_session_id=data.ideation_session_id,
        topic=data.topic,
        theme_id=data.theme_id,
        visual_style=data.visual_style,
        status=data.status,
    )
    db.add(draft)
    db.flush()  # Get the ID

    # Add slides if provided
    for slide_data in data.slides:
        slide = RoughDraftSlide(
            rough_draft_id=draft.id,
            position=slide_data.position,
            title=slide_data.title,
            content=slide_data.content,
            speaker_notes=slide_data.speaker_notes,
            image_prompt=slide_data.image_prompt,
            image_url=slide_data.image_url,
            layout_type=slide_data.layout_type,
            alignment=slide_data.alignment,
            approval_state=slide_data.approval_state,
        )
        db.add(slide)

    db.commit()
    db.refresh(draft)
    return RoughDraftDetailResponse.model_validate(draft)


@router.get(
    "/{draft_id}",
    response_model=RoughDraftDetailResponse,
    summary="Get rough draft",
    description="Get a rough draft by ID with all slides",
)
def get_draft(
    draft_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> RoughDraftDetailResponse:
    """Get a rough draft with all slides"""
    draft = get_draft_by_id(db, draft_id)
    draft = require_draft_ownership(draft, current_user)
    return RoughDraftDetailResponse.model_validate(draft)


@router.put(
    "/{draft_id}",
    response_model=RoughDraftResponse,
    summary="Update rough draft",
    description="Update rough draft metadata",
)
def update_draft(
    draft_id: uuid.UUID,
    data: RoughDraftUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> RoughDraftResponse:
    """Update a rough draft"""
    draft = get_draft_by_id(db, draft_id)
    draft = require_draft_ownership(draft, current_user)

    # Update fields
    if data.topic is not None:
        draft.topic = data.topic
    if data.theme_id is not None:
        draft.theme_id = data.theme_id
    if data.visual_style is not None:
        draft.visual_style = data.visual_style
    if data.status is not None:
        draft.status = data.status

    db.commit()
    db.refresh(draft)
    return RoughDraftResponse.model_validate(draft)


@router.delete(
    "/{draft_id}",
    response_model=MessageResponse,
    summary="Delete rough draft",
    description="Delete a rough draft and all its slides",
)
def delete_draft(
    draft_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> MessageResponse:
    """Delete a rough draft"""
    draft = get_draft_by_id(db, draft_id)
    draft = require_draft_ownership(draft, current_user)
    db.delete(draft)
    db.commit()
    return MessageResponse(message="Rough draft deleted successfully")


# Approve draft - convert to presentation
@router.post(
    "/{draft_id}/approve",
    response_model=PresentationDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Approve rough draft",
    description="Convert a rough draft to a final presentation",
)
def approve_draft(
    draft_id: uuid.UUID,
    data: RoughDraftApproveRequest,
    current_user: CurrentUser,
    db: DbSession,
) -> PresentationDetailResponse:
    """Approve a rough draft and create a presentation"""
    draft = get_draft_by_id(db, draft_id)
    draft = require_draft_ownership(draft, current_user)

    if draft.status == "approved":
        raise AuthorizationError("This draft has already been approved")

    # Create presentation from draft
    presentation = Presentation(
        owner_id=current_user.id,
        topic=data.topic or draft.topic,
        theme_id=data.theme_id or draft.theme_id,
        visual_style=data.visual_style or draft.visual_style,
        ideation_session_id=draft.ideation_session_id,
        source_rough_draft_id=draft.id,
    )
    db.add(presentation)
    db.flush()  # Get the ID

    # Copy slides from draft to presentation
    for draft_slide in draft.slides:
        slide = Slide(
            presentation_id=presentation.id,
            position=draft_slide.position,
            title=draft_slide.title,
            content=draft_slide.content,
            speaker_notes=draft_slide.speaker_notes,
            image_prompt=draft_slide.image_prompt,
            image_url=draft_slide.image_url,
            layout_type=draft_slide.layout_type,
            alignment=draft_slide.alignment,
        )
        db.add(slide)

    # Update draft status and link to presentation
    draft.status = "approved"
    draft.presentation_id = presentation.id

    db.commit()
    db.refresh(presentation)
    return PresentationDetailResponse.model_validate(presentation)


# Slide endpoints
@router.post(
    "/{draft_id}/slides",
    response_model=RoughDraftSlideResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add slide",
    description="Add a new slide to a rough draft",
)
def add_slide(
    draft_id: uuid.UUID,
    data: RoughDraftSlideCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> RoughDraftSlideResponse:
    """Add a slide to a draft"""
    draft = get_draft_by_id(db, draft_id)
    draft = require_draft_ownership(draft, current_user)

    slide = RoughDraftSlide(
        rough_draft_id=draft.id,
        position=data.position,
        title=data.title,
        content=data.content,
        speaker_notes=data.speaker_notes,
        image_prompt=data.image_prompt,
        image_url=data.image_url,
        layout_type=data.layout_type,
        alignment=data.alignment,
        approval_state=data.approval_state,
    )
    db.add(slide)
    db.commit()
    db.refresh(slide)
    return RoughDraftSlideResponse.model_validate(slide)


@router.put(
    "/{draft_id}/slides/{slide_id}",
    response_model=RoughDraftSlideResponse,
    summary="Update slide",
    description="Update an existing slide",
)
def update_slide(
    draft_id: uuid.UUID,
    slide_id: uuid.UUID,
    data: RoughDraftSlideUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> RoughDraftSlideResponse:
    """Update a slide"""
    draft = get_draft_by_id(db, draft_id)
    draft = require_draft_ownership(draft, current_user)

    slide = db.query(RoughDraftSlide).filter(
        RoughDraftSlide.id == slide_id,
        RoughDraftSlide.rough_draft_id == draft_id,
    ).first()
    if not slide:
        raise NotFoundError(
            message="Slide not found",
            resource_type="RoughDraftSlide",
            resource_id=str(slide_id),
        )

    # Update fields
    if data.position is not None:
        slide.position = data.position
    if data.title is not None:
        slide.title = data.title
    if data.content is not None:
        slide.content = data.content
    if data.speaker_notes is not None:
        slide.speaker_notes = data.speaker_notes
    if data.image_prompt is not None:
        slide.image_prompt = data.image_prompt
    if data.image_url is not None:
        slide.image_url = data.image_url
    if data.layout_type is not None:
        slide.layout_type = data.layout_type
    if data.alignment is not None:
        slide.alignment = data.alignment
    if data.approval_state is not None:
        slide.approval_state = data.approval_state

    db.commit()
    db.refresh(slide)
    return RoughDraftSlideResponse.model_validate(slide)


@router.delete(
    "/{draft_id}/slides/{slide_id}",
    response_model=MessageResponse,
    summary="Delete slide",
    description="Delete a slide from a rough draft",
)
def delete_slide(
    draft_id: uuid.UUID,
    slide_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> MessageResponse:
    """Delete a slide"""
    draft = get_draft_by_id(db, draft_id)
    draft = require_draft_ownership(draft, current_user)

    slide = db.query(RoughDraftSlide).filter(
        RoughDraftSlide.id == slide_id,
        RoughDraftSlide.rough_draft_id == draft_id,
    ).first()
    if not slide:
        raise NotFoundError(
            message="Slide not found",
            resource_type="RoughDraftSlide",
            resource_id=str(slide_id),
        )

    db.delete(slide)
    db.commit()
    return MessageResponse(message="Slide deleted successfully")

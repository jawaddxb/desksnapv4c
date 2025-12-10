"""
Presentations API Endpoints
CRUD operations for presentations
"""
import uuid

from fastapi import APIRouter, Query, status

from apps.public_api.dependencies import CurrentUser, DbSession
from packages.common.schemas.presentation import (
    PresentationCreate,
    PresentationUpdate,
    PresentationResponse,
    PresentationDetailResponse,
    PresentationListResponse,
    SlideCreate,
    SlideUpdate,
    SlideResponse,
    PresentationImport,
    PresentationExport,
)
from packages.common.schemas.auth import MessageResponse
from packages.common.services.presentation_service import (
    get_presentation_by_id,
    list_presentations,
    create_presentation,
    update_presentation,
    delete_presentation,
    duplicate_presentation,
    add_slide,
    update_slide,
    delete_slide,
    get_slide_by_id,
    import_presentation,
    export_presentation,
)
from packages.common.services.authorization_service import (
    require_presentation_ownership,
    check_presentation_access,
)
from packages.common.core.exceptions import NotFoundError

router = APIRouter()


# Presentation CRUD
@router.get(
    "",
    response_model=PresentationListResponse,
    summary="List presentations",
    description="Get all presentations for the current user",
)
def list_user_presentations(
    current_user: CurrentUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
) -> PresentationListResponse:
    """List user's presentations with pagination"""
    return list_presentations(db, current_user, page, page_size)


@router.post(
    "",
    response_model=PresentationDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create presentation",
    description="Create a new presentation with optional slides",
)
def create_new_presentation(
    data: PresentationCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> PresentationDetailResponse:
    """Create a new presentation"""
    presentation = create_presentation(db, current_user, data)
    return PresentationDetailResponse.model_validate(presentation)


@router.get(
    "/{presentation_id}",
    response_model=PresentationDetailResponse,
    summary="Get presentation",
    description="Get a presentation by ID with all slides",
)
def get_presentation(
    presentation_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> PresentationDetailResponse:
    """Get a presentation with slides"""
    presentation = get_presentation_by_id(db, presentation_id)
    presentation = check_presentation_access(presentation, current_user)
    return PresentationDetailResponse.model_validate(presentation)


@router.put(
    "/{presentation_id}",
    response_model=PresentationResponse,
    summary="Update presentation",
    description="Update presentation metadata",
)
def update_existing_presentation(
    presentation_id: uuid.UUID,
    data: PresentationUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> PresentationResponse:
    """Update a presentation"""
    presentation = get_presentation_by_id(db, presentation_id)
    presentation = require_presentation_ownership(presentation, current_user)
    updated = update_presentation(db, presentation, data)
    return PresentationResponse.model_validate(updated)


@router.delete(
    "/{presentation_id}",
    response_model=MessageResponse,
    summary="Delete presentation",
    description="Delete a presentation and all its slides",
)
def delete_existing_presentation(
    presentation_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> MessageResponse:
    """Delete a presentation"""
    presentation = get_presentation_by_id(db, presentation_id)
    presentation = require_presentation_ownership(presentation, current_user)
    delete_presentation(db, presentation)
    return MessageResponse(message="Presentation deleted successfully")


@router.post(
    "/{presentation_id}/duplicate",
    response_model=PresentationDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Duplicate presentation",
    description="Create a copy of an existing presentation",
)
def duplicate_existing_presentation(
    presentation_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> PresentationDetailResponse:
    """Duplicate a presentation"""
    presentation = get_presentation_by_id(db, presentation_id)
    presentation = check_presentation_access(presentation, current_user)
    new_presentation = duplicate_presentation(db, current_user, presentation)
    return PresentationDetailResponse.model_validate(new_presentation)


# Import/Export
@router.post(
    "/import",
    response_model=PresentationDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Import presentation",
    description="Import a presentation from JSON format",
)
def import_presentation_endpoint(
    data: PresentationImport,
    current_user: CurrentUser,
    db: DbSession,
) -> PresentationDetailResponse:
    """Import a presentation"""
    presentation = import_presentation(db, current_user, data)
    return PresentationDetailResponse.model_validate(presentation)


@router.get(
    "/{presentation_id}/export",
    response_model=PresentationExport,
    summary="Export presentation",
    description="Export a presentation to JSON format for frontend",
)
def export_presentation_endpoint(
    presentation_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> PresentationExport:
    """Export a presentation"""
    presentation = get_presentation_by_id(db, presentation_id)
    presentation = check_presentation_access(presentation, current_user)
    return export_presentation(presentation)


# Slide operations
@router.post(
    "/{presentation_id}/slides",
    response_model=SlideResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add slide",
    description="Add a new slide to a presentation",
)
def add_slide_to_presentation(
    presentation_id: uuid.UUID,
    data: SlideCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> SlideResponse:
    """Add a slide to a presentation"""
    presentation = get_presentation_by_id(db, presentation_id)
    presentation = require_presentation_ownership(presentation, current_user)
    slide = add_slide(db, presentation, data)
    return SlideResponse.model_validate(slide)


@router.put(
    "/{presentation_id}/slides/{slide_id}",
    response_model=SlideResponse,
    summary="Update slide",
    description="Update an existing slide",
)
def update_existing_slide(
    presentation_id: uuid.UUID,
    slide_id: uuid.UUID,
    data: SlideUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> SlideResponse:
    """Update a slide"""
    presentation = get_presentation_by_id(db, presentation_id)
    presentation = require_presentation_ownership(presentation, current_user)

    slide = get_slide_by_id(db, slide_id, presentation_id)
    if not slide:
        raise NotFoundError(message="Slide not found", resource_type="slide", resource_id=str(slide_id))

    updated = update_slide(db, slide, data)
    return SlideResponse.model_validate(updated)


@router.delete(
    "/{presentation_id}/slides/{slide_id}",
    response_model=MessageResponse,
    summary="Delete slide",
    description="Delete a slide from a presentation",
)
def delete_existing_slide(
    presentation_id: uuid.UUID,
    slide_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> MessageResponse:
    """Delete a slide"""
    presentation = get_presentation_by_id(db, presentation_id)
    presentation = require_presentation_ownership(presentation, current_user)

    slide = get_slide_by_id(db, slide_id, presentation_id)
    if not slide:
        raise NotFoundError(message="Slide not found", resource_type="slide", resource_id=str(slide_id))

    delete_slide(db, slide)
    return MessageResponse(message="Slide deleted successfully")

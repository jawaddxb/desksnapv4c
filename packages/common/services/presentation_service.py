"""
Presentation Service
Business logic for presentation CRUD operations
"""
import uuid
from math import ceil

from sqlalchemy.orm import Session

from packages.common.models.presentation import Presentation
from packages.common.models.slide import Slide
from packages.common.models.user import User
from packages.common.schemas.presentation import (
    PresentationCreate,
    PresentationUpdate,
    SlideCreate,
    SlideUpdate,
    PresentationListResponse,
    PresentationResponse,
    PresentationDetailResponse,
    PresentationImport,
    PresentationExport,
)
from packages.common.services.presentation_mappers import (
    create_slide_from_data,
    create_slide_from_import,
    duplicate_slide,
    slide_to_export_dict,
)
from packages.common.core.exceptions import ApplicationError


# Backwards compatibility alias
class PresentationError(ApplicationError):
    """Presentation service error (deprecated, use ApplicationError)"""
    pass


def get_presentation_by_id(
    db: Session, presentation_id: uuid.UUID, user: User | None = None
) -> Presentation | None:
    """
    Get a presentation by ID

    If user is provided, only return if user owns it or it's public
    """
    query = db.query(Presentation).filter(Presentation.id == presentation_id)

    if user:
        query = query.filter(
            (Presentation.owner_id == user.id) | (Presentation.is_public == True)  # noqa: E712
        )

    return query.first()


def list_presentations(
    db: Session,
    user: User,
    page: int = 1,
    page_size: int = 20,
) -> PresentationListResponse:
    """List presentations for a user with pagination"""
    query = db.query(Presentation).filter(Presentation.owner_id == user.id)

    total = query.count()
    pages = ceil(total / page_size) if total > 0 else 1

    presentations = (
        query.order_by(Presentation.updated_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return PresentationListResponse(
        items=[PresentationDetailResponse.model_validate(p) for p in presentations],
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


def create_presentation(
    db: Session, user: User, data: PresentationCreate
) -> Presentation:
    """Create a new presentation with slides"""
    presentation = Presentation(
        owner_id=user.id,
        topic=data.topic,
        theme_id=data.theme_id,
        visual_style=data.visual_style,
        wabi_sabi_layout=data.wabi_sabi_layout,
        thumbnail_url=data.thumbnail_url,
        is_public=data.is_public,
    )
    db.add(presentation)
    db.flush()  # Get the presentation ID

    # Add slides using centralized mapper
    for i, slide_data in enumerate(data.slides):
        slide = create_slide_from_data(presentation.id, slide_data, i)
        db.add(slide)

    db.commit()
    db.refresh(presentation)
    return presentation


def update_presentation(
    db: Session, presentation: Presentation, data: PresentationUpdate
) -> Presentation:
    """Update a presentation"""
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(presentation, field, value)

    db.commit()
    db.refresh(presentation)
    return presentation


def delete_presentation(db: Session, presentation: Presentation) -> bool:
    """Delete a presentation and all its slides"""
    db.delete(presentation)
    db.commit()
    return True


def duplicate_presentation(db: Session, user: User, presentation: Presentation) -> Presentation:
    """Duplicate a presentation"""
    new_presentation = Presentation(
        owner_id=user.id,
        topic=f"{presentation.topic} (Copy)",
        theme_id=presentation.theme_id,
        visual_style=presentation.visual_style,
        wabi_sabi_layout=presentation.wabi_sabi_layout,
        is_public=False,  # Copies are private by default
    )
    db.add(new_presentation)
    db.flush()

    # Duplicate slides using centralized mapper
    for slide in presentation.slides:
        new_slide = duplicate_slide(new_presentation.id, slide)
        db.add(new_slide)

    db.commit()
    db.refresh(new_presentation)
    return new_presentation


# Slide operations
def add_slide(
    db: Session, presentation: Presentation, data: SlideCreate
) -> Slide:
    """Add a slide to a presentation"""
    # Use position from data, or append at end
    position = data.position if data.position is not None else len(presentation.slides)
    slide = create_slide_from_data(presentation.id, data, position)
    db.add(slide)
    db.commit()
    db.refresh(slide)
    return slide


def update_slide(db: Session, slide: Slide, data: SlideUpdate) -> Slide:
    """Update a slide"""
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(slide, field, value)

    db.commit()
    db.refresh(slide)
    return slide


def delete_slide(db: Session, slide: Slide) -> bool:
    """Delete a slide"""
    db.delete(slide)
    db.commit()
    return True


def get_slide_by_id(
    db: Session, slide_id: uuid.UUID, presentation_id: uuid.UUID | None = None
) -> Slide | None:
    """Get a slide by ID"""
    query = db.query(Slide).filter(Slide.id == slide_id)
    if presentation_id:
        query = query.filter(Slide.presentation_id == presentation_id)
    return query.first()


# Import/Export
def import_presentation(
    db: Session, user: User, data: PresentationImport
) -> Presentation:
    """Import a presentation from frontend format (camelCase)"""
    presentation = Presentation(
        owner_id=user.id,
        topic=data.topic,
        theme_id=data.themeId,
        visual_style=data.visualStyle,
        wabi_sabi_layout=data.wabiSabiLayout,
    )
    db.add(presentation)
    db.flush()

    # Import slides using centralized mapper
    for i, slide_data in enumerate(data.slides):
        slide = create_slide_from_import(presentation.id, slide_data, i)
        db.add(slide)

    db.commit()
    db.refresh(presentation)
    return presentation


def export_presentation(presentation: Presentation) -> PresentationExport:
    """Export a presentation to frontend format (camelCase)"""
    # Use centralized mapper for slides
    slides = [slide_to_export_dict(slide) for slide in presentation.slides]

    return PresentationExport(
        id=str(presentation.id),
        topic=presentation.topic,
        themeId=presentation.theme_id,
        visualStyle=presentation.visual_style,
        wabiSabiLayout=presentation.wabi_sabi_layout,
        slides=slides,
        createdAt=presentation.created_at.isoformat(),
        updatedAt=presentation.updated_at.isoformat(),
    )

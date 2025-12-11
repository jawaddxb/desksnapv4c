"""
Version Service
Business logic for presentation version history
"""
import uuid

from sqlalchemy import func
from sqlalchemy.orm import Session

from packages.common.models.presentation import Presentation
from packages.common.models.presentation_version import PresentationVersion
from packages.common.models.slide import Slide
from packages.common.schemas.presentation_version import (
    VersionCreate,
    VersionResponse,
    VersionListResponse,
)


def create_version(
    db: Session,
    presentation: Presentation,
    data: VersionCreate,
) -> PresentationVersion:
    """
    Create a new version checkpoint for a presentation.
    Captures the full state as a JSONB snapshot.
    """
    # Get next version number
    max_version = (
        db.query(func.max(PresentationVersion.version_number))
        .filter(PresentationVersion.presentation_id == presentation.id)
        .scalar()
        or 0
    )

    # Create snapshot of current state
    snapshot = {
        "topic": presentation.topic,
        "theme_id": presentation.theme_id,
        "visual_style": presentation.visual_style,
        "wabi_sabi_layout": presentation.wabi_sabi_layout,
        "view_mode": presentation.view_mode,
        "slides": [
            {
                "position": slide.position,
                "title": slide.title,
                "content": slide.content,
                "speaker_notes": slide.speaker_notes,
                "image_prompt": slide.image_prompt,
                "image_url": slide.image_url,
                "layout_type": slide.layout_type,
                "alignment": slide.alignment,
                "font_scale": slide.font_scale,
                "layout_variant": slide.layout_variant,
                "style_overrides": slide.style_overrides,
            }
            for slide in presentation.slides
        ],
    }

    version = PresentationVersion(
        presentation_id=presentation.id,
        version_number=max_version + 1,
        label=data.label,
        thumbnail_url=presentation.thumbnail_url,
        snapshot=snapshot,
    )
    db.add(version)
    db.commit()
    db.refresh(version)
    return version


def list_versions(
    db: Session,
    presentation_id: uuid.UUID,
) -> VersionListResponse:
    """List all versions for a presentation, newest first"""
    versions = (
        db.query(PresentationVersion)
        .filter(PresentationVersion.presentation_id == presentation_id)
        .order_by(PresentationVersion.version_number.desc())
        .all()
    )

    return VersionListResponse(
        items=[VersionResponse.model_validate(v) for v in versions],
        total=len(versions),
    )


def get_version(
    db: Session,
    version_id: uuid.UUID,
) -> PresentationVersion | None:
    """Get a specific version by ID"""
    return (
        db.query(PresentationVersion)
        .filter(PresentationVersion.id == version_id)
        .first()
    )


def restore_version(
    db: Session,
    presentation: Presentation,
    version: PresentationVersion,
) -> Presentation:
    """
    Restore a presentation to a specific version.
    Replaces current state with the snapshot.
    """
    snapshot = version.snapshot

    # Update presentation metadata
    presentation.topic = snapshot.get("topic", presentation.topic)
    presentation.theme_id = snapshot.get("theme_id")
    presentation.visual_style = snapshot.get("visual_style")
    presentation.wabi_sabi_layout = snapshot.get("wabi_sabi_layout")
    presentation.view_mode = snapshot.get("view_mode")

    # Delete existing slides
    db.query(Slide).filter(Slide.presentation_id == presentation.id).delete()

    # Recreate slides from snapshot
    for slide_data in snapshot.get("slides", []):
        slide = Slide(
            presentation_id=presentation.id,
            position=slide_data.get("position", 0),
            title=slide_data.get("title"),
            content=slide_data.get("content"),
            speaker_notes=slide_data.get("speaker_notes"),
            image_prompt=slide_data.get("image_prompt"),
            image_url=slide_data.get("image_url"),
            layout_type=slide_data.get("layout_type"),
            alignment=slide_data.get("alignment"),
            font_scale=slide_data.get("font_scale"),
            layout_variant=slide_data.get("layout_variant"),
            style_overrides=slide_data.get("style_overrides"),
        )
        db.add(slide)

    db.commit()
    db.refresh(presentation)
    return presentation


def delete_version(
    db: Session,
    version: PresentationVersion,
) -> bool:
    """Delete a specific version"""
    db.delete(version)
    db.commit()
    return True

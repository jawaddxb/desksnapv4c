"""
Presentation Mappers

Centralized mapping functions for converting between:
- Frontend format (camelCase)
- Backend format (snake_case)
- Database models

DRY: All field mappings defined once and reused.
"""

from typing import Any
from uuid import UUID

from packages.common.models.slide import Slide
from packages.common.schemas.presentation import SlideCreate, SlideImport


# Field mapping: frontend camelCase -> backend snake_case
FRONTEND_TO_DB_SLIDE = {
    "contentBlocks": "content_blocks",
    "speakerNotes": "speaker_notes",
    "imagePrompt": "image_prompt",
    "imageUrl": "image_url",
    "layoutType": "layout_type",
    "fontScale": "font_scale",
    "layoutVariant": "layout_variant",
    "styleOverrides": "style_overrides",
}

# Reverse mapping: backend snake_case -> frontend camelCase
DB_TO_FRONTEND_SLIDE = {v: k for k, v in FRONTEND_TO_DB_SLIDE.items()}

FRONTEND_TO_DB_PRESENTATION = {
    "themeId": "theme_id",
    "visualStyle": "visual_style",
    "wabiSabiLayout": "wabi_sabi_layout",
    "thumbnailUrl": "thumbnail_url",
    "isPublic": "is_public",
    "createdAt": "created_at",
    "updatedAt": "updated_at",
}

DB_TO_FRONTEND_PRESENTATION = {v: k for k, v in FRONTEND_TO_DB_PRESENTATION.items()}


def map_frontend_to_db(data: dict[str, Any], mapping: dict[str, str]) -> dict[str, Any]:
    """
    Convert frontend camelCase keys to backend snake_case.

    Args:
        data: Dictionary with camelCase keys
        mapping: Mapping of camelCase -> snake_case

    Returns:
        Dictionary with snake_case keys
    """
    return {mapping.get(k, k): v for k, v in data.items()}


def map_db_to_frontend(data: dict[str, Any], mapping: dict[str, str]) -> dict[str, Any]:
    """
    Convert backend snake_case keys to frontend camelCase.

    Args:
        data: Dictionary with snake_case keys
        mapping: Mapping of snake_case -> camelCase

    Returns:
        Dictionary with camelCase keys
    """
    return {mapping.get(k, k): v for k, v in data.items()}


def create_slide_from_data(
    presentation_id: UUID,
    slide_data: SlideCreate,
    position: int,
) -> Slide:
    """
    Create a Slide model from SlideCreate schema.

    Centralized slide creation logic to avoid duplication.

    Args:
        presentation_id: UUID of the parent presentation
        slide_data: Slide data from schema
        position: Position index of the slide

    Returns:
        Slide model (not yet added to session)
    """
    return Slide(
        presentation_id=presentation_id,
        position=slide_data.position if slide_data.position is not None else position,
        title=slide_data.title,
        content=slide_data.content,
        content_blocks=slide_data.content_blocks,
        speaker_notes=slide_data.speaker_notes,
        image_prompt=slide_data.image_prompt,
        image_url=slide_data.image_url,
        layout_type=slide_data.layout_type,
        alignment=slide_data.alignment,
        font_scale=slide_data.font_scale,
        layout_variant=slide_data.layout_variant,
        style_overrides=slide_data.style_overrides,
    )


def create_slide_from_import(
    presentation_id: UUID,
    slide_data: SlideImport,
    position: int,
) -> Slide:
    """
    Create a Slide model from SlideImport schema (camelCase frontend format).

    Args:
        presentation_id: UUID of the parent presentation
        slide_data: Slide data from import schema
        position: Position index of the slide

    Returns:
        Slide model (not yet added to session)
    """
    return Slide(
        presentation_id=presentation_id,
        position=position,
        title=slide_data.title,
        content=slide_data.content,
        content_blocks=slide_data.contentBlocks,
        speaker_notes=slide_data.speakerNotes,
        image_prompt=slide_data.imagePrompt,
        image_url=slide_data.imageUrl,
        layout_type=slide_data.layoutType,
        alignment=slide_data.alignment,
        font_scale=slide_data.fontScale,
        layout_variant=slide_data.layoutVariant,
        style_overrides=slide_data.styleOverrides,
    )


def duplicate_slide(
    presentation_id: UUID,
    source_slide: Slide,
) -> Slide:
    """
    Create a copy of an existing slide for a new presentation.

    Args:
        presentation_id: UUID of the new presentation
        source_slide: Source slide to copy

    Returns:
        New Slide model (not yet added to session)
    """
    return Slide(
        presentation_id=presentation_id,
        position=source_slide.position,
        title=source_slide.title,
        content=source_slide.content,
        content_blocks=source_slide.content_blocks,
        speaker_notes=source_slide.speaker_notes,
        image_prompt=source_slide.image_prompt,
        image_url=source_slide.image_url,
        layout_type=source_slide.layout_type,
        alignment=source_slide.alignment,
        font_scale=source_slide.font_scale,
        layout_variant=source_slide.layout_variant,
        style_overrides=source_slide.style_overrides,
    )


def slide_to_export_dict(slide: Slide) -> dict[str, Any]:
    """
    Convert a Slide model to export format (camelCase).

    Args:
        slide: Slide model

    Returns:
        Dictionary with camelCase keys for frontend
    """
    return {
        "id": str(slide.id),
        "title": slide.title,
        "content": slide.content or [],
        "contentBlocks": slide.content_blocks,
        "speakerNotes": slide.speaker_notes,
        "imagePrompt": slide.image_prompt,
        "imageUrl": slide.image_url,
        "layoutType": slide.layout_type,
        "alignment": slide.alignment,
        "fontScale": slide.font_scale,
        "layoutVariant": slide.layout_variant,
        "styleOverrides": slide.style_overrides,
    }

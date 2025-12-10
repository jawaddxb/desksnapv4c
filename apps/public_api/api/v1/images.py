"""
Image Generation API Endpoints
Async image generation via Celery
"""
import uuid

from celery.result import AsyncResult
from fastapi import APIRouter, status

from apps.public_api.dependencies import CurrentUser, DbSession
from packages.common.core.celery_app import celery_app
from packages.common.core.exceptions import NotFoundError, ValidationError
from packages.common.schemas.auth import MessageResponse
from packages.common.schemas.image_generation import (
    BatchImageGenerationRequest,
    BatchImageGenerationResponse,
    BatchStatusResponse,
    ImageGenerationResponse,
    ImageTaskStatus,
)
from packages.common.services.authorization_service import require_presentation_ownership
from packages.common.services.presentation_service import (
    get_presentation_by_id,
    get_slide_by_id,
)
from packages.common.tasks.image_tasks import generate_batch_images, generate_slide_image

router = APIRouter()


@router.post(
    "/{presentation_id}/slides/{slide_id}/generate-image",
    response_model=ImageGenerationResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Generate slide image",
    description="Queue image generation for a single slide",
)
def generate_single_image(
    presentation_id: uuid.UUID,
    slide_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> ImageGenerationResponse:
    """Queue image generation for a slide."""
    # Verify ownership
    presentation = get_presentation_by_id(db, presentation_id)
    presentation = require_presentation_ownership(presentation, current_user)

    slide = get_slide_by_id(db, slide_id, presentation_id)
    if not slide:
        raise NotFoundError(message="Slide not found", resource_type="slide")

    if not slide.image_prompt:
        raise ValidationError(message="Slide has no image prompt", field="image_prompt")

    # Queue the task
    task = generate_slide_image.delay(
        slide_id=str(slide_id),
        presentation_id=str(presentation_id),
        image_prompt=slide.image_prompt,
        visual_style=presentation.visual_style or "",
        slide_index=slide.position,
    )

    # Store task_id on slide
    slide.image_task_id = task.id
    db.commit()

    return ImageGenerationResponse(
        task_id=task.id,
        slide_id=str(slide_id),
        status="PENDING",
    )


@router.post(
    "/{presentation_id}/generate-images",
    response_model=BatchImageGenerationResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Generate all images",
    description="Queue image generation for all slides in presentation",
)
def generate_all_images(
    presentation_id: uuid.UUID,
    data: BatchImageGenerationRequest,
    current_user: CurrentUser,
    db: DbSession,
) -> BatchImageGenerationResponse:
    """Queue image generation for multiple slides."""
    presentation = get_presentation_by_id(db, presentation_id)
    presentation = require_presentation_ownership(presentation, current_user)

    # Determine which slides to process
    if data.slide_ids:
        slides_to_process = [s for s in presentation.slides if s.id in data.slide_ids]
    else:
        # All slides with prompts but no images
        slides_to_process = [s for s in presentation.slides if s.image_prompt and not s.image_url]

    if not slides_to_process:
        raise ValidationError(message="No slides to process", field="slide_ids")

    # Build slide info list
    slides_info = [
        {
            "slide_id": str(s.id),
            "image_prompt": s.image_prompt,
            "index": s.position,
        }
        for s in slides_to_process
    ]

    # Dispatch batch generation (synchronously dispatches individual tasks)
    task_ids = generate_batch_images(
        presentation_id=str(presentation_id),
        visual_style=presentation.visual_style or "",
        slides=slides_info,
    )

    return BatchImageGenerationResponse(
        tasks=task_ids,
        total_slides=len(task_ids),
    )


@router.get(
    "/tasks/{task_id}",
    response_model=ImageTaskStatus,
    summary="Get task status",
    description="Check status of an image generation task",
)
def get_task_status(
    task_id: str,
    current_user: CurrentUser,
) -> ImageTaskStatus:
    """Get status of a single task."""
    result = AsyncResult(task_id, app=celery_app)

    status_response = ImageTaskStatus(
        task_id=task_id,
        status=result.status,
    )

    if result.ready():
        if result.successful():
            task_result = result.result
            if isinstance(task_result, dict):
                status_response.slide_id = task_result.get("slide_id")
                status_response.image_url = task_result.get("image_url")
                if not task_result.get("success"):
                    status_response.error = task_result.get("error")
                    status_response.status = "FAILURE"
        else:
            status_response.error = str(result.result)
            status_response.status = "FAILURE"

    return status_response


@router.get(
    "/{presentation_id}/image-status",
    response_model=BatchStatusResponse,
    summary="Get all image statuses",
    description="Get status of all image generation tasks for a presentation",
)
def get_presentation_image_status(
    presentation_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> BatchStatusResponse:
    """Get status of all image generation tasks for a presentation."""
    presentation = get_presentation_by_id(db, presentation_id)
    presentation = require_presentation_ownership(presentation, current_user)

    slide_statuses: dict[str, ImageTaskStatus] = {}
    completed = 0

    for slide in presentation.slides:
        slide_id = str(slide.id)

        if slide.image_url and not slide.image_task_id:
            # Already has image, no pending task
            slide_statuses[slide_id] = ImageTaskStatus(
                task_id="",
                status="COMPLETE",
                slide_id=slide_id,
                image_url=slide.image_url,
            )
            completed += 1
        elif slide.image_task_id:
            # Has pending/completed task
            result = AsyncResult(slide.image_task_id, app=celery_app)
            task_status = ImageTaskStatus(
                task_id=slide.image_task_id,
                status=result.status,
                slide_id=slide_id,
            )

            if result.ready():
                if result.successful():
                    task_result = result.result
                    if isinstance(task_result, dict):
                        task_status.image_url = task_result.get("image_url")
                        if task_result.get("success"):
                            task_status.status = "SUCCESS"
                            completed += 1
                        else:
                            task_status.error = task_result.get("error")
                            task_status.status = "FAILURE"
                else:
                    task_status.error = str(result.result)
                    task_status.status = "FAILURE"

            slide_statuses[slide_id] = task_status
        else:
            # No image, no task
            slide_statuses[slide_id] = ImageTaskStatus(
                task_id="",
                status="NONE",
                slide_id=slide_id,
            )

    total = len([s for s in presentation.slides if s.image_prompt])

    return BatchStatusResponse(
        slide_statuses=slide_statuses,
        completed=completed,
        total=total,
        all_complete=completed >= total if total > 0 else True,
    )


@router.post(
    "/{presentation_id}/slides/{slide_id}/regenerate-image",
    response_model=ImageGenerationResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Regenerate slide image",
    description="Force regenerate image for a slide that already has one",
)
def regenerate_slide_image(
    presentation_id: uuid.UUID,
    slide_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> ImageGenerationResponse:
    """Force regenerate image for a slide."""
    presentation = get_presentation_by_id(db, presentation_id)
    presentation = require_presentation_ownership(presentation, current_user)

    slide = get_slide_by_id(db, slide_id, presentation_id)
    if not slide:
        raise NotFoundError(message="Slide not found", resource_type="slide")

    if not slide.image_prompt:
        raise ValidationError(message="Slide has no image prompt", field="image_prompt")

    # Clear existing image
    slide.image_url = None
    slide.image_storage_key = None

    # Queue the task
    task = generate_slide_image.delay(
        slide_id=str(slide_id),
        presentation_id=str(presentation_id),
        image_prompt=slide.image_prompt,
        visual_style=presentation.visual_style or "",
        slide_index=slide.position,
    )

    slide.image_task_id = task.id
    db.commit()

    return ImageGenerationResponse(
        task_id=task.id,
        slide_id=str(slide_id),
        status="PENDING",
    )

"""
Image Generation Celery Tasks

Handles async image generation with:
- Fallback model strategy (Pro -> Flash)
- Storage provider integration
- Proper error handling and retries
"""
import base64
import logging

import httpx
from celery import shared_task
from celery.exceptions import MaxRetriesExceededError

from packages.common.core.config import settings
from packages.common.core.database import get_db_context
from packages.common.models.slide import Slide
from packages.common.providers.provider_factory import get_image_storage_provider

logger = logging.getLogger(__name__)

# Gemini model fallback strategy (synced with frontend geminiService.ts)
# Uses the newer image generation models available via generateContent API
IMAGE_MODELS = [
    {"model": "gemini-2.0-flash-exp", "label": "Flash Exp"},
]


def _generate_with_gemini(prompt: str) -> str | None:
    """
    Generate image using Gemini with fallback strategy.
    Returns base64-encoded image data or None.
    """
    api_key = settings.gemini_api_key
    if not api_key:
        logger.error("GEMINI_API_KEY not configured")
        return None

    for model_config in IMAGE_MODELS:
        model = model_config["model"]
        try:
            logger.info(f"Trying model: {model}")

            # Use generateContent format with image output requested
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "responseModalities": ["IMAGE", "TEXT"],
                },
            }

            response = httpx.post(
                url,
                headers={"Content-Type": "application/json"},
                params={"key": api_key},
                json=payload,
                timeout=120.0,
            )

            if response.status_code == 200:
                data = response.json()

                # Extract image from Gemini format
                for candidate in data.get("candidates", []):
                    for part in candidate.get("content", {}).get("parts", []):
                        if "inlineData" in part:
                            logger.info(f"Image generated with {model}")
                            return part["inlineData"]["data"]

                logger.warning(f"Model {model} returned no image data")
            else:
                logger.warning(f"Model {model} failed: {response.status_code} - {response.text[:200]}")

        except httpx.TimeoutException:
            logger.warning(f"Model {model} timed out")
            continue
        except Exception as e:
            logger.warning(f"Model {model} exception: {e}")
            continue

    return None


@shared_task(
    bind=True,
    name="packages.common.tasks.image_tasks.generate_slide_image",
    max_retries=3,
    default_retry_delay=10,
    autoretry_for=(httpx.TimeoutException, httpx.ConnectError),
    retry_backoff=True,
    retry_backoff_max=60,
)
def generate_slide_image(
    self,
    slide_id: str,
    presentation_id: str,
    image_prompt: str,
    visual_style: str,
    slide_index: int,
) -> dict:
    """
    Generate an image for a slide and upload to storage.

    Args:
        slide_id: UUID of the slide
        presentation_id: UUID of the presentation
        image_prompt: The image generation prompt
        visual_style: Theme visual style to enhance prompt
        slide_index: Position of slide (for storage key)

    Returns:
        dict with keys: success, image_url, storage_key, slide_id, error
    """
    try:
        # Build enhanced prompt (same pattern as frontend)
        enhanced_prompt = (
            f"{visual_style}. "
            f"SUBJECT: {image_prompt}. "
            "High quality, 8k, detailed, professional presentation image."
        )

        logger.info(f"Generating image for slide {slide_id}: {image_prompt[:50]}...")

        # Generate image using Gemini
        image_data = _generate_with_gemini(enhanced_prompt)

        if not image_data:
            logger.error(f"Failed to generate image for slide {slide_id}")
            return {
                "success": False,
                "error": "Failed to generate image with all models",
                "slide_id": slide_id,
            }

        # Upload to storage provider
        storage = get_image_storage_provider()
        storage_key = storage.generate_key(presentation_id, slide_index)

        # Decode base64 to bytes
        image_bytes = base64.b64decode(image_data)

        # Upload (providers are sync)
        image_url = storage.upload(storage_key, image_bytes, "image/png")

        logger.info(f"Image uploaded for slide {slide_id}: {image_url[:50]}...")

        # Update slide in database
        with get_db_context() as db:
            slide = db.query(Slide).filter(Slide.id == slide_id).first()
            if slide:
                slide.image_url = image_url
                slide.image_storage_key = storage_key
                slide.image_task_id = None  # Clear task ID on completion
                db.commit()
                logger.info(f"Slide {slide_id} updated with image URL")

        return {
            "success": True,
            "image_url": image_url,
            "storage_key": storage_key,
            "slide_id": slide_id,
        }

    except MaxRetriesExceededError:
        logger.error(f"Max retries exceeded for slide {slide_id}")
        return {
            "success": False,
            "error": "Max retries exceeded",
            "slide_id": slide_id,
        }
    except Exception as e:
        logger.error(f"Image generation failed for slide {slide_id}: {e}")
        # Re-raise to trigger Celery retry
        raise


@shared_task(
    name="packages.common.tasks.image_tasks.generate_batch_images",
)
def generate_batch_images(
    presentation_id: str,
    visual_style: str,
    slides: list[dict],
) -> dict:
    """
    Dispatch image generation for multiple slides.

    Args:
        presentation_id: UUID of the presentation
        visual_style: Theme visual style
        slides: List of dicts with keys: slide_id, image_prompt, index

    Returns:
        dict mapping slide_id -> task_id
    """
    task_ids = {}

    for slide_info in slides:
        task = generate_slide_image.delay(
            slide_id=slide_info["slide_id"],
            presentation_id=presentation_id,
            image_prompt=slide_info["image_prompt"],
            visual_style=visual_style,
            slide_index=slide_info["index"],
        )
        task_ids[slide_info["slide_id"]] = task.id

        # Update slide with task ID
        with get_db_context() as db:
            slide = db.query(Slide).filter(Slide.id == slide_info["slide_id"]).first()
            if slide:
                slide.image_task_id = task.id
                db.commit()

    logger.info(f"Dispatched {len(task_ids)} image generation tasks for presentation {presentation_id}")

    return task_ids

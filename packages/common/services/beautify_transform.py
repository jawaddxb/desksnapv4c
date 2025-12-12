"""
Beautify Transform Service
Transforms SlideIR to final Slide format based on intensity level
KISS: Three intensity levels with clear transformation rules
"""
import logging
import uuid
from typing import Any

logger = logging.getLogger(__name__)


# Layout mapping from slide type
SLIDE_TYPE_LAYOUT_MAP = {
    "title": "statement",
    "bullets": "split",
    "two-column": "horizontal",
    "chart": "gallery",
    "image-focus": "full-bleed",
    "quote": "statement",
    "unknown": "split",
}


def transform_slides(
    slides_ir: list[dict[str, Any]],
    theme_id: str,
    intensity: str
) -> list[dict[str, Any]]:
    """
    Transform SlideIR[] to Slide[] based on intensity.
    """
    transformed = []

    for slide_ir in slides_ir:
        if intensity == "cleanup":
            slide = transform_cleanup(slide_ir, theme_id)
        elif intensity == "redesign":
            slide = transform_redesign(slide_ir, theme_id)
        else:  # rebuild
            slide = transform_rebuild(slide_ir, theme_id)

        transformed.append(slide)

    return transformed


def transform_cleanup(slide_ir: dict[str, Any], theme_id: str) -> dict[str, Any]:
    """
    Minimal transform: Keep content, fix layout.
    - Keep original images
    - Apply suggested layout
    - Normalize bullet formatting
    """
    # Generate unique ID
    slide_id = str(uuid.uuid4())

    # Get content (already extracted)
    content = slide_ir.get("content", [])

    # Normalize bullets (remove excessive bullet characters)
    content = normalize_bullets(content)

    return {
        "id": slide_id,
        "position": slide_ir.get("position", 0),
        "title": slide_ir.get("title", ""),
        "content": content,
        "speakerNotes": slide_ir.get("notes", ""),
        "imageUrl": slide_ir.get("image_url"),  # Keep original image
        "imagePrompt": "",  # No new image generation
        "layoutType": slide_ir.get("suggested_layout", "split"),
        "alignment": slide_ir.get("suggested_alignment", "left"),
        "fontScale": "base",
        "layoutVariant": 0,
    }


def transform_redesign(slide_ir: dict[str, Any], theme_id: str) -> dict[str, Any]:
    """
    Medium transform: New layouts, enhanced content.
    - Map to optimal layout
    - Simplify bullet content (max 6 bullets)
    - Keep best image from original
    - Generate new imagePrompt
    """
    slide_id = str(uuid.uuid4())

    # Get and simplify content
    content = slide_ir.get("content", [])
    content = simplify_bullets(content, max_bullets=6)

    # Get optimal layout based on slide type
    slide_type = slide_ir.get("type", "unknown")
    layout_type = SLIDE_TYPE_LAYOUT_MAP.get(slide_type, "split")

    # Generate image prompt based on content
    title = slide_ir.get("title", "")
    image_prompt = generate_image_prompt(title, content, theme_id)

    return {
        "id": slide_id,
        "position": slide_ir.get("position", 0),
        "title": title,
        "content": content,
        "speakerNotes": slide_ir.get("notes", ""),
        "imageUrl": slide_ir.get("image_url"),  # Keep original for now
        "imagePrompt": image_prompt,
        "layoutType": layout_type,
        "alignment": slide_ir.get("suggested_alignment", "left"),
        "fontScale": "base",
        "layoutVariant": 0,
    }


def transform_rebuild(slide_ir: dict[str, Any], theme_id: str) -> dict[str, Any]:
    """
    Full transform: AI-enhanced everything.
    - Optimal layout selection
    - Content rewriting (message titles)
    - New AI-generated imagePrompt
    - Full image regeneration needed
    """
    slide_id = str(uuid.uuid4())

    # Get and aggressively simplify content
    content = slide_ir.get("content", [])
    content = simplify_bullets(content, max_bullets=5)

    # Shorten bullets to key points
    content = shorten_bullets(content)

    # Get optimal layout
    slide_type = slide_ir.get("type", "unknown")
    layout_type = SLIDE_TYPE_LAYOUT_MAP.get(slide_type, "split")

    # Create message-style title
    title = slide_ir.get("title", "")
    title = create_message_title(title, content)

    # Generate rich image prompt
    image_prompt = generate_rich_image_prompt(title, content, theme_id)

    return {
        "id": slide_id,
        "position": slide_ir.get("position", 0),
        "title": title,
        "content": content,
        "speakerNotes": slide_ir.get("notes", ""),
        "imageUrl": None,  # Clear for regeneration
        "imagePrompt": image_prompt,
        "layoutType": layout_type,
        "alignment": slide_ir.get("suggested_alignment", "left"),
        "fontScale": "base",
        "layoutVariant": 0,
    }


def normalize_bullets(content: list[str]) -> list[str]:
    """Remove bullet characters from content, keep text only."""
    bullet_chars = ["•", "-", "*", "–", "›", "‣", "○", "●", "→"]
    normalized = []

    for item in content:
        text = item.strip()
        # Remove leading bullet character
        for char in bullet_chars:
            if text.startswith(char):
                text = text[len(char):].strip()
                break
        # Remove numbered list prefix
        if text and text[0].isdigit() and len(text) > 1:
            if text[1] in [".", ")", ":"]:
                text = text[2:].strip()
            elif len(text) > 2 and text[1].isdigit() and text[2] in [".", ")", ":"]:
                text = text[3:].strip()

        if text:
            normalized.append(text)

    return normalized


def simplify_bullets(content: list[str], max_bullets: int = 6) -> list[str]:
    """Reduce bullet count to max_bullets."""
    # Normalize first
    content = normalize_bullets(content)

    if len(content) <= max_bullets:
        return content

    # Keep first and last, sample middle
    if max_bullets >= 3:
        return content[:max_bullets - 1] + [content[-1]]

    return content[:max_bullets]


def shorten_bullets(content: list[str], max_words: int = 12) -> list[str]:
    """Shorten each bullet to max_words."""
    shortened = []

    for item in content:
        words = item.split()
        if len(words) > max_words:
            # Take first max_words, try to end at sentence boundary
            truncated = " ".join(words[:max_words])
            # Remove trailing incomplete word if needed
            if not truncated.endswith((".", "!", "?")):
                truncated = truncated.rstrip(",;:") + "..."
            shortened.append(truncated)
        else:
            shortened.append(item)

    return shortened


def create_message_title(title: str, content: list[str]) -> str:
    """
    Create a message-style title that communicates the key takeaway.
    For now, returns cleaned up original title.
    TODO: Use LLM for smarter title generation.
    """
    # Clean up title
    title = title.strip()

    # Remove trailing punctuation except question marks
    while title and title[-1] in [".", ":", ",", ";"]:
        title = title[:-1]

    return title


def generate_image_prompt(title: str, content: list[str], theme_id: str) -> str:
    """
    Generate a simple image prompt based on slide content.
    """
    # Combine title and first content item
    context = title
    if content:
        context = f"{title}: {content[0]}"

    return f"Professional illustration representing {context}, {theme_id} style, clean modern design"


def generate_rich_image_prompt(title: str, content: list[str], theme_id: str) -> str:
    """
    Generate a rich image prompt for full rebuild.
    """
    # Theme-specific style hints
    style_hints = {
        "executive": "minimalist corporate, muted colors, sophisticated",
        "saas": "bold startup aesthetic, gradient backgrounds, modern tech",
        "editorial": "magazine layout, elegant typography, editorial photography",
        "neoBrutalist": "raw bold design, strong contrasts, geometric shapes",
        "architect": "clean lines, structural, monochromatic",
    }

    style = style_hints.get(theme_id, "professional modern")

    # Build context
    context_parts = [title]
    if content:
        context_parts.extend(content[:2])

    context = " | ".join(context_parts)

    return f"Stunning visual for '{context}', {style}, professional presentation quality, high resolution"

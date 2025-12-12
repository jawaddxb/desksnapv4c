"""
Slide Classifier Service
Classifies slide types using heuristics
KISS: Rule-based classification with confidence scores
"""
import logging
from typing import Any

logger = logging.getLogger(__name__)

# Slide types
SLIDE_TYPES = ["title", "bullets", "two-column", "chart", "image-focus", "quote", "unknown"]


def classify_slide(slide_data: dict[str, Any]) -> tuple[str, float]:
    """
    Classify slide type using heuristics.

    Returns: (slide_type, confidence)
    """
    texts = slide_data.get("texts", [])
    images = slide_data.get("images", [])

    # Try each classifier in order of specificity
    classifiers = [
        classify_title_slide,
        classify_image_focus,
        classify_quote_slide,
        classify_two_column,
        classify_bullets,
    ]

    for classifier in classifiers:
        slide_type, confidence = classifier(texts, images)
        if confidence > 0.6:
            return slide_type, confidence

    return "unknown", 0.5


def classify_title_slide(
    texts: list[dict[str, Any]],
    images: list[dict[str, Any]]
) -> tuple[str, float]:
    """
    Title slide: Large text at top, minimal content.
    """
    if not texts:
        return "title", 0.0

    # Check for title-like text
    title_texts = [t for t in texts if t.get("is_title", False)]
    non_title_texts = [t for t in texts if not t.get("is_title", False)]

    # Strong title indicators
    if len(title_texts) >= 1 and len(non_title_texts) <= 2:
        # Check font size
        max_font_size = max(t.get("font_size", 12) for t in texts)
        if max_font_size > 36:
            return "title", 0.9
        elif max_font_size > 28:
            return "title", 0.75

    # Few texts total = likely title
    if len(texts) <= 2 and any(t.get("font_size", 12) > 30 for t in texts):
        return "title", 0.7

    return "title", 0.0


def classify_image_focus(
    texts: list[dict[str, Any]],
    images: list[dict[str, Any]]
) -> tuple[str, float]:
    """
    Image-focus slide: Large image, minimal text.
    """
    if not images:
        return "image-focus", 0.0

    # Calculate total image area (assuming 720x540 slide dimensions)
    slide_area = 720 * 540
    total_image_area = sum(
        img.get("width", 0) * img.get("height", 0)
        for img in images
    )

    image_coverage = total_image_area / slide_area if slide_area > 0 else 0

    # High image coverage with low text
    total_text_length = sum(len(t.get("value", "")) for t in texts)

    if image_coverage > 0.5 and total_text_length < 200:
        return "image-focus", 0.85
    elif image_coverage > 0.3 and total_text_length < 100:
        return "image-focus", 0.7

    return "image-focus", 0.0


def classify_quote_slide(
    texts: list[dict[str, Any]],
    images: list[dict[str, Any]]
) -> tuple[str, float]:
    """
    Quote slide: Contains quotation marks or attribution.
    """
    if not texts:
        return "quote", 0.0

    quote_indicators = ['"', '"', '"', '—', '-', '~']
    attribution_patterns = ["- ", "— ", "~ "]

    for text in texts:
        value = text.get("value", "")
        # Check for quotation marks
        if any(char in value for char in ['"', '"', '"']):
            return "quote", 0.85
        # Check for attribution at the end
        if any(value.strip().startswith(p) for p in attribution_patterns):
            return "quote", 0.8

    return "quote", 0.0


def classify_two_column(
    texts: list[dict[str, Any]],
    images: list[dict[str, Any]]
) -> tuple[str, float]:
    """
    Two-column slide: Two major text blocks side-by-side.
    """
    if len(texts) < 2:
        return "two-column", 0.0

    # Get text positions
    lefts = [t.get("position", {}).get("left", 0) for t in texts if t.get("position")]

    if len(lefts) < 2:
        return "two-column", 0.0

    # Check if texts are distributed on left and right
    mid_point = 360  # Half of 720 slide width

    left_texts = sum(1 for left in lefts if left < mid_point - 50)
    right_texts = sum(1 for left in lefts if left > mid_point + 50)

    if left_texts >= 1 and right_texts >= 1:
        return "two-column", 0.75

    return "two-column", 0.0


def classify_bullets(
    texts: list[dict[str, Any]],
    images: list[dict[str, Any]]
) -> tuple[str, float]:
    """
    Bullet slide: List structure detected.
    """
    if not texts:
        return "bullets", 0.0

    bullet_chars = ["•", "-", "*", "–", "›", "‣", "○", "●"]
    numbered_patterns = ["1.", "2.", "3.", "1)", "2)", "3)"]

    bullet_count = 0
    for text in texts:
        value = text.get("value", "").strip()
        # Check for bullet character at start
        if any(value.startswith(char) for char in bullet_chars):
            bullet_count += 1
        # Check for numbered list
        elif any(value.startswith(p) for p in numbered_patterns):
            bullet_count += 1
        # Check for line breaks suggesting list
        elif "\n" in value:
            lines = value.split("\n")
            if len(lines) >= 3:
                bullet_count += 1

    # More than 3 bullets = high confidence
    if bullet_count >= 3:
        return "bullets", 0.9
    elif bullet_count >= 2:
        return "bullets", 0.75
    elif bullet_count >= 1:
        return "bullets", 0.6

    # Check for multiple short texts that might be bullets
    short_texts = [t for t in texts if len(t.get("value", "")) < 100]
    if len(short_texts) >= 4:
        return "bullets", 0.65

    return "bullets", 0.0


def get_suggested_layout(slide_type: str) -> str:
    """Map slide type to suggested layout."""
    layout_map = {
        "title": "statement",
        "bullets": "split",
        "two-column": "horizontal",
        "chart": "gallery",
        "image-focus": "full-bleed",
        "quote": "statement",
        "unknown": "split",
    }
    return layout_map.get(slide_type, "split")


def get_suggested_alignment(slide_type: str) -> str:
    """Map slide type to suggested alignment."""
    alignment_map = {
        "title": "center",
        "bullets": "left",
        "two-column": "left",
        "chart": "center",
        "image-focus": "center",
        "quote": "center",
        "unknown": "left",
    }
    return alignment_map.get(slide_type, "left")

"""
Mess Analyzer Service
Calculates mess scores and identifies issues in slides
KISS: Simple weighted metrics with clear issue descriptions
"""
import logging
from typing import Any

logger = logging.getLogger(__name__)


def analyze_mess(slide_data: dict[str, Any]) -> tuple[float, list[str]]:
    """
    Calculate mess score and identify issues.

    Returns: (score 0-100, list of issues)
    """
    texts = slide_data.get("texts", [])
    images = slide_data.get("images", [])

    # Calculate individual metrics
    font_chaos = calculate_font_chaos(texts)
    alignment_issues = calculate_alignment_issues(texts)
    density_score = calculate_density_score(texts)
    bullet_hell = calculate_bullet_hell(texts)

    # Weighted average
    score = (
        font_chaos * 0.30 +
        alignment_issues * 0.25 +
        density_score * 0.25 +
        bullet_hell * 0.20
    )

    # Collect issues
    issues = []

    if font_chaos > 50:
        issues.append("Too many different fonts or sizes")
    if alignment_issues > 50:
        issues.append("Inconsistent text alignment")
    if density_score > 60:
        issues.append("Too much text content")
    if bullet_hell > 50:
        issues.append("Too many bullet points")

    # Cap score at 100
    score = min(100, max(0, score))

    return score, issues


def calculate_font_chaos(texts: list[dict[str, Any]]) -> float:
    """
    Count unique fonts, font sizes, colors. More = messier.
    """
    if not texts:
        return 0

    # Collect unique fonts and sizes
    font_families = set()
    font_sizes = set()

    for text in texts:
        font_family = text.get("font_family", "Arial")
        font_size = text.get("font_size", 12)

        font_families.add(font_family)
        # Round font size to group similar sizes
        font_sizes.add(round(font_size / 2) * 2)

    # Score based on variety
    font_family_score = min(100, (len(font_families) - 1) * 30)  # 1 font = 0, 4+ fonts = 90+
    font_size_score = min(100, (len(font_sizes) - 2) * 25)  # 2 sizes = 0, 6+ sizes = 100

    return (font_family_score + font_size_score) / 2


def calculate_alignment_issues(texts: list[dict[str, Any]]) -> float:
    """
    Check if text boxes have inconsistent alignment.
    """
    if len(texts) < 2:
        return 0

    # Get left positions
    lefts = []
    for text in texts:
        pos = text.get("position", {})
        if pos:
            lefts.append(pos.get("left", 0))

    if not lefts:
        return 0

    # Group lefts into alignment bands (within 20pt = same alignment)
    alignment_bands: list[list[float]] = []
    for left in lefts:
        placed = False
        for band in alignment_bands:
            if abs(band[0] - left) < 20:
                band.append(left)
                placed = True
                break
        if not placed:
            alignment_bands.append([left])

    # More alignment bands = messier
    band_count = len(alignment_bands)
    if band_count <= 2:
        return 0
    elif band_count == 3:
        return 40
    elif band_count == 4:
        return 70
    else:
        return min(100, 70 + (band_count - 4) * 15)


def calculate_density_score(texts: list[dict[str, Any]]) -> float:
    """
    Words per slide. Higher = messier.
    """
    if not texts:
        return 0

    total_words = sum(
        len(text.get("value", "").split())
        for text in texts
    )

    # Scoring: 0-50 words = 0, 100+ words = 100
    if total_words <= 50:
        return 0
    elif total_words <= 75:
        return 30
    elif total_words <= 100:
        return 60
    elif total_words <= 150:
        return 80
    else:
        return 100


def calculate_bullet_hell(texts: list[dict[str, Any]]) -> float:
    """
    Nested bullets, too many bullets = higher score.
    """
    if not texts:
        return 0

    bullet_chars = ["•", "-", "*", "–", "›", "‣", "○", "●"]
    bullet_count = 0
    nested_count = 0

    for text in texts:
        value = text.get("value", "")
        lines = value.split("\n")

        for line in lines:
            stripped = line.strip()
            # Count bullets
            if any(stripped.startswith(char) for char in bullet_chars):
                bullet_count += 1
                # Check for nested (indented) bullets
                if line.startswith("  ") or line.startswith("\t"):
                    nested_count += 1

    # Scoring
    score = 0

    # Base bullet score: 6+ bullets is bad
    if bullet_count > 6:
        score += min(50, (bullet_count - 6) * 10)

    # Nested bullet penalty
    if nested_count > 0:
        score += min(50, nested_count * 15)

    return min(100, score)


def calculate_overall_mess_score(slides_data: list[dict[str, Any]]) -> float:
    """
    Calculate overall mess score for all slides.
    """
    if not slides_data:
        return 0

    scores = []
    for slide in slides_data:
        score, _ = analyze_mess(slide)
        scores.append(score)

    return sum(scores) / len(scores) if scores else 0

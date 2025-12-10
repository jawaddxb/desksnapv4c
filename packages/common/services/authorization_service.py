"""
Authorization Service

Centralized authorization checks for resource ownership.
Replaces inline ownership checks scattered across endpoints.
"""

from uuid import UUID

from packages.common.core.exceptions import AuthorizationError, NotFoundError
from packages.common.models.presentation import Presentation
from packages.common.models.slide import Slide
from packages.common.models.user import User


def require_presentation_ownership(presentation: Presentation | None, user: User) -> Presentation:
    """
    Verify that a user owns a presentation.

    Args:
        presentation: The presentation to check (can be None if not found)
        user: The user attempting access

    Returns:
        The presentation if ownership is verified

    Raises:
        NotFoundError: If presentation is None
        AuthorizationError: If user doesn't own the presentation
    """
    if presentation is None:
        raise NotFoundError(
            message="Presentation not found",
            resource_type="presentation",
        )

    if presentation.owner_id != user.id:
        raise AuthorizationError(
            message="Not authorized to access this presentation",
            details={"presentation_id": str(presentation.id)},
        )

    return presentation


def require_slide_ownership(slide: Slide | None, user: User) -> Slide:
    """
    Verify that a user owns a slide (via presentation ownership).

    Args:
        slide: The slide to check (can be None if not found)
        user: The user attempting access

    Returns:
        The slide if ownership is verified

    Raises:
        NotFoundError: If slide is None
        AuthorizationError: If user doesn't own the slide's presentation
    """
    if slide is None:
        raise NotFoundError(
            message="Slide not found",
            resource_type="slide",
        )

    if slide.presentation.owner_id != user.id:
        raise AuthorizationError(
            message="Not authorized to access this slide",
            details={"slide_id": str(slide.id)},
        )

    return slide


def require_presentation_ownership_by_id(
    presentation_id: UUID | str,
    user: User,
    get_presentation_fn,
) -> Presentation:
    """
    Verify ownership using presentation ID and a getter function.

    This is useful when you don't have the presentation object yet.

    Args:
        presentation_id: The presentation ID to check
        user: The user attempting access
        get_presentation_fn: Function to fetch presentation by ID

    Returns:
        The presentation if ownership is verified

    Raises:
        NotFoundError: If presentation doesn't exist
        AuthorizationError: If user doesn't own the presentation
    """
    presentation = get_presentation_fn(presentation_id)
    return require_presentation_ownership(presentation, user)


def check_presentation_access(presentation: Presentation | None, user: User | None) -> Presentation:
    """
    Check if a user can access a presentation (owner OR public).

    Args:
        presentation: The presentation to check
        user: The user attempting access (can be None for anonymous)

    Returns:
        The presentation if access is allowed

    Raises:
        NotFoundError: If presentation is None
        AuthorizationError: If access is denied
    """
    if presentation is None:
        raise NotFoundError(
            message="Presentation not found",
            resource_type="presentation",
        )

    # Public presentations are accessible to everyone
    if presentation.is_public:
        return presentation

    # Private presentations require ownership
    if user is None:
        raise AuthorizationError(
            message="Authentication required to access this presentation",
        )

    if presentation.owner_id != user.id:
        raise AuthorizationError(
            message="Not authorized to access this presentation",
        )

    return presentation

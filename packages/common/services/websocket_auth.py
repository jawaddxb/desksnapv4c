"""
WebSocket Authentication Service
Validates JWT tokens for WebSocket connections
"""
import logging
from uuid import UUID

from fastapi import WebSocket

from packages.common.core.database import get_db_context
from packages.common.services.auth_service import decode_token, get_user_by_id, AuthError, ACCESS_TOKEN
from packages.common.models.user import User
from packages.common.models.presentation import Presentation

logger = logging.getLogger(__name__)


async def authenticate_websocket(websocket: WebSocket, token: str) -> User | None:
    """
    Authenticate a WebSocket connection using JWT token.

    Args:
        websocket: The WebSocket connection (not used but available for logging)
        token: JWT access token

    Returns:
        User if authenticated, None otherwise
    """
    try:
        payload = decode_token(token)

        if payload.get("type") != ACCESS_TOKEN:
            logger.warning("WebSocket auth failed: Invalid token type")
            return None

        user_id = UUID(payload["sub"])

        with get_db_context() as db:
            user = get_user_by_id(db, user_id)

            if not user or not user.is_active:
                logger.warning(f"WebSocket auth failed: User {user_id} not found or inactive")
                return None

            return user

    except AuthError as e:
        logger.warning(f"WebSocket auth failed: {e.message}")
        return None
    except Exception as e:
        logger.error(f"WebSocket auth error: {e}")
        return None


async def check_presentation_access(
    user_id: UUID,
    presentation_id: UUID,
) -> bool:
    """
    Check if user has access to view/edit a presentation.

    Args:
        user_id: The authenticated user's ID
        presentation_id: The presentation to check access for

    Returns:
        True if user can access, False otherwise
    """
    try:
        with get_db_context() as db:
            presentation = db.query(Presentation).filter(
                Presentation.id == presentation_id
            ).first()

            if not presentation:
                logger.warning(f"Presentation {presentation_id} not found")
                return False

            # Owner always has access
            if presentation.owner_id == user_id:
                return True

            # Public presentations are viewable by anyone (but not editable)
            # For now, we only allow owners to connect via WebSocket
            # Future: Add collaborator support here

            logger.warning(
                f"User {user_id} denied access to presentation {presentation_id}"
            )
            return False

    except Exception as e:
        logger.error(f"Error checking presentation access: {e}")
        return False


async def check_presentation_edit_access(
    user_id: UUID,
    presentation_id: UUID,
) -> bool:
    """
    Check if user has edit access to a presentation.
    Currently only owners can edit.

    Args:
        user_id: The authenticated user's ID
        presentation_id: The presentation to check access for

    Returns:
        True if user can edit, False otherwise
    """
    try:
        with get_db_context() as db:
            presentation = db.query(Presentation).filter(
                Presentation.id == presentation_id
            ).first()

            if not presentation:
                return False

            # Only owner can edit
            return presentation.owner_id == user_id

    except Exception as e:
        logger.error(f"Error checking presentation edit access: {e}")
        return False

"""
WebSocket API Endpoints
Real-time synchronization for presentations
"""
import logging
from uuid import UUID

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query

from packages.common.services.websocket_manager import connection_manager
from packages.common.services.websocket_auth import (
    authenticate_websocket,
    check_presentation_access,
)
from packages.common.services.sync_service import handle_sync_message
from packages.common.services.presentation_service import get_presentation_by_id
from packages.common.core.database import get_db_context

logger = logging.getLogger(__name__)

router = APIRouter()


@router.websocket("/ws/presentations/{presentation_id}")
async def presentation_websocket(
    websocket: WebSocket,
    presentation_id: UUID,
    token: str = Query(..., description="JWT access token"),
):
    """
    WebSocket endpoint for real-time presentation sync.

    Connect with: ws://host/api/v1/ws/presentations/{id}?token={jwt}

    Message Protocol:
    - Client sends JSON messages with 'type' field
    - Server broadcasts changes to all connected clients
    - Each message includes 'message_id' for tracking
    - Version-based conflict detection for optimistic concurrency
    """
    # Authenticate the WebSocket connection
    user = await authenticate_websocket(websocket, token)
    if not user:
        await websocket.close(code=4001, reason="Unauthorized")
        return

    # Check if user has access to this presentation
    has_access = await check_presentation_access(user.id, presentation_id)
    if not has_access:
        await websocket.accept()  # Accept to send close reason
        await websocket.close(code=4003, reason="Access denied to presentation")
        return

    # Connect to the presentation room
    active_users = await connection_manager.connect(
        websocket=websocket,
        presentation_id=presentation_id,
        user_id=user.id,
        user_name=user.name,
        avatar_url=user.avatar_url,
    )

    # Send initial state
    logger.info(f"Sending initial state to user {user.id}")
    await send_initial_state(websocket, presentation_id, active_users)
    logger.info(f"Initial state sent to user {user.id}")

    try:
        while True:
            # Receive messages from client
            logger.debug(f"Waiting for message from user {user.id}")
            data = await websocket.receive_json()
            logger.info(f"Received message type {data.get('type')} from user {user.id}")

            # Process the sync message
            await handle_sync_message(
                presentation_id=presentation_id,
                user_id=user.id,
                message=data,
            )

    except WebSocketDisconnect:
        # Clean up on disconnect
        logger.info(f"WebSocketDisconnect for user {user.id}")
        await connection_manager.disconnect(
            websocket=websocket,
            presentation_id=presentation_id,
            user_id=user.id,
        )
        logger.info(f"User {user.id} disconnected from presentation {presentation_id}")

    except Exception as e:
        logger.error(f"WebSocket error for user {user.id}: {e}", exc_info=True)
        await connection_manager.disconnect(
            websocket=websocket,
            presentation_id=presentation_id,
            user_id=user.id,
        )


async def send_initial_state(
    websocket: WebSocket,
    presentation_id: UUID,
    active_users: list[dict],
):
    """Send the current presentation state to a newly connected client"""
    try:
        with get_db_context() as db:
            presentation = get_presentation_by_id(db, presentation_id)
            if not presentation:
                await websocket.send_json({
                    "type": "error",
                    "error_code": "presentation_not_found",
                    "error_message": "Presentation not found",
                })
                return

            # Build presentation data
            presentation_data = {
                "id": str(presentation.id),
                "owner_id": str(presentation.owner_id),
                "topic": presentation.topic,
                "theme_id": presentation.theme_id,
                "visual_style": presentation.visual_style,
                "wabi_sabi_layout": presentation.wabi_sabi_layout,
                "thumbnail_url": presentation.thumbnail_url,
                "is_public": presentation.is_public,
                "version": presentation.version,
                "created_at": presentation.created_at.isoformat() if presentation.created_at else None,
                "updated_at": presentation.updated_at.isoformat() if presentation.updated_at else None,
            }

            # Build slides data
            # Note: We exclude image_url from WebSocket sync to avoid sending large
            # base64 data that can exceed WebSocket frame limits (~1MB).
            # The frontend should fetch images via the REST API instead.
            slides_data = []
            for slide in presentation.slides:
                slides_data.append({
                    "id": str(slide.id),
                    "presentation_id": str(slide.presentation_id),
                    "position": slide.position,
                    "title": slide.title,
                    "content": slide.content,
                    "speaker_notes": slide.speaker_notes,
                    "image_prompt": slide.image_prompt,
                    # Indicate whether image exists without sending the actual data
                    "has_image": bool(slide.image_url),
                    "image_task_id": slide.image_task_id,
                    "image_storage_key": slide.image_storage_key,
                    "layout_type": slide.layout_type,
                    "alignment": slide.alignment,
                    "font_scale": slide.font_scale,
                    "layout_variant": slide.layout_variant,
                    "style_overrides": slide.style_overrides,
                    "version": slide.version,
                    "created_at": slide.created_at.isoformat() if slide.created_at else None,
                    "updated_at": slide.updated_at.isoformat() if slide.updated_at else None,
                })

            # Send sync state message
            await websocket.send_json({
                "type": "sync:state",
                "presentation": presentation_data,
                "slides": slides_data,
                "active_users": active_users,
                "version": presentation.version,
            })

    except Exception as e:
        logger.error(f"Error sending initial state: {e}")
        await websocket.send_json({
            "type": "error",
            "error_code": "initial_state_failed",
            "error_message": "Failed to load presentation state",
        })

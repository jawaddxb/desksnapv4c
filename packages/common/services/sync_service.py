"""
Sync Service
Handles real-time sync operations for presentations via WebSocket
"""
import logging
from uuid import UUID
from typing import Any

from packages.common.core.database import get_db_context
from packages.common.models.presentation import Presentation
from packages.common.models.slide import Slide
from packages.common.services.websocket_manager import connection_manager
from packages.common.schemas.websocket import MessageType, ConflictType

logger = logging.getLogger(__name__)


async def handle_sync_message(
    presentation_id: UUID,
    user_id: UUID,
    message: dict,
) -> None:
    """
    Main entry point for processing sync messages.
    Routes to appropriate handler based on message type.
    """
    message_type = message.get("type")

    handlers = {
        MessageType.SLIDE_UPDATE.value: handle_slide_update,
        MessageType.SLIDE_CREATE.value: handle_slide_create,
        MessageType.SLIDE_DELETE.value: handle_slide_delete,
        MessageType.SLIDE_REORDER.value: handle_slide_reorder,
        MessageType.PRESENTATION_UPDATE.value: handle_presentation_update,
        MessageType.CURSOR_MOVE.value: handle_cursor_move,
        MessageType.SELECTION_CHANGE.value: handle_selection_change,
    }

    handler = handlers.get(message_type)
    if handler:
        await handler(presentation_id, user_id, message)
    else:
        logger.warning(f"Unknown message type: {message_type}")
        await send_error(
            presentation_id,
            user_id,
            message.get("message_id"),
            "unknown_message_type",
            f"Unknown message type: {message_type}",
        )


async def handle_slide_update(
    presentation_id: UUID,
    user_id: UUID,
    message: dict,
) -> None:
    """Handle slide content update with optimistic concurrency control"""
    slide_id = UUID(message["slide_id"])
    changes = message["changes"]
    base_version = message["base_version"]
    message_id = message.get("message_id")

    try:
        with get_db_context() as db:
            slide = db.query(Slide).filter(
                Slide.id == slide_id,
                Slide.presentation_id == presentation_id,
            ).first()

            if not slide:
                await send_error(
                    presentation_id, user_id, message_id,
                    "slide_not_found", "Slide not found"
                )
                return

            # Check version for conflict
            if slide.version != base_version:
                await send_conflict(
                    presentation_id=presentation_id,
                    user_id=user_id,
                    message_id=message_id,
                    conflict_type=ConflictType.VERSION_MISMATCH,
                    server_state=slide_to_dict(slide),
                    server_version=slide.version,
                )
                return

            # Apply changes (only allowed fields)
            allowed_fields = {
                "title", "content", "speaker_notes", "image_prompt",
                "layout_type", "alignment", "font_scale", "layout_variant",
                "style_overrides",
            }
            for field, value in changes.items():
                if field in allowed_fields and hasattr(slide, field):
                    setattr(slide, field, value)

            # Increment version
            slide.version += 1
            db.commit()
            db.refresh(slide)

            # Send ACK to originator
            await send_ack(presentation_id, user_id, message_id, slide.version)

            # Broadcast to other users
            await connection_manager.broadcast_to_room(
                presentation_id=presentation_id,
                message={
                    "type": MessageType.SLIDE_UPDATE.value,
                    "slide_id": str(slide_id),
                    "changes": changes,
                    "version": slide.version,
                    "updated_by": str(user_id),
                },
                exclude_user_id=user_id,
            )

    except Exception as e:
        logger.error(f"Error handling slide update: {e}")
        await send_error(
            presentation_id, user_id, message_id,
            "internal_error", "Failed to update slide"
        )


async def handle_slide_create(
    presentation_id: UUID,
    user_id: UUID,
    message: dict,
) -> None:
    """Handle new slide creation"""
    position = message["position"]
    slide_data = message["slide_data"]
    temp_id = message["temp_id"]
    message_id = message.get("message_id")

    try:
        with get_db_context() as db:
            # Shift existing slides at and after position
            db.query(Slide).filter(
                Slide.presentation_id == presentation_id,
                Slide.position >= position,
            ).update(
                {Slide.position: Slide.position + 1},
                synchronize_session=False,
            )

            # Create new slide
            slide = Slide(
                presentation_id=presentation_id,
                position=position,
                version=1,
                title=slide_data.get("title"),
                content=slide_data.get("content", []),
                speaker_notes=slide_data.get("speaker_notes"),
                image_prompt=slide_data.get("image_prompt"),
                layout_type=slide_data.get("layout_type", "split"),
                alignment=slide_data.get("alignment", "left"),
                font_scale=slide_data.get("font_scale"),
                layout_variant=slide_data.get("layout_variant"),
                style_overrides=slide_data.get("style_overrides"),
            )
            db.add(slide)
            db.commit()
            db.refresh(slide)

            # Send ACK with real server ID
            await send_ack(
                presentation_id, user_id, message_id,
                slide.version, server_id=slide.id
            )

            # Broadcast to others
            await connection_manager.broadcast_to_room(
                presentation_id=presentation_id,
                message={
                    "type": MessageType.SLIDE_CREATE.value,
                    "slide": slide_to_dict(slide),
                    "temp_id": temp_id,
                    "created_by": str(user_id),
                },
                exclude_user_id=user_id,
            )

    except Exception as e:
        logger.error(f"Error creating slide: {e}")
        await send_error(
            presentation_id, user_id, message_id,
            "internal_error", "Failed to create slide"
        )


async def handle_slide_delete(
    presentation_id: UUID,
    user_id: UUID,
    message: dict,
) -> None:
    """Handle slide deletion"""
    slide_id = UUID(message["slide_id"])
    base_version = message["base_version"]
    message_id = message.get("message_id")

    try:
        with get_db_context() as db:
            slide = db.query(Slide).filter(
                Slide.id == slide_id,
                Slide.presentation_id == presentation_id,
            ).first()

            if not slide:
                # Already deleted - send ACK
                await send_ack(presentation_id, user_id, message_id, None)
                return

            # Check version
            if slide.version != base_version:
                await send_conflict(
                    presentation_id=presentation_id,
                    user_id=user_id,
                    message_id=message_id,
                    conflict_type=ConflictType.VERSION_MISMATCH,
                    server_state=slide_to_dict(slide),
                    server_version=slide.version,
                )
                return

            position = slide.position
            db.delete(slide)

            # Shift remaining slides to fill gap
            db.query(Slide).filter(
                Slide.presentation_id == presentation_id,
                Slide.position > position,
            ).update(
                {Slide.position: Slide.position - 1},
                synchronize_session=False,
            )

            db.commit()

            await send_ack(presentation_id, user_id, message_id, None)

            # Broadcast deletion
            await connection_manager.broadcast_to_room(
                presentation_id=presentation_id,
                message={
                    "type": MessageType.SLIDE_DELETE.value,
                    "slide_id": str(slide_id),
                    "deleted_by": str(user_id),
                },
                exclude_user_id=user_id,
            )

    except Exception as e:
        logger.error(f"Error deleting slide: {e}")
        await send_error(
            presentation_id, user_id, message_id,
            "internal_error", "Failed to delete slide"
        )


async def handle_slide_reorder(
    presentation_id: UUID,
    user_id: UUID,
    message: dict,
) -> None:
    """Handle slide reordering"""
    slide_orders = message["slide_orders"]  # [{slide_id, new_position}, ...]
    message_id = message.get("message_id")

    try:
        with get_db_context() as db:
            for order in slide_orders:
                slide_id = UUID(order["slide_id"])
                new_position = order["new_position"]

                db.query(Slide).filter(
                    Slide.id == slide_id,
                    Slide.presentation_id == presentation_id,
                ).update({Slide.position: new_position})

            db.commit()

            await send_ack(presentation_id, user_id, message_id, None)

            # Broadcast reorder
            await connection_manager.broadcast_to_room(
                presentation_id=presentation_id,
                message={
                    "type": MessageType.SLIDE_REORDER.value,
                    "slide_orders": slide_orders,
                    "reordered_by": str(user_id),
                },
                exclude_user_id=user_id,
            )

    except Exception as e:
        logger.error(f"Error reordering slides: {e}")
        await send_error(
            presentation_id, user_id, message_id,
            "internal_error", "Failed to reorder slides"
        )


async def handle_presentation_update(
    presentation_id: UUID,
    user_id: UUID,
    message: dict,
) -> None:
    """Handle presentation metadata update"""
    changes = message["changes"]
    base_version = message["base_version"]
    message_id = message.get("message_id")

    try:
        with get_db_context() as db:
            presentation = db.query(Presentation).filter(
                Presentation.id == presentation_id,
            ).first()

            if not presentation:
                await send_error(
                    presentation_id, user_id, message_id,
                    "presentation_not_found", "Presentation not found"
                )
                return

            # Check version
            if presentation.version != base_version:
                await send_conflict(
                    presentation_id=presentation_id,
                    user_id=user_id,
                    message_id=message_id,
                    conflict_type=ConflictType.VERSION_MISMATCH,
                    server_state=presentation_to_dict(presentation),
                    server_version=presentation.version,
                )
                return

            # Apply changes (only allowed fields)
            allowed_fields = {
                "topic", "theme_id", "visual_style", "wabi_sabi_layout",
            }
            for field, value in changes.items():
                if field in allowed_fields and hasattr(presentation, field):
                    setattr(presentation, field, value)

            presentation.version += 1
            db.commit()
            db.refresh(presentation)

            await send_ack(presentation_id, user_id, message_id, presentation.version)

            # Broadcast
            await connection_manager.broadcast_to_room(
                presentation_id=presentation_id,
                message={
                    "type": MessageType.PRESENTATION_UPDATE.value,
                    "changes": changes,
                    "version": presentation.version,
                    "updated_by": str(user_id),
                },
                exclude_user_id=user_id,
            )

    except Exception as e:
        logger.error(f"Error updating presentation: {e}")
        await send_error(
            presentation_id, user_id, message_id,
            "internal_error", "Failed to update presentation"
        )


async def handle_cursor_move(
    presentation_id: UUID,
    user_id: UUID,
    message: dict,
) -> None:
    """Handle cursor position updates (presence awareness) - no persistence"""
    await connection_manager.broadcast_to_room(
        presentation_id=presentation_id,
        message={
            "type": MessageType.CURSOR_MOVE.value,
            "user_id": str(user_id),
            "slide_id": message.get("slide_id"),
            "x": message.get("x"),
            "y": message.get("y"),
        },
        exclude_user_id=user_id,
    )


async def handle_selection_change(
    presentation_id: UUID,
    user_id: UUID,
    message: dict,
) -> None:
    """Handle user selection changes (presence awareness) - no persistence"""
    await connection_manager.broadcast_to_room(
        presentation_id=presentation_id,
        message={
            "type": MessageType.SELECTION_CHANGE.value,
            "user_id": str(user_id),
            "slide_id": message.get("slide_id"),
            "element_id": message.get("element_id"),
        },
        exclude_user_id=user_id,
    )


# ============ Helper Functions ============


async def send_ack(
    presentation_id: UUID,
    user_id: UUID,
    message_id: str | None,
    new_version: int | None,
    server_id: UUID | None = None,
):
    """Send acknowledgment to specific user"""
    ack_message = {
        "type": MessageType.SYNC_ACK.value,
        "original_message_id": message_id,
        "success": True,
        "new_version": new_version,
    }
    if server_id:
        ack_message["server_id"] = str(server_id)

    await connection_manager.send_to_user(presentation_id, user_id, ack_message)


async def send_error(
    presentation_id: UUID,
    user_id: UUID,
    message_id: str | None,
    error_code: str,
    error_message: str,
):
    """Send error to specific user"""
    await connection_manager.send_to_user(
        presentation_id,
        user_id,
        {
            "type": MessageType.ERROR.value,
            "original_message_id": message_id,
            "error_code": error_code,
            "error_message": error_message,
        },
    )


async def send_conflict(
    presentation_id: UUID,
    user_id: UUID,
    message_id: str | None,
    conflict_type: ConflictType,
    server_state: dict,
    server_version: int,
):
    """Send conflict notification to specific user"""
    await connection_manager.send_to_user(
        presentation_id,
        user_id,
        {
            "type": MessageType.SYNC_CONFLICT.value,
            "original_message_id": message_id,
            "conflict_type": conflict_type.value,
            "server_state": server_state,
            "server_version": server_version,
        },
    )


def slide_to_dict(slide: Slide) -> dict:
    """Convert slide model to dict for serialization"""
    return {
        "id": str(slide.id),
        "presentation_id": str(slide.presentation_id),
        "position": slide.position,
        "title": slide.title,
        "content": slide.content,
        "speaker_notes": slide.speaker_notes,
        "image_prompt": slide.image_prompt,
        "image_url": slide.image_url,
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
    }


def presentation_to_dict(presentation: Presentation) -> dict:
    """Convert presentation model to dict for serialization"""
    return {
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

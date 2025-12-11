"""
WebSocket Schemas
Pydantic models for real-time sync message protocol
"""
import uuid
from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class MessageType(str, Enum):
    """Types of WebSocket messages"""

    # Client -> Server operations
    SLIDE_UPDATE = "slide:update"
    SLIDE_CREATE = "slide:create"
    SLIDE_DELETE = "slide:delete"
    SLIDE_REORDER = "slide:reorder"
    PRESENTATION_UPDATE = "presentation:update"

    # Presence (bidirectional)
    CURSOR_MOVE = "cursor:move"
    SELECTION_CHANGE = "selection:change"

    # Server -> Client events
    SYNC_STATE = "sync:state"
    SYNC_ACK = "sync:ack"
    SYNC_CONFLICT = "sync:conflict"
    USER_JOINED = "user:joined"
    USER_LEFT = "user:left"
    ERROR = "error"

    # Image generation events
    IMAGE_GENERATING = "image:generating"
    IMAGE_COMPLETED = "image:completed"
    IMAGE_FAILED = "image:failed"


# ============ Base Message ============


class BaseMessage(BaseModel):
    """Base structure for all WebSocket messages"""

    type: MessageType
    message_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ============ Client -> Server Messages ============


class SlideUpdateMessage(BaseMessage):
    """Update a specific slide with partial changes"""

    type: MessageType = MessageType.SLIDE_UPDATE
    slide_id: uuid.UUID
    changes: dict[str, Any]  # Partial update fields
    base_version: int  # For optimistic concurrency control


class SlideCreateMessage(BaseMessage):
    """Create a new slide"""

    type: MessageType = MessageType.SLIDE_CREATE
    position: int
    slide_data: dict[str, Any]
    temp_id: str  # Client-generated temporary ID for tracking


class SlideDeleteMessage(BaseMessage):
    """Delete a slide"""

    type: MessageType = MessageType.SLIDE_DELETE
    slide_id: uuid.UUID
    base_version: int


class SlideReorderMessage(BaseMessage):
    """Reorder slides within a presentation"""

    type: MessageType = MessageType.SLIDE_REORDER
    slide_orders: list[dict[str, Any]]  # [{slide_id, new_position}, ...]


class PresentationUpdateMessage(BaseMessage):
    """Update presentation metadata"""

    type: MessageType = MessageType.PRESENTATION_UPDATE
    changes: dict[str, Any]
    base_version: int


class CursorMoveMessage(BaseMessage):
    """User cursor position for presence awareness"""

    type: MessageType = MessageType.CURSOR_MOVE
    slide_id: uuid.UUID | None = None
    x: float
    y: float


class SelectionChangeMessage(BaseMessage):
    """User selection state for presence awareness"""

    type: MessageType = MessageType.SELECTION_CHANGE
    slide_id: uuid.UUID | None = None
    element_id: str | None = None


# ============ Server -> Client Messages ============


class UserInfo(BaseModel):
    """Basic user info for presence"""

    user_id: uuid.UUID
    name: str | None = None
    avatar_url: str | None = None


class SyncStateMessage(BaseMessage):
    """Full state sync sent on connection"""

    type: MessageType = MessageType.SYNC_STATE
    presentation: dict[str, Any]
    slides: list[dict[str, Any]]
    active_users: list[UserInfo]
    version: int


class SyncAckMessage(BaseMessage):
    """Acknowledgment of a successful operation"""

    type: MessageType = MessageType.SYNC_ACK
    original_message_id: str
    success: bool = True
    new_version: int | None = None
    server_id: uuid.UUID | None = None  # For slide:create - the real server ID


class ConflictType(str, Enum):
    """Types of sync conflicts"""

    VERSION_MISMATCH = "version_mismatch"
    CONCURRENT_EDIT = "concurrent_edit"
    DELETED = "deleted"
    PERMISSION_DENIED = "permission_denied"


class SyncConflictMessage(BaseMessage):
    """Conflict detected during update"""

    type: MessageType = MessageType.SYNC_CONFLICT
    original_message_id: str
    conflict_type: ConflictType
    server_state: dict[str, Any]  # Current server state
    server_version: int


class UserJoinedMessage(BaseMessage):
    """User joined the presentation room"""

    type: MessageType = MessageType.USER_JOINED
    user: UserInfo
    active_users: list[UserInfo]


class UserLeftMessage(BaseMessage):
    """User left the presentation room"""

    type: MessageType = MessageType.USER_LEFT
    user_id: uuid.UUID
    active_users: list[UserInfo]


class ErrorMessage(BaseMessage):
    """Error response"""

    type: MessageType = MessageType.ERROR
    original_message_id: str | None = None
    error_code: str
    error_message: str


class ImageGeneratingMessage(BaseMessage):
    """Image generation started"""

    type: MessageType = MessageType.IMAGE_GENERATING
    slide_id: uuid.UUID
    task_id: str


class ImageCompletedMessage(BaseMessage):
    """Image generation completed"""

    type: MessageType = MessageType.IMAGE_COMPLETED
    slide_id: uuid.UUID
    image_url: str
    image_storage_key: str | None = None


class ImageFailedMessage(BaseMessage):
    """Image generation failed"""

    type: MessageType = MessageType.IMAGE_FAILED
    slide_id: uuid.UUID
    error: str


# ============ Generic Broadcast Message ============


class BroadcastMessage(BaseModel):
    """
    Generic broadcast message wrapper.
    Used for broadcasting updates to other clients.
    """

    type: MessageType
    presentation_id: uuid.UUID
    payload: dict[str, Any]
    triggered_by: uuid.UUID  # User who triggered this update
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ============ WebSocket Connection Request ============


class WebSocketAuthParams(BaseModel):
    """Query parameters for WebSocket authentication"""

    token: str = Field(..., description="JWT access token")

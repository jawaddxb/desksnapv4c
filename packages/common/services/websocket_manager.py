"""
WebSocket Connection Manager
Manages WebSocket connections grouped by presentation (rooms)
Supports horizontal scaling via Redis pub/sub
"""
import asyncio
import json
import logging
from dataclasses import dataclass, field
from typing import Callable, Awaitable
from uuid import UUID

from fastapi import WebSocket
import redis.asyncio as aioredis

from packages.common.core.config import settings

logger = logging.getLogger(__name__)


@dataclass
class UserConnection:
    """Information about a connected user"""
    user_id: UUID
    user_name: str | None = None
    avatar_url: str | None = None


@dataclass
class PresentationRoom:
    """A room for a specific presentation with connected users"""
    presentation_id: UUID
    connections: dict[UUID, WebSocket] = field(default_factory=dict)  # user_id -> websocket
    user_info: dict[UUID, UserConnection] = field(default_factory=dict)  # user_id -> user info

    @property
    def user_ids(self) -> set[UUID]:
        return set(self.connections.keys())

    @property
    def connection_count(self) -> int:
        return len(self.connections)

    def get_active_users(self) -> list[dict]:
        """Get list of active users in this room"""
        return [
            {
                "user_id": str(user_id),
                "name": info.user_name,
                "avatar_url": info.avatar_url,
            }
            for user_id, info in self.user_info.items()
        ]


class ConnectionManager:
    """
    Manages WebSocket connections with Redis pub/sub for horizontal scaling.

    Architecture:
    - Local connections stored in memory (per-instance)
    - Redis pub/sub broadcasts messages to all instances
    - Each instance only sends to its own local connections
    """

    def __init__(self):
        # Local state (per FastAPI instance)
        self.rooms: dict[UUID, PresentationRoom] = {}
        self.user_connections: dict[UUID, set[UUID]] = {}  # user_id -> set of presentation_ids

        # Redis clients
        self.redis_pub: aioredis.Redis | None = None
        self.redis_sub: aioredis.Redis | None = None
        self.pubsub: aioredis.client.PubSub | None = None

        # Background task for listening to Redis
        self._listener_task: asyncio.Task | None = None
        self._is_initialized = False

        # Message handler callback
        self._message_handler: Callable[[UUID, UUID, dict], Awaitable[None]] | None = None

    async def initialize(self):
        """Initialize Redis connections and start listener"""
        if self._is_initialized:
            return

        redis_url = settings.get_redis_url_str()

        self.redis_pub = aioredis.from_url(redis_url, decode_responses=True)
        self.redis_sub = aioredis.from_url(redis_url, decode_responses=True)

        self.pubsub = self.redis_sub.pubsub()

        # Start background listener
        self._listener_task = asyncio.create_task(self._redis_listener())
        self._is_initialized = True

        logger.info("WebSocket connection manager initialized")

    async def shutdown(self):
        """Clean shutdown of Redis connections"""
        if self._listener_task:
            self._listener_task.cancel()
            try:
                await self._listener_task
            except asyncio.CancelledError:
                pass

        if self.pubsub:
            await self.pubsub.close()
        if self.redis_pub:
            await self.redis_pub.close()
        if self.redis_sub:
            await self.redis_sub.close()

        self._is_initialized = False
        logger.info("WebSocket connection manager shut down")

    def set_message_handler(
        self, handler: Callable[[UUID, UUID, dict], Awaitable[None]]
    ):
        """Set the handler for incoming WebSocket messages"""
        self._message_handler = handler

    def _get_channel_name(self, presentation_id: UUID) -> str:
        """Get Redis channel name for a presentation"""
        return f"presentation:{presentation_id}:sync"

    async def connect(
        self,
        websocket: WebSocket,
        presentation_id: UUID,
        user_id: UUID,
        user_name: str | None = None,
        avatar_url: str | None = None,
    ):
        """Accept a new WebSocket connection and join presentation room"""
        await websocket.accept()

        # Create room if doesn't exist
        if presentation_id not in self.rooms:
            self.rooms[presentation_id] = PresentationRoom(presentation_id=presentation_id)
            # Subscribe to Redis channel for this presentation
            channel = self._get_channel_name(presentation_id)
            await self.pubsub.subscribe(channel)

        # Add connection to room
        room = self.rooms[presentation_id]
        room.connections[user_id] = websocket
        room.user_info[user_id] = UserConnection(
            user_id=user_id,
            user_name=user_name,
            avatar_url=avatar_url,
        )

        # Track user's connections
        if user_id not in self.user_connections:
            self.user_connections[user_id] = set()
        self.user_connections[user_id].add(presentation_id)

        # Broadcast join event to other users
        await self.broadcast_to_room(
            presentation_id=presentation_id,
            message={
                "type": "user:joined",
                "user": {
                    "user_id": str(user_id),
                    "name": user_name,
                    "avatar_url": avatar_url,
                },
                "active_users": room.get_active_users(),
            },
            exclude_user_id=user_id,
        )

        logger.info(f"User {user_id} connected to presentation {presentation_id}")

        return room.get_active_users()

    async def disconnect(
        self,
        websocket: WebSocket,
        presentation_id: UUID,
        user_id: UUID,
    ):
        """Handle WebSocket disconnection"""
        if presentation_id in self.rooms:
            room = self.rooms[presentation_id]

            # Remove from room
            if user_id in room.connections:
                del room.connections[user_id]
            if user_id in room.user_info:
                del room.user_info[user_id]

            # Clean up empty rooms
            if room.connection_count == 0:
                del self.rooms[presentation_id]
                # Unsubscribe from Redis channel
                channel = self._get_channel_name(presentation_id)
                await self.pubsub.unsubscribe(channel)
            else:
                # Broadcast leave event
                await self.broadcast_to_room(
                    presentation_id=presentation_id,
                    message={
                        "type": "user:left",
                        "user_id": str(user_id),
                        "active_users": room.get_active_users(),
                    },
                )

        # Clean up user tracking
        if user_id in self.user_connections:
            self.user_connections[user_id].discard(presentation_id)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]

        logger.info(f"User {user_id} disconnected from presentation {presentation_id}")

    async def broadcast_to_room(
        self,
        presentation_id: UUID,
        message: dict,
        exclude_user_id: UUID | None = None,
    ):
        """
        Broadcast message to all users in a presentation room.
        Uses Redis pub/sub for cross-instance broadcasting.
        """
        # Add metadata for routing
        broadcast_message = {
            **message,
            "_presentation_id": str(presentation_id),
        }
        if exclude_user_id:
            broadcast_message["_exclude_user_id"] = str(exclude_user_id)

        # Publish to Redis (all instances will receive)
        channel = self._get_channel_name(presentation_id)
        await self.redis_pub.publish(channel, json.dumps(broadcast_message))

    async def send_to_user(
        self,
        presentation_id: UUID,
        user_id: UUID,
        message: dict,
    ):
        """Send message directly to a specific user"""
        if presentation_id not in self.rooms:
            return

        room = self.rooms[presentation_id]
        if user_id not in room.connections:
            return

        websocket = room.connections[user_id]
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Error sending to user {user_id}: {e}")

    async def _send_to_local_room(
        self,
        presentation_id: UUID,
        message: dict,
        exclude_user_id: UUID | None = None,
    ):
        """Send message to local connections only (called from Redis listener)"""
        if presentation_id not in self.rooms:
            return

        room = self.rooms[presentation_id]
        disconnected_users = []

        for user_id, websocket in room.connections.items():
            if exclude_user_id and user_id == exclude_user_id:
                continue

            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.error(f"Error sending to user {user_id}: {e}")
                disconnected_users.append(user_id)

        # Clean up disconnected users
        for user_id in disconnected_users:
            if user_id in room.connections:
                del room.connections[user_id]
            if user_id in room.user_info:
                del room.user_info[user_id]

    async def _redis_listener(self):
        """Background task listening for Redis pub/sub messages"""
        try:
            async for message in self.pubsub.listen():
                if message["type"] == "message":
                    try:
                        data = json.loads(message["data"])

                        # Extract routing metadata
                        presentation_id = UUID(data.pop("_presentation_id"))
                        exclude_user_id = None
                        if "_exclude_user_id" in data:
                            exclude_user_id = UUID(data.pop("_exclude_user_id"))

                        await self._send_to_local_room(
                            presentation_id=presentation_id,
                            message=data,
                            exclude_user_id=exclude_user_id,
                        )
                    except Exception as e:
                        logger.error(f"Error processing Redis message: {e}")
        except asyncio.CancelledError:
            logger.info("Redis listener cancelled")
            raise

    def get_active_users(self, presentation_id: UUID) -> list[dict]:
        """Get list of users currently in a presentation room"""
        if presentation_id in self.rooms:
            return self.rooms[presentation_id].get_active_users()
        return []

    def is_user_in_room(self, presentation_id: UUID, user_id: UUID) -> bool:
        """Check if a user is in a presentation room"""
        if presentation_id in self.rooms:
            return user_id in self.rooms[presentation_id].connections
        return False


# Singleton instance
connection_manager = ConnectionManager()

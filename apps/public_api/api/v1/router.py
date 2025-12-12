"""
API v1 Router
Aggregates all API v1 endpoints
Follows SOLID-S: Single responsibility (route aggregation)
"""
from fastapi import APIRouter

from apps.public_api.api.v1 import auth, ideations, images, presentations, websocket, debug, rough_drafts, beautify

# Create main API router
api_router = APIRouter()

# Include sub-routers
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(presentations.router, prefix="/presentations", tags=["Presentations"])
api_router.include_router(ideations.router, prefix="/ideations", tags=["Ideations"])
api_router.include_router(rough_drafts.router, prefix="/rough-drafts", tags=["Rough Drafts"])
api_router.include_router(images.router, prefix="/presentations", tags=["Images"])
api_router.include_router(websocket.router, tags=["WebSocket"])
api_router.include_router(debug.router, prefix="/debug", tags=["Debug"])
api_router.include_router(beautify.router, prefix="/beautify", tags=["Beautify"])
# api_router.include_router(templates.router, prefix="/templates", tags=["Templates"])
# api_router.include_router(shares.router, prefix="/shares", tags=["Shares"])
# api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

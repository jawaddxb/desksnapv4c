"""
API v1 Router
Aggregates all API v1 endpoints
Follows SOLID-S: Single responsibility (route aggregation)
"""
from fastapi import APIRouter

from apps.public_api.api.v1 import auth, images, presentations

# Create main API router
api_router = APIRouter()

# Include sub-routers
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(presentations.router, prefix="/presentations", tags=["Presentations"])
api_router.include_router(images.router, prefix="/presentations", tags=["Images"])
# api_router.include_router(templates.router, prefix="/templates", tags=["Templates"])
# api_router.include_router(shares.router, prefix="/shares", tags=["Shares"])
# api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

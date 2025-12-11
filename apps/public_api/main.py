"""
DeckSnap Public API
Main FastAPI application
Follows KISS principle: simple, clear structure
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from packages.common.core.config import settings
from packages.common.core.logging import setup_logging
from packages.common.core.exceptions import ApplicationError
from packages.common.middleware.security import SecurityHeadersMiddleware

# Import API routers
from apps.public_api.api.v1.router import api_router

# Import WebSocket manager for lifecycle management
from packages.common.services.websocket_manager import connection_manager

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan events
    Setup on startup, cleanup on shutdown
    """
    # Startup
    setup_logging()
    print(f"🚀 Starting {settings.app_name} v{settings.app_version}")
    print(f"📝 Environment: {settings.environment}")
    print(f"🔧 Debug mode: {settings.debug}")

    # Initialize WebSocket connection manager (Redis pub/sub)
    await connection_manager.initialize()
    print("🔌 WebSocket connection manager initialized")

    yield

    # Shutdown
    await connection_manager.shutdown()
    print("🔌 WebSocket connection manager shut down")
    print(f"👋 Shutting down {settings.app_name}")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="""
    DeckSnap API - AI-Powered Presentation Generator

    Backend API for DeckSnap, providing:
    - User authentication and authorization
    - Presentation management (CRUD)
    - Template library with thumbnails
    - Document sharing with heatmaps
    - Analytics and viewer tracking

    ## Features

    * **Auth**: Register, login, JWT tokens
    * **Presentations**: Create, read, update, delete presentations
    * **Templates**: Browse and use presentation templates
    * **Sharing**: Share presentations with permissions
    * **Analytics**: Track viewer engagement
    """,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
    debug=settings.debug,
)

# Security headers middleware (should be first to apply to all responses)
app.add_middleware(
    SecurityHeadersMiddleware,
    enable_hsts=settings.environment == "production",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get(
    "/health",
    tags=["Health"],
    summary="Health check",
    description="Check if the API is running",
)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
    }


# Root endpoint
@app.get(
    "/",
    tags=["Root"],
    summary="API Root",
    description="Get API information",
)
async def root():
    """Root endpoint with API information"""
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/health",
        "api": "/api/v1",
    }


# Application error handler (unified for all ApplicationError subclasses)
@app.exception_handler(ApplicationError)
async def application_error_handler(request: Request, exc: ApplicationError):
    """Handle all application-level errors with consistent response format."""
    logger.warning(
        f"Application error [{exc.error_id}]: {exc.error_code} - {exc.message}",
        extra={
            "error_id": exc.error_id,
            "error_code": exc.error_code,
            "status_code": exc.status_code,
            "path": request.url.path,
            "method": request.method,
        },
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.to_dict(),
    )


# Validation error handler (Pydantic validation failures)
@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors with detailed field information."""
    errors = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"] if loc != "body")
        errors.append({
            "field": field,
            "message": error["msg"],
            "type": error["type"],
        })

    return JSONResponse(
        status_code=422,
        content={
            "error_code": "VALIDATION_ERROR",
            "message": "Request validation failed",
            "details": {"errors": errors},
        },
    )


# Global exception handler (catch-all for unexpected errors)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions with error tracking."""
    import uuid

    error_id = str(uuid.uuid4())[:8]

    logger.error(
        f"Unhandled exception [{error_id}]: {type(exc).__name__} - {str(exc)}",
        extra={
            "error_id": error_id,
            "exception_type": type(exc).__name__,
            "path": request.url.path,
            "method": request.method,
        },
        exc_info=True,
    )

    return JSONResponse(
        status_code=500,
        content={
            "error_id": error_id,
            "error_code": "INTERNAL_ERROR",
            "message": "An unexpected error occurred",
            "details": {"exception": str(exc)} if settings.debug else {},
        },
    )


# Include API router
app.include_router(api_router, prefix="/api/v1")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "apps.public_api.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
        log_level=settings.log_level.lower(),
    )

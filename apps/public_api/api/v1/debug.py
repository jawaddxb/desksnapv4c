"""
Debug API Endpoints
For diagnosing data issues - only enabled in development mode
"""
import uuid
from typing import Any

from fastapi import APIRouter, Query
from sqlalchemy import func

from apps.public_api.dependencies import CurrentUser, DbSession
from packages.common.core.config import settings
from packages.common.models.user import User
from packages.common.models.presentation import Presentation
from packages.common.core.exceptions import AuthorizationError

router = APIRouter()


def require_debug_mode():
    """Ensure debug mode is enabled"""
    if not settings.debug:
        raise AuthorizationError(
            message="Debug endpoints are only available in development mode",
        )


@router.get(
    "/me",
    summary="Debug: Current user info",
    description="Get detailed info about the current authenticated user and their presentations",
)
def debug_current_user(
    current_user: CurrentUser,
    db: DbSession,
) -> dict[str, Any]:
    """Get current user's debug info"""
    require_debug_mode()

    # Count user's presentations
    presentation_count = (
        db.query(func.count(Presentation.id))
        .filter(Presentation.owner_id == current_user.id)
        .scalar()
    )

    # Get user's presentations with basic info
    presentations = (
        db.query(Presentation)
        .filter(Presentation.owner_id == current_user.id)
        .order_by(Presentation.updated_at.desc())
        .all()
    )

    return {
        "user": {
            "id": str(current_user.id),
            "email": current_user.email,
            "name": current_user.name,
            "auth_provider": current_user.auth_provider,
            "is_active": current_user.is_active,
            "is_verified": current_user.is_verified,
            "created_at": current_user.created_at.isoformat(),
            "updated_at": current_user.updated_at.isoformat(),
        },
        "presentations": {
            "count": presentation_count,
            "items": [
                {
                    "id": str(p.id),
                    "topic": p.topic,
                    "theme_id": p.theme_id,
                    "slide_count": len(p.slides) if p.slides else 0,
                    "created_at": p.created_at.isoformat(),
                    "updated_at": p.updated_at.isoformat(),
                }
                for p in presentations
            ],
        },
    }


@router.get(
    "/users",
    summary="Debug: List all users",
    description="Get a list of all users in the system (debug only)",
)
def debug_list_users(
    current_user: CurrentUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
) -> dict[str, Any]:
    """List all users with their presentation counts"""
    require_debug_mode()

    # Get total count
    total = db.query(func.count(User.id)).scalar()

    # Get users with pagination
    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    # Get presentation counts for each user
    user_data = []
    for user in users:
        pres_count = (
            db.query(func.count(Presentation.id))
            .filter(Presentation.owner_id == user.id)
            .scalar()
        )
        user_data.append({
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "auth_provider": user.auth_provider,
            "is_active": user.is_active,
            "presentation_count": pres_count,
            "created_at": user.created_at.isoformat(),
            "is_current_user": user.id == current_user.id,
        })

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "current_user_id": str(current_user.id),
        "users": user_data,
    }


@router.get(
    "/presentations",
    summary="Debug: List all presentations",
    description="Get a list of all presentations in the system with owner info (debug only)",
)
def debug_list_presentations(
    current_user: CurrentUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
) -> dict[str, Any]:
    """List all presentations with owner info"""
    require_debug_mode()

    # Get total count
    total = db.query(func.count(Presentation.id)).scalar()

    # Get presentations with pagination
    presentations = (
        db.query(Presentation)
        .order_by(Presentation.updated_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    pres_data = []
    for p in presentations:
        # Get owner info
        owner = db.query(User).filter(User.id == p.owner_id).first()
        pres_data.append({
            "id": str(p.id),
            "topic": p.topic,
            "theme_id": p.theme_id,
            "slide_count": len(p.slides) if p.slides else 0,
            "is_public": p.is_public,
            "created_at": p.created_at.isoformat(),
            "updated_at": p.updated_at.isoformat(),
            "owner": {
                "id": str(owner.id) if owner else None,
                "email": owner.email if owner else "Unknown",
                "is_current_user": owner.id == current_user.id if owner else False,
            },
        })

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "current_user_id": str(current_user.id),
        "presentations": pres_data,
    }


@router.get(
    "/lookup/email/{email}",
    summary="Debug: Lookup user by email",
    description="Find a user by their email address",
)
def debug_lookup_user_by_email(
    email: str,
    current_user: CurrentUser,
    db: DbSession,
) -> dict[str, Any]:
    """Lookup a user by email"""
    require_debug_mode()

    user = db.query(User).filter(User.email == email).first()

    if not user:
        return {
            "found": False,
            "email": email,
            "message": "No user found with this email",
        }

    # Get their presentations
    presentations = (
        db.query(Presentation)
        .filter(Presentation.owner_id == user.id)
        .order_by(Presentation.updated_at.desc())
        .all()
    )

    return {
        "found": True,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "auth_provider": user.auth_provider,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat(),
        },
        "is_current_user": user.id == current_user.id,
        "presentations": [
            {
                "id": str(p.id),
                "topic": p.topic,
                "slide_count": len(p.slides) if p.slides else 0,
                "created_at": p.created_at.isoformat(),
            }
            for p in presentations
        ],
    }


@router.get(
    "/stats",
    summary="Debug: Database statistics",
    description="Get overall database statistics",
)
def debug_stats(
    current_user: CurrentUser,
    db: DbSession,
) -> dict[str, Any]:
    """Get database statistics"""
    require_debug_mode()

    user_count = db.query(func.count(User.id)).scalar()
    presentation_count = db.query(func.count(Presentation.id)).scalar()

    # Users with most presentations
    top_users = (
        db.query(
            User.email,
            User.id,
            func.count(Presentation.id).label("pres_count"),
        )
        .outerjoin(Presentation, Presentation.owner_id == User.id)
        .group_by(User.id)
        .order_by(func.count(Presentation.id).desc())
        .limit(10)
        .all()
    )

    return {
        "totals": {
            "users": user_count,
            "presentations": presentation_count,
        },
        "top_users_by_presentations": [
            {
                "email": u.email,
                "id": str(u.id),
                "presentation_count": u.pres_count,
                "is_current_user": u.id == current_user.id,
            }
            for u in top_users
        ],
        "current_user": {
            "id": str(current_user.id),
            "email": current_user.email,
        },
    }

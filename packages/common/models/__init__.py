"""
Models Package
Import all models here for Alembic to discover them
"""
from packages.common.models.base import Base, BaseModel
from packages.common.models.user import User, AuthProvider
from packages.common.models.presentation import Presentation
from packages.common.models.presentation_version import PresentationVersion
from packages.common.models.slide import Slide

__all__ = [
    "Base",
    "BaseModel",
    "User",
    "AuthProvider",
    "Presentation",
    "PresentationVersion",
    "Slide",
]

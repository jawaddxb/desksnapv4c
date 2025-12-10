"""
Providers Package

Abstract interfaces for external services with pluggable implementations.
Enables dependency injection and easy testing.
"""

from packages.common.providers.base_provider import ImageStorageProvider
from packages.common.providers.provider_factory import get_image_storage_provider

__all__ = [
    "ImageStorageProvider",
    "get_image_storage_provider",
]

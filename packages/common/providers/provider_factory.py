"""
Provider Factory

Factory function to create the appropriate image storage provider
based on configuration settings.
"""

import logging
from typing import Literal

from packages.common.providers.base_provider import ImageStorageProvider
from packages.common.core.config import settings

logger = logging.getLogger(__name__)

StorageProviderType = Literal["s3", "cloudinary", "local"]


def get_image_storage_provider(
    provider_type: StorageProviderType | None = None,
) -> ImageStorageProvider:
    """
    Get an image storage provider based on configuration.

    Uses the following precedence:
    1. Explicit provider_type parameter
    2. STORAGE_PROVIDER environment variable
    3. Auto-detect based on available credentials

    Args:
        provider_type: Explicitly specify provider type

    Returns:
        Configured ImageStorageProvider instance

    Raises:
        ValueError: If no valid provider can be configured
    """
    # Determine provider type
    if provider_type is None:
        provider_type = _detect_provider_type()

    logger.info(f"Initializing image storage provider: {provider_type}")

    if provider_type == "s3":
        return _create_s3_provider()
    elif provider_type == "cloudinary":
        return _create_cloudinary_provider()
    elif provider_type == "local":
        return _create_local_provider()
    else:
        raise ValueError(f"Unknown storage provider type: {provider_type}")


def _detect_provider_type() -> StorageProviderType:
    """
    Auto-detect which provider to use based on available credentials.
    """
    # Check for explicit setting first
    if hasattr(settings, "storage_provider") and settings.storage_provider:
        return settings.storage_provider

    # Check S3 credentials
    if settings.aws_access_key_id and settings.aws_secret_access_key and settings.aws_s3_bucket:
        return "s3"

    # Check Cloudinary credentials
    if (
        settings.cloudinary_cloud_name
        and settings.cloudinary_api_key
        and settings.cloudinary_api_secret
    ):
        return "cloudinary"

    # Default to local storage
    logger.warning("No cloud storage configured, using local storage")
    return "local"


def _create_s3_provider() -> ImageStorageProvider:
    """Create and configure S3 provider."""
    from packages.common.providers.s3_provider import S3Provider

    if not settings.aws_s3_bucket:
        raise ValueError("AWS_S3_BUCKET is required for S3 storage")

    return S3Provider(
        bucket=settings.aws_s3_bucket,
        region=settings.aws_region,
        access_key_id=settings.aws_access_key_id,
        secret_access_key=settings.aws_secret_access_key,
    )


def _create_cloudinary_provider() -> ImageStorageProvider:
    """Create and configure Cloudinary provider."""
    from packages.common.providers.cloudinary_provider import CloudinaryProvider

    if not all(
        [
            settings.cloudinary_cloud_name,
            settings.cloudinary_api_key,
            settings.cloudinary_api_secret,
        ]
    ):
        raise ValueError("Cloudinary credentials are required")

    return CloudinaryProvider(
        cloud_name=settings.cloudinary_cloud_name,
        api_key=settings.cloudinary_api_key,
        api_secret=settings.cloudinary_api_secret,
    )


def _create_local_provider() -> ImageStorageProvider:
    """Create and configure local provider."""
    from packages.common.providers.local_provider import LocalProvider

    return LocalProvider(
        base_path="./uploads",
        base_url="/uploads",
    )

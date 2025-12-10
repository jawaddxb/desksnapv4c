"""
Local Provider

Local filesystem implementation of the ImageStorageProvider interface.
Used for development and testing.
"""

import logging
import os
from pathlib import Path
from typing import BinaryIO

from packages.common.providers.base_provider import ImageStorageProvider
from packages.common.core.exceptions import ExternalServiceError

logger = logging.getLogger(__name__)


class LocalProvider(ImageStorageProvider):
    """
    Local filesystem storage provider.

    Stores images in a local directory. Useful for development and testing.
    """

    def __init__(
        self,
        base_path: str = "./uploads",
        base_url: str = "/uploads",
    ):
        """
        Initialize local provider.

        Args:
            base_path: Local directory to store files
            base_url: Base URL to serve files (requires static file serving)
        """
        self.base_path = Path(base_path)
        self.base_url = base_url.rstrip("/")

        # Create directory if it doesn't exist
        self.base_path.mkdir(parents=True, exist_ok=True)

    async def upload(
        self,
        key: str,
        data: bytes | BinaryIO,
        content_type: str = "image/png",
    ) -> str:
        """Save image to local filesystem."""
        try:
            file_path = self.base_path / key

            # Create parent directories
            file_path.parent.mkdir(parents=True, exist_ok=True)

            # Write data
            if isinstance(data, bytes):
                file_path.write_bytes(data)
            else:
                file_path.write_bytes(data.read())

            url = f"{self.base_url}/{key}"
            logger.info(f"Saved image locally: {key}")
            return url

        except Exception as e:
            logger.error(f"Failed to save locally: {e}")
            raise ExternalServiceError(
                message=f"Failed to save image locally: {str(e)}",
                service_name="local",
            )

    async def delete(self, key: str) -> bool:
        """Delete image from local filesystem."""
        try:
            file_path = self.base_path / key

            if file_path.exists():
                file_path.unlink()
                logger.info(f"Deleted local image: {key}")

                # Clean up empty parent directories
                try:
                    file_path.parent.rmdir()
                except OSError:
                    pass  # Directory not empty

                return True

            return False

        except Exception as e:
            logger.error(f"Failed to delete locally: {e}")
            raise ExternalServiceError(
                message=f"Failed to delete image locally: {str(e)}",
                service_name="local",
            )

    async def get_url(self, key: str) -> str | None:
        """Get URL for a local file."""
        if await self.exists(key):
            return f"{self.base_url}/{key}"
        return None

    async def exists(self, key: str) -> bool:
        """Check if file exists locally."""
        file_path = self.base_path / key
        return file_path.exists()

"""
Cloudinary Provider

Cloudinary implementation of the ImageStorageProvider interface.
"""

import logging
from typing import BinaryIO

from packages.common.providers.base_provider import ImageStorageProvider
from packages.common.core.exceptions import ExternalServiceError

logger = logging.getLogger(__name__)


class CloudinaryProvider(ImageStorageProvider):
    """
    Cloudinary storage provider.

    Requires cloudinary package to be installed.
    """

    def __init__(
        self,
        cloud_name: str,
        api_key: str,
        api_secret: str,
    ):
        """
        Initialize Cloudinary provider.

        Args:
            cloud_name: Cloudinary cloud name
            api_key: Cloudinary API key
            api_secret: Cloudinary API secret
        """
        self.cloud_name = cloud_name

        try:
            import cloudinary
            import cloudinary.uploader
            import cloudinary.api

            cloudinary.config(
                cloud_name=cloud_name,
                api_key=api_key,
                api_secret=api_secret,
                secure=True,
            )

            self.uploader = cloudinary.uploader
            self.api = cloudinary.api
        except ImportError:
            raise ExternalServiceError(
                message="cloudinary is required. Install with: pip install cloudinary",
                service_name="cloudinary",
            )

    async def upload(
        self,
        key: str,
        data: bytes | BinaryIO,
        content_type: str = "image/png",
    ) -> str:
        """Upload image to Cloudinary and return public URL."""
        try:
            # Convert key to Cloudinary public_id (remove extension)
            public_id = key.rsplit(".", 1)[0]

            if isinstance(data, bytes):
                from io import BytesIO

                data = BytesIO(data)

            result = self.uploader.upload(
                data,
                public_id=public_id,
                resource_type="image",
                overwrite=True,
            )

            url = result["secure_url"]
            logger.info(f"Uploaded image to Cloudinary: {key}")
            return url

        except Exception as e:
            logger.error(f"Failed to upload to Cloudinary: {e}")
            raise ExternalServiceError(
                message=f"Failed to upload image to Cloudinary: {str(e)}",
                service_name="cloudinary",
            )

    async def delete(self, key: str) -> bool:
        """Delete image from Cloudinary."""
        try:
            # Convert key to Cloudinary public_id
            public_id = key.rsplit(".", 1)[0]

            result = self.uploader.destroy(public_id)
            deleted = result.get("result") == "ok"

            if deleted:
                logger.info(f"Deleted image from Cloudinary: {key}")

            return deleted

        except Exception as e:
            logger.error(f"Failed to delete from Cloudinary: {e}")
            raise ExternalServiceError(
                message=f"Failed to delete image from Cloudinary: {str(e)}",
                service_name="cloudinary",
            )

    async def get_url(self, key: str) -> str | None:
        """Get public URL for a Cloudinary image."""
        try:
            import cloudinary

            public_id = key.rsplit(".", 1)[0]
            url, _options = cloudinary.utils.cloudinary_url(public_id, secure=True)
            return url
        except Exception:
            return None

    async def exists(self, key: str) -> bool:
        """Check if image exists in Cloudinary."""
        try:
            public_id = key.rsplit(".", 1)[0]
            self.api.resource(public_id)
            return True
        except Exception:
            return False

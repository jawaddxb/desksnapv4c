"""
Base Provider Interface

Abstract base class for image storage providers.
Implementations must inherit from this and implement all abstract methods.
"""

from abc import ABC, abstractmethod
from typing import BinaryIO


class ImageStorageProvider(ABC):
    """
    Abstract base class for image storage providers.

    Implementations include:
    - S3Provider: AWS S3 storage
    - CloudinaryProvider: Cloudinary CDN storage
    - LocalProvider: Local filesystem storage (for development)
    """

    @abstractmethod
    async def upload(
        self,
        key: str,
        data: bytes | BinaryIO,
        content_type: str = "image/png",
    ) -> str:
        """
        Upload an image and return its public URL.

        Args:
            key: Unique identifier for the image (e.g., "presentations/uuid/slide-1.png")
            data: Image data as bytes or file-like object
            content_type: MIME type of the image

        Returns:
            Public URL of the uploaded image

        Raises:
            ExternalServiceError: If upload fails
        """
        pass

    @abstractmethod
    async def delete(self, key: str) -> bool:
        """
        Delete an image by key.

        Args:
            key: The key/path of the image to delete

        Returns:
            True if deleted successfully, False if not found

        Raises:
            ExternalServiceError: If deletion fails
        """
        pass

    @abstractmethod
    async def get_url(self, key: str) -> str | None:
        """
        Get the public URL for an existing image.

        Args:
            key: The key/path of the image

        Returns:
            Public URL if image exists, None otherwise
        """
        pass

    @abstractmethod
    async def exists(self, key: str) -> bool:
        """
        Check if an image exists.

        Args:
            key: The key/path of the image

        Returns:
            True if image exists, False otherwise
        """
        pass

    def generate_key(self, presentation_id: str, slide_index: int, extension: str = "png") -> str:
        """
        Generate a storage key for a slide image.

        Args:
            presentation_id: UUID of the presentation
            slide_index: Index of the slide (0-based)
            extension: File extension (default: png)

        Returns:
            Storage key like "presentations/abc123/slide-0.png"
        """
        return f"presentations/{presentation_id}/slide-{slide_index}.{extension}"

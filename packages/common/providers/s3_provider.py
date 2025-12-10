"""
S3 Provider

AWS S3 implementation of the ImageStorageProvider interface.
"""

import logging
from typing import BinaryIO

from packages.common.providers.base_provider import ImageStorageProvider
from packages.common.core.exceptions import ExternalServiceError

logger = logging.getLogger(__name__)


class S3Provider(ImageStorageProvider):
    """
    AWS S3 storage provider.

    Requires boto3 to be installed and AWS credentials configured.
    """

    def __init__(
        self,
        bucket: str,
        region: str = "us-east-1",
        access_key_id: str | None = None,
        secret_access_key: str | None = None,
    ):
        """
        Initialize S3 provider.

        Args:
            bucket: S3 bucket name
            region: AWS region
            access_key_id: AWS access key (optional, uses env/IAM role if not provided)
            secret_access_key: AWS secret key (optional, uses env/IAM role if not provided)
        """
        self.bucket = bucket
        self.region = region

        try:
            import boto3

            client_kwargs = {"region_name": region}
            if access_key_id and secret_access_key:
                client_kwargs["aws_access_key_id"] = access_key_id
                client_kwargs["aws_secret_access_key"] = secret_access_key

            self.client = boto3.client("s3", **client_kwargs)
            self.base_url = f"https://{bucket}.s3.{region}.amazonaws.com"
        except ImportError:
            raise ExternalServiceError(
                message="boto3 is required for S3 storage. Install with: pip install boto3",
                service_name="s3",
            )

    async def upload(
        self,
        key: str,
        data: bytes | BinaryIO,
        content_type: str = "image/png",
    ) -> str:
        """Upload image to S3 and return public URL."""
        try:
            if isinstance(data, bytes):
                from io import BytesIO

                data = BytesIO(data)

            self.client.upload_fileobj(
                data,
                self.bucket,
                key,
                ExtraArgs={
                    "ContentType": content_type,
                    "ACL": "public-read",
                },
            )

            url = f"{self.base_url}/{key}"
            logger.info(f"Uploaded image to S3: {key}")
            return url

        except Exception as e:
            logger.error(f"Failed to upload to S3: {e}")
            raise ExternalServiceError(
                message=f"Failed to upload image to S3: {str(e)}",
                service_name="s3",
            )

    async def delete(self, key: str) -> bool:
        """Delete image from S3."""
        try:
            self.client.delete_object(Bucket=self.bucket, Key=key)
            logger.info(f"Deleted image from S3: {key}")
            return True
        except self.client.exceptions.NoSuchKey:
            return False
        except Exception as e:
            logger.error(f"Failed to delete from S3: {e}")
            raise ExternalServiceError(
                message=f"Failed to delete image from S3: {str(e)}",
                service_name="s3",
            )

    async def get_url(self, key: str) -> str | None:
        """Get public URL for an S3 object."""
        if await self.exists(key):
            return f"{self.base_url}/{key}"
        return None

    async def exists(self, key: str) -> bool:
        """Check if object exists in S3."""
        try:
            self.client.head_object(Bucket=self.bucket, Key=key)
            return True
        except self.client.exceptions.ClientError as e:
            if e.response["Error"]["Code"] == "404":
                return False
            raise ExternalServiceError(
                message=f"Failed to check S3 object: {str(e)}",
                service_name="s3",
            )

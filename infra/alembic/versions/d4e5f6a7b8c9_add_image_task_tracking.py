"""add image task tracking

Revision ID: d4e5f6a7b8c9
Revises: c3c6c9ac6005
Create Date: 2025-12-10

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "d4e5f6a7b8c9"
down_revision: str | None = "c3c6c9ac6005"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Add task tracking fields to slides table
    op.add_column("slides", sa.Column("image_task_id", sa.String(255), nullable=True))
    op.add_column("slides", sa.Column("image_storage_key", sa.String(500), nullable=True))

    # Change image_url from String(500) to Text for longer CDN URLs
    op.alter_column(
        "slides",
        "image_url",
        existing_type=sa.String(500),
        type_=sa.Text(),
        existing_nullable=True,
    )

    # Index for efficient task lookups
    op.create_index("ix_slides_image_task_id", "slides", ["image_task_id"])


def downgrade() -> None:
    op.drop_index("ix_slides_image_task_id", table_name="slides")

    # Revert image_url back to String(500)
    op.alter_column(
        "slides",
        "image_url",
        existing_type=sa.Text(),
        type_=sa.String(500),
        existing_nullable=True,
    )

    op.drop_column("slides", "image_storage_key")
    op.drop_column("slides", "image_task_id")

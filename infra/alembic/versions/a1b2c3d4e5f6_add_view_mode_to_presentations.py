"""add_view_mode_to_presentations

Revision ID: a1b2c3d4e5f6
Revises: f6d037f842c0
Create Date: 2025-12-11

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = 'f6d037f842c0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add view_mode column to presentations table
    # Default to 'standard' for existing presentations
    op.add_column(
        'presentations',
        sa.Column('view_mode', sa.String(20), nullable=True, server_default='standard')
    )


def downgrade() -> None:
    op.drop_column('presentations', 'view_mode')

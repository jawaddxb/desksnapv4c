"""add presentation versions

Revision ID: g7h8i9j0k1l2
Revises: a1b2c3d4e5f6
Create Date: 2025-12-11

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'g7h8i9j0k1l2'
down_revision: Union[str, None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('presentation_versions',
        sa.Column('presentation_id', sa.UUID(), nullable=False),
        sa.Column('version_number', sa.Integer(), nullable=False),
        sa.Column('label', sa.String(length=255), nullable=True),
        sa.Column('thumbnail_url', sa.String(length=500), nullable=True),
        sa.Column('snapshot', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['presentation_id'], ['presentations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('presentation_id', 'version_number', name='uq_presentation_version')
    )
    op.create_index(op.f('ix_presentation_versions_id'), 'presentation_versions', ['id'], unique=False)
    op.create_index(op.f('ix_presentation_versions_presentation_id'), 'presentation_versions', ['presentation_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_presentation_versions_presentation_id'), table_name='presentation_versions')
    op.drop_index(op.f('ix_presentation_versions_id'), table_name='presentation_versions')
    op.drop_table('presentation_versions')

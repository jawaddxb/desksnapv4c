"""add beautify sessions

Revision ID: j0k1l2m3n4o5
Revises: i9j0k1l2m3n4
Create Date: 2025-12-12

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'j0k1l2m3n4o5'
down_revision: Union[str, None] = 'i9j0k1l2m3n4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create beautify_sessions table
    op.create_table('beautify_sessions',
        sa.Column('owner_id', sa.UUID(), nullable=False),
        sa.Column('file_name', sa.String(length=500), nullable=False),
        sa.Column('file_size', sa.Integer(), nullable=False),
        sa.Column('original_file_key', sa.String(length=500), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('progress', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('overall_mess_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('slides_data', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('theme_id', sa.String(length=100), nullable=True),
        sa.Column('intensity', sa.String(length=50), nullable=True),
        sa.Column('transformed_slides', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('share_id', sa.String(length=100), nullable=True),
        sa.Column('is_public', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_beautify_sessions_id'), 'beautify_sessions', ['id'], unique=False)
    op.create_index(op.f('ix_beautify_sessions_owner_id'), 'beautify_sessions', ['owner_id'], unique=False)
    op.create_index(op.f('ix_beautify_sessions_share_id'), 'beautify_sessions', ['share_id'], unique=True)


def downgrade() -> None:
    # Drop beautify_sessions
    op.drop_index(op.f('ix_beautify_sessions_share_id'), table_name='beautify_sessions')
    op.drop_index(op.f('ix_beautify_sessions_owner_id'), table_name='beautify_sessions')
    op.drop_index(op.f('ix_beautify_sessions_id'), table_name='beautify_sessions')
    op.drop_table('beautify_sessions')

"""add rough drafts

Revision ID: i9j0k1l2m3n4
Revises: h8i9j0k1l2m3
Create Date: 2025-12-12

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'i9j0k1l2m3n4'
down_revision: Union[str, None] = 'h8i9j0k1l2m3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create rough_drafts table
    op.create_table('rough_drafts',
        sa.Column('owner_id', sa.UUID(), nullable=False),
        sa.Column('ideation_session_id', sa.UUID(), nullable=True),
        sa.Column('presentation_id', sa.UUID(), nullable=True),
        sa.Column('topic', sa.String(length=500), nullable=False),
        sa.Column('theme_id', sa.String(length=100), nullable=False),
        sa.Column('visual_style', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['ideation_session_id'], ['ideation_sessions.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['presentation_id'], ['presentations.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_rough_drafts_id'), 'rough_drafts', ['id'], unique=False)
    op.create_index(op.f('ix_rough_drafts_owner_id'), 'rough_drafts', ['owner_id'], unique=False)
    op.create_index(op.f('ix_rough_drafts_ideation_session_id'), 'rough_drafts', ['ideation_session_id'], unique=False)
    op.create_index(op.f('ix_rough_drafts_presentation_id'), 'rough_drafts', ['presentation_id'], unique=False)

    # Create rough_draft_slides table
    op.create_table('rough_draft_slides',
        sa.Column('rough_draft_id', sa.UUID(), nullable=False),
        sa.Column('position', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=500), nullable=True),
        sa.Column('content', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('speaker_notes', sa.Text(), nullable=True),
        sa.Column('image_prompt', sa.Text(), nullable=True),
        sa.Column('image_url', sa.Text(), nullable=True),
        sa.Column('layout_type', sa.String(length=50), nullable=True),
        sa.Column('alignment', sa.String(length=20), nullable=True),
        sa.Column('approval_state', sa.String(length=20), nullable=False),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['rough_draft_id'], ['rough_drafts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_rough_draft_slides_id'), 'rough_draft_slides', ['id'], unique=False)
    op.create_index(op.f('ix_rough_draft_slides_rough_draft_id'), 'rough_draft_slides', ['rough_draft_id'], unique=False)

    # Add source references to presentations table
    op.add_column('presentations', sa.Column('ideation_session_id', sa.UUID(), nullable=True))
    op.add_column('presentations', sa.Column('source_rough_draft_id', sa.UUID(), nullable=True))
    op.create_foreign_key(
        'fk_presentations_ideation_session_id',
        'presentations', 'ideation_sessions',
        ['ideation_session_id'], ['id'],
        ondelete='SET NULL'
    )
    op.create_foreign_key(
        'fk_presentations_source_rough_draft_id',
        'presentations', 'rough_drafts',
        ['source_rough_draft_id'], ['id'],
        ondelete='SET NULL'
    )
    op.create_index(op.f('ix_presentations_ideation_session_id'), 'presentations', ['ideation_session_id'], unique=False)
    op.create_index(op.f('ix_presentations_source_rough_draft_id'), 'presentations', ['source_rough_draft_id'], unique=False)


def downgrade() -> None:
    # Remove source references from presentations table
    op.drop_index(op.f('ix_presentations_source_rough_draft_id'), table_name='presentations')
    op.drop_index(op.f('ix_presentations_ideation_session_id'), table_name='presentations')
    op.drop_constraint('fk_presentations_source_rough_draft_id', 'presentations', type_='foreignkey')
    op.drop_constraint('fk_presentations_ideation_session_id', 'presentations', type_='foreignkey')
    op.drop_column('presentations', 'source_rough_draft_id')
    op.drop_column('presentations', 'ideation_session_id')

    # Drop rough_draft_slides
    op.drop_index(op.f('ix_rough_draft_slides_rough_draft_id'), table_name='rough_draft_slides')
    op.drop_index(op.f('ix_rough_draft_slides_id'), table_name='rough_draft_slides')
    op.drop_table('rough_draft_slides')

    # Drop rough_drafts
    op.drop_index(op.f('ix_rough_drafts_presentation_id'), table_name='rough_drafts')
    op.drop_index(op.f('ix_rough_drafts_ideation_session_id'), table_name='rough_drafts')
    op.drop_index(op.f('ix_rough_drafts_owner_id'), table_name='rough_drafts')
    op.drop_index(op.f('ix_rough_drafts_id'), table_name='rough_drafts')
    op.drop_table('rough_drafts')

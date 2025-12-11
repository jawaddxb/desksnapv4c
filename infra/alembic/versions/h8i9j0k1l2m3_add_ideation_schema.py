"""add ideation schema

Revision ID: h8i9j0k1l2m3
Revises: g7h8i9j0k1l2
Create Date: 2025-12-11

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = 'h8i9j0k1l2m3'
down_revision: Union[str, None] = 'g7h8i9j0k1l2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create ideation_sessions table
    op.create_table('ideation_sessions',
        sa.Column('owner_id', sa.UUID(), nullable=False),
        sa.Column('topic', sa.String(length=500), nullable=False),
        sa.Column('stage', sa.String(length=50), nullable=False),
        sa.Column('source_content', sa.Text(), nullable=True),
        sa.Column('archetype', sa.String(length=100), nullable=True),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ideation_sessions_id'), 'ideation_sessions', ['id'], unique=False)
    op.create_index(op.f('ix_ideation_sessions_owner_id'), 'ideation_sessions', ['owner_id'], unique=False)

    # Create idea_notes table
    op.create_table('idea_notes',
        sa.Column('session_id', sa.UUID(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('note_type', sa.String(length=50), nullable=False),
        sa.Column('source_url', sa.String(length=1000), nullable=True),
        sa.Column('parent_id', sa.String(length=100), nullable=True),
        sa.Column('column_index', sa.Integer(), nullable=False),
        sa.Column('row_index', sa.Integer(), nullable=False),
        sa.Column('color', sa.String(length=50), nullable=True),
        sa.Column('approved', sa.Boolean(), nullable=False),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['session_id'], ['ideation_sessions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_idea_notes_id'), 'idea_notes', ['id'], unique=False)
    op.create_index(op.f('ix_idea_notes_session_id'), 'idea_notes', ['session_id'], unique=False)

    # Create note_connections table
    op.create_table('note_connections',
        sa.Column('session_id', sa.UUID(), nullable=False),
        sa.Column('from_note_id', sa.String(length=100), nullable=False),
        sa.Column('to_note_id', sa.String(length=100), nullable=False),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['session_id'], ['ideation_sessions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_note_connections_id'), 'note_connections', ['id'], unique=False)
    op.create_index(op.f('ix_note_connections_session_id'), 'note_connections', ['session_id'], unique=False)

    # Create ideation_journal_entries table
    op.create_table('ideation_journal_entries',
        sa.Column('session_id', sa.UUID(), nullable=False),
        sa.Column('stage', sa.String(length=50), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('narrative', sa.Text(), nullable=False),
        sa.Column('decision', sa.Text(), nullable=True),
        sa.Column('confidence', sa.Integer(), nullable=True),
        sa.Column('related_note_ids', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('related_slide_ids', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['session_id'], ['ideation_sessions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ideation_journal_entries_id'), 'ideation_journal_entries', ['id'], unique=False)
    op.create_index(op.f('ix_ideation_journal_entries_session_id'), 'ideation_journal_entries', ['session_id'], unique=False)


def downgrade() -> None:
    # Drop ideation_journal_entries
    op.drop_index(op.f('ix_ideation_journal_entries_session_id'), table_name='ideation_journal_entries')
    op.drop_index(op.f('ix_ideation_journal_entries_id'), table_name='ideation_journal_entries')
    op.drop_table('ideation_journal_entries')

    # Drop note_connections
    op.drop_index(op.f('ix_note_connections_session_id'), table_name='note_connections')
    op.drop_index(op.f('ix_note_connections_id'), table_name='note_connections')
    op.drop_table('note_connections')

    # Drop idea_notes
    op.drop_index(op.f('ix_idea_notes_session_id'), table_name='idea_notes')
    op.drop_index(op.f('ix_idea_notes_id'), table_name='idea_notes')
    op.drop_table('idea_notes')

    # Drop ideation_sessions
    op.drop_index(op.f('ix_ideation_sessions_owner_id'), table_name='ideation_sessions')
    op.drop_index(op.f('ix_ideation_sessions_id'), table_name='ideation_sessions')
    op.drop_table('ideation_sessions')

"""
Ideations API Endpoints
CRUD operations for ideation sessions
"""
import uuid

from fastapi import APIRouter, Query, status
from sqlalchemy.orm import selectinload

from apps.public_api.dependencies import CurrentUser, DbSession
from packages.common.schemas.ideation import (
    IdeationSessionCreate,
    IdeationSessionUpdate,
    IdeationSessionResponse,
    IdeationSessionDetailResponse,
    IdeationSessionListResponse,
    IdeaNoteCreate,
    IdeaNoteUpdate,
    IdeaNoteResponse,
    NoteConnectionCreate,
    NoteConnectionResponse,
    JournalEntryCreate,
    JournalEntryResponse,
)
from packages.common.schemas.auth import MessageResponse
from packages.common.models.ideation import (
    IdeationSession,
    IdeaNote,
    NoteConnection,
    IdeationJournalEntry,
)
from packages.common.core.exceptions import NotFoundError, AuthorizationError

router = APIRouter()


# Helper functions
def get_session_by_id(db, session_id: uuid.UUID) -> IdeationSession:
    """Get a session by ID or raise NotFoundError"""
    session = db.query(IdeationSession).filter(IdeationSession.id == session_id).first()
    if not session:
        raise NotFoundError(
            message="Ideation session not found",
            resource_type="IdeationSession",
            resource_id=str(session_id),
        )
    return session


def require_session_ownership(session: IdeationSession, user) -> IdeationSession:
    """Verify user owns the session or raise AuthorizationError"""
    if session.owner_id != user.id:
        raise AuthorizationError("You do not have access to this session")
    return session


# Session CRUD

def _serialize_note(note: IdeaNote) -> dict:
    """Manually serialize a note to ensure all fields are properly converted"""
    return {
        "id": note.id,
        "session_id": note.session_id,
        "content": note.content,
        "type": note.note_type,  # Map note_type -> type (alias)
        "source_url": note.source_url,
        "parent_id": note.parent_id,
        "column": note.column_index,  # Map column_index -> column (alias)
        "row": note.row_index,  # Map row_index -> row (alias)
        "color": note.color,
        "approved": note.approved,
        "created_at": note.created_at,
        "updated_at": note.updated_at,
    }


def _serialize_session_with_notes(session: IdeationSession) -> dict:
    """Manually serialize a session with its notes for list display"""
    return {
        "id": session.id,
        "owner_id": session.owner_id,
        "topic": session.topic,
        "stage": session.stage,
        "source_content": session.source_content,
        "archetype": session.archetype,
        "created_at": session.created_at,
        "updated_at": session.updated_at,
        "notes": [_serialize_note(n) for n in session.notes],
    }


@router.get(
    "",
    response_model=IdeationSessionListResponse,
    summary="List ideation sessions",
    description="Get all ideation sessions for the current user",
)
def list_sessions(
    current_user: CurrentUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
) -> IdeationSessionListResponse:
    """List user's ideation sessions with pagination"""
    # Use selectinload to eager-load notes for display in dashboard cards
    query = db.query(IdeationSession).options(
        selectinload(IdeationSession.notes)
    ).filter(
        IdeationSession.owner_id == current_user.id
    ).order_by(IdeationSession.updated_at.desc())

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    pages = (total + page_size - 1) // page_size if page_size > 0 else 0

    # Manually serialize to ensure notes are properly included
    # (Pydantic v2 model_validate may not handle SQLAlchemy relationships correctly)
    response_items = [
        IdeationSessionResponse.model_validate(_serialize_session_with_notes(s))
        for s in items
    ]

    return IdeationSessionListResponse(
        items=response_items,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages,
    )


@router.post(
    "",
    response_model=IdeationSessionDetailResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create ideation session",
    description="Create a new ideation session with optional notes",
)
def create_session(
    data: IdeationSessionCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> IdeationSessionDetailResponse:
    """Create a new ideation session"""
    # Create session
    session = IdeationSession(
        owner_id=current_user.id,
        topic=data.topic,
        stage=data.stage,
        source_content=data.source_content,
        archetype=data.archetype,
    )
    db.add(session)
    db.flush()  # Get the ID

    # Add notes if provided
    for note_data in data.notes:
        note = IdeaNote(
            session_id=session.id,
            content=note_data.content,
            note_type=note_data.note_type,
            source_url=note_data.source_url,
            parent_id=note_data.parent_id,
            column_index=note_data.column_index,
            row_index=note_data.row_index,
            color=note_data.color,
            approved=note_data.approved,
        )
        db.add(note)

    # Add connections if provided
    for conn_data in data.connections:
        conn = NoteConnection(
            session_id=session.id,
            from_note_id=conn_data.from_note_id,
            to_note_id=conn_data.to_note_id,
        )
        db.add(conn)

    # Add journal entries if provided
    for entry_data in data.journal_entries:
        entry = IdeationJournalEntry(
            session_id=session.id,
            stage=entry_data.stage,
            title=entry_data.title,
            narrative=entry_data.narrative,
            decision=entry_data.decision,
            confidence=entry_data.confidence,
            related_note_ids=entry_data.related_note_ids,
            related_slide_ids=entry_data.related_slide_ids,
        )
        db.add(entry)

    db.commit()
    db.refresh(session)
    return IdeationSessionDetailResponse.model_validate(session)


@router.get(
    "/{session_id}",
    response_model=IdeationSessionDetailResponse,
    summary="Get ideation session",
    description="Get an ideation session by ID with all notes and connections",
)
def get_session(
    session_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> IdeationSessionDetailResponse:
    """Get an ideation session with all nested data"""
    session = get_session_by_id(db, session_id)
    session = require_session_ownership(session, current_user)
    return IdeationSessionDetailResponse.model_validate(session)


@router.put(
    "/{session_id}",
    response_model=IdeationSessionDetailResponse,
    summary="Update ideation session",
    description="Update ideation session metadata and notes",
)
def update_session(
    session_id: uuid.UUID,
    data: IdeationSessionUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> IdeationSessionDetailResponse:
    """Update an ideation session"""
    session = get_session_by_id(db, session_id)
    session = require_session_ownership(session, current_user)

    # Update metadata fields
    if data.topic is not None:
        session.topic = data.topic
    if data.stage is not None:
        session.stage = data.stage
    if data.source_content is not None:
        session.source_content = data.source_content
    if data.archetype is not None:
        session.archetype = data.archetype

    # Handle notes (replace all)
    if data.notes is not None:
        # Delete existing notes
        db.query(IdeaNote).filter(IdeaNote.session_id == session_id).delete()
        # Add new notes
        for note_data in data.notes:
            note = IdeaNote(
                session_id=session.id,
                content=note_data.content,
                note_type=note_data.note_type,
                column_index=note_data.column_index,
                row_index=note_data.row_index,
                color=note_data.color,
                approved=note_data.approved,
                source_url=note_data.source_url,
                parent_id=note_data.parent_id,
            )
            db.add(note)

    # Handle connections (replace all)
    if data.connections is not None:
        db.query(NoteConnection).filter(NoteConnection.session_id == session_id).delete()
        for conn_data in data.connections:
            conn = NoteConnection(
                session_id=session.id,
                from_note_id=conn_data.from_note_id,
                to_note_id=conn_data.to_note_id,
            )
            db.add(conn)

    db.commit()
    db.refresh(session)
    return IdeationSessionDetailResponse.model_validate(session)


@router.delete(
    "/{session_id}",
    response_model=MessageResponse,
    summary="Delete ideation session",
    description="Delete an ideation session and all its notes",
)
def delete_session(
    session_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> MessageResponse:
    """Delete an ideation session"""
    session = get_session_by_id(db, session_id)
    session = require_session_ownership(session, current_user)
    db.delete(session)
    db.commit()
    return MessageResponse(message="Ideation session deleted successfully")


# Notes endpoints
@router.post(
    "/{session_id}/notes",
    response_model=IdeaNoteResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add note",
    description="Add a new note to an ideation session",
)
def add_note(
    session_id: uuid.UUID,
    data: IdeaNoteCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> IdeaNoteResponse:
    """Add a note to a session"""
    session = get_session_by_id(db, session_id)
    session = require_session_ownership(session, current_user)

    note = IdeaNote(
        session_id=session.id,
        content=data.content,
        note_type=data.note_type,
        source_url=data.source_url,
        parent_id=data.parent_id,
        column_index=data.column_index,
        row_index=data.row_index,
        color=data.color,
        approved=data.approved,
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return IdeaNoteResponse.model_validate(note)


@router.put(
    "/{session_id}/notes/{note_id}",
    response_model=IdeaNoteResponse,
    summary="Update note",
    description="Update an existing note",
)
def update_note(
    session_id: uuid.UUID,
    note_id: uuid.UUID,
    data: IdeaNoteUpdate,
    current_user: CurrentUser,
    db: DbSession,
) -> IdeaNoteResponse:
    """Update a note"""
    session = get_session_by_id(db, session_id)
    session = require_session_ownership(session, current_user)

    note = db.query(IdeaNote).filter(
        IdeaNote.id == note_id,
        IdeaNote.session_id == session_id,
    ).first()
    if not note:
        raise NotFoundError(
            message="Note not found",
            resource_type="IdeaNote",
            resource_id=str(note_id),
        )

    # Update fields
    if data.content is not None:
        note.content = data.content
    if data.note_type is not None:
        note.note_type = data.note_type
    if data.source_url is not None:
        note.source_url = data.source_url
    if data.parent_id is not None:
        note.parent_id = data.parent_id
    if data.column_index is not None:
        note.column_index = data.column_index
    if data.row_index is not None:
        note.row_index = data.row_index
    if data.color is not None:
        note.color = data.color
    if data.approved is not None:
        note.approved = data.approved

    db.commit()
    db.refresh(note)
    return IdeaNoteResponse.model_validate(note)


@router.delete(
    "/{session_id}/notes/{note_id}",
    response_model=MessageResponse,
    summary="Delete note",
    description="Delete a note from an ideation session",
)
def delete_note(
    session_id: uuid.UUID,
    note_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> MessageResponse:
    """Delete a note"""
    session = get_session_by_id(db, session_id)
    session = require_session_ownership(session, current_user)

    note = db.query(IdeaNote).filter(
        IdeaNote.id == note_id,
        IdeaNote.session_id == session_id,
    ).first()
    if not note:
        raise NotFoundError(
            message="Note not found",
            resource_type="IdeaNote",
            resource_id=str(note_id),
        )

    db.delete(note)
    db.commit()
    return MessageResponse(message="Note deleted successfully")


# Connections endpoints
@router.post(
    "/{session_id}/connections",
    response_model=NoteConnectionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add connection",
    description="Add a connection between two notes",
)
def add_connection(
    session_id: uuid.UUID,
    data: NoteConnectionCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> NoteConnectionResponse:
    """Add a connection between notes"""
    session = get_session_by_id(db, session_id)
    session = require_session_ownership(session, current_user)

    conn = NoteConnection(
        session_id=session.id,
        from_note_id=data.from_note_id,
        to_note_id=data.to_note_id,
    )
    db.add(conn)
    db.commit()
    db.refresh(conn)
    return NoteConnectionResponse.model_validate(conn)


@router.delete(
    "/{session_id}/connections/{connection_id}",
    response_model=MessageResponse,
    summary="Delete connection",
    description="Delete a connection between notes",
)
def delete_connection(
    session_id: uuid.UUID,
    connection_id: uuid.UUID,
    current_user: CurrentUser,
    db: DbSession,
) -> MessageResponse:
    """Delete a connection"""
    session = get_session_by_id(db, session_id)
    session = require_session_ownership(session, current_user)

    conn = db.query(NoteConnection).filter(
        NoteConnection.id == connection_id,
        NoteConnection.session_id == session_id,
    ).first()
    if not conn:
        raise NotFoundError(
            message="Connection not found",
            resource_type="NoteConnection",
            resource_id=str(connection_id),
        )

    db.delete(conn)
    db.commit()
    return MessageResponse(message="Connection deleted successfully")


# Journal endpoints
@router.post(
    "/{session_id}/journal",
    response_model=JournalEntryResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add journal entry",
    description="Add a journal entry to an ideation session",
)
def add_journal_entry(
    session_id: uuid.UUID,
    data: JournalEntryCreate,
    current_user: CurrentUser,
    db: DbSession,
) -> JournalEntryResponse:
    """Add a journal entry to a session"""
    session = get_session_by_id(db, session_id)
    session = require_session_ownership(session, current_user)

    entry = IdeationJournalEntry(
        session_id=session.id,
        stage=data.stage,
        title=data.title,
        narrative=data.narrative,
        decision=data.decision,
        confidence=data.confidence,
        related_note_ids=data.related_note_ids,
        related_slide_ids=data.related_slide_ids,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return JournalEntryResponse.model_validate(entry)

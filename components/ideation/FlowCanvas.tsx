/**
 * FlowCanvas Component
 *
 * The main ideation canvas with 5 swimlane columns.
 * Renders notes in a flowchart layout with connectors.
 */

import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { IdeaNote, NoteConnection, COLUMNS, ColumnName } from '../../types/ideation';
import { StickyNote } from './StickyNote';
import { ConnectorLayer } from './ConnectorLayer';
import { ColumnHeader } from './ColumnHeader';

interface FlowCanvasProps {
  notes: IdeaNote[];
  connections: NoteConnection[];
  selectedNoteId?: string | null;
  onSelectNote?: (noteId: string | null) => void;
  onUpdateNote?: (noteId: string, updates: Partial<IdeaNote>) => void;
  onDeleteNote?: (noteId: string) => void;
  onMoveNote?: (noteId: string, column: number, row: number) => void;
  onAddNote?: (column: number) => void;
}

// Note dimensions for layout calculation
const NOTE_WIDTH = 176; // w-44 = 11rem = 176px
const NOTE_HEIGHT = 120; // min-h-[100px] + padding
const NOTE_GAP = 16;
const COLUMN_GAP = 24;
const HEADER_HEIGHT = 80;

export const FlowCanvas: React.FC<FlowCanvasProps> = ({
  notes,
  connections,
  selectedNoteId,
  onSelectNote,
  onUpdateNote,
  onDeleteNote,
  onMoveNote,
  onAddNote,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [notePositions, setNotePositions] = useState<Map<string, { x: number; y: number; width: number; height: number }>>(new Map());
  const [draggedNoteId, setDraggedNoteId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<number | null>(null);

  // Group notes by column
  const notesByColumn = useMemo(() => {
    const grouped: IdeaNote[][] = COLUMNS.map(() => []);
    notes.forEach(note => {
      if (note.column >= 0 && note.column < COLUMNS.length) {
        grouped[note.column].push(note);
      }
    });
    // Sort by row within each column
    grouped.forEach(columnNotes => {
      columnNotes.sort((a, b) => a.row - b.row);
    });
    return grouped;
  }, [notes]);

  // Calculate note positions based on column and row
  useEffect(() => {
    const positions = new Map<string, { x: number; y: number; width: number; height: number }>();
    const columnWidth = NOTE_WIDTH + COLUMN_GAP;

    notesByColumn.forEach((columnNotes, colIndex) => {
      const colX = colIndex * columnWidth + COLUMN_GAP / 2;

      columnNotes.forEach((note, rowIndex) => {
        const y = HEADER_HEIGHT + rowIndex * (NOTE_HEIGHT + NOTE_GAP);
        positions.set(note.id, {
          x: colX,
          y,
          width: NOTE_WIDTH,
          height: NOTE_HEIGHT,
        });
      });
    });

    setNotePositions(positions);
  }, [notesByColumn]);

  // Calculate canvas height based on content
  const canvasHeight = useMemo(() => {
    const maxNotesInColumn = Math.max(...notesByColumn.map(col => col.length), 1);
    return HEADER_HEIGHT + maxNotesInColumn * (NOTE_HEIGHT + NOTE_GAP) + 100;
  }, [notesByColumn]);

  // Handle drag start
  const handleDragStart = useCallback((noteId: string) => (e: React.DragEvent) => {
    setDraggedNoteId(noteId);
    e.dataTransfer.setData('text/plain', noteId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggedNoteId(null);
    setDragOverColumn(null);
  }, []);

  // Handle drag over column
  const handleDragOver = useCallback((colIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(colIndex);
  }, []);

  // Handle drop on column
  const handleDrop = useCallback((colIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData('text/plain');
    if (noteId && onMoveNote) {
      // Calculate new row (at the bottom of the column)
      const newRow = notesByColumn[colIndex].length;
      onMoveNote(noteId, colIndex, newRow);
    }
    setDraggedNoteId(null);
    setDragOverColumn(null);
  }, [notesByColumn, onMoveNote]);

  // Handle canvas click (deselect)
  const handleCanvasClick = useCallback(() => {
    onSelectNote?.(null);
  }, [onSelectNote]);

  // Handle add note to column
  const handleAddNote = useCallback((colIndex: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddNote?.(colIndex);
  }, [onAddNote]);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-auto"
      style={{
        minHeight: canvasHeight,
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(197, 164, 126, 0.03) 0%, transparent 50%),
          linear-gradient(180deg, #0a0a0a 0%, #080808 100%)
        `
      }}
      onClick={handleCanvasClick}
    >
      {/* Subtle grid pattern for spatial orientation */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '44px 44px'
        }}
      />
      {/* Column headers and swimlanes */}
      <div className="flex gap-6 px-3 pt-3 sticky top-0 bg-[#0a0a0a] z-10">
        {COLUMNS.map((colName, colIndex) => (
          <div
            key={colName}
            className="flex-shrink-0"
            style={{ width: NOTE_WIDTH }}
          >
            <ColumnHeader
              name={colName as ColumnName}
              noteCount={notesByColumn[colIndex].length}
              isActive={dragOverColumn === colIndex}
            />
          </div>
        ))}
      </div>

      {/* Notes area with connectors */}
      <div className="relative" style={{ minHeight: canvasHeight - HEADER_HEIGHT }}>
        {/* Connector layer (behind notes) */}
        <ConnectorLayer
          notes={notes}
          connections={connections}
          notePositions={notePositions}
        />

        {/* Column drop zones */}
        <div className="flex gap-6 px-3 absolute inset-0">
          {COLUMNS.map((colName, colIndex) => (
            <div
              key={colName}
              className={`
                flex-shrink-0 min-h-full
                transition-all duration-200 ease-out
                ${dragOverColumn === colIndex
                  ? 'bg-[#c5a47e]/[0.08] ring-1 ring-inset ring-[#c5a47e]/20'
                  : ''}
              `}
              style={{ width: NOTE_WIDTH }}
              onDragOver={handleDragOver(colIndex)}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={handleDrop(colIndex)}
            >
              {/* Notes in this column */}
              <div className="flex flex-col gap-4 pt-4">
                {notesByColumn[colIndex].map(note => (
                  <StickyNote
                    key={note.id}
                    note={note}
                    isSelected={selectedNoteId === note.id}
                    onSelect={() => onSelectNote?.(note.id)}
                    onUpdate={(updates) => onUpdateNote?.(note.id, updates)}
                    onDelete={() => onDeleteNote?.(note.id)}
                    onDragStart={handleDragStart(note.id)}
                    onDragEnd={handleDragEnd}
                  />
                ))}

                {/* Add note button */}
                <button
                  onClick={handleAddNote(colIndex)}
                  className="w-44 h-12 border border-dashed border-white/20
                             text-white/40 hover:border-[#c5a47e] hover:text-[#c5a47e]
                             transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <span className="text-xs uppercase tracking-wider">Add note</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state - centered in the full viewport height */}
      {notes.length === 0 && (
        <div
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
          style={{ right: '40%' }}
        >
          <div className="text-center text-white/40">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50 text-[#c5a47e]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/>
            </svg>
            <p className="text-lg font-bold text-white uppercase tracking-wide">Start brainstorming</p>
            <p className="text-sm text-white/50">Chat with the copilot or click "Add note" to begin</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowCanvas;

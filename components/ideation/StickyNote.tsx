/**
 * StickyNote Component
 *
 * A draggable sticky note for the ideation canvas.
 * Uses SmartText for auto-sizing content.
 */

import React, { useState, useCallback } from 'react';
import { SmartText } from '../SmartText';
import { IdeaNote, NOTE_COLORS, NoteColor } from '../../types/ideation';

interface StickyNoteProps {
  note: IdeaNote;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (updates: Partial<IdeaNote>) => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

// Color options for the picker
const COLOR_OPTIONS: { color: NoteColor; label: string }[] = [
  { color: 'yellow', label: 'User Idea' },
  { color: 'blue', label: 'AI Suggestion' },
  { color: 'green', label: 'Research' },
  { color: 'pink', label: 'Question' },
  { color: 'purple', label: 'Key Insight' },
];

export const StickyNote: React.FC<StickyNoteProps> = ({
  note,
  isSelected = false,
  onSelect,
  onUpdate,
  onDelete,
  onApprove,
  onDragStart,
  onDragEnd,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleContentChange = useCallback((content: string) => {
    onUpdate?.({ content });
  }, [onUpdate]);

  const handleColorChange = useCallback((color: NoteColor) => {
    onUpdate?.({ color });
    setShowColorPicker(false);
  }, [onUpdate]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
  }, [onSelect]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowColorPicker(prev => !prev);
  }, []);

  // Get color classes
  const colorClasses = NOTE_COLORS[note.color] || NOTE_COLORS.yellow;

  // Type indicator icon
  const TypeIcon = () => {
    switch (note.type) {
      case 'ai':
        return (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        );
      case 'research':
        return (
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        group relative w-44 min-h-[100px] p-3 rounded-lg border-2 shadow-md
        transition-all duration-200 cursor-pointer select-none
        ${colorClasses}
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' : 'hover:shadow-lg hover:scale-[1.02]'}
        ${!note.approved && note.type === 'ai' ? 'opacity-80 border-dashed' : ''}
      `}
      draggable={!isEditing}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      data-note-id={note.id}
    >
      {/* Type indicator badge */}
      {note.type !== 'user' && (
        <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center text-gray-600">
          <TypeIcon />
        </div>
      )}

      {/* Approval indicator for AI notes */}
      {!note.approved && note.type === 'ai' && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onApprove?.(); }}
            className="w-5 h-5 rounded-full bg-green-500 text-white shadow flex items-center justify-center hover:bg-green-600 transition-colors"
            title="Approve"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="w-5 h-5 rounded-full bg-red-500 text-white shadow flex items-center justify-center hover:bg-red-600 transition-colors"
            title="Reject"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Content */}
      <div className="h-full">
        {isEditing ? (
          <SmartText
            value={note.content}
            onChange={handleContentChange}
            onBlur={handleBlur}
            autoFocus
            fontSize={14}
            lineHeight={1.4}
            className="text-sm text-gray-800 leading-snug"
            style={{ fontFamily: 'system-ui' }}
          />
        ) : (
          <p className="text-sm text-gray-800 leading-snug whitespace-pre-wrap break-words">
            {note.content}
          </p>
        )}
      </div>

      {/* Research source link */}
      {note.type === 'research' && note.sourceUrl && (
        <a
          href={note.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-xs text-blue-600 hover:underline truncate block"
          onClick={(e) => e.stopPropagation()}
        >
          {note.sourceTitle || 'Source'}
        </a>
      )}

      {/* Delete button (shown on hover for approved notes) */}
      {(note.approved || note.type === 'user') && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/80 text-gray-400
                     opacity-0 group-hover:opacity-100 transition-opacity
                     hover:bg-red-100 hover:text-red-500 flex items-center justify-center"
          title="Delete"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      )}

      {/* Color picker dropdown */}
      {showColorPicker && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg shadow-lg border p-2 flex gap-1">
          {COLOR_OPTIONS.map(({ color, label }) => (
            <button
              key={color}
              onClick={(e) => { e.stopPropagation(); handleColorChange(color); }}
              className={`w-6 h-6 rounded-full border-2 ${NOTE_COLORS[color].split(' ')[0]}
                         ${note.color === color ? 'ring-2 ring-blue-500' : ''}
                         hover:scale-110 transition-transform`}
              title={label}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StickyNote;

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
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

// Color options for the picker (Studio Noir)
const COLOR_OPTIONS: { color: NoteColor; label: string; swatchClass: string }[] = [
  { color: 'yellow', label: 'User Idea', swatchClass: 'bg-[#c5a47e]' },
  { color: 'blue', label: 'AI Suggestion', swatchClass: 'bg-white/60' },
  { color: 'green', label: 'Research', swatchClass: 'bg-[#c5a47e]/60' },
  { color: 'pink', label: 'Question', swatchClass: 'bg-white/30' },
  { color: 'purple', label: 'Key Insight', swatchClass: 'bg-[#c5a47e]' },
];

export const StickyNote: React.FC<StickyNoteProps> = ({
  note,
  isSelected = false,
  onSelect,
  onUpdate,
  onDelete,
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

  // Check if note was recently created (for entrance animation)
  const isNew = Date.now() - note.createdAt < 500;

  // Type indicator icon
  const TypeIcon = () => {
    switch (note.type) {
      case 'ai':
        return (
          <svg className="w-3 h-3 text-[#c5a47e]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        );
      case 'research':
        return (
          <svg className="w-3 h-3 text-[#c5a47e]" viewBox="0 0 24 24" fill="currentColor">
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
        group relative w-full min-h-[120px] p-3 border
        transition-note cursor-pointer select-none
        sticky-note-shadow
        ${colorClasses}
        ${isSelected
          ? 'ring-1 ring-[#c5a47e] scale-[1.02] sticky-note-shadow-selected -translate-y-0.5'
          : 'hover:border-[#c5a47e]/50 hover:sticky-note-shadow-hover hover:-translate-y-px'}
        ${!note.approved && note.type === 'ai' ? 'opacity-70 border-dashed' : ''}
        ${isNew ? 'animate-note-entrance' : ''}
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
        <div className={`
          absolute -top-2.5 -left-2.5 w-6 h-6
          bg-gradient-to-br from-[#1a1a1a] to-black
          border border-[#c5a47e]/60
          flex items-center justify-center
          shadow-lg
        `}>
          <TypeIcon />
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
            className="text-sm text-white leading-snug bg-transparent"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />
        ) : (
          <p className="text-sm text-white/90 leading-snug whitespace-pre-wrap break-words" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {note.content}
          </p>
        )}
      </div>

      {/* Research source link with enhanced citation */}
      {note.type === 'research' && (note.sourceUrl || note.sourceName) && (
        <div className="mt-2 space-y-1">
          {/* Finding type badge */}
          {note.findingType && (
            <span className="inline-block text-[10px] px-1.5 py-0.5 bg-[#c5a47e]/20 text-[#c5a47e] uppercase tracking-wider">
              {note.findingType}
            </span>
          )}

          {/* Source with reliability */}
          <div className="flex items-center gap-1.5">
            {note.sourceName && (
              <span className="text-xs text-white/50">{note.sourceName}</span>
            )}
            {note.sourceReliability && (
              <span className="text-[10px] text-[#c5a47e]" title={`Reliability: ${note.sourceReliability}/5`}>
                {'★'.repeat(note.sourceReliability)}
                {'☆'.repeat(5 - note.sourceReliability)}
              </span>
            )}
          </div>

          {/* Clickable source link */}
          {note.sourceUrl && (
            <a
              href={note.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#c5a47e] hover:underline truncate block"
              onClick={(e) => e.stopPropagation()}
            >
              {note.sourceTitle || 'View Source'}
            </a>
          )}
        </div>
      )}

      {/* Delete button (shown on hover for approved notes) */}
      {(note.approved || note.type === 'user') && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
          className="absolute top-1 right-1 w-5 h-5 bg-black/80 text-white/40
                     opacity-0 group-hover:opacity-100 transition-opacity
                     hover:bg-red-900 hover:text-red-400 flex items-center justify-center"
          title="Delete"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      )}

      {/* Color picker dropdown */}
      {showColorPicker && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-black border border-white/20 p-2 flex gap-1">
          {COLOR_OPTIONS.map(({ color, label, swatchClass }) => (
            <button
              key={color}
              onClick={(e) => { e.stopPropagation(); handleColorChange(color); }}
              className={`w-6 h-6 border ${swatchClass}
                         ${note.color === color ? 'ring-1 ring-[#c5a47e]' : 'border-white/20'}
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

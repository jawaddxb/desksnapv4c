import React, { useState, useRef, useCallback } from 'react';
import { Slide } from '@/types';
import { X, GripHorizontal, FileText } from 'lucide-react';

interface SpeakerNotesPanelProps {
    slide: Slide;
    onUpdateSlide: (updates: Partial<Slide>) => void;
    onClose: () => void;
}

export const SpeakerNotesPanel: React.FC<SpeakerNotesPanelProps> = ({
    slide,
    onUpdateSlide,
    onClose
}) => {
    // Drag state
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Drag handlers
    const handleDragStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startPosX: position.x,
            startPosY: position.y,
        };
        setIsDragging(true);

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!dragRef.current) return;

            const deltaX = moveEvent.clientX - dragRef.current.startX;
            const deltaY = moveEvent.clientY - dragRef.current.startY;

            setPosition({
                x: dragRef.current.startPosX + deltaX,
                y: dragRef.current.startPosY + deltaY,
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            dragRef.current = null;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [position]);

    return (
        <div
            ref={panelRef}
            className={`fixed z-[300] ${isDragging ? 'cursor-grabbing' : ''}`}
            style={{
                bottom: '100px',
                right: '20px',
                transform: `translate(${position.x}px, ${position.y}px)`,
            }}
        >
            <div className="w-80 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/20 ring-1 ring-zinc-900/5 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="flex items-center gap-2">
                        {/* Drag Handle */}
                        <div
                            onMouseDown={handleDragStart}
                            className="cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 transition-colors"
                            title="Drag to move"
                        >
                            <GripHorizontal className="w-4 h-4" />
                        </div>
                        <FileText className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                            Speaker Notes
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-zinc-200 rounded transition-colors"
                    >
                        <X className="w-4 h-4 text-zinc-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    <textarea
                        value={slide.speakerNotes || ''}
                        onChange={(e) => onUpdateSlide({ speakerNotes: e.target.value })}
                        placeholder="Add speaker notes for this slide..."
                        className="w-full h-48 p-3 text-sm text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        style={{ lineHeight: 1.5 }}
                    />
                    <div className="mt-2 text-[10px] text-zinc-400 text-right">
                        {(slide.speakerNotes || '').length} characters
                    </div>
                </div>
            </div>
        </div>
    );
};

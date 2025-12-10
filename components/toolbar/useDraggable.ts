/**
 * useDraggable Hook
 *
 * Provides drag-and-drop functionality for toolbar positioning.
 */

import { useState, useRef, useCallback, RefObject } from 'react';

export interface UseDraggableOptions {
  /** Ref to the draggable element */
  elementRef: RefObject<HTMLDivElement | null>;
}

export interface Position {
  x: number;
  y: number;
}

export interface UseDraggableReturn {
  /** Current position offset */
  position: Position | null;
  /** Whether currently dragging */
  isDragging: boolean;
  /** Handler for starting drag */
  handleDragStart: (e: React.MouseEvent) => void;
  /** Style object to apply to element */
  dragStyle: React.CSSProperties;
}

export function useDraggable({ elementRef }: UseDraggableOptions): UseDraggableReturn {
  const [position, setPosition] = useState<Position | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const element = elementRef.current;
    if (!element) return;

    const parentRect = element.parentElement?.getBoundingClientRect();
    if (!parentRect) return;

    // If no position set yet, use current offset
    const currentX = position?.x ?? 0;
    const currentY = position?.y ?? 0;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: currentX,
      startPosY: currentY,
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
  }, [position, elementRef]);

  // Calculate transform style for drag position
  const dragStyle: React.CSSProperties = position
    ? { transform: `translate(calc(-50% + ${position.x}px), ${position.y}px)` }
    : { transform: 'translate(-50%, 0)' };

  return {
    position,
    isDragging,
    handleDragStart,
    dragStyle,
  };
}

export default useDraggable;

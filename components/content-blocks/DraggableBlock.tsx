/**
 * DraggableBlock Component
 *
 * Wrapper for content blocks that enables drag and resize functionality.
 * Uses react-rnd for drag/resize, integrates with SelectionContext.
 *
 * KISS: Single wrapper for all draggable blocks (content + images)
 * SOLID: Single responsibility - just handles drag/resize
 * DRY: Reuses existing SelectionContext
 */

import React, { useRef, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { BlockPosition } from '@/types/contentBlocks';
import { useSelectionSafe } from '@/contexts/SelectionContext';
import { Theme } from '@/types';

export interface DraggableBlockProps {
  /** Unique identifier for this block */
  blockId: string;
  /** Index in the blocks array */
  blockIndex: number;
  /** Current position (percentages) */
  position: BlockPosition;
  /** Callback when position changes */
  onPositionChange: (position: BlockPosition) => void;
  /** Whether editing is disabled (presentation mode) */
  readOnly?: boolean;
  /** Theme for styling selection indicators */
  theme: Theme;
  /** Minimum width in pixels */
  minWidth?: number;
  /** Minimum height in pixels */
  minHeight?: number;
  /** Children to render inside */
  children: React.ReactNode;
}

/**
 * DraggableBlock
 *
 * Wraps content blocks with drag and resize capabilities.
 * Click to select, drag handles appear when selected.
 */
export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  blockId,
  blockIndex,
  position,
  onPositionChange,
  readOnly = false,
  theme,
  minWidth = 80,
  minHeight = 40,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectionContext = useSelectionSafe();

  const isSelected =
    selectionContext?.selection.type === 'block' &&
    selectionContext?.selection.contentIndex === blockIndex;

  const handleSelect = useCallback(
    (e: React.MouseEvent) => {
      if (readOnly) return;
      e.stopPropagation();
      selectionContext?.setSelection('block', blockId, blockIndex);
    },
    [readOnly, selectionContext, blockId, blockIndex]
  );

  const handleDragStop = useCallback(
    (_e: unknown, d: { x: number; y: number }) => {
      const container = containerRef.current?.parentElement;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const newPosition: BlockPosition = {
        ...position,
        x: (d.x / containerWidth) * 100,
        y: (d.y / containerHeight) * 100,
      };

      onPositionChange(newPosition);
    },
    [position, onPositionChange]
  );

  const handleResizeStop = useCallback(
    (
      _e: unknown,
      _direction: unknown,
      ref: HTMLElement,
      _delta: unknown,
      pos: { x: number; y: number }
    ) => {
      const container = containerRef.current?.parentElement;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const newPosition: BlockPosition = {
        x: (pos.x / containerWidth) * 100,
        y: (pos.y / containerHeight) * 100,
        width: (ref.offsetWidth / containerWidth) * 100,
        height: (ref.offsetHeight / containerHeight) * 100,
      };

      onPositionChange(newPosition);
    },
    [onPositionChange]
  );

  // Calculate pixel values from percentages
  const getPixelSize = useCallback(() => {
    const container = containerRef.current?.parentElement;
    if (!container) {
      return { x: 0, y: 0, width: 200, height: 150 };
    }

    return {
      x: (position.x / 100) * container.offsetWidth,
      y: (position.y / 100) * container.offsetHeight,
      width: (position.width / 100) * container.offsetWidth,
      height: (position.height / 100) * container.offsetHeight,
    };
  }, [position]);

  const pixelSize = getPixelSize();

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <Rnd
        position={{ x: pixelSize.x, y: pixelSize.y }}
        size={{ width: pixelSize.width, height: pixelSize.height }}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        minWidth={minWidth}
        minHeight={minHeight}
        bounds="parent"
        disableDragging={readOnly || !isSelected}
        enableResizing={!readOnly && isSelected}
        style={{
          pointerEvents: 'auto',
          outline: isSelected ? `2px solid ${theme.colors.accent}` : 'none',
          outlineOffset: '2px',
          borderRadius: theme.layout.radius,
          cursor: readOnly ? 'default' : isSelected ? 'move' : 'pointer',
        }}
        onClick={handleSelect}
        resizeHandleStyles={{
          topLeft: handleStyle(isSelected),
          topRight: handleStyle(isSelected),
          bottomLeft: handleStyle(isSelected),
          bottomRight: handleStyle(isSelected),
          top: handleStyle(isSelected, true),
          bottom: handleStyle(isSelected, true),
          left: handleStyle(isSelected, true),
          right: handleStyle(isSelected, true),
        }}
      >
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          {children}
        </div>
      </Rnd>
    </div>
  );
};

// Resize handle styles
const handleStyle = (isSelected: boolean, isEdge = false): React.CSSProperties => ({
  display: isSelected ? 'block' : 'none',
  width: isEdge ? '100%' : 8,
  height: isEdge ? '100%' : 8,
  background: isSelected ? '#3b82f6' : 'transparent',
  border: '1px solid white',
  borderRadius: 2,
});

export default DraggableBlock;

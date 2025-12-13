/**
 * ConnectorLayer Component
 *
 * SVG layer that renders bezier curve connectors between notes.
 * Positioned absolutely over the canvas.
 */

import React, { useMemo } from 'react';
import { IdeaNote, NoteConnection } from '@/types/ideation';

interface ConnectorLayerProps {
  notes: IdeaNote[];
  connections: NoteConnection[];
  notePositions: Map<string, { x: number; y: number; width: number; height: number }>;
}

interface ConnectorPath {
  id: string;
  d: string;
  fromId: string;
  toId: string;
}

/**
 * Calculate a smooth bezier curve path between two points
 */
function calculateBezierPath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): string {
  // Determine control point offset based on distance
  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const controlOffset = Math.min(distance * 0.4, 100);

  // Determine flow direction (prefer vertical flow)
  const isMainlyVertical = Math.abs(dy) > Math.abs(dx);

  let cp1x, cp1y, cp2x, cp2y;

  if (isMainlyVertical) {
    // Vertical flow - control points extend vertically
    cp1x = fromX;
    cp1y = fromY + controlOffset * Math.sign(dy);
    cp2x = toX;
    cp2y = toY - controlOffset * Math.sign(dy);
  } else {
    // Horizontal flow - control points extend horizontally
    cp1x = fromX + controlOffset * Math.sign(dx);
    cp1y = fromY;
    cp2x = toX - controlOffset * Math.sign(dx);
    cp2y = toY;
  }

  return `M ${fromX} ${fromY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toX} ${toY}`;
}

export const ConnectorLayer: React.FC<ConnectorLayerProps> = ({
  notes,
  connections,
  notePositions,
}) => {
  // Calculate all connector paths
  const paths = useMemo<ConnectorPath[]>(() => {
    const result: ConnectorPath[] = [];

    // Add connections from parentId references
    notes.forEach(note => {
      if (note.parentId) {
        const fromPos = notePositions.get(note.parentId);
        const toPos = notePositions.get(note.id);

        if (fromPos && toPos) {
          // Connect from bottom-center of parent to top-center of child
          const fromX = fromPos.x + fromPos.width / 2;
          const fromY = fromPos.y + fromPos.height;
          const toX = toPos.x + toPos.width / 2;
          const toY = toPos.y;

          result.push({
            id: `parent-${note.parentId}-${note.id}`,
            d: calculateBezierPath(fromX, fromY, toX, toY),
            fromId: note.parentId,
            toId: note.id,
          });
        }
      }
    });

    // Add explicit connections
    connections.forEach(conn => {
      const fromPos = notePositions.get(conn.fromId);
      const toPos = notePositions.get(conn.toId);

      if (fromPos && toPos) {
        const fromX = fromPos.x + fromPos.width / 2;
        const fromY = fromPos.y + fromPos.height;
        const toX = toPos.x + toPos.width / 2;
        const toY = toPos.y;

        result.push({
          id: conn.id,
          d: calculateBezierPath(fromX, fromY, toX, toY),
          fromId: conn.fromId,
          toId: conn.toId,
        });
      }
    });

    return result;
  }, [notes, connections, notePositions]);

  if (paths.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <defs>
        {/* Refined arrow marker for connector endpoints */}
        <marker
          id="arrowheadRefined"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0 0 L8 3 L0 6 L2 3 Z"
            fill="#c5a47e"
            opacity="0.8"
          />
        </marker>

        {/* Refined gradient for connector lines */}
        <linearGradient id="connectorGradientRefined" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
          <stop offset="50%" stopColor="rgba(197, 164, 126, 0.6)" />
          <stop offset="100%" stopColor="rgba(197, 164, 126, 0.4)" />
        </linearGradient>
      </defs>

      {/* Render all connector paths */}
      {paths.map(path => (
        <g key={path.id}>
          {/* Soft ambient glow - widest layer */}
          <path
            d={path.d}
            fill="none"
            stroke="rgba(197, 164, 126, 0.06)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Mid glow layer */}
          <path
            d={path.d}
            fill="none"
            stroke="rgba(197, 164, 126, 0.1)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Main connector line - solid, refined */}
          <path
            d={path.d}
            fill="none"
            stroke="url(#connectorGradientRefined)"
            strokeWidth="1.5"
            strokeLinecap="round"
            markerEnd="url(#arrowheadRefined)"
          />
        </g>
      ))}
    </svg>
  );
};

export default ConnectorLayer;

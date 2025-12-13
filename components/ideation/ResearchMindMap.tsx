/**
 * ResearchMindMap Component
 *
 * Visualizes research findings as an interactive mind map.
 * Uses ReactFlow for the graph visualization.
 */

import React, { useMemo, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { Finding, MindMapNode as MindMapNodeType } from '@/types';

interface ResearchMindMapProps {
  findings: Finding[];
  topic: string;
  onNodeClick?: (finding: Finding) => void;
}

// Type icons for categories
const TYPE_ICONS: Record<string, string> = {
  market: '📊',
  trend: '🔥',
  competitor: '🏢',
  expert: '💬',
  social: '🐦',
};

// Group findings by type
function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = String(item[key]);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

// Build ReactFlow graph from findings
function buildGraph(
  findings: Finding[],
  topic: string
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Central topic node
  nodes.push({
    id: 'topic',
    type: 'default',
    data: { label: topic },
    position: { x: 250, y: 150 },
    style: {
      background: '#c5a47e',
      color: 'black',
      padding: '12px 16px',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: '14px',
      border: 'none',
      boxShadow: '0 4px 12px rgba(197, 164, 126, 0.3)',
    },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  });

  if (findings.length === 0) {
    return { nodes, edges };
  }

  // Group findings by type
  const grouped = groupBy(findings, 'type');
  const types = Object.keys(grouped);

  // Calculate positions for category nodes in a semi-circle
  types.forEach((type, i) => {
    const angle = ((i + 0.5) / types.length) * Math.PI;
    const radius = 180;
    const x = 250 + Math.cos(angle - Math.PI / 2) * radius;
    const y = 150 + Math.sin(angle - Math.PI / 2) * radius + 80;

    // Category node
    const categoryId = `cat-${type}`;
    nodes.push({
      id: categoryId,
      type: 'default',
      data: {
        label: `${TYPE_ICONS[type] || '📄'} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      },
      position: { x, y },
      style: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    });

    // Edge from topic to category
    edges.push({
      id: `edge-topic-${type}`,
      source: 'topic',
      target: categoryId,
      style: { stroke: '#c5a47e', strokeWidth: 2 },
      animated: false,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#c5a47e',
      },
    });

    // Individual findings as leaf nodes
    const categoryFindings = grouped[type];
    categoryFindings.forEach((finding, j) => {
      const leafAngle =
        angle +
        ((j - (categoryFindings.length - 1) / 2) * 0.4) -
        Math.PI / 2;
      const leafRadius = 100;
      const leafX = x + Math.cos(leafAngle) * leafRadius;
      const leafY = y + Math.sin(leafAngle) * leafRadius + 60;

      // Truncate summary for display
      const displayText =
        finding.summary.length > 40
          ? finding.summary.slice(0, 40) + '...'
          : finding.summary;

      nodes.push({
        id: finding.id,
        type: 'default',
        data: {
          label: displayText,
          finding,
        },
        position: { x: leafX, y: leafY },
        style: {
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'rgba(255, 255, 255, 0.8)',
          padding: '6px 10px',
          borderRadius: '4px',
          fontSize: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '150px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      });

      edges.push({
        id: `edge-${type}-${finding.id}`,
        source: categoryId,
        target: finding.id,
        style: { stroke: 'rgba(255, 255, 255, 0.3)', strokeWidth: 1 },
        animated: false,
      });
    });
  });

  return { nodes, edges };
}

export const ResearchMindMap: React.FC<ResearchMindMapProps> = ({
  findings,
  topic,
  onNodeClick,
}) => {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildGraph(findings, topic),
    [findings, topic]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.data?.finding && onNodeClick) {
        onNodeClick(node.data.finding as Finding);
      }
    },
    [onNodeClick]
  );

  if (findings.length === 0) {
    return (
      <div className="h-64 bg-white/5 rounded-lg flex items-center justify-center">
        <p className="text-white/40 text-sm">
          Research findings will appear here as a mind map
        </p>
      </div>
    );
  }

  return (
    <div className="h-64 bg-white/5 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background color="rgba(255, 255, 255, 0.05)" gap={20} />
        <Controls
          showInteractive={false}
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '4px',
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default ResearchMindMap;

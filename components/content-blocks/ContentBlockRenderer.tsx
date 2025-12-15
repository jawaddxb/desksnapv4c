/**
 * ContentBlockRenderer Component
 *
 * Single entry point for rendering content blocks.
 * Used by all views: rough draft, final deck, presentation mode.
 *
 * Design Principles:
 * - Single Responsibility: One component renders all block types
 * - Open/Closed: Add new blocks via registry, no changes here
 * - DRY: All views use this single renderer
 */

import React, { Suspense, useCallback } from 'react';
import { ContentBlock, hasBlockPosition, BlockPosition } from '@/types/contentBlocks';
import { Theme } from '@/types';
import { BLOCK_REGISTRY, getBlockRenderer, isLazyBlock } from './registry';
import { DraggableBlock } from './DraggableBlock';

export interface ContentBlockRendererProps {
  /** Array of content blocks to render */
  blocks: ContentBlock[];
  /** Active theme for styling */
  theme: Theme;
  /** Whether blocks are read-only (default: true) */
  readOnly?: boolean;
  /** Callback when a block is updated (edit mode only) */
  onUpdateBlock?: (index: number, updates: Partial<ContentBlock>) => void;
  /** Callback when a block's position changes (drag/resize) */
  onPositionChange?: (index: number, position: BlockPosition) => void;
  /** Additional CSS classes for the container */
  className?: string;
  /** Gap between blocks (default: 'md') */
  gap?: 'sm' | 'md' | 'lg';
}

/** Loading placeholder for lazy-loaded blocks */
const BlockLoadingFallback: React.FC<{ theme: Theme }> = ({ theme }) => (
  <div
    className="animate-pulse rounded-lg p-4"
    style={{
      background: theme.colors.surface,
      minHeight: '200px',
    }}
  >
    <div
      className="h-4 rounded w-3/4 mb-2"
      style={{ background: theme.colors.secondary + '40' }}
    />
    <div
      className="h-4 rounded w-1/2"
      style={{ background: theme.colors.secondary + '30' }}
    />
  </div>
);

/** Error fallback for failed block renders */
const BlockErrorFallback: React.FC<{
  block: ContentBlock;
  theme: Theme;
}> = ({ block, theme }) => (
  <div
    className="rounded-lg p-4 border"
    style={{
      background: theme.colors.surface,
      borderColor: theme.colors.secondary + '40',
      color: theme.colors.secondary,
    }}
  >
    <p className="text-sm">Unable to render {block.type} block</p>
  </div>
);

/** Gap size mappings */
const GAP_SIZES = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
} as const;

/** Min sizes for different block types */
const MIN_SIZES: Record<string, { width: number; height: number }> = {
  chart: { width: 150, height: 100 },
  diagram: { width: 150, height: 100 },
  statistic: { width: 100, height: 60 },
  default: { width: 80, height: 40 },
};

/**
 * ContentBlockRenderer
 *
 * Renders an array of content blocks using the block registry.
 * Handles lazy loading for heavy components (charts, diagrams).
 * Supports positioned blocks (drag/resize) alongside flow blocks.
 */
export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({
  blocks,
  theme,
  readOnly = true,
  onUpdateBlock,
  onPositionChange,
  className = '',
  gap = 'md',
}) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Separate blocks into flow (no position) and positioned
  const flowBlocks: { block: ContentBlock; index: number }[] = [];
  const positionedBlocks: { block: ContentBlock; index: number }[] = [];

  blocks.forEach((block, index) => {
    if (hasBlockPosition(block)) {
      positionedBlocks.push({ block, index });
    } else {
      flowBlocks.push({ block, index });
    }
  });

  const renderBlockContent = (block: ContentBlock, index: number, fillContainer = false) => {
    const Renderer = getBlockRenderer(block.type);

    if (!Renderer) {
      return (
        <BlockErrorFallback
          key={index}
          block={block}
          theme={theme}
        />
      );
    }

    const handleUpdate = (updates: Partial<ContentBlock>) => {
      if (onUpdateBlock) {
        onUpdateBlock(index, updates);
      }
    };

    const blockElement = (
      <Renderer
        block={block as any}
        theme={theme}
        readOnly={readOnly}
        onUpdate={!readOnly ? handleUpdate : undefined}
        fillContainer={fillContainer}
      />
    );

    // Wrap lazy-loaded blocks in Suspense
    if (isLazyBlock(block.type)) {
      return (
        <Suspense
          key={index}
          fallback={<BlockLoadingFallback theme={theme} />}
        >
          {blockElement}
        </Suspense>
      );
    }

    return <React.Fragment key={index}>{blockElement}</React.Fragment>;
  };

  const handlePositionChange = useCallback(
    (index: number) => (position: BlockPosition) => {
      onPositionChange?.(index, position);
    },
    [onPositionChange]
  );

  const getMinSize = (blockType: string) => MIN_SIZES[blockType] || MIN_SIZES.default;

  return (
    <div className={`relative ${className}`} style={{ minHeight: positionedBlocks.length > 0 ? '200px' : undefined }}>
      {/* Flow-positioned blocks (normal flex layout) */}
      {flowBlocks.length > 0 && (
        <div className={`flex flex-col ${GAP_SIZES[gap]}`}>
          {flowBlocks.map(({ block, index }) => renderBlockContent(block, index))}
        </div>
      )}

      {/* Absolutely-positioned blocks (draggable/resizable) */}
      {positionedBlocks.map(({ block, index }) => {
        const position = (block as any).position as BlockPosition;
        const minSize = getMinSize(block.type);

        return (
          <DraggableBlock
            key={`positioned-${index}`}
            blockId={`block-${index}`}
            blockIndex={index}
            position={position}
            onPositionChange={handlePositionChange(index)}
            readOnly={readOnly}
            theme={theme}
            minWidth={minSize.width}
            minHeight={minSize.height}
          >
            {renderBlockContent(block, index, true)}
          </DraggableBlock>
        );
      })}
    </div>
  );
};

/**
 * Utility: Check if slide has content blocks
 * Use this to determine whether to use ContentBlockRenderer or legacy content
 */
export const hasContentBlocks = (slide: { contentBlocks?: ContentBlock[] }): boolean => {
  return Array.isArray(slide.contentBlocks) && slide.contentBlocks.length > 0;
};

export default ContentBlockRenderer;

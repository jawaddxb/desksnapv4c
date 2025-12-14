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

import React, { Suspense } from 'react';
import { ContentBlock } from '@/types/contentBlocks';
import { Theme } from '@/types';
import { BLOCK_REGISTRY, getBlockRenderer, isLazyBlock } from './registry';

export interface ContentBlockRendererProps {
  /** Array of content blocks to render */
  blocks: ContentBlock[];
  /** Active theme for styling */
  theme: Theme;
  /** Whether blocks are read-only (default: true) */
  readOnly?: boolean;
  /** Callback when a block is updated (edit mode only) */
  onUpdateBlock?: (index: number, updates: Partial<ContentBlock>) => void;
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

/**
 * ContentBlockRenderer
 *
 * Renders an array of content blocks using the block registry.
 * Handles lazy loading for heavy components (charts, diagrams).
 */
export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({
  blocks,
  theme,
  readOnly = true,
  onUpdateBlock,
  className = '',
  gap = 'md',
}) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  const renderBlock = (block: ContentBlock, index: number) => {
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

  return (
    <div className={`flex flex-col ${GAP_SIZES[gap]} ${className}`}>
      {blocks.map(renderBlock)}
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

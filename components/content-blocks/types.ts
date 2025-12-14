/**
 * Content Block Component Types
 *
 * Shared types for block renderer components.
 */

import { Theme } from '@/types';
import { ContentBlock, ContentBlockType } from '@/types/contentBlocks';

/**
 * Base props for all block renderer components
 */
export interface BlockProps<T extends ContentBlock = ContentBlock> {
  /** The content block to render */
  block: T;
  /** Current theme for styling */
  theme: Theme;
  /** Whether the block is in read-only mode */
  readOnly?: boolean;
  /** Called when block content is updated */
  onUpdate?: (updates: Partial<T>) => void;
  /** Additional CSS class name */
  className?: string;
}

/**
 * Block renderer component type
 */
export type BlockRenderer<T extends ContentBlock = ContentBlock> = React.FC<BlockProps<T>>;

/**
 * Registry entry for a block type
 */
export interface BlockRegistryEntry<T extends ContentBlock = ContentBlock> {
  /** React component that renders this block type */
  renderer: React.LazyExoticComponent<BlockRenderer<T>> | BlockRenderer<T>;
  /** Whether this block type should be lazy loaded */
  lazy?: boolean;
}

/**
 * Complete block registry type
 */
export type BlockRegistry = {
  [K in ContentBlockType]: BlockRegistryEntry;
};

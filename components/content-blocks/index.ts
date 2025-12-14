/**
 * Content Blocks Module
 *
 * Export all content block components and utilities.
 * Import from '@/components/content-blocks' for cleaner imports.
 */

// Main renderer - primary export
export {
  ContentBlockRenderer,
  hasContentBlocks,
  type ContentBlockRendererProps,
} from './ContentBlockRenderer';

// Registry utilities
export {
  BLOCK_REGISTRY,
  getBlockRenderer,
  isLazyBlock,
} from './registry';

// Individual block components (for direct use if needed)
export { ParagraphBlock } from './ParagraphBlock';
export { BulletsBlock } from './BulletsBlock';
export { NumberedBlock } from './NumberedBlock';
export { QuoteBlock } from './QuoteBlock';
export { StatisticBlock } from './StatisticBlock';
export { CalloutBlock } from './CalloutBlock';

// Lazy-loaded components (import dynamically for code splitting)
// export { ChartBlock } from './ChartBlock';
// export { DiagramBlock } from './DiagramBlock';

// Types
export type { BlockProps, BlockRenderer, BlockRegistryEntry } from './types';

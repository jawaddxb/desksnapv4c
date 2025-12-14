/**
 * Block Registry
 *
 * Single source of truth for block type -> renderer mapping.
 * Add new block types here only - no other file changes needed.
 *
 * Design Principles:
 * - Open/Closed: Add new blocks without modifying existing code
 * - Lazy Loading: Charts and diagrams loaded only when used
 */

import { lazy } from 'react';
import { ContentBlockType } from '@/types/contentBlocks';
import { BlockRegistryEntry } from './types';

// Eagerly loaded components (small, frequently used)
import { ParagraphBlock } from './ParagraphBlock';
import { BulletsBlock } from './BulletsBlock';
import { NumberedBlock } from './NumberedBlock';
import { QuoteBlock } from './QuoteBlock';
import { StatisticBlock } from './StatisticBlock';
import { CalloutBlock } from './CalloutBlock';

// Lazy loaded components (large dependencies)
const ChartBlock = lazy(() => import('./ChartBlock'));
const DiagramBlock = lazy(() => import('./DiagramBlock'));

/**
 * Block renderer registry
 * Maps block types to their renderer components
 */
export const BLOCK_REGISTRY: Record<ContentBlockType, BlockRegistryEntry> = {
  paragraph: {
    renderer: ParagraphBlock,
    lazy: false,
  },
  bullets: {
    renderer: BulletsBlock,
    lazy: false,
  },
  numbered: {
    renderer: NumberedBlock,
    lazy: false,
  },
  quote: {
    renderer: QuoteBlock,
    lazy: false,
  },
  statistic: {
    renderer: StatisticBlock,
    lazy: false,
  },
  callout: {
    renderer: CalloutBlock,
    lazy: false,
  },
  chart: {
    renderer: ChartBlock,
    lazy: true,
  },
  diagram: {
    renderer: DiagramBlock,
    lazy: true,
  },
};

/**
 * Get renderer component for a block type
 */
export const getBlockRenderer = (type: ContentBlockType) => {
  const entry = BLOCK_REGISTRY[type];
  if (!entry) {
    console.warn(`No renderer found for block type: ${type}`);
    return null;
  }
  return entry.renderer;
};

/**
 * Check if a block type uses lazy loading
 */
export const isLazyBlock = (type: ContentBlockType): boolean => {
  return BLOCK_REGISTRY[type]?.lazy ?? false;
};

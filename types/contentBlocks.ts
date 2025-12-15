/**
 * Content Block Types
 *
 * Discriminated union types for rich slide content.
 * Replaces the simple string[] content model with typed blocks.
 *
 * Design Principles:
 * - KISS: Simple discriminated union, no inheritance
 * - SOLID: Open/Closed - add new types to registry only
 * - DRY: Single source of truth for block definitions
 */

// ============ Block Type Constants ============

export const CONTENT_BLOCK_TYPES = [
  'paragraph',   // Flowing text
  'bullets',     // Bullet list
  'numbered',    // Numbered list
  'quote',       // Blockquote with attribution
  'statistic',   // Key metric with label and trend
  'callout',     // Highlighted info box
  'chart',       // Data visualization
  'diagram',     // Mermaid/flowchart
] as const;

export type ContentBlockType = typeof CONTENT_BLOCK_TYPES[number];

// ============ Chart Types ============

export const CHART_TYPES = ['bar', 'line', 'pie', 'donut'] as const;
export type ChartType = typeof CHART_TYPES[number];

export interface ChartData {
  labels: string[];
  values: number[];
  colors?: string[];  // Optional, uses theme accent if not provided
}

// ============ Callout Variants ============

export const CALLOUT_VARIANTS = ['info', 'warning', 'success', 'tip'] as const;
export type CalloutVariant = typeof CALLOUT_VARIANTS[number];

// ============ Trend Types ============

export const TREND_TYPES = ['up', 'down', 'neutral'] as const;
export type TrendType = typeof TREND_TYPES[number];

// ============ Block Position (for drag/resize) ============

export interface BlockPosition {
  x: number;      // percentage 0-100 relative to container
  y: number;      // percentage 0-100 relative to container
  width: number;  // percentage 0-100 relative to container
  height: number; // percentage 0-100 relative to container
}

// ============ Content Block Union ============

/**
 * Discriminated union for content blocks.
 * Each block type has specific properties for its rendering needs.
 */
export type ContentBlock =
  | ParagraphBlock
  | BulletsBlock
  | NumberedBlock
  | QuoteBlock
  | StatisticBlock
  | CalloutBlock
  | ChartBlock
  | DiagramBlock;

// ============ Individual Block Types ============

export interface ParagraphBlock {
  type: 'paragraph';
  text: string;
  position?: BlockPosition;
}

export interface BulletsBlock {
  type: 'bullets';
  items: string[];
  position?: BlockPosition;
}

export interface NumberedBlock {
  type: 'numbered';
  items: string[];
  position?: BlockPosition;
}

export interface QuoteBlock {
  type: 'quote';
  text: string;
  attribution?: string;
  position?: BlockPosition;
}

export interface StatisticBlock {
  type: 'statistic';
  value: string;
  label: string;
  trend?: TrendType;
  position?: BlockPosition;
}

export interface CalloutBlock {
  type: 'callout';
  text: string;
  variant: CalloutVariant;
  position?: BlockPosition;
}

export interface ChartBlock {
  type: 'chart';
  chartType: ChartType;
  data: ChartData;
  title?: string;
  position?: BlockPosition;
}

export interface DiagramBlock {
  type: 'diagram';
  mermaid: string;
  caption?: string;
  position?: BlockPosition;
}

// ============ Type Guards ============

export const isParagraphBlock = (block: ContentBlock): block is ParagraphBlock =>
  block.type === 'paragraph';

export const isBulletsBlock = (block: ContentBlock): block is BulletsBlock =>
  block.type === 'bullets';

export const isNumberedBlock = (block: ContentBlock): block is NumberedBlock =>
  block.type === 'numbered';

export const isQuoteBlock = (block: ContentBlock): block is QuoteBlock =>
  block.type === 'quote';

export const isStatisticBlock = (block: ContentBlock): block is StatisticBlock =>
  block.type === 'statistic';

export const isCalloutBlock = (block: ContentBlock): block is CalloutBlock =>
  block.type === 'callout';

export const isChartBlock = (block: ContentBlock): block is ChartBlock =>
  block.type === 'chart';

export const isDiagramBlock = (block: ContentBlock): block is DiagramBlock =>
  block.type === 'diagram';

export const hasBlockPosition = (block: ContentBlock): boolean =>
  'position' in block && block.position !== undefined;

// ============ Utility Functions ============

/**
 * Check if a block type requires lazy loading (charts, diagrams)
 */
export const requiresLazyLoading = (type: ContentBlockType): boolean =>
  type === 'chart' || type === 'diagram';

/**
 * Get plain text content from a block (for search, export, etc.)
 */
export const getBlockPlainText = (block: ContentBlock): string => {
  switch (block.type) {
    case 'paragraph':
      return block.text;
    case 'bullets':
    case 'numbered':
      return block.items.join('\n');
    case 'quote':
      return block.attribution ? `"${block.text}" - ${block.attribution}` : `"${block.text}"`;
    case 'statistic':
      return `${block.value} ${block.label}`;
    case 'callout':
      return block.text;
    case 'chart':
      return block.title || 'Chart';
    case 'diagram':
      return block.caption || 'Diagram';
  }
};

/**
 * Convert legacy content string[] to contentBlocks
 * Useful for migration or backward compatibility display
 */
export const legacyContentToBlocks = (content: string[]): ContentBlock[] => {
  if (content.length === 0) return [];

  // If content looks like bullet points, create a bullets block
  return [{
    type: 'bullets',
    items: content,
  }];
};

/**
 * Convert contentBlocks to legacy content string[]
 * Useful for export or API compatibility
 */
export const blocksToLegacyContent = (blocks: ContentBlock[]): string[] => {
  const items: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        items.push(block.text);
        break;
      case 'bullets':
      case 'numbered':
        items.push(...block.items);
        break;
      case 'quote':
        items.push(block.attribution ? `"${block.text}" - ${block.attribution}` : `"${block.text}"`);
        break;
      case 'statistic':
        items.push(`${block.value} - ${block.label}`);
        break;
      case 'callout':
        items.push(block.text);
        break;
      case 'chart':
        items.push(block.title || '[Chart]');
        break;
      case 'diagram':
        items.push(block.caption || '[Diagram]');
        break;
    }
  }

  return items;
};

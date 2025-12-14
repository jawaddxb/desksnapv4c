/**
 * BulletsBlock Component
 *
 * Renders bullet list with theme-aware styling.
 */

import React from 'react';
import { BulletsBlock as BulletsBlockType } from '@/types/contentBlocks';
import { getBulletsStyles } from '@/lib/blockStyles';
import { BlockProps } from './types';

const BULLET_MARKERS: Record<string, string> = {
  dot: '\u2022',      // •
  dash: '\u2013',     // –
  arrow: '\u2192',    // →
  check: '\u2713',    // ✓
  square: '\u25A0',   // ■
  circle: '\u25CB',   // ○
  diamond: '\u25C6',  // ◆
  none: '',
};

export const BulletsBlock: React.FC<BlockProps<BulletsBlockType>> = ({
  block,
  theme,
  readOnly = true,
  onUpdate,
  className = '',
}) => {
  const styles = getBulletsStyles(theme);

  const handleItemChange = (index: number, value: string) => {
    if (onUpdate) {
      const newItems = [...block.items];
      newItems[index] = value;
      onUpdate({ items: newItems });
    }
  };

  const marker = BULLET_MARKERS[styles.markerStyle] || BULLET_MARKERS.dot;

  return (
    <ul
      className={`flex flex-col ${className}`}
      style={{
        gap: `${styles.itemSpacing}px`,
        fontFamily: styles.fontBody,
        color: styles.text,
      }}
    >
      {block.items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-3"
          style={{
            padding: styles.itemPadding,
            background: styles.itemBackground || 'transparent',
            borderRadius: styles.itemBorderRadius,
            borderLeft: styles.leftAccentBorder
              ? `${styles.leftBorderWidth}px solid ${styles.accent}`
              : 'none',
          }}
        >
          <span
            className="shrink-0 mt-0.5"
            style={{
              color: styles.markerColor,
              fontSize: `${styles.markerSize}px`,
              lineHeight: '1.5',
            }}
          >
            {marker}
          </span>
          {!readOnly && onUpdate ? (
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className="flex-1 bg-transparent border-none outline-none"
              style={{ color: styles.text }}
            />
          ) : (
            <span>{item}</span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default BulletsBlock;

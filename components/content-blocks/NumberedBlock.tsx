/**
 * NumberedBlock Component
 *
 * Renders numbered list with theme-aware styling.
 */

import React from 'react';
import { NumberedBlock as NumberedBlockType } from '@/types/contentBlocks';
import { getBulletsStyles } from '@/lib/blockStyles';
import { BlockProps } from './types';

export const NumberedBlock: React.FC<BlockProps<NumberedBlockType>> = ({
  block,
  theme,
  readOnly = true,
  onUpdate,
  className = '',
}) => {
  const styles = getBulletsStyles(theme);
  const suffix = theme.contentStyle?.numberedSuffix ?? '.';

  const handleItemChange = (index: number, value: string) => {
    if (onUpdate) {
      const newItems = [...block.items];
      newItems[index] = value;
      onUpdate({ items: newItems });
    }
  };

  return (
    <ol
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
            className="shrink-0 font-semibold mt-0.5"
            style={{
              color: styles.markerColor,
              minWidth: '1.5em',
            }}
          >
            {index + 1}{suffix}
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
    </ol>
  );
};

export default NumberedBlock;

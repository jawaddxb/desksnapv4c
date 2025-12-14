/**
 * ParagraphBlock Component
 *
 * Renders flowing paragraph text with theme typography.
 */

import React from 'react';
import { ParagraphBlock as ParagraphBlockType } from '@/types/contentBlocks';
import { getParagraphStyles } from '@/lib/blockStyles';
import { BlockProps } from './types';

export const ParagraphBlock: React.FC<BlockProps<ParagraphBlockType>> = ({
  block,
  theme,
  readOnly = true,
  onUpdate,
  className = '',
}) => {
  const styles = getParagraphStyles(theme);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onUpdate) {
      onUpdate({ text: e.target.value });
    }
  };

  if (!readOnly && onUpdate) {
    return (
      <textarea
        value={block.text}
        onChange={handleChange}
        className={`w-full resize-none bg-transparent border-none outline-none ${className}`}
        style={{
          color: styles.text,
          fontFamily: styles.fontBody,
          lineHeight: styles.lineHeight,
          fontSize: 'inherit',
        }}
        rows={Math.max(3, Math.ceil(block.text.length / 80))}
      />
    );
  }

  return (
    <p
      className={`${className}`}
      style={{
        color: styles.text,
        fontFamily: styles.fontBody,
        lineHeight: styles.lineHeight,
      }}
    >
      {block.text}
    </p>
  );
};

export default ParagraphBlock;

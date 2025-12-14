/**
 * QuoteBlock Component
 *
 * Renders blockquote with attribution and theme styling.
 */

import React from 'react';
import { QuoteBlock as QuoteBlockType } from '@/types/contentBlocks';
import { getQuoteStyles } from '@/lib/blockStyles';
import { BlockProps } from './types';

export const QuoteBlock: React.FC<BlockProps<QuoteBlockType>> = ({
  block,
  theme,
  readOnly = true,
  onUpdate,
  className = '',
}) => {
  const styles = getQuoteStyles(theme);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onUpdate) {
      onUpdate({ text: e.target.value });
    }
  };

  const handleAttributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUpdate) {
      onUpdate({ attribution: e.target.value });
    }
  };

  return (
    <blockquote
      className={`pl-4 py-2 ${className}`}
      style={{
        borderLeft: `${styles.quoteBorderWidth} solid ${styles.accent}`,
        background: styles.quoteBackground,
        borderRadius: styles.radius,
        fontFamily: styles.fontBody,
      }}
    >
      {!readOnly && onUpdate ? (
        <textarea
          value={block.text}
          onChange={handleTextChange}
          className="w-full bg-transparent border-none outline-none resize-none"
          style={{
            color: styles.text,
            fontStyle: styles.quoteFontStyle,
            fontSize: '1.1em',
          }}
          rows={2}
        />
      ) : (
        <p
          style={{
            color: styles.text,
            fontStyle: styles.quoteFontStyle,
            fontSize: '1.1em',
            margin: 0,
          }}
        >
          "{block.text}"
        </p>
      )}
      {block.attribution && (
        <footer className="mt-2">
          {!readOnly && onUpdate ? (
            <input
              type="text"
              value={block.attribution}
              onChange={handleAttributionChange}
              className="bg-transparent border-none outline-none text-sm"
              style={{ color: styles.secondary }}
              placeholder="Attribution"
            />
          ) : (
            <cite
              className="text-sm not-italic"
              style={{ color: styles.secondary }}
            >
              — {block.attribution}
            </cite>
          )}
        </footer>
      )}
    </blockquote>
  );
};

export default QuoteBlock;

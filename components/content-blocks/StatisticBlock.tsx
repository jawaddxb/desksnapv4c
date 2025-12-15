/**
 * StatisticBlock Component
 *
 * Renders a large statistic value with label and optional trend indicator.
 */

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StatisticBlock as StatisticBlockType } from '@/types/contentBlocks';
import { getStatisticStyles, getTrendColor } from '@/lib/blockStyles';
import { BlockProps } from './types';

export const StatisticBlock: React.FC<BlockProps<StatisticBlockType>> = ({
  block,
  theme,
  readOnly = true,
  onUpdate,
  className = '',
  fillContainer = false,
}) => {
  const styles = getStatisticStyles(theme);
  const trendColor = getTrendColor(styles, block.trend);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUpdate) {
      onUpdate({ value: e.target.value });
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onUpdate) {
      onUpdate({ label: e.target.value });
    }
  };

  const TrendIcon = block.trend === 'up'
    ? TrendingUp
    : block.trend === 'down'
      ? TrendingDown
      : Minus;

  return (
    <div
      className={`flex flex-col items-start ${fillContainer ? 'justify-center' : ''} ${className}`}
      style={fillContainer ? { width: '100%', height: '100%' } : undefined}
    >
      <div className="flex items-center gap-3">
        {!readOnly && onUpdate ? (
          <input
            type="text"
            value={block.value}
            onChange={handleValueChange}
            className="bg-transparent border-none outline-none"
            style={{
              color: styles.accent,
              fontFamily: styles.fontHeading,
              fontSize: styles.valueFontSize,
              fontWeight: styles.valueFontWeight,
              width: `${block.value.length + 2}ch`,
            }}
          />
        ) : (
          <span
            style={{
              color: styles.accent,
              fontFamily: styles.fontHeading,
              fontSize: styles.valueFontSize,
              fontWeight: styles.valueFontWeight,
              lineHeight: 1,
            }}
          >
            {block.value}
          </span>
        )}
        {block.trend && (
          <TrendIcon
            size={32}
            style={{ color: trendColor }}
            strokeWidth={2.5}
          />
        )}
      </div>
      {!readOnly && onUpdate ? (
        <input
          type="text"
          value={block.label}
          onChange={handleLabelChange}
          className="bg-transparent border-none outline-none mt-2"
          style={{
            color: styles.labelColor,
            fontFamily: styles.fontBody,
            fontSize: styles.labelFontSize,
          }}
          placeholder="Label"
        />
      ) : (
        <span
          className="mt-2"
          style={{
            color: styles.labelColor,
            fontFamily: styles.fontBody,
            fontSize: styles.labelFontSize,
          }}
        >
          {block.label}
        </span>
      )}
    </div>
  );
};

export default StatisticBlock;

/**
 * LayoutGrid Primitive
 *
 * A flexible grid/flex container for layout composition.
 * DRY: Consolidates repeated flex patterns across layouts.
 */

import React from 'react';

export interface LayoutGridProps {
  /** Flex direction */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** Gap between children */
  gap?: string;
  /** Align items */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Justify content */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Padding */
  padding?: string;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Children */
  children: React.ReactNode;
}

const directionClasses: Record<string, string> = {
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse',
};

const alignClasses: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyClasses: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export const LayoutGrid: React.FC<LayoutGridProps> = ({
  direction = 'row',
  gap = '1.5rem',
  align = 'stretch',
  justify = 'start',
  padding,
  className = '',
  style = {},
  children,
}) => {
  const classes = [
    'flex',
    directionClasses[direction],
    alignClasses[align],
    justifyClasses[justify],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{
        gap,
        padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

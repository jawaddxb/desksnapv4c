/**
 * LayoutContentSection Primitive
 *
 * Content area wrapper with alignment and sizing options.
 * DRY: Consolidates content section patterns across layouts.
 */

import React from 'react';

export type ContentAlignment = 'left' | 'center' | 'right';

export interface LayoutContentSectionProps {
  /** Horizontal text alignment */
  alignment?: ContentAlignment;
  /** Vertical alignment */
  verticalAlign?: 'start' | 'center' | 'end';
  /** Max width constraint */
  maxWidth?: string;
  /** Padding */
  padding?: string;
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Z-index layer */
  zIndex?: number;
  /** Order in flex container */
  order?: number;
  /** Flex sizing */
  flex?: string;
  /** Children */
  children: React.ReactNode;
}

const alignmentClasses: Record<ContentAlignment, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center mx-auto',
  right: 'items-end text-right ml-auto',
};

const verticalAlignClasses: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
};

export const LayoutContentSection: React.FC<LayoutContentSectionProps> = ({
  alignment = 'left',
  verticalAlign = 'center',
  maxWidth,
  padding = '2rem 3rem',
  className = '',
  style = {},
  zIndex = 20,
  order,
  flex = '1',
  children,
}) => {
  const classes = [
    'flex flex-col',
    'relative',
    'min-h-0',
    'overflow-hidden',
    'shrink-0',
    verticalAlignClasses[verticalAlign],
    alignmentClasses[alignment],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{
        padding,
        zIndex,
        order,
        flex,
        maxWidth,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

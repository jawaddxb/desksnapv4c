/**
 * Divider Component
 *
 * Simple vertical divider for toolbars.
 */

import React from 'react';

export interface DividerProps {
  /** Orientation (default: vertical) */
  orientation?: 'vertical' | 'horizontal';
  /** Additional className */
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'vertical',
  className = '',
}) => {
  const baseClass = orientation === 'vertical'
    ? 'w-px h-6 bg-zinc-200 mx-1'
    : 'h-px w-full bg-zinc-200 my-1';

  return <div className={`${baseClass} ${className}`} />;
};

export default Divider;

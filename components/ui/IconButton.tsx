/**
 * IconButton Component
 *
 * Reusable icon button with active state, hover effects, and label tooltip.
 * Used throughout the app for toolbar buttons.
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface IconButtonProps {
  /** Whether the button is in active/selected state */
  active?: boolean;
  /** Click handler */
  onClick: () => void;
  /** Lucide icon component */
  icon?: LucideIcon;
  /** Text to show instead of icon */
  text?: string;
  /** Accessible label (also used for hover tooltip in toolbar) */
  label: string;
  /** Callback when mouse enters (for toolbar label updates) */
  onHoverStart?: () => void;
  /** Callback when mouse leaves (for toolbar label updates) */
  onHoverEnd?: () => void;
  /** Button size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the active indicator dot */
  showActiveDot?: boolean;
  /** Additional className */
  className?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Button title attribute */
  title?: string;
}

const sizeClasses = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-11 h-11',
};

const iconSizeClasses = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export const IconButton: React.FC<IconButtonProps> = ({
  active = false,
  onClick,
  icon: Icon,
  text,
  label,
  onHoverStart,
  onHoverEnd,
  size = 'md',
  showActiveDot = true,
  className = '',
  disabled = false,
  title,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) onClick();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      disabled={disabled}
      aria-label={label}
      title={title || label}
      className={`
        relative group flex items-center justify-center rounded-lg transition-all duration-200
        ${sizeClasses[size]}
        ${active
          ? 'bg-[#6B8E6B] text-white shadow-md scale-105'
          : 'hover:bg-[#EDF5F0] text-[#4A5D4A] hover:text-[#1E2E1E] hover:scale-105'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {Icon && (
        <Icon
          className={iconSizeClasses[size]}
          strokeWidth={active ? 2.5 : 2}
        />
      )}
      {text && (
        <span className={`text-[10px] font-medium ${active ? 'text-white' : 'text-current'}`}>
          {text}
        </span>
      )}

      {/* Active Indicator Dot */}
      {showActiveDot && active && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5A7A5A] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6B8E6B] border border-white" />
        </span>
      )}
    </button>
  );
};

export default IconButton;

/**
 * ToolbarButton Component
 *
 * A button for the layout toolbar with icon or text, active state,
 * and hover label updates.
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ToolbarButtonProps {
  /** Whether the button is in active state */
  active: boolean;
  /** Click handler */
  onClick: () => void;
  /** Optional icon component */
  icon?: LucideIcon;
  /** Label shown on hover */
  label: string;
  /** Optional text to display instead of icon */
  text?: string;
  /** Callback when mouse enters */
  onHoverStart?: (label: string) => void;
  /** Callback when mouse leaves */
  onHoverEnd?: () => void;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  active,
  onClick,
  icon: Icon,
  label,
  text,
  onHoverStart,
  onHoverEnd,
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={() => onHoverStart?.(label)}
      onMouseLeave={onHoverEnd}
      className={`
        relative group flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200
        ${active
          ? 'bg-[#6B8E6B] text-white shadow-md scale-105'
          : 'hover:bg-[#EDF5F0] text-[#4A5D4A] hover:text-[#1E2E1E] hover:scale-105'
        }
      `}
    >
      {Icon && <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 2} />}
      {text && (
        <span className={`text-[10px] font-medium ${active ? 'text-white' : 'text-current'}`}>
          {text}
        </span>
      )}

      {/* Active Indicator Dot */}
      {active && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5A7A5A] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6B8E6B] border border-white" />
        </span>
      )}
    </button>
  );
};

export default ToolbarButton;

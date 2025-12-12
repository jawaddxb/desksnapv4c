/**
 * ToggleButton Component
 *
 * A reusable toggle switch component for boolean settings.
 * DRY: Consolidates duplicated toggle patterns across the codebase.
 *
 * Used in:
 * - DebugRoute (debug UI toggle)
 * - ExportPreviewDialog (include notes toggle)
 * - ChatInterface (draft preview toggle)
 */

import React, { forwardRef } from 'react';

export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleButtonProps {
  /** Whether the toggle is checked/on */
  checked: boolean;
  /** Callback when the toggle state changes */
  onChange: (checked: boolean) => void;
  /** Size variant */
  size?: ToggleSize;
  /** Whether the toggle is disabled */
  disabled?: boolean;
  /** Active/checked color (defaults to brand gold) */
  activeColor?: string;
  /** Inactive/unchecked color */
  inactiveColor?: string;
  /** Optional label to display before the toggle */
  label?: string;
  /** Label position relative to toggle */
  labelPosition?: 'left' | 'right';
  /** Additional CSS classes for the wrapper */
  className?: string;
  /** Accessible label for screen readers */
  'aria-label'?: string;
}

const sizeConfig: Record<ToggleSize, { track: string; thumb: string; translate: string }> = {
  sm: {
    track: 'w-8 h-4',
    thumb: 'w-3 h-3 top-0.5',
    translate: 'translate-x-4',
  },
  md: {
    track: 'w-10 h-5',
    thumb: 'w-4 h-4 top-0.5',
    translate: 'translate-x-5',
  },
  lg: {
    track: 'w-12 h-6',
    thumb: 'w-5 h-5 top-0.5',
    translate: 'translate-x-6',
  },
};

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      checked,
      onChange,
      size = 'md',
      disabled = false,
      activeColor = 'bg-[#c5a47e]',
      inactiveColor = 'bg-white/20',
      label,
      labelPosition = 'left',
      className = '',
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const config = sizeConfig[size];

    const handleClick = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    };

    const toggle = (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          relative ${config.track} rounded-full transition-colors duration-200
          ${checked ? activeColor : inactiveColor}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a47e] focus-visible:ring-offset-2 focus-visible:ring-offset-black
        `}
      >
        <span
          className={`
            absolute left-0.5 ${config.thumb}
            bg-white rounded-full shadow
            transition-transform duration-200
            ${checked ? config.translate : 'translate-x-0'}
          `}
        />
      </button>
    );

    if (!label) {
      return toggle;
    }

    return (
      <label className={`flex items-center gap-2 cursor-pointer ${disabled ? 'cursor-not-allowed' : ''} ${className}`}>
        {labelPosition === 'left' && (
          <span className={`text-sm text-white/50 ${disabled ? 'opacity-50' : ''}`}>{label}</span>
        )}
        {toggle}
        {labelPosition === 'right' && (
          <span className={`text-sm text-white/50 ${disabled ? 'opacity-50' : ''}`}>{label}</span>
        )}
      </label>
    );
  }
);

ToggleButton.displayName = 'ToggleButton';

/**
 * ToggleGroup - A labeled toggle with description
 * For more complex toggle UI patterns with additional context
 */
export interface ToggleGroupProps extends ToggleButtonProps {
  /** Title/main label */
  title: string;
  /** Optional description text */
  description?: string;
  /** Icon to display before the title */
  icon?: React.ReactNode;
}

export const ToggleGroup = forwardRef<HTMLButtonElement, ToggleGroupProps>(
  ({ title, description, icon, ...toggleProps }, ref) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-white/40">{icon}</span>}
          <div>
            <div className="text-sm font-medium text-white">{title}</div>
            {description && (
              <div className="text-xs text-white/50">{description}</div>
            )}
          </div>
        </div>
        <ToggleButton ref={ref} {...toggleProps} />
      </div>
    );
  }
);

ToggleGroup.displayName = 'ToggleGroup';

export default ToggleButton;

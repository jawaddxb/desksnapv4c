/**
 * Slider Component
 *
 * Reusable range slider with label and value display.
 * Used for opacity, filter, and other numeric adjustments.
 */

import React from 'react';

export interface SliderProps {
  /** Label displayed on the left */
  label: string;
  /** Current value */
  value: number;
  /** Minimum value */
  min: number;
  /** Maximum value */
  max: number;
  /** Step size (default: 0.05) */
  step?: number;
  /** Change handler */
  onChange: (value: number) => void;
  /** Format function for the display value (default: percentage) */
  formatValue?: (value: number) => string;
  /** Label width class (default: w-16) */
  labelWidth?: string;
  /** Value width class (default: w-8) */
  valueWidth?: string;
  /** Additional className */
  className?: string;
  /** Whether the slider is disabled */
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 0.05,
  onChange,
  formatValue = (v) => `${Math.round(v * 100)}%`,
  labelWidth = 'w-16',
  valueWidth = 'w-8',
  className = '',
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`text-[10px] text-[#4A5D4A] ${labelWidth}`}>
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          flex-1 h-1 bg-[#D4E5D4] rounded-full appearance-none cursor-pointer accent-[#6B8E6B]
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
      <span className={`text-[10px] text-[#8FA58F] text-right ${valueWidth}`}>
        {formatValue(value)}
      </span>
    </div>
  );
};

export default Slider;

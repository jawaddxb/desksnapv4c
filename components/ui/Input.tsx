import React, { forwardRef } from 'react';

export type InputVariant = 'default' | 'search' | 'minimal';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant;
  size?: InputSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  error?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<InputVariant, string> = {
  default: 'bg-white border border-[#D4E5D4] focus:border-[#6B8E6B] focus:ring-2 focus:ring-[#6B8E6B]/20',
  search: 'bg-[#EDF5F0] border border-transparent focus:border-[#D4E5D4] focus:bg-white',
  minimal: 'bg-transparent border-b border-[#D4E5D4] focus:border-[#6B8E6B] rounded-none px-0',
};

const sizeClasses: Record<InputSize, string> = {
  sm: 'p-2 text-xs',
  md: 'p-3 text-sm',
  lg: 'p-4 text-base',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      icon,
      iconPosition = 'left',
      error = false,
      fullWidth = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'font-medium text-[#1E2E1E] outline-none transition-all duration-150 placeholder:text-[#8FA58F] rounded-md';

    const errorClasses = error ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' : '';

    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      errorClasses,
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    if (icon) {
      return (
        <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
          {iconPosition === 'left' && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8FA58F]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`${combinedClasses} ${iconPosition === 'left' ? 'pl-10' : 'pr-10'}`}
            {...props}
          />
          {iconPosition === 'right' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8FA58F]">
              {icon}
            </span>
          )}
        </div>
      );
    }

    return <input ref={ref} className={combinedClasses} {...props} />;
  }
);

Input.displayName = 'Input';

// Textarea variant
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: InputVariant;
  error?: boolean;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      variant = 'default',
      error = false,
      fullWidth = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'p-3 text-sm font-medium text-[#1E2E1E] outline-none transition-all duration-150 placeholder:text-[#8FA58F] resize-none rounded-md';

    const errorClasses = error ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' : '';

    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      errorClasses,
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return <textarea ref={ref} className={combinedClasses} {...props} />;
  }
);

Textarea.displayName = 'Textarea';

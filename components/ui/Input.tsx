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
  default: 'bg-black border border-white/20 focus:border-[#c5a47e]',
  search: 'bg-white/5 border border-transparent focus:border-white/20',
  minimal: 'bg-transparent border-b border-white/20 focus:border-[#c5a47e] rounded-none px-0',
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
      'font-bold text-white outline-none transition-all duration-150 placeholder:text-white/40';

    const errorClasses = error ? 'border-red-500 focus:border-red-400' : '';

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
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`${combinedClasses} ${iconPosition === 'left' ? 'pl-10' : 'pr-10'}`}
            {...props}
          />
          {iconPosition === 'right' && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
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
      'p-3 text-sm font-bold text-white outline-none transition-all duration-150 placeholder:text-white/40 resize-none';

    const errorClasses = error ? 'border-red-500 focus:border-red-400' : '';

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

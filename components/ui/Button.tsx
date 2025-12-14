import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'white' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-[#6B8E6B] hover:bg-[#5A7A5A] text-white',
  secondary: 'bg-white hover:bg-[#EDF5F0] text-[#1E2E1E] border border-[#D4E5D4] hover:border-[#C0D6C0]',
  ghost: 'bg-transparent text-[#4A5D4A] hover:text-[#1E2E1E] hover:bg-[#EDF5F0]',
  white: 'bg-white hover:bg-[#6B8E6B] hover:text-white text-[#1E2E1E] border border-[#D4E5D4]',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-sm',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      icon,
      iconPosition = 'left',
      fullWidth = false,
      loading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-150 rounded-md disabled:opacity-50 disabled:cursor-not-allowed';

    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const iconElement = icon && (
      <span className="flex-shrink-0">{icon}</span>
    );

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={combinedClasses}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {iconPosition === 'left' && iconElement}
            {children}
            {iconPosition === 'right' && iconElement}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Tab variant for dashboard-style tabs
export interface TabButtonProps extends Omit<ButtonProps, 'variant'> {
  active?: boolean;
  count?: number;
}

export const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
  ({ active = false, count, children, className = '', ...props }, ref) => {
    const activeClasses = active
      ? 'bg-[#6B8E6B] text-white'
      : 'bg-transparent text-[#4A5D4A] hover:text-[#1E2E1E] hover:bg-[#EDF5F0]';

    return (
      <button
        ref={ref}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium tracking-wide transition-all duration-150 rounded-md ${activeClasses} ${className}`}
        {...props}
      >
        {children}
        {count !== undefined && (
          <span className="px-2 py-0.5 text-[10px] bg-[#1E2E1E]/10 rounded-sm">
            {count}
          </span>
        )}
      </button>
    );
  }
);

TabButton.displayName = 'TabButton';

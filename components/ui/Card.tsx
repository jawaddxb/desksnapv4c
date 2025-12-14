import React, { forwardRef } from 'react';

export type CardVariant = 'default' | 'interactive' | 'selected' | 'ghost';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white border border-[#D4E5D4] shadow-[0_4px_24px_rgba(107,142,107,0.06)]',
  interactive: 'bg-white border border-[#D4E5D4] shadow-[0_4px_24px_rgba(107,142,107,0.06)] hover:border-[#6B8E6B]/50 hover:shadow-[0_8px_32px_rgba(107,142,107,0.1)] cursor-pointer',
  selected: 'bg-white border border-[#6B8E6B] ring-2 ring-[#6B8E6B]/20 shadow-[0_8px_32px_rgba(107,142,107,0.1)]',
  ghost: 'bg-transparent border border-[#D4E5D4] hover:border-[#C0D6C0]',
};

const paddingClasses: Record<'none' | 'sm' | 'md' | 'lg', string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'none',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'transition-all duration-150 overflow-hidden rounded-lg';

    const combinedClasses = [
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components for composition
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-5 py-4 border-b border-[#D4E5D4] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  )
);

CardBody.displayName = 'CardBody';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      className={`px-5 py-4 border-t border-[#D4E5D4] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardFooter.displayName = 'CardFooter';

// Empty state card
export interface EmptyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyCard = forwardRef<HTMLDivElement, EmptyCardProps>(
  ({ icon, title, description, action, className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`border border-dashed border-[#D4E5D4] p-20 text-center flex flex-col items-center justify-center bg-[#F5FAF7] rounded-lg ${className}`}
      {...props}
    >
      {icon && (
        <div className="w-16 h-16 bg-[#6B8E6B]/10 rounded-lg flex items-center justify-center mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-medium text-[#1E2E1E] mb-2">{title}</h3>
      {description && (
        <p className="text-[#4A5D4A] mb-8 max-w-md mx-auto">{description}</p>
      )}
      {action}
    </div>
  )
);

EmptyCard.displayName = 'EmptyCard';

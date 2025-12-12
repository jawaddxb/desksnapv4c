import React, { forwardRef } from 'react';

export type CardVariant = 'default' | 'interactive' | 'selected' | 'ghost';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-[#1a1a1a] border border-white/10',
  interactive: 'bg-[#1a1a1a] border border-white/10 hover:border-[#c5a47e]/50 cursor-pointer',
  selected: 'bg-[#1a1a1a] border border-[#c5a47e] ring-2 ring-[#c5a47e]/20',
  ghost: 'bg-transparent border border-white/10 hover:border-white/20',
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
    const baseClasses = 'transition-all duration-150 overflow-hidden';

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
      className={`px-5 py-4 border-b border-white/10 ${className}`}
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
      className={`px-5 py-4 border-t border-white/10 ${className}`}
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
      className={`border border-dashed border-white/20 p-20 text-center flex flex-col items-center justify-center bg-black/50 ${className}`}
      {...props}
    >
      {icon && (
        <div className="w-16 h-16 bg-white/5 flex items-center justify-center mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-light text-white mb-2">{title}</h3>
      {description && (
        <p className="text-white/60 mb-8 max-w-md mx-auto">{description}</p>
      )}
      {action}
    </div>
  )
);

EmptyCard.displayName = 'EmptyCard';

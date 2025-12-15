/**
 * Bento Grid Container Component
 * Provides flexible grid layout system for bento-style cards
 */

import React from 'react';
import { motion } from 'framer-motion';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: number;
  gap?: number;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  className = '',
  columns = 4,
  gap = 6,
}) => {
  return (
    <div
      className={`grid gap-${gap} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {children}
    </div>
  );
};

interface BentoCardProps {
  children: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  colSpan = 1,
  rowSpan = 1,
  className = '',
  interactive = true,
  onClick,
}) => {
  const baseClasses = `
    bg-white rounded-3xl p-8
    shadow-[0_4px_24px_rgba(107,142,107,0.08)]
    border border-[#D4E5D4]
    overflow-hidden
    relative
  `;

  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
      whileHover={
        interactive
          ? {
              y: -4,
              scale: 1.02,
              boxShadow: '0 12px 48px rgba(107, 142, 107, 0.12)',
              transition: { duration: 0.2, ease: [0, 0, 0.2, 1] },
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
};

// Colored card variant
interface ColoredBentoCardProps extends BentoCardProps {
  color?: 'green' | 'sage' | 'cream';
}

export const ColoredBentoCard: React.FC<ColoredBentoCardProps> = ({
  color = 'green',
  children,
  ...props
}) => {
  const colorClasses = {
    green: 'bg-[#6B8E6B] text-white border-[#5A7A5A]',
    sage: 'bg-[#EDF5F0] text-[#1E2E1E] border-[#D4E5D4]',
    cream: 'bg-[#FAFBF8] text-[#1E2E1E] border-[#D4E5D4]',
  };

  return (
    <BentoCard
      {...props}
      className={`${colorClasses[color]} ${props.className || ''}`}
    >
      {children}
    </BentoCard>
  );
};

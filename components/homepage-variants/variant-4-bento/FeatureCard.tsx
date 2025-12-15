/**
 * Feature Card Component
 * Interactive cards with icons and hover effects
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  FileEdit,
  LayoutGrid,
  Image,
  Palette,
  Users,
  Sparkles,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
  variant?: 'default' | 'highlighted' | 'minimal';
  className?: string;
}

const iconMap = {
  lightbulb: Lightbulb,
  edit: FileEdit,
  layout: LayoutGrid,
  image: Image,
  palette: Palette,
  users: Users,
  sparkles: Sparkles,
  zap: Zap,
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon = 'sparkles',
  variant = 'default',
  className = '',
}) => {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Sparkles;

  const variants = {
    default: 'bg-white border-[#D4E5D4]',
    highlighted: 'bg-[#6B8E6B] text-white border-[#5A7A5A]',
    minimal: 'bg-[#F5FAF7] border-[#D4E5D4]',
  };

  const iconVariants = {
    default: 'text-[#6B8E6B] bg-[#6B8E6B]/10',
    highlighted: 'text-white bg-white/20',
    minimal: 'text-[#6B8E6B] bg-white',
  };

  return (
    <motion.div
      className={`
        relative p-8 rounded-3xl border
        shadow-[0_4px_24px_rgba(107,142,107,0.08)]
        overflow-hidden
        ${variants[variant]}
        ${className}
      `}
      whileHover={{
        y: -4,
        boxShadow: '0 12px 48px rgba(107, 142, 107, 0.12)',
        transition: { duration: 0.2 },
      }}
    >
      {/* Icon */}
      <motion.div
        className={`
          w-14 h-14 rounded-2xl flex items-center justify-center mb-6
          ${iconVariants[variant]}
        `}
        whileHover={{ rotate: 5, scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <IconComponent className="w-7 h-7" />
      </motion.div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p
        className={`
        text-sm leading-relaxed
        ${variant === 'highlighted' ? 'text-white/90' : 'text-[#4A5D4A]'}
      `}
      >
        {description}
      </p>

      {/* Hover arrow */}
      <motion.div
        className="absolute bottom-6 right-6"
        initial={{ opacity: 0, x: -10 }}
        whileHover={{ opacity: 1, x: 0 }}
      >
        <ArrowRight
          className={`w-5 h-5 ${
            variant === 'highlighted' ? 'text-white/70' : 'text-[#6B8E6B]'
          }`}
        />
      </motion.div>

      {/* Decorative element */}
      <motion.div
        className={`
          absolute -right-6 -bottom-6 w-24 h-24 rounded-full
          ${variant === 'highlighted' ? 'bg-white/10' : 'bg-[#6B8E6B]/5'}
        `}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

// Stat card variant
interface StatCardProps {
  stat: string;
  label: string;
  trend?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  stat,
  label,
  trend,
  className = '',
}) => {
  return (
    <motion.div
      className={`
        p-8 rounded-3xl bg-[#EDF5F0] border border-[#D4E5D4]
        shadow-[0_4px_24px_rgba(107,142,107,0.08)]
        ${className}
      `}
      whileHover={{
        y: -4,
        boxShadow: '0 12px 48px rgba(107, 142, 107, 0.12)',
        transition: { duration: 0.2 },
      }}
    >
      <motion.div
        className="text-5xl font-bold text-[#6B8E6B] mb-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {stat}
      </motion.div>
      <div className="text-sm text-[#4A5D4A] mb-1">{label}</div>
      {trend && (
        <div className="text-xs text-[#8FA58F] flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {trend}
        </div>
      )}
    </motion.div>
  );
};

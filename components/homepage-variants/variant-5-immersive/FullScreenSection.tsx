/**
 * FullScreenSection - Reusable full-viewport section wrapper
 * Handles scroll-snap behavior and section styling
 */

import React from 'react';
import { motion } from 'framer-motion';

interface FullScreenSectionProps {
  children: React.ReactNode;
  id: string;
  backgroundColor?: string;
  className?: string;
  parallax?: boolean;
}

export const FullScreenSection: React.FC<FullScreenSectionProps> = ({
  children,
  id,
  backgroundColor = '#FFFFFF',
  className = '',
  parallax = false,
}) => {
  return (
    <section
      id={id}
      className={`relative min-h-screen h-screen flex items-center justify-center snap-start snap-always overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      {/* Parallax background layer */}
      {parallax && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: 0 }}
          whileInView={{ y: -50 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: false, amount: 0.5 }}
        />
      )}

      {/* Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {children}
      </div>
    </section>
  );
};

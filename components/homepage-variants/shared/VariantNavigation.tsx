/**
 * Variant Navigation Component
 * Floating pill to switch between homepage variants
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Layers, X, Check } from 'lucide-react';
import { tokens, tw } from './tokens';

export interface VariantInfo {
  id: number;
  name: string;
  description: string;
  color: string;
}

export const variantList: VariantInfo[] = [
  { id: 1, name: 'Refined', description: 'Current layout with Bento Matcha palette', color: '#6B8E6B' },
  { id: 2, name: 'Editorial', description: 'Magazine-style with SVG illustrations', color: '#8B7355' },
  { id: 3, name: 'Minimal', description: 'Typography-first with maximum whitespace', color: '#4A5D4A' },
  { id: 4, name: 'Bento', description: 'Interactive card-based grid layout', color: '#7BA37B' },
  { id: 5, name: 'Immersive', description: 'Full-screen sections with scroll-snap', color: '#5A7A5A' },
];

interface VariantNavigationProps {
  current: number;
  onChange: (id: number) => void;
}

export const VariantNavigation: React.FC<VariantNavigationProps> = ({ current, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentVariant = variantList.find(v => v.id === current) || variantList[0];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers 1-5 to switch variants
      if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          onChange(parseInt(e.key));
          setIsExpanded(false);
        }
      }
      // Escape to close
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChange]);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Navigation Panel */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(107,142,107,0.2)] border border-[#D4E5D4] overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-[#D4E5D4] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6B8E6B]/10 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-[#6B8E6B]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1E2E1E]">Homepage Variants</h3>
                    <p className="text-xs text-[#8FA58F]">Press 1-5 to switch</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="w-8 h-8 rounded-lg hover:bg-[#EDF5F0] flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-[#4A5D4A]" />
                </button>
              </div>

              {/* Variant List */}
              <div className="p-2 space-y-1">
                {variantList.map((variant) => (
                  <motion.button
                    key={variant.id}
                    className={`w-full px-4 py-3 rounded-xl text-left transition-all flex items-center gap-4 ${
                      current === variant.id
                        ? 'bg-[#6B8E6B]/10'
                        : 'hover:bg-[#EDF5F0]'
                    }`}
                    onClick={() => {
                      onChange(variant.id);
                      setIsExpanded(false);
                    }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Number Badge */}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold text-white shrink-0"
                      style={{ backgroundColor: variant.color }}
                    >
                      {variant.id}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#1E2E1E]">{variant.name}</span>
                        {current === variant.id && (
                          <Check className="w-4 h-4 text-[#6B8E6B]" />
                        )}
                      </div>
                      <p className="text-xs text-[#8FA58F] truncate">{variant.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-[#F5FAF7] border-t border-[#D4E5D4]">
                <p className="text-xs text-[#8FA58F] text-center">
                  Choose the design that feels right for DeckSnap
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              className="group flex items-center gap-3 px-4 py-3 bg-white rounded-full shadow-[0_8px_32px_rgba(107,142,107,0.15)] border border-[#D4E5D4] hover:shadow-[0_12px_48px_rgba(107,142,107,0.2)] transition-all"
              onClick={() => setIsExpanded(true)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Current Variant Badge */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-semibold text-white"
                style={{ backgroundColor: currentVariant.color }}
              >
                {current}
              </div>

              {/* Label */}
              <div className="flex flex-col items-start">
                <span className="text-xs text-[#8FA58F] leading-tight">Variant</span>
                <span className="text-sm font-medium text-[#1E2E1E] leading-tight">{currentVariant.name}</span>
              </div>

              {/* Expand Icon */}
              <motion.div
                className="ml-1"
                animate={{ rotate: isExpanded ? 180 : 0 }}
              >
                <ChevronUp className="w-4 h-4 text-[#8FA58F] group-hover:text-[#6B8E6B] transition-colors" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Keyboard Shortcut Hint (shown briefly on load) */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-[#D4E5D4] shadow-sm">
          <span className="text-xs text-[#8FA58F]">Press</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <kbd
                key={n}
                className={`w-5 h-5 rounded text-xs flex items-center justify-center transition-colors ${
                  current === n
                    ? 'bg-[#6B8E6B] text-white'
                    : 'bg-[#EDF5F0] text-[#4A5D4A]'
                }`}
              >
                {n}
              </kbd>
            ))}
          </div>
          <span className="text-xs text-[#8FA58F]">to switch</span>
        </div>
      </motion.div>
    </>
  );
};

export default VariantNavigation;

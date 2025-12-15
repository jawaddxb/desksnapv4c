/**
 * ShortcutsOverlay
 *
 * Keyboard shortcuts documentation overlay.
 * Press "?" to show available shortcuts for current context.
 *
 * KISS: Static display component, < 80 lines
 * SOLID-S: Only renders shortcut documentation
 * DRY: Reads from config/shortcuts.ts
 */

import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { SHORTCUT_CATEGORIES } from '@/config/shortcuts';

interface ShortcutsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  context?: 'editing' | 'presenting';
}

export const ShortcutsOverlay: React.FC<ShortcutsOverlayProps> = ({
  isOpen,
  onClose,
  context = 'editing',
}) => {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#1E2E1E]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4 bg-white border border-[#D4E5D4] rounded-lg shadow-[0_8px_32px_rgba(107,142,107,0.15)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4E5D4]">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#6B8E6B]" />
            <h2 className="text-lg font-bold text-[#1E2E1E]">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8FA58F] hover:text-[#1E2E1E] hover:bg-[#EDF5F0] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {SHORTCUT_CATEGORIES.map((category) => {
              const relevantShortcuts = category.shortcuts.filter(
                (s) => !s.context || s.context === context || s.context === 'any'
              );
              if (relevantShortcuts.length === 0) return null;

              return (
                <div key={category.name}>
                  <h3 className="text-xs font-bold text-[#8FA58F] uppercase tracking-wider mb-3">
                    {category.name}
                  </h3>
                  <div className="space-y-2">
                    {relevantShortcuts.map((shortcut, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5">
                        <span className="text-sm text-[#4A5D4A]">{shortcut.description}</span>
                        <kbd className="px-2 py-1 bg-[#F5FAF7] border border-[#D4E5D4] rounded text-xs font-mono text-[#1E2E1E]">
                          {shortcut.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#D4E5D4] bg-[#F5FAF7]">
          <p className="text-xs text-[#8FA58F] text-center">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-[#D4E5D4] rounded text-[10px] font-mono">?</kbd> anytime to show this overlay
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * PrototypeSwitcher Component
 *
 * Floating navigation bar to browse between homepage variations.
 * Features keyboard shortcuts (1-0), collapse toggle, and preview thumbnails.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { PROTOTYPE_LIST } from './shared/types';

export const PrototypeSwitcher: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Get current prototype ID from URL
  const currentId = location.pathname.split('/').pop() || 'studio-noir';
  const currentIndex = PROTOTYPE_LIST.findIndex((p) => p.id === currentId);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Number keys 1-9, 0 for 10th
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (index < PROTOTYPE_LIST.length) {
          navigate(`/prototypes/${PROTOTYPE_LIST[index].id}`);
        }
      } else if (e.key === '0') {
        // 0 = 10th item (index 9)
        if (PROTOTYPE_LIST.length >= 10) {
          navigate(`/prototypes/${PROTOTYPE_LIST[9].id}`);
        }
      } else if (e.key === 'Escape') {
        // Toggle collapsed state
        setIsCollapsed((prev) => !prev);
      } else if (e.key === 'ArrowLeft') {
        // Previous prototype
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : PROTOTYPE_LIST.length - 1;
        navigate(`/prototypes/${PROTOTYPE_LIST[prevIndex].id}`);
      } else if (e.key === 'ArrowRight') {
        // Next prototype
        const nextIndex = currentIndex < PROTOTYPE_LIST.length - 1 ? currentIndex + 1 : 0;
        navigate(`/prototypes/${PROTOTYPE_LIST[nextIndex].id}`);
      } else if (e.key === 'h' || e.key === 'H') {
        // Hide completely
        setIsHidden((prev) => !prev);
      }
    },
    [navigate, currentIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (isHidden) {
    return (
      <button
        onClick={() => setIsHidden(false)}
        className="fixed top-4 right-4 z-[9999] w-10 h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
        title="Show switcher (H)"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
        isCollapsed ? 'w-auto' : 'w-auto max-w-[95vw]'
      }`}
    >
      <div className="bg-black/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-white/60">
              {currentIndex + 1}/{PROTOTYPE_LIST.length}
            </span>
            <span className="text-sm font-medium text-white">
              {PROTOTYPE_LIST[currentIndex]?.name || 'Unknown'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title={isCollapsed ? 'Expand (Esc)' : 'Collapse (Esc)'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsHidden(true)}
              className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Hide (H)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Prototype List */}
        {!isCollapsed && (
          <div className="p-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {PROTOTYPE_LIST.map((proto, index) => {
                const isActive = proto.id === currentId;
                const keyHint = index < 9 ? index + 1 : index === 9 ? 0 : null;

                return (
                  <button
                    key={proto.id}
                    onClick={() => navigate(`/prototypes/${proto.id}`)}
                    className={`group relative flex-shrink-0 p-2 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white/20 ring-2 ring-white/40'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                    title={`${proto.name} - ${proto.description}`}
                  >
                    {/* Color Preview */}
                    <div className="flex gap-0.5 mb-1.5">
                      {proto.previewColors.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-sm first:rounded-l-md last:rounded-r-md"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {/* Name */}
                    <span
                      className={`text-xs whitespace-nowrap ${
                        isActive ? 'text-white font-medium' : 'text-white/70'
                      }`}
                    >
                      {proto.name}
                    </span>

                    {/* Keyboard Shortcut */}
                    {keyHint !== null && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-white/20 rounded text-[10px] text-white/60 flex items-center justify-center">
                        {keyHint}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Keyboard hints */}
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-center gap-4 text-[10px] text-white/40">
              <span>1-0: Quick select</span>
              <span>←→: Navigate</span>
              <span>Esc: Collapse</span>
              <span>H: Hide</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrototypeSwitcher;

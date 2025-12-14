import React, { useState, useEffect, useCallback } from 'react';
import { DESIGN_SYSTEMS, DesignSystem, getSystemById } from './themes';
import { ThemeNav } from './ThemeNav';
import { ThemeSwatch } from './ThemeSwatch';
import { DashboardDemo } from './DashboardDemo';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface DesignShowcaseProps {
  onClose?: () => void;
}

/**
 * DesignShowcase - Main component for browsing 20 distinct design systems
 * Features:
 * - Theme navigation sidebar with style indicators
 * - Live dashboard preview with theme-specific layouts
 * - Theme info panel with comprehensive design properties
 * - Keyboard navigation
 * - Fullscreen mode
 */
export const DesignShowcase: React.FC<DesignShowcaseProps> = ({ onClose }) => {
  const [activeSystemId, setActiveSystemId] = useState(DESIGN_SYSTEMS[0].id);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const activeSystem = getSystemById(activeSystemId) || DESIGN_SYSTEMS[0];
  const currentIndex = DESIGN_SYSTEMS.findIndex(s => s.id === activeSystemId);

  // Navigate to next/previous system
  const navigateSystem = useCallback((direction: 'next' | 'prev') => {
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % DESIGN_SYSTEMS.length
      : (currentIndex - 1 + DESIGN_SYSTEMS.length) % DESIGN_SYSTEMS.length;
    setActiveSystemId(DESIGN_SYSTEMS[newIndex].id);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close
      if (e.key === 'Escape' && onClose) {
        onClose();
        return;
      }

      // Arrow keys to navigate
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        navigateSystem('next');
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        navigateSystem('prev');
        return;
      }

      // Number keys 1-9, 0 for quick access
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (index < DESIGN_SYSTEMS.length) {
          setActiveSystemId(DESIGN_SYSTEMS[index].id);
        }
        return;
      }
      if (e.key === '0' && DESIGN_SYSTEMS.length > 9) {
        setActiveSystemId(DESIGN_SYSTEMS[9].id);
        return;
      }

      // Toggle fullscreen with 'f'
      if (e.key === 'f') {
        setIsFullscreen(prev => !prev);
        return;
      }

      // Toggle info panel with 'i'
      if (e.key === 'i') {
        setShowInfo(prev => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateSystem, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex bg-gray-100">
      {/* Theme Navigation Sidebar */}
      {!isFullscreen && (
        <ThemeNav
          themes={DESIGN_SYSTEMS}
          activeThemeId={activeSystemId}
          onSelectTheme={setActiveSystemId}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex-none h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Navigation arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigateSystem('prev')}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500 min-w-[60px] text-center">
                {currentIndex + 1} / {DESIGN_SYSTEMS.length}
              </span>
              <button
                onClick={() => navigateSystem('next')}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-200" />

            {/* Current theme name */}
            <div>
              <h2 className="font-semibold text-gray-900">{activeSystem.name}</h2>
              <p className="text-xs text-gray-500">{activeSystem.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle info */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                showInfo ? 'bg-gray-100 text-gray-700' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {showInfo ? 'Hide Info' : 'Show Info'}
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-gray-600" />
              ) : (
                <Maximize2 className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Dashboard Preview */}
          <div className="flex-1 overflow-hidden">
            <DashboardDemo theme={activeSystem} />
          </div>

          {/* Info Panel */}
          {showInfo && !isFullscreen && (
            <div className="w-80 flex-none border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
              <ThemeSwatch theme={activeSystem} />

              {/* Keyboard Shortcuts */}
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Keyboard Shortcuts
                </h4>
                <div className="space-y-2 text-xs">
                  {[
                    { key: '← →', desc: 'Navigate themes' },
                    { key: '1-9, 0', desc: 'Quick select' },
                    { key: 'F', desc: 'Toggle fullscreen' },
                    { key: 'I', desc: 'Toggle info panel' },
                    { key: 'Esc', desc: 'Close showcase' },
                  ].map(({ key, desc }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-gray-500">{desc}</span>
                      <kbd className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-mono">
                        {key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignShowcase;

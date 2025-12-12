import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface FeatureTooltipProps {
  id: string;
  title: string;
  description: string;
  isVisible: boolean;
  onDismiss: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

export const FeatureTooltip: React.FC<FeatureTooltipProps> = ({
  title,
  description,
  isVisible,
  onDismiss,
  position = 'bottom',
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      // Small delay to allow for smooth entrance
      const timer = setTimeout(() => setShowTooltip(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowTooltip(false);
    }
  }, [isVisible]);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#c5a47e] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#c5a47e] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#c5a47e] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#c5a47e] border-y-transparent border-l-transparent',
  };

  return (
    <div ref={containerRef} className="relative inline-block">
      {children}

      {/* Tooltip */}
      {showTooltip && isVisible && (
        <>
          {/* Backdrop pulse effect */}
          <div className="absolute inset-0 animate-pulse ring-2 ring-[#c5a47e]/50 pointer-events-none" />

          {/* Tooltip content */}
          <div
            className={`absolute z-50 w-64 ${positionClasses[position]} animate-fadeIn`}
          >
            <div className="bg-[#1a1a1a] border border-[#c5a47e]/50 shadow-lg shadow-black/50">
              {/* Header */}
              <div className="px-4 py-3 border-b border-[#c5a47e]/20 flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-white">{title}</h4>
                <button
                  onClick={onDismiss}
                  className="p-0.5 text-white/40 hover:text-white transition-colors duration-150 flex-shrink-0"
                  aria-label="Dismiss tip"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-4 py-3">
                <p className="text-xs text-white/60 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 bg-black/30 border-t border-white/5">
                <button
                  onClick={onDismiss}
                  className="text-xs text-[#c5a47e] hover:text-white transition-colors duration-150"
                >
                  Got it
                </button>
              </div>
            </div>

            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 border-8 ${arrowClasses[position]}`}
            />
          </div>
        </>
      )}
    </div>
  );
};

// Simple inline tip for tab explanations
interface TabTipProps {
  text: string;
  isVisible: boolean;
  onDismiss: () => void;
}

export const TabTip: React.FC<TabTipProps> = ({ text, isVisible, onDismiss }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 mt-1 z-50 animate-fadeIn">
      <div className="bg-[#c5a47e] text-black px-3 py-1.5 text-xs font-medium shadow-lg flex items-center gap-2">
        <span>{text}</span>
        <button
          onClick={onDismiss}
          className="p-0.5 hover:bg-black/10 transition-colors duration-150"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      {/* Arrow pointing up */}
      <div className="absolute bottom-full left-4 w-0 h-0 border-8 border-t-transparent border-x-transparent border-b-[#c5a47e]" />
    </div>
  );
};

/**
 * RemixDialog Component
 *
 * Dialog shown when user clicks "Remix All" button.
 * Allows selecting a new theme before remixing images.
 */

import React, { useState } from 'react';
import { X, Shuffle, Check, FileSpreadsheet } from 'lucide-react';
import { THEMES } from '../lib/themes';
import { isPptxSafe } from '../lib/fontCompatibility';
import { getThemeThumbnailPath } from '../services/thumbnailService';

export interface RemixDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onConfirm: (newThemeId?: string) => void;
}

export const RemixDialog: React.FC<RemixDialogProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onConfirm,
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState(currentThemeId);

  if (!isOpen) return null;

  const currentTheme = THEMES[currentThemeId];
  const selectedTheme = THEMES[selectedThemeId];
  const hasThemeChanged = selectedThemeId !== currentThemeId;

  const handleRemixKeepTheme = () => {
    onConfirm(); // No theme change
    onClose();
  };

  const handleRemixWithNewTheme = () => {
    onConfirm(selectedThemeId);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] bg-[#111111] border border-white/20 shadow-2xl z-[1001] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c5a47e]/20 rounded">
              <Shuffle className="w-5 h-5 text-[#c5a47e]" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">
              Remix All Slides
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Description */}
          <p className="text-sm text-white/70">
            Remix applies creative variations (lighting, composition, mood) to all images.
            Optionally select a new theme to change the visual style.
          </p>

          {/* Current Theme Indicator */}
          <div className="flex items-center gap-3 p-3 bg-black/50 border border-white/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
              Current:
            </span>
            <span className="text-sm font-bold text-white">{currentTheme?.name}</span>
            {hasThemeChanged && (
              <>
                <span className="text-white/40">→</span>
                <span className="text-sm font-bold text-[#c5a47e]">{selectedTheme?.name}</span>
              </>
            )}
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto p-1">
            {Object.values(THEMES).map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedThemeId(theme.id)}
                className={`group relative flex flex-col items-start text-left transition-all duration-150 p-1 ${
                  selectedThemeId === theme.id
                    ? 'bg-white/10 ring-1 ring-[#c5a47e]'
                    : 'hover:bg-white/5'
                }`}
              >
                <div
                  className="w-full h-24 mb-2 relative overflow-hidden shadow-sm transition-transform duration-150 group-hover:scale-[1.01]"
                  style={{
                    background: theme.colors.background,
                    border: `${theme.layout.borderWidth} solid ${theme.colors.border}`,
                    borderRadius: theme.layout.radius,
                  }}
                >
                  {/* Thumbnail image with fallback */}
                  <img
                    src={getThemeThumbnailPath(theme.id)}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback: inline color preview */}
                  <div
                    className="hidden absolute inset-0 flex-col p-3"
                    style={{ background: theme.colors.background }}
                  >
                    <div className="relative z-10 mt-auto">
                      <div
                        className="text-xl leading-none"
                        style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}
                      >
                        Aa
                      </div>
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {selectedThemeId === theme.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#c5a47e] text-black flex items-center justify-center shadow-md z-20">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                  )}

                  {/* Current theme badge */}
                  {currentThemeId === theme.id && selectedThemeId !== theme.id && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-white/20 text-white text-[8px] font-bold uppercase tracking-wider z-20">
                      Current
                    </div>
                  )}

                  {/* PowerPoint Safe Badge */}
                  {isPptxSafe(theme) && (
                    <div className="absolute bottom-1 left-1 px-1 py-0.5 bg-emerald-500/90 text-white text-[7px] font-bold uppercase tracking-wider flex items-center gap-0.5 z-20">
                      <FileSpreadsheet className="w-2 h-2" />
                      PPT
                    </div>
                  )}
                </div>
                <div className="px-1 w-full">
                  <span className="text-xs font-bold text-white">{theme.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-5 pt-0">
          <button
            onClick={handleRemixKeepTheme}
            className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/70 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            Remix
          </button>
          <button
            onClick={handleRemixWithNewTheme}
            disabled={!hasThemeChanged}
            className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black bg-[#c5a47e] hover:bg-[#b8956f] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Shuffle className="w-4 h-4" />
            Remix + Change Theme
          </button>
        </div>
      </div>
    </>
  );
};

export default RemixDialog;

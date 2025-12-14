/**
 * RemixDialog Component
 *
 * Dialog shown when user clicks "Remix All" button.
 * Allows selecting a new theme before remixing images.
 */

import React, { useState } from 'react';
import { Shuffle } from 'lucide-react';
import { THEMES } from '@/config/themes';
import { ThemePicker } from './shared/ThemePicker';
import { Dialog, DialogButton } from './shared/Dialog';

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
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Remix All Slides"
      icon={Shuffle}
      maxWidth="lg"
      actions={
        <>
          <button onClick={handleRemixKeepTheme} className={DialogButton.secondary}>
            <Shuffle className="w-4 h-4" />
            Remix
          </button>
          <button
            onClick={handleRemixWithNewTheme}
            disabled={!hasThemeChanged}
            className={DialogButton.primaryDisabled}
          >
            <Shuffle className="w-4 h-4" />
            Remix + Change Theme
          </button>
        </>
      }
    >
      {/* Description */}
      <p className="text-sm text-[#4A5D4A]">
        Remix applies creative variations (lighting, composition, mood) to all images.
        Optionally select a new theme to change the visual style.
      </p>

      {/* Current Theme Indicator */}
      <div className="flex items-center gap-3 p-3 bg-[#F5FAF7] border border-[#D4E5D4] rounded-lg">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8FA58F]">
          Current:
        </span>
        <span className="text-sm font-bold text-[#1E2E1E]">{currentTheme?.name}</span>
        {hasThemeChanged && (
          <>
            <span className="text-[#8FA58F]">→</span>
            <span className="text-sm font-bold text-[#6B8E6B]">{selectedTheme?.name}</span>
          </>
        )}
      </div>

      {/* Theme Grid */}
      <ThemePicker
        selectedThemeId={selectedThemeId}
        onSelect={setSelectedThemeId}
        currentThemeId={currentThemeId}
        size="compact"
        gap="compact"
        maxHeight="40vh"
      />
    </Dialog>
  );
};

export default RemixDialog;

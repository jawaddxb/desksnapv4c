/**
 * ArchetypeChangeDialog Component
 *
 * Confirmation dialog shown when user switches archetypes.
 * Asks if they want to regenerate images with the new archetype's aesthetic.
 */

import React from 'react';
import { X, Image, RefreshCw, ArrowRight } from 'lucide-react';
import { getArchetypeVisualStyle } from '../lib/archetypeVisualStyles';
import { findArchetype } from '../lib/archetypeCategories';

export interface ArchetypeChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  previousArchetype: string;
  newArchetype: string;
  onConfirm: (regenerateImages: boolean) => void;
}

export const ArchetypeChangeDialog: React.FC<ArchetypeChangeDialogProps> = ({
  isOpen,
  onClose,
  previousArchetype,
  newArchetype,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const prevInfo = findArchetype(previousArchetype);
  const newInfo = findArchetype(newArchetype);
  const newStyle = getArchetypeVisualStyle(newArchetype);

  const handleKeepImages = () => {
    onConfirm(false);
    onClose();
  };

  const handleRegenerateImages = () => {
    onConfirm(true);
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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-[#111111] border border-white/20 shadow-2xl z-[1001] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c5a47e]/20 rounded">
              <Image className="w-5 h-5 text-[#c5a47e]" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">
              Update Images?
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
          {/* Archetype Change Visual */}
          <div className="flex items-center justify-center gap-4 py-3">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded border border-white/20 mb-2 mx-auto"
                style={{
                  background: prevInfo
                    ? `linear-gradient(135deg, ${prevInfo.previewColors[0]}, ${prevInfo.previewColors[1]})`
                    : '#333',
                }}
              />
              <span className="text-xs text-white/60">{previousArchetype}</span>
            </div>

            <ArrowRight className="w-5 h-5 text-white/40" />

            <div className="text-center">
              <div
                className="w-16 h-16 rounded border-2 border-[#c5a47e] mb-2 mx-auto"
                style={{
                  background: newInfo
                    ? `linear-gradient(135deg, ${newInfo.previewColors[0]}, ${newInfo.previewColors[1]})`
                    : '#333',
                }}
              />
              <span className="text-xs text-[#c5a47e] font-bold">{newArchetype}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-white/70 text-center">
            You switched to <span className="text-white font-medium">{newArchetype}</span>.
            Would you like to regenerate all images to match this aesthetic?
          </p>

          {/* New Style Preview */}
          <div className="bg-black/50 border border-white/10 p-3 rounded">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-2">
              New Image Aesthetic
            </span>
            <p className="text-xs text-white/60 italic line-clamp-2">
              "{newStyle}"
            </p>
          </div>

          {/* Warning */}
          <p className="text-xs text-white/40 text-center">
            Regenerating will replace all current images. This may take a moment.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-5 pt-0">
          <button
            onClick={handleKeepImages}
            className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/70 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
          >
            Keep Current Images
          </button>
          <button
            onClick={handleRegenerateImages}
            className="flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black bg-[#c5a47e] hover:bg-[#b8956f] transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate All
          </button>
        </div>
      </div>
    </>
  );
};

export default ArchetypeChangeDialog;

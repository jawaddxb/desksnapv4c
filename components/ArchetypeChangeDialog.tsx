/**
 * ArchetypeChangeDialog Component
 *
 * Confirmation dialog shown when user switches archetypes.
 * Asks if they want to regenerate images with the new archetype's aesthetic.
 */

import React from 'react';
import { Image, RefreshCw, ArrowRight } from 'lucide-react';
import { getArchetypeVisualStyle } from '@/lib/archetypeVisualStyles';
import { findArchetype } from '@/lib/archetypeCategories';
import { Dialog, DialogButton } from './shared/Dialog';

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
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Update Images?"
      icon={Image}
      actions={
        <>
          <button onClick={handleKeepImages} className={DialogButton.secondary}>
            Keep Current Images
          </button>
          <button onClick={handleRegenerateImages} className={DialogButton.primary}>
            <RefreshCw className="w-4 h-4" />
            Regenerate All
          </button>
        </>
      }
    >
      {/* Archetype Change Visual */}
      <div className="flex items-center justify-center gap-4 py-3">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-lg border border-[#D4E5D4] mb-2 mx-auto"
            style={{
              background: prevInfo
                ? `linear-gradient(135deg, ${prevInfo.previewColors[0]}, ${prevInfo.previewColors[1]})`
                : '#f5f5f5',
            }}
          />
          <span className="text-xs text-[#8FA58F]">{previousArchetype}</span>
        </div>

        <ArrowRight className="w-5 h-5 text-[#8FA58F]" />

        <div className="text-center">
          <div
            className="w-16 h-16 rounded-lg border-2 border-[#6B8E6B] mb-2 mx-auto"
            style={{
              background: newInfo
                ? `linear-gradient(135deg, ${newInfo.previewColors[0]}, ${newInfo.previewColors[1]})`
                : '#f5f5f5',
            }}
          />
          <span className="text-xs text-[#6B8E6B] font-bold">{newArchetype}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[#4A5D4A] text-center">
        You switched to <span className="text-[#1E2E1E] font-medium">{newArchetype}</span>.
        Would you like to regenerate all images to match this aesthetic?
      </p>

      {/* New Style Preview */}
      <div className="bg-[#EDF5F0] border border-[#D4E5D4] p-3 rounded-lg">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8FA58F] block mb-2">
          New Image Aesthetic
        </span>
        <p className="text-xs text-[#4A5D4A] italic line-clamp-2">
          "{newStyle}"
        </p>
      </div>

      {/* Warning */}
      <p className="text-xs text-[#8FA58F] text-center">
        Regenerating will replace all current images. This may take a moment.
      </p>
    </Dialog>
  );
};

export default ArchetypeChangeDialog;

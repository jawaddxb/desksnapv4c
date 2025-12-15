/**
 * LayoutPreviewThumbnail
 *
 * Mini visual previews for layout types.
 * Shows simplified diagram of each layout structure.
 *
 * KISS: CSS-only preview boxes < 60 lines
 * SOLID-S: Only renders layout preview
 * DRY: Configured by layout type
 */

import React from 'react';
import { LayoutType } from '@/types';

interface LayoutPreviewThumbnailProps {
  layoutType: LayoutType;
}

// Placeholder colors for content areas
const TEXT_BG = '#6B8E6B';
const IMAGE_BG = '#D4E5D4';

export const LayoutPreviewThumbnail: React.FC<LayoutPreviewThumbnailProps> = ({
  layoutType,
}) => {
  const baseClass = 'w-full h-full rounded bg-[#F5FAF7] overflow-hidden';

  switch (layoutType) {
    case 'split':
      return (
        <div className={`${baseClass} flex`}>
          <div className="w-1/2 h-full p-1">
            <div className="w-full h-2 rounded-sm mb-1" style={{ backgroundColor: TEXT_BG }} />
            <div className="w-3/4 h-1.5 rounded-sm mb-0.5" style={{ backgroundColor: TEXT_BG, opacity: 0.5 }} />
            <div className="w-2/3 h-1.5 rounded-sm" style={{ backgroundColor: TEXT_BG, opacity: 0.5 }} />
          </div>
          <div className="w-1/2 h-full p-1">
            <div className="w-full h-full rounded" style={{ backgroundColor: IMAGE_BG }} />
          </div>
        </div>
      );

    case 'full-bleed':
      return (
        <div className={`${baseClass} relative`}>
          <div className="absolute inset-0" style={{ backgroundColor: IMAGE_BG }} />
          <div className="absolute bottom-1 left-1 right-1">
            <div className="w-1/2 h-2 rounded-sm mb-0.5" style={{ backgroundColor: TEXT_BG }} />
            <div className="w-1/3 h-1.5 rounded-sm" style={{ backgroundColor: TEXT_BG, opacity: 0.5 }} />
          </div>
        </div>
      );

    case 'statement':
      return (
        <div className={`${baseClass} flex items-center justify-center p-2`}>
          <div className="text-center">
            <div className="w-16 h-2 mx-auto rounded-sm mb-1" style={{ backgroundColor: TEXT_BG }} />
            <div className="w-12 h-1.5 mx-auto rounded-sm" style={{ backgroundColor: TEXT_BG, opacity: 0.5 }} />
          </div>
        </div>
      );

    case 'gallery':
      return (
        <div className={`${baseClass} p-1`}>
          <div className="w-full h-2 rounded-sm mb-1" style={{ backgroundColor: TEXT_BG }} />
          <div className="grid grid-cols-3 gap-0.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square rounded-sm" style={{ backgroundColor: IMAGE_BG }} />
            ))}
          </div>
        </div>
      );

    case 'card':
      return (
        <div className={`${baseClass} p-1.5`}>
          <div className="w-full h-full rounded border border-[#D4E5D4] p-1 bg-white">
            <div className="w-3/4 h-1.5 rounded-sm mb-1" style={{ backgroundColor: TEXT_BG }} />
            <div className="w-full h-6 rounded-sm mb-1" style={{ backgroundColor: IMAGE_BG }} />
            <div className="w-1/2 h-1 rounded-sm" style={{ backgroundColor: TEXT_BG, opacity: 0.5 }} />
          </div>
        </div>
      );

    case 'horizontal':
      return (
        <div className={`${baseClass} flex flex-col`}>
          <div className="h-1/2 p-1 flex items-center">
            <div>
              <div className="w-12 h-1.5 rounded-sm mb-0.5" style={{ backgroundColor: TEXT_BG }} />
              <div className="w-8 h-1 rounded-sm" style={{ backgroundColor: TEXT_BG, opacity: 0.5 }} />
            </div>
          </div>
          <div className="h-1/2 px-1 pb-1">
            <div className="w-full h-full rounded" style={{ backgroundColor: IMAGE_BG }} />
          </div>
        </div>
      );

    case 'magazine':
      return (
        <div className={`${baseClass} p-1`}>
          <div className="flex gap-1 mb-1">
            <div className="w-2/3">
              <div className="w-full h-1.5 rounded-sm mb-0.5" style={{ backgroundColor: TEXT_BG }} />
              <div className="w-2/3 h-1 rounded-sm" style={{ backgroundColor: TEXT_BG, opacity: 0.5 }} />
            </div>
            <div className="w-1/3 h-6 rounded" style={{ backgroundColor: IMAGE_BG }} />
          </div>
          <div className="w-full h-1 rounded-sm" style={{ backgroundColor: TEXT_BG, opacity: 0.3 }} />
        </div>
      );

    default:
      return <div className={baseClass} />;
  }
};

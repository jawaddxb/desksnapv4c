/**
 * LayoutDropdown
 *
 * Layout selection dropdown for toolbar with hover previews.
 * Replaces 7 layout buttons with single dropdown.
 *
 * KISS: Configuration-driven < 60 lines
 * SOLID-S: Only handles layout selection
 * DRY: Reuses ToolbarDropdown and LayoutPreviewThumbnail
 */

import React from 'react';
import { LayoutTemplate, Columns, Maximize2, Type, Smartphone, Square, Rows } from 'lucide-react';
import { ToolbarDropdown, DropdownOption } from './ToolbarDropdown';
import { LayoutPreviewThumbnail } from './LayoutPreviewThumbnail';
import { LayoutType } from '@/types';

const LAYOUT_OPTIONS: DropdownOption[] = [
  { id: 'split', label: 'Split', icon: Columns, preview: <LayoutPreviewThumbnail layoutType="split" /> },
  { id: 'magazine', label: 'Magazine', icon: Smartphone, preview: <LayoutPreviewThumbnail layoutType="magazine" /> },
  { id: 'horizontal', label: 'Horizontal', icon: Rows, preview: <LayoutPreviewThumbnail layoutType="horizontal" /> },
  { id: 'card', label: 'Card', icon: Square, preview: <LayoutPreviewThumbnail layoutType="card" /> },
  { id: 'full-bleed', label: 'Full Bleed', icon: Maximize2, preview: <LayoutPreviewThumbnail layoutType="full-bleed" /> },
  { id: 'statement', label: 'Statement', icon: Type, preview: <LayoutPreviewThumbnail layoutType="statement" /> },
  { id: 'gallery', label: 'Gallery', icon: LayoutTemplate, preview: <LayoutPreviewThumbnail layoutType="gallery" /> },
];

interface LayoutDropdownProps {
  selectedLayout: LayoutType;
  onSelect: (layout: LayoutType) => void;
  onHover?: (layout: LayoutType | null) => void;
}

export const LayoutDropdown: React.FC<LayoutDropdownProps> = ({
  selectedLayout,
  onSelect,
  onHover,
}) => {
  return (
    <ToolbarDropdown
      label="Layout"
      icon={LayoutTemplate}
      options={LAYOUT_OPTIONS}
      selectedId={selectedLayout}
      onSelect={(id) => onSelect(id as LayoutType)}
      onHover={(id) => onHover?.(id as LayoutType | null)}
      showPreviews
    />
  );
};

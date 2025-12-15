/**
 * AlignmentDropdown
 *
 * Text alignment dropdown for toolbar.
 * Replaces 3 alignment buttons with single dropdown.
 *
 * KISS: Configuration-driven < 40 lines
 * SOLID-S: Only handles alignment selection
 * DRY: Reuses ToolbarDropdown
 */

import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { ToolbarDropdown, DropdownOption } from './ToolbarDropdown';
import { Alignment } from '@/types';

const ALIGNMENT_OPTIONS: DropdownOption[] = [
  { id: 'left', label: 'Left', icon: AlignLeft },
  { id: 'center', label: 'Center', icon: AlignCenter },
  { id: 'right', label: 'Right', icon: AlignRight },
];

interface AlignmentDropdownProps {
  selectedAlignment: Alignment;
  onSelect: (alignment: Alignment) => void;
}

export const AlignmentDropdown: React.FC<AlignmentDropdownProps> = ({
  selectedAlignment,
  onSelect,
}) => {
  return (
    <ToolbarDropdown
      label="Align"
      icon={AlignLeft}
      options={ALIGNMENT_OPTIONS}
      selectedId={selectedAlignment}
      onSelect={(id) => onSelect(id as Alignment)}
    />
  );
};

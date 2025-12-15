/**
 * SelectionContext
 *
 * Unified selection state for contextual toolbar awareness.
 * Tracks what element is currently selected (none, slide, text, image, block).
 *
 * KISS: Simple discriminated union type, < 50 lines
 * SOLID-S: Only manages selection state, no side effects
 * DRY: Single source of truth for selection across app
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type SelectionType = 'none' | 'slide' | 'text' | 'image' | 'block';

interface SelectionState {
  type: SelectionType;
  elementId?: string;
  contentIndex?: number;
}

interface SelectionContextValue {
  selection: SelectionState;
  setSelection: (type: SelectionType, elementId?: string, contentIndex?: number) => void;
  clearSelection: () => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selection, setSelectionState] = useState<SelectionState>({ type: 'none' });

  const setSelection = useCallback((type: SelectionType, elementId?: string, contentIndex?: number) => {
    setSelectionState({ type, elementId, contentIndex });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectionState({ type: 'none' });
  }, []);

  return (
    <SelectionContext.Provider value={{ selection, setSelection, clearSelection }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = (): SelectionContextValue => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within SelectionProvider');
  }
  return context;
};

/** Safe hook that returns null when outside provider */
export const useSelectionSafe = (): SelectionContextValue | null => {
  return useContext(SelectionContext);
};

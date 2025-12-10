import React, { createContext, useContext, useState, useCallback } from 'react';
import { TextSelection } from '../types';

interface TextSelectionContextValue {
  selection: TextSelection;
  setSelection: (selection: TextSelection) => void;
  clearSelection: () => void;
}

const TextSelectionContext = createContext<TextSelectionContextValue | null>(null);

export const TextSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selection, setSelectionState] = useState<TextSelection>(null);

  const setSelection = useCallback((sel: TextSelection) => {
    setSelectionState(sel);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectionState(null);
  }, []);

  return (
    <TextSelectionContext.Provider value={{ selection, setSelection, clearSelection }}>
      {children}
    </TextSelectionContext.Provider>
  );
};

export const useTextSelection = () => {
  const ctx = useContext(TextSelectionContext);
  // Return a no-op context if not within provider (for standard mode / print mode)
  if (!ctx) {
    return {
      selection: null as TextSelection,
      setSelection: () => {},
      clearSelection: () => {},
    };
  }
  return ctx;
};

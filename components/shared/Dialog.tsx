/**
 * Dialog Component
 *
 * Shared dialog component that provides consistent structure:
 * - Backdrop with blur effect
 * - Centered modal container
 * - Header with icon, title, and close button
 * - Content area
 * - Actions area
 */

import React from 'react';
import { X, LucideIcon } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const MAX_WIDTH_CLASSES: Record<NonNullable<DialogProps['maxWidth']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-[600px]',
  xl: 'max-w-2xl',
};

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  icon: Icon,
  children,
  actions,
  maxWidth = 'md',
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] ${MAX_WIDTH_CLASSES[maxWidth]} bg-[#111111] border border-white/20 shadow-2xl z-[1001] overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c5a47e]/20 rounded">
              <Icon className="w-5 h-5 text-[#c5a47e]" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">
              {title}
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
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex gap-3 p-5 pt-0">
            {actions}
          </div>
        )}
      </div>
    </>
  );
};

// Common button styles for dialog actions
export const DialogButton = {
  secondary: 'flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest text-white/70 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2',
  primary: 'flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black bg-[#c5a47e] hover:bg-[#b8956f] transition-all flex items-center justify-center gap-2',
  primaryDisabled: 'flex-1 px-4 py-3 text-xs font-bold uppercase tracking-widest text-black bg-[#c5a47e] hover:bg-[#b8956f] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2',
};

export default Dialog;

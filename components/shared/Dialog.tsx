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
        className="fixed inset-0 bg-[#1E2E1E]/40 backdrop-blur-sm z-[1000]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] ${MAX_WIDTH_CLASSES[maxWidth]} bg-white border border-[#D4E5D4] shadow-[0_12px_48px_rgba(107,142,107,0.12)] rounded-lg z-[1001] overflow-hidden animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4E5D4]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6B8E6B]/10 rounded-md">
              <Icon className="w-5 h-5 text-[#6B8E6B]" />
            </div>
            <h2 className="text-sm font-medium tracking-wide text-[#1E2E1E]">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#EDF5F0] transition-colors rounded-md"
          >
            <X className="w-4 h-4 text-[#4A5D4A]" />
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
  secondary: 'flex-1 px-4 py-3 text-xs font-medium tracking-wide text-[#4A5D4A] bg-[#EDF5F0] hover:bg-[#D4E5D4] border border-[#D4E5D4] rounded-md transition-all flex items-center justify-center gap-2',
  primary: 'flex-1 px-4 py-3 text-xs font-medium tracking-wide text-white bg-[#6B8E6B] hover:bg-[#5A7A5A] rounded-md transition-all flex items-center justify-center gap-2',
  primaryDisabled: 'flex-1 px-4 py-3 text-xs font-medium tracking-wide text-white bg-[#6B8E6B] hover:bg-[#5A7A5A] disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition-all flex items-center justify-center gap-2',
};

export default Dialog;

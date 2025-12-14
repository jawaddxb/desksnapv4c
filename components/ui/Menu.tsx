/**
 * Menu Components
 *
 * Reusable dropdown menu system with submenus.
 * Used for theme selection, AI refinement menus, etc.
 */

import React, { useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

// ============ Menu Root ============

export interface MenuProps {
  /** Whether the menu is open */
  isOpen: boolean;
  /** Handler to close the menu */
  onClose: () => void;
  /** Menu content */
  children: ReactNode;
  /** Positioning (default: dropdown) */
  position?: 'dropdown' | 'popup';
  /** Alignment relative to trigger */
  align?: 'left' | 'center' | 'right';
  /** Additional className */
  className?: string;
}

export const Menu: React.FC<MenuProps> = ({
  isOpen,
  onClose,
  children,
  position = 'dropdown',
  align = 'left',
  className = '',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const alignmentClass = {
    left: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-0',
  }[align];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Menu */}
      <div
        ref={menuRef}
        className={`
          absolute z-50 mt-2 min-w-[160px]
          bg-white border border-[#D4E5D4] rounded-lg shadow-[0_8px_32px_rgba(107,142,107,0.1)]
          py-1 animate-in fade-in-0 zoom-in-95 duration-200
          ${alignmentClass}
          ${className}
        `}
      >
        {children}
      </div>
    </>
  );
};

// ============ Menu Item ============

export interface MenuItemProps {
  /** Item label */
  children: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Whether the item is selected */
  selected?: boolean;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Icon to show on the left */
  icon?: ReactNode;
  /** Whether this item has a submenu */
  hasSubmenu?: boolean;
  /** Additional className */
  className?: string;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  onClick,
  selected = false,
  disabled = false,
  icon,
  hasSubmenu = false,
  className = '',
}) => {
  const handleClick = () => {
    if (!disabled && onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full px-3 py-2 text-left text-xs font-medium
        flex items-center gap-2
        transition-colors duration-150
        ${selected
          ? 'bg-[#EDF5F0] text-[#1E2E1E]'
          : 'text-[#4A5D4A] hover:bg-[#EDF5F0] hover:text-[#1E2E1E]'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon && <span className="w-4 h-4 flex-shrink-0">{icon}</span>}
      <span className="flex-1">{children}</span>
      {hasSubmenu && <ChevronRight className="w-3 h-3 text-[#8FA58F]" />}
    </button>
  );
};

// ============ Menu Separator ============

export const MenuSeparator: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`h-px bg-[#D4E5D4] my-1 ${className}`} />
);

// ============ Menu Header ============

export interface MenuHeaderProps {
  children: ReactNode;
  className?: string;
}

export const MenuHeader: React.FC<MenuHeaderProps> = ({ children, className = '' }) => (
  <div className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-[#8FA58F] ${className}`}>
    {children}
  </div>
);

// ============ Submenu ============

export interface SubmenuProps {
  /** Trigger element */
  trigger: ReactNode;
  /** Submenu content */
  children: ReactNode;
  /** Additional className for the submenu */
  className?: string;
}

export const Submenu: React.FC<SubmenuProps> = ({
  trigger,
  children,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger}
      {isOpen && (
        <div
          className={`
            absolute left-full top-0 ml-1 min-w-[160px]
            bg-white border border-[#D4E5D4] rounded-lg shadow-[0_8px_32px_rgba(107,142,107,0.1)]
            py-1 animate-in fade-in-0 slide-in-from-left-2 duration-200
            ${className}
          `}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Menu;

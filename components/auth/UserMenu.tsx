/**
 * UserMenu
 *
 * Shows user avatar/name when logged in with dropdown menu.
 * Shows login button when not authenticated.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuProps {
  onLoginClick: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onLoginClick }) => {
  const { user, isAuthenticated, isLoading, actions } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-8 h-8 bg-[#EDF5F0] animate-pulse rounded" />
    );
  }

  // Not logged in - show login button
  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={onLoginClick}
        className="px-3 py-1.5 text-sm font-medium text-[#8FA58F] hover:text-[#4A5D4A] hover:bg-[#EDF5F0] rounded transition-colors duration-150 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Sign In
      </button>
    );
  }

  // Logged in - show user menu
  // Safe initials extraction with null checks
  const initials = user.name && user.name.trim()
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user.email && user.email.length > 0 ? user.email[0].toUpperCase() : '?');

  const handleLogout = async () => {
    setIsOpen(false);
    await actions.logout();
  };

  // Validate avatar URL to prevent XSS
  const isValidAvatarUrl = (url: string | null | undefined): boolean => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      // Only allow https URLs or data URIs (for local avatars)
      return parsed.protocol === 'https:' || url.startsWith('data:image/');
    } catch {
      // Relative URLs are ok
      return url.startsWith('/');
    }
  };

  const safeAvatarUrl = isValidAvatarUrl(user.avatar_url) ? user.avatar_url : null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 hover:bg-[#EDF5F0] rounded transition-colors duration-150"
      >
        {/* Avatar */}
        {safeAvatarUrl ? (
          <img
            src={safeAvatarUrl}
            alt={user.name || user.email || 'User'}
            className="w-8 h-8 object-cover rounded"
          />
        ) : (
          <div className="w-8 h-8 bg-[#6B8E6B] text-white flex items-center justify-center text-sm font-bold rounded">
            {initials}
          </div>
        )}
        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 text-[#8FA58F] transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-[0_8px_32px_rgba(107,142,107,0.15)] border border-[#D4E5D4] rounded-lg py-1 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-[#D4E5D4]">
            <p className="text-sm font-medium text-[#1E2E1E] truncate">
              {user.name || 'User'}
            </p>
            <p className="text-xs text-[#8FA58F] truncate">
              {user.email}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {/* Cloud sync status */}
            <div className="px-4 py-2 flex items-center gap-2 text-sm text-[#8FA58F]">
              <svg className="w-4 h-4 text-[#6B8E6B]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Cloud sync enabled
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-[#8FA58F] hover:bg-[#EDF5F0] hover:text-[#4A5D4A] flex items-center gap-2 transition-colors duration-150"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

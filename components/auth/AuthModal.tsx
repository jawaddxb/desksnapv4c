/**
 * AuthModal
 *
 * Login/Register modal for user authentication.
 * Clean, minimal design matching the DeckSnap aesthetic.
 */

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use centralized error from AuthContext (no dual tracking)
  const { actions, error: displayError } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    actions.clearError();

    try {
      if (mode === 'login') {
        await actions.login({ email, password });
      } else {
        await actions.register({ email, password, name: name || undefined });
      }
      // Success - close modal, reset form, and trigger success callback
      setEmail('');
      setPassword('');
      setName('');
      onClose();
      onSuccess?.();
    } catch {
      // Error is already set in AuthContext, no need to duplicate
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    actions.clearError();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/20 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-light text-white">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 transition-colors duration-150"
          >
            <svg className="w-5 h-5 text-white/60 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error message */}
          {displayError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {displayError}
            </div>
          )}

          {/* Name field (register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-white/20 bg-black text-white focus:border-[#c5a47e] outline-none transition-colors duration-150 placeholder:text-white/30"
                placeholder="Your name"
              />
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-white/20 bg-black text-white focus:border-[#c5a47e] outline-none transition-colors duration-150 placeholder:text-white/30"
              placeholder="you@example.com"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 border border-white/20 bg-black text-white focus:border-[#c5a47e] outline-none transition-colors duration-150 placeholder:text-white/30"
              placeholder="Min 8 characters"
            />
            {mode === 'register' && (
              <p className="mt-2 text-xs text-white/40">
                Must include uppercase, lowercase, and number
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-[#c5a47e] hover:bg-white disabled:bg-white/20 text-black font-bold uppercase tracking-widest text-xs transition-colors duration-150 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        {/* Footer - switch mode */}
        <div className="px-6 py-4 bg-black border-t border-white/10 text-center">
          <p className="text-sm text-white/60">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              type="button"
              onClick={switchMode}
              className="text-[#c5a47e] hover:text-white font-medium transition-colors duration-150"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

/**
 * App Component
 *
 * Main application shell with routing and providers.
 * Delegates main content rendering to AppContent component.
 */

import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppContent } from './components/AppContent';
import { AuthProvider } from './contexts/AuthContext';
import { QueryProvider } from './contexts/QueryContext';
import { NetworkProvider } from './contexts/NetworkContext';
import { DebugProvider } from './contexts/DebugContext';
import { WorkspaceModeProvider } from './contexts/WorkspaceModeContext';
import { ChatUIProvider } from './contexts/ChatUIContext';
import { DebugRoute, ThumbnailGenerator, ComponentShowcase, ImageAgentRoute } from './components/debug';
import { DesignShowcase } from './design-showcase/DesignShowcase';
import { AuthModal } from './components/auth';
import { ProtectedRoute, OfflineGate } from './components/routing';
import { ImmersiveLandingPage } from './components/homepage-variants/variant-5-immersive';
import {
  FeaturesPage,
  PricingPage,
  AboutPage,
  ThemesGalleryPage,
  SolutionsPage,
} from './components/pages';
import { MobileViewRoute } from './components/mobile';
import { PrototypeRouter } from './homepage-prototypes';
import { HomepageVariants } from './components/homepage-variants';
import { useRealtimeSync } from './hooks/useRealtimeSync';

// ============ Realtime Sync Initializer ============

function RealtimeSyncInitializer({ children }: { children: React.ReactNode }) {
  useRealtimeSync();
  return <>{children}</>;
}

// ============ Main App with Routing ============

function AppRoutes() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app';
    navigate(from, { replace: true });
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<ImmersiveLandingPage onAuth={handleOpenAuth} />} />
        <Route path="/features" element={<FeaturesPage onAuth={handleOpenAuth} />} />
        <Route path="/pricing" element={<PricingPage onAuth={handleOpenAuth} />} />
        <Route path="/about" element={<AboutPage onAuth={handleOpenAuth} />} />
        <Route path="/themes" element={<ThemesGalleryPage onAuth={handleOpenAuth} />} />
        <Route path="/solutions/:solutionId" element={<SolutionsPage onAuth={handleOpenAuth} />} />

        {/* Homepage Prototypes */}
        <Route path="/prototypes/*" element={<PrototypeRouter />} />

        {/* Homepage Variants Preview */}
        <Route path="/homepage-preview" element={<HomepageVariants onGetStarted={() => navigate('/app')} />} />

        {/* Debug Routes */}
        <Route path="/debug" element={<DebugRoute />} />
        <Route path="/debug/thumbnails" element={<ThumbnailGenerator />} />
        <Route path="/debug/components" element={<ComponentShowcase />} />
        <Route path="/debug/image-agent" element={<ImageAgentRoute />} />
        <Route path="/design-showcase" element={<DesignShowcase />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthModalTrigger mode="login" onAuth={handleOpenAuth}>
              <ImmersiveLandingPage onAuth={handleOpenAuth} />
            </AuthModalTrigger>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthModalTrigger mode="register" onAuth={handleOpenAuth}>
              <ImmersiveLandingPage onAuth={handleOpenAuth} />
            </AuthModalTrigger>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <ChatUIProvider>
                <AppContent />
              </ChatUIProvider>
            </ProtectedRoute>
          }
        />

        {/* Mobile Presentation View (Public - allows sharing) */}
        <Route path="/mobile/:presentationId" element={<MobileViewRoute />} />

        {/* Fallback */}
        <Route path="*" element={<ImmersiveLandingPage onAuth={handleOpenAuth} />} />
      </Routes>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

// ============ Root App Component ============

export default function App() {
  return (
    <QueryProvider>
      <NetworkProvider>
        <OfflineGate>
          <DebugProvider>
            <AuthProvider>
              <WorkspaceModeProvider>
                <RealtimeSyncInitializer>
                  <AppRoutes />
                </RealtimeSyncInitializer>
              </WorkspaceModeProvider>
            </AuthProvider>
          </DebugProvider>
        </OfflineGate>
      </NetworkProvider>
    </QueryProvider>
  );
}

// ============ Helper Components ============

interface AuthModalTriggerProps {
  mode: 'login' | 'register';
  onAuth: (mode: 'login' | 'register') => void;
  children: React.ReactNode;
}

function AuthModalTrigger({ mode, onAuth, children }: AuthModalTriggerProps) {
  React.useEffect(() => {
    onAuth(mode);
  }, [mode, onAuth]);

  return <>{children}</>;
}

/**
 * Homepage Prototypes Router
 *
 * Entry point for the 10 homepage variations.
 * Uses lazy loading for each variation to optimize bundle size.
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrototypeLayout } from './PrototypeLayout';

// Lazy load each variation
const StudioNoir = lazy(() => import('./variations/studio-noir'));
const SoftCanvas = lazy(() => import('./variations/soft-canvas'));
const PaperTexture = lazy(() => import('./variations/paper-texture'));
const InkGold = lazy(() => import('./variations/ink-gold'));
const AtelierLight = lazy(() => import('./variations/atelier-light'));
const FluidForms = lazy(() => import('./variations/fluid-forms'));
const Sketchbook = lazy(() => import('./variations/sketchbook'));
const GalleryWhite = lazy(() => import('./variations/gallery-white'));
const WarmTerra = lazy(() => import('./variations/warm-terra'));
const DuskGradient = lazy(() => import('./variations/dusk-gradient'));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-100">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-sm text-neutral-600">Loading prototype...</p>
    </div>
  </div>
);

export const PrototypeRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<PrototypeLayout />}>
          {/* Default redirect to first prototype */}
          <Route index element={<Navigate to="studio-noir" replace />} />

          {/* Individual prototype routes */}
          <Route path="studio-noir" element={<StudioNoir />} />
          <Route path="soft-canvas" element={<SoftCanvas />} />
          <Route path="paper-texture" element={<PaperTexture />} />
          <Route path="ink-gold" element={<InkGold />} />
          <Route path="atelier-light" element={<AtelierLight />} />
          <Route path="fluid-forms" element={<FluidForms />} />
          <Route path="sketchbook" element={<Sketchbook />} />
          <Route path="gallery-white" element={<GalleryWhite />} />
          <Route path="warm-terra" element={<WarmTerra />} />
          <Route path="dusk-gradient" element={<DuskGradient />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="studio-noir" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default PrototypeRouter;

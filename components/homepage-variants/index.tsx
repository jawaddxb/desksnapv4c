/**
 * Homepage Variants - Main Entry Point
 *
 * Navigate between 5 different homepage designs using:
 * - Floating navigation pill (bottom-right)
 * - Keyboard shortcuts (1-5)
 * - URL parameter (?variant=1)
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { VariantNavigation, variantList } from './shared/VariantNavigation';

// Lazy load variants for better performance
const Variant1Refined = lazy(() => import('./variant-1-refined'));
const Variant2Editorial = lazy(() => import('./variant-2-editorial'));
const Variant3Minimal = lazy(() => import('./variant-3-minimal'));
const Variant4Bento = lazy(() => import('./variant-4-bento'));
const Variant5Immersive = lazy(() => import('./variant-5-immersive'));

// Loading fallback
const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-[#F5FAF7] flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-3 border-[#6B8E6B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-[#4A5D4A] text-sm">Loading variant...</p>
    </div>
  </div>
);

interface HomepageVariantsProps {
  onGetStarted?: () => void;
  initialVariant?: number;
}

export const HomepageVariants: React.FC<HomepageVariantsProps> = ({
  onGetStarted = () => console.log('Get Started clicked'),
  initialVariant,
}) => {
  // Get initial variant from URL or prop
  const getInitialVariant = (): number => {
    if (initialVariant) return initialVariant;

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const variantParam = params.get('variant');
      if (variantParam) {
        const parsed = parseInt(variantParam);
        if (parsed >= 1 && parsed <= 5) return parsed;
      }
    }
    return 1;
  };

  const [currentVariant, setCurrentVariant] = useState(getInitialVariant);

  // Update URL when variant changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('variant', currentVariant.toString());
      window.history.replaceState({}, '', url.toString());
    }
  }, [currentVariant]);

  // Render the current variant
  const renderVariant = () => {
    switch (currentVariant) {
      case 1:
        return <Variant1Refined onGetStarted={onGetStarted} />;
      case 2:
        return <Variant2Editorial onGetStarted={onGetStarted} />;
      case 3:
        return <Variant3Minimal onGetStarted={onGetStarted} />;
      case 4:
        return <Variant4Bento onGetStarted={onGetStarted} />;
      case 5:
        return <Variant5Immersive onGetStarted={onGetStarted} />;
      default:
        return <Variant1Refined onGetStarted={onGetStarted} />;
    }
  };

  return (
    <div className="homepage-variants">
      {/* Current Variant */}
      <Suspense fallback={<LoadingFallback />}>
        {renderVariant()}
      </Suspense>

      {/* Variant Navigation */}
      <VariantNavigation
        current={currentVariant}
        onChange={setCurrentVariant}
      />
    </div>
  );
};

// Export individual variants for direct use
export { Variant1Refined, Variant2Editorial, Variant3Minimal, Variant4Bento, Variant5Immersive };

// Export variant list for external reference
export { variantList };

export default HomepageVariants;

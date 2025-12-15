/**
 * Demo/Test file for Variant 2: Editorial Homepage
 *
 * This file demonstrates how to use the Editorial variant.
 * You can use this as a starting point for integration or testing.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import Variant2Editorial from './index';

// Demo wrapper component
function Demo() {
  const handleGetStarted = () => {
    console.log('Get Started clicked!');
    // In a real app, this would navigate to signup or the app
    // Example: window.location.href = '/signup';
    // Or with React Router: navigate('/signup');
  };

  return (
    <div className="min-h-screen">
      <Variant2Editorial onGetStarted={handleGetStarted} />
    </div>
  );
}

// Export for testing purposes
export default Demo;

// Uncomment below to render as standalone page
// (useful for development/preview)
/*
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Demo />
    </React.StrictMode>
  );
}
*/

/**
 * Integration Examples:
 *
 * 1. As a standalone page route:
 * ```tsx
 * import Variant2Editorial from './components/homepage-variants/variant-2-editorial';
 *
 * function LandingPage() {
 *   return <Variant2Editorial onGetStarted={() => navigate('/app')} />;
 * }
 * ```
 *
 * 2. With React Router:
 * ```tsx
 * import { useNavigate } from 'react-router-dom';
 * import Variant2Editorial from './components/homepage-variants/variant-2-editorial';
 *
 * function HomePage() {
 *   const navigate = useNavigate();
 *   return <Variant2Editorial onGetStarted={() => navigate('/signup')} />;
 * }
 * ```
 *
 * 3. With custom analytics:
 * ```tsx
 * import Variant2Editorial from './components/homepage-variants/variant-2-editorial';
 *
 * function LandingPage() {
 *   const handleGetStarted = () => {
 *     // Track event
 *     analytics.track('cta_clicked', { variant: 'editorial' });
 *     // Navigate
 *     window.location.href = '/signup';
 *   };
 *
 *   return <Variant2Editorial onGetStarted={handleGetStarted} />;
 * }
 * ```
 *
 * 4. In an A/B test:
 * ```tsx
 * import Variant1Refined from './components/homepage-variants/variant-1-refined';
 * import Variant2Editorial from './components/homepage-variants/variant-2-editorial';
 *
 * function HomePage() {
 *   const variant = useABTest('homepage_variant', ['refined', 'editorial']);
 *
 *   const Component = variant === 'editorial' ? Variant2Editorial : Variant1Refined;
 *
 *   return <Component onGetStarted={() => navigate('/signup')} />;
 * }
 * ```
 */

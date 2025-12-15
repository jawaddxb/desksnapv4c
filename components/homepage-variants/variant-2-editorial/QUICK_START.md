# Quick Start Guide - Editorial Variant

## 30-Second Setup

```tsx
import Variant2Editorial from './components/homepage-variants/variant-2-editorial';

function App() {
  return <Variant2Editorial onGetStarted={() => console.log('CTA clicked')} />;
}
```

Done! The component includes all fonts, styles, and animations.

---

## File Structure at a Glance

```
variant-2-editorial/
├── index.tsx              # 👈 Import this
├── Hero.tsx               # Split hero with illustration
├── Features.tsx           # 3 feature blocks
├── Gallery.tsx            # Theme previews
├── Testimonials.tsx       # 6 testimonial cards
├── CTA.tsx                # Final call-to-action
├── illustrations.tsx      # All SVG artwork
├── demo.tsx              # Integration examples
├── README.md             # Full documentation
├── SUMMARY.md            # Build details
└── QUICK_START.md        # This file
```

---

## Key Features

### 🎨 Design
- **Magazine-style** editorial layouts
- **Playfair Display** serif headlines (up to 96px)
- **Inter** clean body text
- **Forest green** (#6B8E6B) accent color
- **Custom SVG** illustrations throughout

### 🎬 Animations
- Scroll-triggered section reveals
- Hover effects on all interactive elements
- Morphing SVG backgrounds
- Floating decorative shapes

### 📱 Responsive
- Mobile: Single column stack
- Tablet: 2-3 column grids
- Desktop: Full side-by-side layouts
- Large: Up to 6-column gallery

---

## Customization Cheat Sheet

### Change Primary Color
Search & replace `#6B8E6B` with your brand color in all component files.

### Update Typography
Edit `fontFamily` inline styles:
- Headlines: Change `'Playfair Display, serif'`
- Body: Change `'Inter, sans-serif'`

### Modify Content
Each section exports its content as constants or props:
- **Features**: Edit `features` array in Features.tsx
- **Testimonials**: Edit `testimonials` array in Testimonials.tsx
- **Gallery**: Edit `themes` array in Gallery.tsx

### Adjust Animations
All animations use Framer Motion:
- Speed: Modify `duration` in `transition` props
- Easing: Change `ease` values
- Disable: Set `initial={false}` or remove `motion.` wrapper

---

## Props Reference

```tsx
interface Variant2EditorialProps {
  onGetStarted: () => void;  // Required callback for CTA buttons
}
```

The `onGetStarted` callback is triggered by:
- Hero primary button
- CTA section primary button

---

## Common Integration Patterns

### With React Router
```tsx
import { useNavigate } from 'react-router-dom';
import Variant2Editorial from './components/homepage-variants/variant-2-editorial';

function HomePage() {
  const navigate = useNavigate();
  return <Variant2Editorial onGetStarted={() => navigate('/signup')} />;
}
```

### With Analytics
```tsx
import Variant2Editorial from './components/homepage-variants/variant-2-editorial';

function LandingPage() {
  const handleGetStarted = () => {
    analytics.track('cta_clicked', { variant: 'editorial' });
    window.location.href = '/signup';
  };

  return <Variant2Editorial onGetStarted={handleGetStarted} />;
}
```

### With Authentication
```tsx
import { useAuth } from './hooks/useAuth';
import Variant2Editorial from './components/homepage-variants/variant-2-editorial';

function HomePage() {
  const { login, isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    } else {
      login();
    }
  };

  return <Variant2Editorial onGetStarted={handleGetStarted} />;
}
```

---

## Section Overview

### 1. Hero (Hero.tsx)
- Split layout: 40% text + 60% illustration
- 2 CTA buttons
- Animated presentation mockup
- Floating stat badges
- Social proof avatars

### 2. Features (Features.tsx)
- 3 alternating feature blocks
- Custom SVG illustrations
- Numbered badges
- Feature highlight pills

### 3. Gallery (Gallery.tsx)
- 12 theme preview cards
- 6 layout variants
- Hover overlays
- 3 stat cards

### 4. Testimonials (Testimonials.tsx)
- 6 testimonial cards
- Gradient avatars
- 5-star ratings
- 3 bottom stats

### 5. CTA (CTA.tsx)
- Full-width section
- Flowing SVG background
- Dual CTA buttons
- Benefit checklist
- Social proof

---

## Dependencies

Required (already in DeckSnap):
- React 18+ or 19+
- Framer Motion 10+
- Lucide React (icons)

Included automatically:
- Google Fonts (Playfair Display, Inter)
- Shared components from `../shared/`
- Design tokens from `../shared/tokens.ts`

---

## Performance Tips

1. **Lazy load** if not using immediately:
   ```tsx
   const Editorial = lazy(() => import('./components/homepage-variants/variant-2-editorial'));
   ```

2. **Reduce motion** for accessibility:
   ```tsx
   // Add to each section's motion.div
   <motion.div {...(prefersReducedMotion ? {} : variants.fadeInUp)}>
   ```

3. **Optimize images** if you add photos:
   - Use WebP format
   - Implement lazy loading
   - Add blur placeholders

---

## Troubleshooting

### Fonts not loading?
Check network tab - Google Fonts should load from index.tsx `<style>` tag.

### Animations not working?
Ensure Framer Motion is installed: `npm install framer-motion`

### TypeScript errors?
Import types: `import type { Variant2EditorialProps } from './index'`

### Build fails?
Check for missing dependencies and ensure all shared components exist.

---

## Resources

- **Full Docs**: See README.md
- **Build Details**: See SUMMARY.md
- **Examples**: See demo.tsx
- **Shared Components**: ../shared/CommonComponents.tsx
- **Design Tokens**: ../shared/tokens.ts

---

## Support

For issues or questions:
1. Check README.md for detailed documentation
2. Review demo.tsx for integration examples
3. Inspect SUMMARY.md for technical specifications

---

**Built with ❤️ for DeckSnap**

Version: 1.0.0
Last Updated: 2025-12-15

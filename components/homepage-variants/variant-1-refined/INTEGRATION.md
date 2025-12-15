# Integration Guide: Variant 1 - Refined Current

## Quick Start

### 1. Basic Usage

```tsx
import Variant1Refined from '@/components/homepage-variants/variant-1-refined';

function HomePage() {
  const handleGetStarted = () => {
    console.log('User clicked Get Started');
    // Your navigation or modal logic here
  };

  return <Variant1Refined onGetStarted={handleGetStarted} />;
}
```

### 2. With Router Navigation

```tsx
import { useNavigate } from 'react-router-dom';
import Variant1Refined from '@/components/homepage-variants/variant-1-refined';

function HomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app');
  };

  return <Variant1Refined onGetStarted={handleGetStarted} />;
}
```

### 3. With Analytics Tracking

```tsx
import Variant1Refined from '@/components/homepage-variants/variant-1-refined';
import { trackEvent } from '@/analytics';

function HomePage() {
  const handleGetStarted = () => {
    trackEvent('cta_clicked', {
      source: 'homepage_hero',
      variant: 'variant-1-refined',
    });
    // Navigate or show modal
  };

  return <Variant1Refined onGetStarted={handleGetStarted} />;
}
```

## Props API

```typescript
interface Variant1RefinedProps {
  onGetStarted: () => void;
}
```

### Props Details

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onGetStarted` | `() => void` | Yes | Callback fired when user clicks any "Get Started" or "Start Creating Free" button |

## Component Tree

```
Variant1Refined
├── Hero
│   ├── FloatingShapes (background decoration)
│   ├── Badge (AI-Powered badge)
│   ├── Headline with animated underline
│   ├── Subtitle
│   ├── Button (primary) → calls onGetStarted
│   ├── Button (secondary - Watch Demo)
│   ├── Social proof section
│   └── WorkflowIllustration
│       ├── SVG workflow diagram
│       └── 3 stage cards (Ideate, Draft, Polish)
│
├── HowItWorks
│   ├── Section header
│   └── 3 process steps
│       ├── Step 1: Ideate
│       │   ├── Icon + number
│       │   ├── Title & description
│       │   ├── Feature list
│       │   └── IdeateVisual (sticky notes)
│       ├── Step 2: Draft
│       │   ├── Icon + number
│       │   ├── Title & description
│       │   ├── Feature list
│       │   └── DraftVisual (slide stack)
│       └── Step 3: Polish
│           ├── Icon + number
│           ├── Title & description
│           ├── Feature list
│           └── PolishVisual (final deck)
│
├── Testimonials
│   ├── Section header
│   ├── 4 testimonial cards
│   │   ├── Quote icon
│   │   ├── Star rating
│   │   ├── Quote text
│   │   └── Author info
│   ├── Stats bar (4 metrics)
│   └── Trust badges
│
└── CTA
    ├── Gradient background
    ├── Badge (Start Creating Today)
    ├── Headline
    ├── Subtitle
    ├── Button (primary) → calls onGetStarted
    ├── Button (secondary - Schedule Demo)
    ├── Benefits checklist (4 items)
    ├── Social proof
    └── Floating animated icons
```

## Customization Options

### 1. Modify Colors

If you need to adjust colors, update the shared tokens:

```tsx
// components/homepage-variants/shared/tokens.ts
export const tokens = {
  colors: {
    accent: '#6B8E6B',  // Change to your brand color
    background: '#F5FAF7', // Adjust background
    // ... other colors
  },
};
```

### 2. Update Content

Edit the respective section files:

```tsx
// Hero.tsx - Update headline
<h1>Your custom headline here</h1>

// HowItWorks.tsx - Update steps
const steps = [
  {
    title: 'Your custom step',
    description: 'Custom description',
    // ...
  },
];

// Testimonials.tsx - Import testimonials from shared
import { testimonials } from '../shared/CommonComponents';
```

### 3. Add Additional CTAs

```tsx
// Hero.tsx - Add third button
<Button variant="ghost" size="lg">
  Learn More
</Button>
```

### 4. Disable Animations (for testing)

```tsx
// Temporarily disable all animations by setting initial to visible
<motion.div
  initial="visible" // Changed from "hidden"
  animate="visible"
  variants={variants.fadeInUp}
>
```

## Performance Tips

1. **Lazy Load Components**: For better initial load time

```tsx
import { lazy, Suspense } from 'react';

const Variant1Refined = lazy(() => import('@/components/homepage-variants/variant-1-refined'));

function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Variant1Refined onGetStarted={handleGetStarted} />
    </Suspense>
  );
}
```

2. **Preload Fonts**: Add to your HTML head

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

3. **Optimize Images**: If you add images, use modern formats (WebP, AVIF)

## Accessibility Features

- Semantic HTML structure (`<section>`, `<article>`, `<header>`)
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus states on all interactive elements
- Color contrast meeting WCAG AA standards
- Reduced motion support (respects `prefers-reduced-motion`)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Features used:**
- CSS Grid & Flexbox
- CSS Custom Properties
- Backdrop filter (for blurred backgrounds)
- Framer Motion animations

## Testing

### Visual Regression Testing

```tsx
// Example with Storybook
import Variant1Refined from './index';

export default {
  title: 'Homepage/Variant1Refined',
  component: Variant1Refined,
};

export const Default = () => (
  <Variant1Refined onGetStarted={() => console.log('Get Started')} />
);
```

### Unit Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Variant1Refined from './index';

test('calls onGetStarted when button clicked', () => {
  const handleGetStarted = jest.fn();
  render(<Variant1Refined onGetStarted={handleGetStarted} />);

  const button = screen.getByText(/start creating free/i);
  fireEvent.click(button);

  expect(handleGetStarted).toHaveBeenCalledTimes(1);
});
```

## Troubleshooting

### Issue: Animations not working

**Solution**: Ensure Framer Motion is installed and imported:

```bash
npm install framer-motion
```

### Issue: Fonts not loading

**Solution**: Add Google Fonts to your HTML or CSS:

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
```

### Issue: Colors not matching design

**Solution**: Verify Tailwind config includes the Bento Matcha colors or use inline styles from tokens.

### Issue: Mobile layout issues

**Solution**: Ensure Tailwind breakpoints are working. Check responsive classes (lg:, md:, etc.)

## Dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.294.0"
  }
}
```

## Support

For issues or questions:
1. Check the README.md for component details
2. Review STRUCTURE.md for layout information
3. Examine the source code comments
4. Check shared tokens and components

## Version History

- **v1.0.0** (2025-12-15): Initial release
  - Hero section with 3-stage workflow
  - How It Works with alternating layouts
  - Testimonials grid with stats
  - CTA with gradient background

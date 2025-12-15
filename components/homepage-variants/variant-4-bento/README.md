# Variant 4: Bento Grid Layout

Modern bento box grid homepage with interactive cards and playful depth.

## Overview

This variant features an asymmetric card grid layout inspired by bento boxes, with interactive hover effects, animated illustrations, and a sticky notes aesthetic.

## Design System

- **Background**: #F5FAF7 (sage)
- **Cards**: #FFFFFF with green-tinted shadows
- **Accent**: #6B8E6B (forest green)
- **Text**: #1E2E1E (primary), #4A5D4A (secondary)
- **Border**: #D4E5D4
- **Shadows**: Green-tinted with depth
- **Border Radius**: 16-24px (rounded-3xl)

## Components

### 1. BentoGrid.tsx
Reusable grid container components:
- `BentoGrid` - Flexible grid container with configurable columns
- `BentoCard` - Interactive card with hover lift effects
- `ColoredBentoCard` - Colored variant (green, sage, cream)

### 2. FeatureCard.tsx
Feature and stat cards:
- `FeatureCard` - Interactive feature cards with icons
- `StatCard` - Statistic cards with trends

### 3. HeroSection.tsx
Hero bento grid (auto-rows-[280px]):
```
[  Large Hero (2x2)  ] [ AI Magic (1x1) ]
                       [ Fast (1x1)     ]
[ Themes (1x2)  ] [ Users (1x1) ] [ Images (1x1) ]
```

### 4. ProcessSection.tsx
Three-card process flow:
- Ideate (yellow) - Sticky notes illustration
- Draft (blue) - Stacked slides illustration
- Polish (green) - Final deck illustration

### 5. TestimonialCards.tsx
Asymmetric testimonial grid (auto-rows-[240px]):
- Large featured testimonial (2x2)
- Medium testimonial (1x2)
- Small testimonials (1x1)
- Stats card (1x1)
- Wide testimonial (2x1)
- Logo cloud (2x1)

### 6. CTASection.tsx
Final CTA bento grid:
- Large CTA card (2x2) with gradient background
- Decorative cards (1x1) with animated icons
- Social proof elements

### 7. index.tsx
Main component with:
- Fixed navigation with blur backdrop
- Full sections for each component
- Footer with links

## Animations

All cards feature:
- **Hover lift**: `y: -4`, scale `1.02`
- **Shadow increase**: Enhanced green-tinted shadow
- **Framer Motion**: Smooth transitions with cubic bezier easing
- **Viewport animations**: `whileInView` with `once: true`
- **Stagger delays**: Sequential appearance

## Usage

```tsx
import Variant4Bento from './components/homepage-variants/variant-4-bento';

function App() {
  return (
    <Variant4Bento onGetStarted={() => console.log('Get started clicked')} />
  );
}
```

## Key Features

- Asymmetric bento grid layouts (2x2, 1x2, 1x1 card sizes)
- Interactive hover states on all cards
- Animated SVG illustrations
- Sticky note aesthetic influences
- Depth with layered shadows
- Subtle parallax effects
- Mobile-responsive grid system
- Green-tinted color palette
- Playful, modern feel

## Grid System

Uses CSS Grid with:
- `grid-template-columns: repeat(4, 1fr)`
- `auto-rows-[280px]` or `auto-rows-[200px]`
- `gap-6` (24px spacing)
- `col-span` and `row-span` for card sizing

## Dependencies

- React 19+
- Framer Motion
- Lucide React (icons)
- Tailwind CSS
- Shared tokens from `../shared/tokens.ts`
- Common components from `../shared/CommonComponents.tsx`

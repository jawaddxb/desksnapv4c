# Variant 2: Image-Rich Editorial

A magazine-style editorial homepage with large custom SVG illustrations and oversized serif typography.

## Design Philosophy

This variant embodies editorial design principles with:
- **Magazine aesthetics**: Asymmetric layouts inspired by high-end publications
- **Typography hierarchy**: Playfair Display serif for headlines, Inter for body
- **Generous whitespace**: Clean, breathable layouts with intentional negative space
- **Custom illustrations**: Hand-crafted SVG artwork throughout
- **Sophisticated palette**: White/cream backgrounds with forest green (#6B8E6B) accents

## Component Structure

```
variant-2-editorial/
├── index.tsx              # Main component export
├── Hero.tsx               # Split layout: 60% illustration + 40% headline
├── Features.tsx           # Side-by-side image/text feature blocks
├── Gallery.tsx            # Grid of theme preview illustrations
├── Testimonials.tsx       # Testimonial cards with abstract avatars
├── CTA.tsx                # Full-width CTA with decorative background
├── illustrations.tsx      # Custom SVG illustrations library
└── README.md             # This file
```

## Key Features

### 1. **Hero Section**
- Split asymmetric layout (40% text, 60% illustration)
- Oversized Playfair Display headlines (up to 8xl)
- Large animated SVG presentation mockup
- Floating stat badges with hover effects
- Scroll indicator animation

### 2. **Features Section**
- Alternating left/right layouts for visual rhythm
- Custom SVG illustrations for each feature (Ideate, Draft, Polish)
- Icon badges with hover animations
- Feature highlight pills
- Number badges for each step

### 3. **Gallery Section**
- 6-column responsive grid of theme previews
- Custom SVG mini-layouts for each theme variant
- Hover overlay effects with theme details
- Color swatches for each theme
- Stat highlight cards

### 4. **Testimonials Section**
- 3-column grid of testimonial cards
- Abstract avatar illustrations with gradients
- 5-star rating display
- Pull quote styling with large quote marks
- Company and role attribution
- Stats bar at bottom

### 5. **CTA Section**
- Full-width with flowing SVG background pattern
- Oversized headline with color accents
- Dual CTA buttons
- Benefit checklist with icons
- Social proof avatars
- Animated decorative elements

## Custom Illustrations

### Hero Illustration
- **HeroPresentationMockup**: Large animated presentation frame
- Features: Staggered content reveals, floating shapes, shadow layers
- Animation: Sequential entrance animations with spring physics

### Feature Illustrations
- **IdeateIllustration**: Lightbulb with idea sparks and floating notes
- **DraftIllustration**: Stacked slides with editing cursor
- **PolishIllustration**: Premium slide with sparkle effects
- All feature scroll-triggered animations with `whileInView`

### Gallery Previews
- **ThemePreview**: Dynamic SVG generator with 6 layout variants
  - Minimal, Bold, Elegant, Modern, Organic, Tech
  - Each accepts custom accent colors
  - Reusable component for theme showcase

### CTA Background
- **CTABackgroundPattern**: Flowing organic shapes with wave animations
- Animated floating circles with scale/position transforms
- Seamless full-width background pattern

## Typography System

### Headlines (Playfair Display)
- **Hero**: 6xl-8xl (60px-96px)
- **Section titles**: 5xl-6xl (48px-60px)
- **Numbers/stats**: 4xl-5xl (36px-48px)

### Body Text (Inter)
- **Lead text**: xl-3xl (20px-30px)
- **Body**: base-xl (16px-20px)
- **Caption**: sm-base (14px-16px)

## Color Palette

```css
Primary Background: #FFFFFF (White)
Secondary Background: #FAFBF8 (Cream)
Tertiary Background: #F5FAF7 (Sage)

Accent: #6B8E6B (Forest Green)
Accent Hover: #5A7A5A (Darker Green)

Text Primary: #1E2E1E (Dark Green)
Text Secondary: #4A5D4A (Medium Green)
Text Muted: #8FA58F (Light Green)

Border: #D4E5D4 (Light Border)
Border Hover: #C0D6C0 (Medium Border)
```

## Animation Strategy

### Scroll-Triggered Animations
- All sections use Framer Motion `whileInView`
- Viewport trigger with `-100px` to `-150px` margin
- `once: true` to prevent re-triggering

### Hover Interactions
- Cards: `y: -8` with shadow increase
- Buttons: `scale: 1.02` with `y: -1`
- Icons: `scale: 1.1` with `rotate: 5`
- Avatars: `scale: 1.2` with color ring

### Continuous Animations
- Background shapes: Scale/rotate loops (8-20s duration)
- Floating elements: Y-axis oscillation (3-8s duration)
- Sparkles: Opacity/scale pulse (2s duration)
- SVG paths: Morphing shapes with easeInOut

## Usage

```tsx
import Variant2Editorial from './components/homepage-variants/variant-2-editorial';

function App() {
  const handleGetStarted = () => {
    // Navigate to app or show signup
    console.log('Get started clicked');
  };

  return <Variant2Editorial onGetStarted={handleGetStarted} />;
}
```

## Props

### Main Component
```tsx
interface Variant2EditorialProps {
  onGetStarted: () => void; // Callback for CTA button clicks
}
```

## Dependencies

- **React** (^18.0.0 or ^19.0.0)
- **Framer Motion** (^10.0.0+)
- **Lucide React** (icons)
- **Shared components**: `../shared/CommonComponents.tsx`
- **Design tokens**: `../shared/tokens.ts`

## Responsive Breakpoints

- **Mobile**: < 768px (Single column layouts)
- **Tablet**: 768px-1024px (2-column grids)
- **Desktop**: 1024px-1400px (3-column grids)
- **Large**: > 1400px (Full 6-column gallery)

## Performance Considerations

- SVG illustrations are inline (no HTTP requests)
- Animations use `transform` and `opacity` (GPU-accelerated)
- Images lazy-loaded via intersection observer
- Scroll animations triggered once with `once: true`
- Framer Motion uses will-change for optimized rendering

## Accessibility

- Semantic HTML structure (section, h1-h6, article)
- Proper heading hierarchy
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states on all interactive elements
- Color contrast ratios meet WCAG AA standards
- Reduced motion support (can be enhanced)

## Browser Support

- Chrome 90+ ✓
- Firefox 88+ ✓
- Safari 14+ ✓
- Edge 90+ ✓

## Customization

### Changing Colors
Edit the color values in sections:
- Primary accent: Search for `#6B8E6B`
- Secondary accent: Search for `#4A5D4A`
- Backgrounds: Update gradient colors in each section

### Adjusting Typography
Modify font families in inline `style` attributes:
- Headlines: `fontFamily: 'Playfair Display, serif'`
- Body: `fontFamily: 'Inter, sans-serif'`

### Custom Illustrations
Extend `illustrations.tsx` with new SVG components:
1. Create new functional component
2. Use Framer Motion `<motion.svg>` wrapper
3. Add viewport-triggered animations
4. Export and import in relevant section

## Design Credits

- Typography: Playfair Display + Inter (Google Fonts)
- Icons: Lucide React
- Animations: Framer Motion
- Design System: Shared tokens from Bento Matcha

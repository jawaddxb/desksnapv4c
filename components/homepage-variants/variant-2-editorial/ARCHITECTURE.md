# Architecture Overview - Editorial Variant

## Visual Component Tree

```
Variant2Editorial (index.tsx)
│
├─ Hero (Hero.tsx)
│  ├─ Eyebrow badge
│  ├─ Headline (Playfair Display, 8xl)
│  ├─ Description text
│  ├─ CTA buttons (2)
│  ├─ Social proof avatars
│  └─ HeroPresentationMockup (SVG)
│     ├─ Presentation frame
│     ├─ Content blocks (animated)
│     ├─ Image placeholder
│     └─ Floating accent shapes
│
├─ Features (Features.tsx)
│  ├─ Section header
│  └─ Feature blocks (3) [alternating layouts]
│     ├─ Block 1: Ideate (left-aligned)
│     │  ├─ IdeateIllustration (SVG)
│     │  │  ├─ Lightbulb with glow
│     │  │  ├─ Idea sparks (animated)
│     │  │  └─ Floating sticky notes
│     │  ├─ Icon badge
│     │  ├─ Title + description
│     │  └─ Feature pills (3)
│     │
│     ├─ Block 2: Draft (right-aligned)
│     │  ├─ DraftIllustration (SVG)
│     │  │  ├─ Stacked slides
│     │  │  ├─ Edit cursor
│     │  │  └─ Content lines
│     │  ├─ Icon badge
│     │  ├─ Title + description
│     │  └─ Feature pills (3)
│     │
│     └─ Block 3: Polish (left-aligned)
│        ├─ PolishIllustration (SVG)
│        │  ├─ Premium slide
│        │  ├─ Sparkles (animated)
│        │  └─ Gradient effects
│        ├─ Icon badge
│        ├─ Title + description
│        └─ Feature pills (3)
│
├─ Gallery (Gallery.tsx)
│  ├─ Section header
│  ├─ Theme grid (12 cards, 6 columns)
│  │  └─ Each card:
│  │     ├─ ThemePreview (SVG)
│  │     │  └─ Layout variant (6 types)
│  │     ├─ Theme name
│  │     ├─ Color swatch
│  │     └─ Hover overlay
│  ├─ Highlight cards (3)
│  │  ├─ 30+ Curated Themes
│  │  ├─ 60+ Layout Archetypes
│  │  └─ ∞ Customization
│  └─ Bottom CTA
│
├─ Testimonials (Testimonials.tsx)
│  ├─ Section header
│  ├─ Testimonial grid (6 cards, 3 columns)
│  │  └─ Each card:
│  │     ├─ Star rating (5 stars)
│  │     ├─ Quote text
│  │     ├─ Avatar illustration (gradient)
│  │     └─ Author info (name, role, company)
│  └─ Stats bar (3 cards)
│     ├─ 10,000+ Active Users
│     ├─ 50,000+ Presentations Created
│     └─ 4.9/5 Average Rating
│
└─ CTA (CTA.tsx)
   ├─ CTABackgroundPattern (SVG)
   │  ├─ Flowing organic shapes
   │  └─ Floating circles (animated)
   ├─ Sparkle badge
   ├─ Headline (Playfair Display, 8xl)
   ├─ Subheadline
   ├─ CTA buttons (2)
   ├─ Benefits list (4 items with checkmarks)
   └─ Social proof (5 avatars)
```

## Data Flow

```
User Interaction
       ↓
   Click CTA
       ↓
onGetStarted() ──→ Parent Component
       ↓               ↓
   Navigate      Track Analytics
       ↓               ↓
   /signup       Event Logged
```

## Animation Timeline

```
Scroll Position: 0% (Hero)
├─ 0.0s: Background shapes appear
├─ 0.1s: Eyebrow badge fades in
├─ 0.3s: Headline animates up (staggered)
├─ 0.6s: Description + CTAs appear
├─ 0.8s: Illustration draws in
├─ 1.0s: Stat badges slide in
└─ 1.5s: Scroll indicator pulses

Scroll Position: 20% (Features)
├─ Feature 1 (Ideate)
│  ├─ 0.0s: Illustration fades in
│  ├─ 0.2s: Number badge pops in
│  ├─ 0.3s: Content slides up
│  └─ 0.5s: Pills appear
├─ Feature 2 (Draft) - triggers at scroll
└─ Feature 3 (Polish) - triggers at scroll

Scroll Position: 50% (Gallery)
├─ 0.0s: Header fades in
├─ 0.2s: Theme cards scale in (staggered)
└─ 0.5s: Highlight cards appear

Scroll Position: 70% (Testimonials)
├─ 0.0s: Header fades in
├─ 0.2s: Cards fade up (staggered)
└─ 0.5s: Stats bar appears

Scroll Position: 90% (CTA)
├─ 0.0s: Background pattern morphs
├─ 0.2s: Badge scales in
├─ 0.4s: Headline slides up
├─ 0.6s: CTAs + benefits appear
└─ 0.8s: Avatars animate in sequence
```

## State Management

```
Component State (Internal)
├─ Hover states (all interactive elements)
├─ Animation states (Framer Motion)
└─ Viewport visibility (IntersectionObserver)

Props (External)
└─ onGetStarted: () => void
   ├─ Hero primary CTA
   └─ CTA section primary button
```

## Styling Architecture

```
Global Styles (index.tsx)
├─ Font imports (Playfair Display, Inter)
├─ Scroll behavior
├─ Typography resets
├─ Selection colors
└─ Scrollbar styling

Component Styles
├─ Tailwind utility classes
├─ Inline styles (fonts)
└─ Motion animations

Shared Tokens (../shared/tokens.ts)
├─ Colors
├─ Shadows
├─ Radius
├─ Fonts
├─ Transitions
└─ Spacing
```

## File Dependencies

```
index.tsx
├─ Hero.tsx
│  ├─ illustrations.tsx → HeroPresentationMockup
│  ├─ ../shared/tokens.ts → tw, variants
│  ├─ ../shared/CommonComponents.tsx → Button
│  └─ lucide-react → ArrowRight
│
├─ Features.tsx
│  ├─ illustrations.tsx → Ideate, Draft, Polish
│  ├─ ../shared/tokens.ts → tw, variants
│  └─ lucide-react → Sparkles, Edit3, Layout, Palette
│
├─ Gallery.tsx
│  ├─ illustrations.tsx → ThemePreview
│  ├─ ../shared/tokens.ts → tw, variants
│  ├─ ../shared/CommonComponents.tsx → Button
│  └─ lucide-react → Palette, ArrowRight
│
├─ Testimonials.tsx
│  ├─ ../shared/tokens.ts → tw, variants
│  └─ lucide-react → Quote, Star
│
└─ CTA.tsx
   ├─ illustrations.tsx → CTABackgroundPattern
   ├─ ../shared/tokens.ts → tw, variants
   ├─ ../shared/CommonComponents.tsx → Button
   └─ lucide-react → ArrowRight, Sparkles, CheckCircle2
```

## Performance Budget

```
Component Code
├─ TSX Components: ~55 KB (uncompressed)
├─ SVG Illustrations: ~18 KB (inline)
├─ Documentation: ~30 KB (not bundled)
└─ Total Bundled: ~73 KB (pre-minification)

External Dependencies (Shared)
├─ Framer Motion: ~70 KB (gzipped)
├─ Lucide Icons: ~2 KB per icon
└─ React: ~42 KB (gzipped)

Font Loading
├─ Playfair Display: ~45 KB (Google Fonts)
└─ Inter: ~30 KB (Google Fonts)

Total First Load: ~262 KB (gzipped, estimated)
```

## Render Optimization

```
Initial Render
├─ Hero: Visible above fold
│  └─ Renders immediately
│
└─ Below-fold sections
   └─ Render on scroll (IntersectionObserver)

Component Memoization Opportunities
├─ ThemePreview (pure, reusable)
├─ TestimonialCard (data-driven)
├─ FeaturePill (simple, repeating)
└─ Individual SVG illustrations

Animation Performance
├─ Uses GPU-accelerated properties
│  ├─ transform (translate, scale, rotate)
│  └─ opacity
├─ Avoids layout thrashing
└─ Fires once with viewport triggers
```

## Accessibility Tree

```
<main role="main">
  <section aria-label="Hero">
    <h1>Create Beautiful Decks in Minutes</h1>
    <button>Start Creating Free</button>
  </section>

  <section aria-label="Features">
    <h2>From idea to polished deck</h2>
    <article aria-label="Ideate with AI">
      <h3>Ideate with AI</h3>
    </article>
  </section>

  <section aria-label="Theme Gallery">
    <h2>Designs that make your content shine</h2>
    <div role="list">
      <article role="listitem">...</article>
    </div>
  </section>

  <section aria-label="Testimonials">
    <h2>Loved by teams around the world</h2>
    <blockquote>...</blockquote>
  </section>

  <section aria-label="Call to Action">
    <h2>Ready to create something beautiful?</h2>
    <button>Get Started Free</button>
  </section>
</main>
```

## Build Output

```
After Build (Vite)
├─ Component chunk: ~25 KB (gzipped)
├─ Shared with other variants
│  ├─ Framer Motion (vendor chunk)
│  ├─ Lucide icons (vendor chunk)
│  └─ Shared components (common chunk)
└─ Fonts loaded from CDN (Google Fonts)

Bundle Analysis
├─ No duplicate dependencies
├─ Tree-shaking applied
├─ Code splitting at route level
└─ Lazy loading ready
```

## Testing Strategy

```
Unit Tests (Recommended)
├─ Component rendering
├─ Prop handling
├─ Animation triggers
└─ SVG generation

Integration Tests
├─ User flow (scroll, click)
├─ CTA callback execution
└─ Responsive behavior

Visual Regression
├─ Chromatic/Percy snapshots
├─ Cross-browser testing
└─ Mobile viewport checks

Performance Tests
├─ Lighthouse CI
├─ Core Web Vitals
└─ Animation frame rate
```

---

## Quick Architecture Facts

- **Total Components**: 11 (5 sections + 6 illustrations)
- **Total Files**: 11 (7 TSX + 4 docs)
- **Lines of Code**: ~1,800 (excluding docs)
- **External Dependencies**: 3 (Framer Motion, Lucide, shared)
- **Props Interface**: 1 simple function prop
- **State Management**: Internal only (no global state)
- **API Calls**: None (static content)
- **Bundle Size**: ~25 KB gzipped (estimated)

---

**Built with modern React patterns and performance best practices**

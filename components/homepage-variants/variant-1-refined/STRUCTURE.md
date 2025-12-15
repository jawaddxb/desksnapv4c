# Variant 1: Refined Current - Component Structure

## Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         HERO SECTION                         │
│                    Background: #F5FAF7 (Sage)               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────┐  ┌───────────────────────────┐     │
│  │   Left Column      │  │   Right Column            │     │
│  │                    │  │                           │     │
│  │ • Badge            │  │ ┌───────────────────────┐ │     │
│  │ • Headline         │  │ │ Workflow Illustration │ │     │
│  │ • Subtitle         │  │ │  (Ideate → Draft →    │ │     │
│  │ • CTA Buttons      │  │ │   Polish)             │ │     │
│  │ • Social Proof     │  │ └───────────────────────┘ │     │
│  │                    │  │                           │     │
│  │                    │  │ ┌─────┐ ┌─────┐ ┌─────┐ │     │
│  │                    │  │ │ 01  │ │ 02  │ │ 03  │ │     │
│  │                    │  │ │Stage│ │Stage│ │Stage│ │     │
│  └────────────────────┘  │ └─────┘ └─────┘ └─────┘ │     │
│                          └───────────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    HOW IT WORKS SECTION                      │
│              Alternating Backgrounds (Sage/White)           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │            Section Header (Centered)              │       │
│  │   "From idea to impact in three steps"           │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ STEP 1: Ideate with AI (Sage Background)           │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ ┌─────────────────┐  ┌──────────────────────────┐ │    │
│  │ │ • Icon + Number │  │  Sticky Notes Visual     │ │    │
│  │ │ • Title         │  │  (Brainstorming mockup)  │ │    │
│  │ │ • Description   │  │                          │ │    │
│  │ │ • Features (4)  │  │                          │ │    │
│  │ └─────────────────┘  └──────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ STEP 2: Draft & Structure (White Background)       │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ ┌──────────────────────────┐  ┌─────────────────┐ │    │
│  │ │  Slide Stack Visual      │  │ • Icon + Number │ │    │
│  │ │  (Draft mode mockup)     │  │ • Title         │ │    │
│  │ │                          │  │ • Description   │ │    │
│  │ │                          │  │ • Features (4)  │ │    │
│  │ └──────────────────────────┘  └─────────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ STEP 3: Polish & Present (Sage Background)         │    │
│  ├─────────────────────────────────────────────────────┤    │
│  │ ┌─────────────────┐  ┌──────────────────────────┐ │    │
│  │ │ • Icon + Number │  │  Polished Slide Visual   │ │    │
│  │ │ • Title         │  │  (Final deck mockup)     │ │    │
│  │ │ • Description   │  │  + Theme selector        │ │    │
│  │ │ • Features (4)  │  │                          │ │    │
│  │ └─────────────────┘  └──────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   TESTIMONIALS SECTION                       │
│                    Background: #F5FAF7 (Sage)               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │            Section Header (Centered)              │       │
│  │         "Loved by creators worldwide"             │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐                        │
│  │Card │  │Card │  │Card │  │Card │                        │
│  │  1  │  │  2  │  │  3  │  │  4  │                        │
│  │     │  │     │  │     │  │     │                        │
│  │ •   │  │ •   │  │ •   │  │ •   │  Each card:           │
│  │Quote│  │Quote│  │Quote│  │Quote│  • Quote icon         │
│  │ •   │  │ •   │  │ •   │  │ •   │  • 5 stars            │
│  │Stars│  │Stars│  │Stars│  │Stars│  • Quote text         │
│  │ •   │  │ •   │  │ •   │  │ •   │  • Avatar             │
│  │Auth │  │Auth │  │Auth │  │Auth │  • Author info        │
│  └─────┘  └─────┘  └─────┘  └─────┘                        │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │              Stats Bar (4 columns)                │       │
│  │  2,500+ │ 50K+ │ 1,200+ │ 4.9/5                  │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │         Trust Badges (Company logos)              │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        CTA SECTION                           │
│          Background: Forest Green Gradient (#6B8E6B)        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │                    Centered                       │       │
│  │                                                   │       │
│  │           • "Start Creating Today" badge          │       │
│  │           • Large headline (white)                │       │
│  │           • Subtitle (white)                      │       │
│  │           • Two CTA buttons                       │       │
│  │                                                   │       │
│  │   ✓ No credit card  ✓ Free forever              │       │
│  │   ✓ AI images       ✓ Export PDF                │       │
│  │                                                   │       │
│  │           • 2,500+ creators • 4.9/5 stars        │       │
│  │                                                   │       │
│  └──────────────────────────────────────────────────┘       │
│                                                              │
│  ╲                                                     ╱      │
│   ╲         Wave transition to next section         ╱       │
│    ╲_______________________________________________╱         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Color Flow

```
Sage (#F5FAF7) → White (#FFFFFF) → Sage (#F5FAF7) → Green (#6B8E6B)
     Hero      →   How It Works   →  Testimonials  →      CTA
                  (alternating)
```

## Animation Timeline

```
Hero Section (0-2s):
├─ 0.0s: Badge fades in
├─ 0.2s: Headline fades in + underline animates
├─ 0.4s: Subtitle fades in
├─ 0.6s: Buttons fade in
├─ 0.8s: Social proof fades in
└─ 1.0s: Workflow illustration animates

How It Works (on scroll):
├─ Header fades in
├─ Each step animates when scrolled into view
│   ├─ Icon + number appear
│   ├─ Text content fades in
│   └─ Visual mockup scales in
└─ Stagger between steps (0.1s delay)

Testimonials (on scroll):
├─ Header fades in
├─ Cards stagger in (0.1s each)
├─ Stats bar animates
└─ Trust badges fade in

CTA (on scroll):
├─ Badge fades in
├─ Headline fades in
├─ Subtitle fades in
├─ Buttons fade in
├─ Benefits stagger in
└─ Sparkle icons float continuously
```

## Responsive Breakpoints

```
Mobile (< 768px):
- Single column layout
- Stack hero content
- Reduced font sizes
- 1-column testimonials
- Adjusted spacing

Tablet (768px - 1024px):
- 2-column grid where applicable
- Moderate font sizes
- 2-column testimonials

Desktop (> 1024px):
- Full 2-column layouts
- 4-column testimonials
- Maximum font sizes
- All animations enabled
```

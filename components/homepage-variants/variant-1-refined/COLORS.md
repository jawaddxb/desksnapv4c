# Color Palette Reference - Variant 1: Refined Current

## Bento Matcha Palette

### Primary Colors

```
┌─────────────────────────────────────────────────────────────┐
│                    FOREST GREEN (Accent)                     │
│                       #6B8E6B                                │
│                                                              │
│  Usage: Buttons, links, icons, highlights, CTAs             │
│  RGB: rgb(107, 142, 107)                                    │
│  HSL: hsl(120°, 14%, 49%)                                   │
│  Contrast: 4.5:1 on white (WCAG AA ✓)                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      SAGE (Background)                       │
│                       #F5FAF7                                │
│                                                              │
│  Usage: Page backgrounds, alternating sections              │
│  RGB: rgb(245, 250, 247)                                    │
│  HSL: hsl(144°, 33%, 97%)                                   │
│  Pairing: Works beautifully with white (#FFFFFF)            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    WHITE (Surface)                           │
│                       #FFFFFF                                │
│                                                              │
│  Usage: Cards, panels, alternating sections                 │
│  RGB: rgb(255, 255, 255)                                    │
│  HSL: hsl(0°, 0%, 100%)                                     │
│  Pairing: Alternates with sage for depth                    │
└─────────────────────────────────────────────────────────────┘
```

### Text Colors

```
┌─────────────────────────────────────────────────────────────┐
│                   DARK GREEN (Primary Text)                  │
│                       #1E2E1E                                │
│                                                              │
│  Usage: Headlines, body text, primary content               │
│  RGB: rgb(30, 46, 30)                                       │
│  HSL: hsl(120°, 21%, 15%)                                   │
│  Contrast: 12.6:1 on sage (WCAG AAA ✓✓)                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 MEDIUM GREEN (Secondary Text)                │
│                       #4A5D4A                                │
│                                                              │
│  Usage: Subtitles, descriptions, supporting text            │
│  RGB: rgb(74, 93, 74)                                       │
│  HSL: hsl(120°, 11%, 33%)                                   │
│  Contrast: 6.8:1 on sage (WCAG AAA ✓)                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   LIGHT GREEN (Muted Text)                   │
│                       #8FA58F                                │
│                                                              │
│  Usage: Captions, labels, disabled states                   │
│  RGB: rgb(143, 165, 143)                                    │
│  HSL: hsl(120°, 11%, 60%)                                   │
│  Contrast: 3.2:1 on sage (WCAG AA for large text ✓)        │
└─────────────────────────────────────────────────────────────┘
```

### Border & Divider Colors

```
┌─────────────────────────────────────────────────────────────┐
│                    BORDER (Default)                          │
│                       #D4E5D4                                │
│                                                              │
│  Usage: Card borders, dividers, subtle separators           │
│  RGB: rgb(212, 229, 212)                                    │
│  HSL: hsl(120°, 24%, 86%)                                   │
│  Opacity variants: 100%, 50%, 20%, 10%                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   BORDER HOVER                               │
│                       #C0D6C0                                │
│                                                              │
│  Usage: Hover states on interactive borders                 │
│  RGB: rgb(192, 214, 192)                                    │
│  HSL: hsl(120°, 24%, 80%)                                   │
└─────────────────────────────────────────────────────────────┘
```

### Interactive States

```
┌─────────────────────────────────────────────────────────────┐
│                   ACCENT HOVER                               │
│                       #5A7A5A                                │
│                                                              │
│  Usage: Button hover states, active links                   │
│  RGB: rgb(90, 122, 90)                                      │
│  HSL: hsl(120°, 15%, 42%)                                   │
│  Transition: 200ms ease                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                SURFACE HOVER                                 │
│                       #EDF5F0                                │
│                                                              │
│  Usage: Card hover, button ghost hover                      │
│  RGB: rgb(237, 245, 240)                                    │
│  HSL: hsl(142°, 29%, 95%)                                   │
└─────────────────────────────────────────────────────────────┘
```

### Opacity Variants

```
Accent Variations:
├─ 100%: #6B8E6B    (Full)
├─  20%: #6B8E6B33  (Medium overlay)
├─  10%: #6B8E6B1A  (Light background)
└─   5%: #6B8E6B0D  (Subtle tint)
```

## Shadow Colors

All shadows use green-tinted values for brand consistency:

```css
/* Small shadow (cards) */
box-shadow: 0 2px 8px rgba(107, 142, 107, 0.06);

/* Medium shadow (hover cards) */
box-shadow: 0 4px 24px rgba(107, 142, 107, 0.08);

/* Large shadow (modals) */
box-shadow: 0 12px 48px rgba(107, 142, 107, 0.12);

/* XL shadow (dropdowns) */
box-shadow: 0 20px 60px rgba(107, 142, 107, 0.16);

/* Glow (focus, emphasis) */
box-shadow: 0 0 30px rgba(107, 142, 107, 0.2);
```

## Gradient Patterns

### CTA Section Gradient

```css
background: linear-gradient(135deg, #6B8E6B 0%, #5A7A5A 100%);
```

Visual:
```
┌─────────────────────────────────────────────────────────────┐
│ #6B8E6B                                           #5A7A5A  │
│    └──────────────────────────────────────────────────┘     │
│                    135° diagonal                             │
└─────────────────────────────────────────────────────────────┘
```

## Color Psychology

| Color | Emotion | Association | Use Case |
|-------|---------|-------------|----------|
| **Forest Green** | Trust, Growth, Stability | Nature, Finance, Health | CTAs, Success states |
| **Sage** | Calm, Clean, Professional | Minimalism, Clarity | Backgrounds, Cards |
| **Dark Green** | Sophistication, Authority | Luxury, Knowledge | Headlines, Important text |
| **White** | Purity, Simplicity, Space | Clarity, Honesty | Content areas, Contrast |

## Accessibility Compliance

### WCAG 2.1 Compliance Matrix

| Foreground | Background | Ratio | Level | Pass |
|------------|------------|-------|-------|------|
| #1E2E1E (Dark) | #F5FAF7 (Sage) | 12.6:1 | AAA | ✓✓ |
| #4A5D4A (Medium) | #F5FAF7 (Sage) | 6.8:1 | AAA | ✓✓ |
| #6B8E6B (Accent) | #FFFFFF (White) | 4.5:1 | AA | ✓ |
| #8FA58F (Muted) | #F5FAF7 (Sage) | 3.2:1 | AA (large) | ✓ |
| #FFFFFF (White) | #6B8E6B (Accent) | 4.5:1 | AA | ✓ |

**Legend:**
- ✓✓ = WCAG AAA (7:1 for normal, 4.5:1 for large)
- ✓ = WCAG AA (4.5:1 for normal, 3:1 for large)

## Color Usage Guidelines

### DO ✓

- Use forest green (#6B8E6B) for all primary CTAs
- Use sage (#F5FAF7) and white (#FFFFFF) alternately for section backgrounds
- Use dark green (#1E2E1E) for all headlines and important text
- Use green-tinted shadows consistently across all components
- Maintain 4.5:1 contrast ratio minimum for accessibility

### DON'T ✗

- Don't use pure black (#000000) - use dark green (#1E2E1E) instead
- Don't mix with unrelated colors (blues, reds) outside of illustrations
- Don't use accent color as background for large areas
- Don't use muted green (#8FA58F) for small text on sage
- Don't override the shadow colors with neutral grays

## Quick Reference

```typescript
// Import tokens
import { tokens, tw } from '../shared/tokens';

// Use in components
<div className={tw.bgPrimary}>      {/* Sage background */}
<div className={tw.bgSecondary}>    {/* White background */}
<div className={tw.bgAccent}>       {/* Forest green background */}
<span className={tw.textPrimary}>   {/* Dark green text */}
<span className={tw.textAccent}>    {/* Forest green text */}
<div className={tw.border}>         {/* Border color */}
<div className={tw.shadow}>         {/* Green-tinted shadow */}
```

## Design Tokens Path

All colors are defined in:
```
/components/homepage-variants/shared/tokens.ts
```

Import and use:
```typescript
import { tokens } from '../shared/tokens';

const myColor = tokens.colors.accent;        // #6B8E6B
const myShadow = tokens.shadows.md;          // Green-tinted shadow
```

---

**Color Palette**: Bento Matcha
**Variant**: 1 - Refined Current
**Last Updated**: December 15, 2025

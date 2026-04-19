# HeySpaces Design System (ElevenLabs-Inspired)

## Two-Layer Tokens
- shadcn HSL semantic tokens stay in `src/index.css` (`--background`, `--foreground`, `--primary`, …) — never remove
- New raw tokens (`--color-*`, `--shadow-*`, `--font-*`) are added on top for warm utilities

## Colors
- Page bg: #ffffff
- Section alt: #f5f5f5
- Warm surface: #f5f2ef
- Warm glass: rgba(245,242,239,0.8)
- Text primary: #000000
- Text secondary: #4e4e4e
- Text muted (warm): #777169
- Border: #e5e5e5
- Border subtle: rgba(0,0,0,0.05)
- Focus ring: rgb(147 197 253 / 0.5)

No decorative purples/blues/greens. No gradients (except product demos).

## Typography
- Display font: 'Waldenburg', Georgia, serif (fallback Georgia until font is uploaded)
- Body font: Inter
- Mono: Geist Mono

Headings (h1/h2/h3): Waldenburg, **font-weight 300 — mandatory, never 400+**
- h1: 48px / 1.08 / -0.96px
- h2: 36px / 1.17
- h3: 32px / 1.13
- h4: Inter 20px weight 500 / 1.35

Body utilities (in index.css):
- `.text-body-lg` 20px / 1.35 / #4e4e4e
- `.text-body` 18px / 1.6 / 0.18px / #4e4e4e
- `.text-body-ui` 16px / 1.5 / 0.16px / #4e4e4e
- `.text-body-medium` 16px weight 500 / #000
- `.text-nav` 15px weight 500 / 0.15px
- `.text-caption` 14px / 0.14px / #777169
- `.text-tag` 13px weight 500
- `.text-micro` 12px weight 500 / #777169
- `.text-fine` 10px / #777169

Body letter-spacing is **positive** (Inter). Never negative.

## Buttons (only three)
- `<Button variant="default">` — black pill, bg #000 text #fff, rounded-pill (9999px)
- `<Button variant="secondary">` or `outline` — white pill with `shadow-button`
- `<Button variant="warm">` — featured warm stone CTA, `rounded-warm` (30px), warm glass bg, `shadow-warm`, backdrop-blur

All buttons: Inter 15px weight 500, hover opacity 0.85, active scale 0.98.

## Cards
- Standard `<Card>`: bg #fff, `rounded-lg` (16px), `shadow-card` (Level 1 multi-layer, no hard border)
- Featured: rounded-2xl (20px) + `shadow-card`
- Section container: rounded-3xl (24px) + `shadow-card`
- Warm: `bg-warm` + rounded-lg + `shadow-warm`
- Internal padding: 24px

**Never** use `border: 1px solid` on cards — use shadow-as-border (`shadow-card`).

## Shadows (sub-0.1 opacity, multi-layer only)
Tailwind tokens: `shadow-card`, `shadow-button`, `shadow-warm`, `shadow-outline`, `shadow-edge`, `shadow-inset-edge`.

## Inputs
- bg #fff, border `#e5e5e5`, rounded-md (8px), padding 10px 14px
- Focus: 3px blue ring `rgb(147 197 253 / 0.5)`, border `rgb(147 197 253 / 0.8)`

## Border Radius Scale
2 / 4 / 8 / 10 / 12 / 16 / 18 / 20 / 24 / 30 (warm CTA only) / 9999 (pill)

## Spacing
- Section vertical padding: 80px (`section-pad` utility)
- Container max-width: 1200px (`container-page` utility), horizontal padding 24px
- Card internal padding: 24px
- Sections alternate white / `section-alt` (#f5f5f5)

## Status Colors (preserved)
- Green: #E8F5EE / #1A6B3C
- Blue: #E8F0FE / #1A3FAB
- Yellow: #FEF6E4 / #8A5A00
- Red: #FEE8E8 / #9B1C1C

## Hard Rules
- Always German UI text
- Headings always serif weight 300; body always Inter
- Pill buttons (9999px) for primary/secondary; warm CTA uses 30px
- No gradients, no colored shadows except warm tint (rgba(78,50,23,0.04))
- No hard borders on cards — shadow-as-border
- No shadow opacity > 0.1
- Use semantic Tailwind tokens (`bg-background`, `text-foreground`, `bg-warm`, `shadow-card`, …) — never hardcode hex in components
- Reuse existing components; never invent new patterns

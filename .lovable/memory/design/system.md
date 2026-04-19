---
name: Design System (ElevenLabs-Inspired)
description: Full HeySpaces visual spec — warm palette, serif weight-300 headings, multi-layer shadows, three button variants
type: design
---

## Token architecture
Two layers in `src/index.css`:
1. shadcn HSL semantic vars (`--background`, `--foreground`, `--primary`, …) — keep, drives all shadcn components
2. Raw vars (`--color-*`, `--shadow-*`, `--font-*`) — drive new utilities (`.btn-warm`, `.card-warm`, `bg-warm`, `shadow-warm`)

## Colors
- bg #FFFFFF, section-alt #F5F5F5, warm #F5F2EF, warm-glass rgba(245,242,239,0.8)
- text: primary #000, secondary #4E4E4E, muted #777169
- border #E5E5E5, subtle border rgba(0,0,0,0.05)
- focus ring rgb(147 197 253 / 0.5)

## Typography
- Display: `'Waldenburg', Georgia, serif` weight **300** (mandatory)
  - h1 48px / 1.08 / -0.96px
  - h2 36px / 1.17
  - h3 32px / 1.13
- Body: Inter, positive tracking (0.14–0.18px). Utilities: `.text-body-lg`, `.text-body`, `.text-body-ui`, `.text-body-medium`, `.text-nav`, `.text-caption`, `.text-tag`, `.text-micro`, `.text-fine`, `.label-eyebrow`
- Mono: Geist Mono

## Shadows (multi-layer, sub-0.1)
- `shadow-card`: rgba(0,0,0,0.06) 0 0 0 1px, rgba(0,0,0,0.04) 0 1px 2px, rgba(0,0,0,0.04) 0 2px 4px
- `shadow-button`: rgba(0,0,0,0.4) 0 0 1px, rgba(0,0,0,0.04) 0 4px 4px
- `shadow-warm`: rgba(78,50,23,0.04) 0 6px 16px
- `shadow-outline`, `shadow-edge`, `shadow-inset-edge`

## Buttons (only three)
- `default` — bg-primary text-primary-foreground rounded-pill
- `secondary`/`outline` — bg-surface shadow-button rounded-pill
- `warm` — bg-sand/80 rounded-warm (30px) shadow-warm backdrop-blur, padding 12px 20px 12px 14px
All: Inter 15/500, hover opacity 0.85, active scale 0.98.

## Cards
`<Card>` uses `shadow-card` (no border). Radii 16/20/24. Warm uses `bg-warm` + `shadow-warm`.

## Inputs
bg-surface, border #E5E5E5, rounded-md (8px). Focus = 3px blue ring + border tint.

## Hard rules
- Headings serif weight 300, never 400+
- Body Inter with positive letter-spacing
- No hard borders on cards (shadow-as-border)
- No shadow opacity > 0.1; warm shadow uses warm tint (rgba(78,50,23,0.04))
- No gradients, no decorative colors (purple/blue/green)
- Pill buttons 9999px for primary/secondary; warm CTA uses 30px
- Never hardcode hex in components — use tokens (`bg-background`, `text-foreground`, `bg-warm`, `shadow-card`, …)
- Always German UI text

---
name: Design System (Modern Sans)
description: HeySpaces visual spec — warm palette, Inter sans-serif everywhere, multi-layer shadows, three button variants
type: design
---

## Typography (sans-serif only)
- Display & body: **Inter** — no serif fonts anywhere
- Headings h1/h2/h3: Inter weight 600, letter-spacing -0.02em
  - h1 48px / 1.1
  - h2 36px / 1.2
  - h3 32px / 1.2
- Body: Inter, positive tracking (0.14–0.18px)
- Mono: Geist Mono

## Colors
- bg #FFFFFF, section-alt #F5F5F5, warm #F5F2EF, warm-glass rgba(245,242,239,0.8)
- text: primary #000, secondary #4E4E4E, muted #777169
- border #E5E5E5, focus ring rgb(147 197 253 / 0.5)

## Shadows
- shadow-card, shadow-button, shadow-warm (rgba(78,50,23,0.04) 0 6px 16px)

## Buttons (only three)
- default — black pill
- secondary/outline — white pill + shadow-button
- warm — sand/80 rounded-warm (30px) + shadow-warm + backdrop-blur

## Hard rules
- NO serif fonts — Inter for everything including headings
- Body Inter with positive letter-spacing
- No hard borders on cards (shadow-as-border)
- No shadow opacity > 0.1
- No gradients, no decorative colors
- Pill buttons 9999px; warm CTA 30px
- Always German UI text

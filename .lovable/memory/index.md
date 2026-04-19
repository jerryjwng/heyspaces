# Project Memory

## Core
- HeySpaces is a German real estate platform (rent, share, buy). ALL UI text must be German.
- Stack: React (Vite), TypeScript, Tailwind, shadcn/ui, Supabase (Auth & DB).
- Design system is ElevenLabs-inspired. Two-layer tokens in `src/index.css`: shadcn HSL semantic layer (`--background`, `--foreground`, `--primary`, …) + raw `--color-*` / `--shadow-*` / `--font-*` on top. Never remove the HSL layer.
- Page bg #FFFFFF, warm surface #F5F2EF, primary text #000, secondary #4E4E4E, muted #777169 (warm). Border #E5E5E5.
- Headings h1/h2/h3 use display font `'Waldenburg', Georgia, serif` at **font-weight 300** (mandatory). Body/UI uses Inter with positive letter-spacing.
- Buttons: only three variants — `default` (black pill), `secondary`/`outline` (white pill + `shadow-button`), `warm` (warm glass, `rounded-warm` 30px, `shadow-warm`, backdrop blur).
- Cards: `shadow-card` (multi-layer ≤0.06 opacity) — no hard borders. Radii 16/20/24. Warm tint shadow uses rgba(78,50,23,0.04).
- Never use semantic shadcn class `bg-background`/`text-foreground` etc with hardcoded hex; always go through tokens. No gradients, no colored shadows except warm tint.
- Full spec lives in `.lovable/knowledge.md` and `mem://design/system`.

## Memories
- [Design System](mem://design/system) — Full ElevenLabs-inspired colors, typography, components, shadows, rules
- [Dashboard Modes](mem://features/dashboard-modes) — Dashboard dual-mode toggle logic for searching and hosting
- [Search Filtering](mem://features/search-filtering) — URL-synchronized filter bar for real estate search
- [Database Schema](mem://database/schema-overview) — Core Supabase tables and listing categories

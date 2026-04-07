

## HeySpaces — Screen 1: Shared Components

### Design Language (from references)
- Clean, minimal black/white/gray palette with subtle lime-green accents
- Rounded pill buttons, soft card borders, system font stack
- Warm off-white backgrounds (#f9f9f6-ish), clean spacing

### Components to Build

**1. Navbar (`components/shared/navbar.tsx`)**
- Sticky 64px header, white bg, subtle bottom border
- Left: "HeySpaces" logo (font-weight 600)
- Center (desktop): Inserate, Mein Dashboard, Favoriten links
- Right: Search pill button, "+ Inserat erstellen" dark pill, Profile avatar with dropdown
- Mobile: hamburger → slide-in drawer
- Dropdown adapts for logged-in vs logged-out state

**2. Footer (`components/shared/footer.tsx`)**
- Links: Inserate | Über uns | Datenschutz | Impressum
- © 2025 HeySpaces

**3. FilterBar (`components/shared/filter-bar.tsx`)**
- Collapsed: search pill "Wo suchst du?"
- Expanded: 4-section row (Ort, Kategorie toggle pills, Max Preis, Zimmer stepper)
- Action row with reset + search buttons
- Active filter chips with × remove
- Mobile: fullscreen overlay
- URL param sync for shareable filters

**4. InseratCard (`components/inserate/inserat-card.tsx`)**
- Clickable card → detail page
- 4:3 image area with category badge, favorite heart, status badge
- Price, title, location·sqm·rooms, owner info

**5. InseratGrid (`components/inserate/inserat-grid.tsx`)**
- Responsive grid: 3 cols desktop, 2 tablet, 1 mobile

**6. StatusBadge (`components/shared/status-badge.tsx`)**
- Pill badges with color variants for all status types

**7. AnfrageModal (`components/shared/anfrage-modal.tsx`)**
- Dialog overlay with contact form (Vorname, Nachname, Email, Telefon, Einzug ab, Nachricht)
- Success state with checkmark

### Supporting Files
- `lib/types.ts` — All TypeScript types from spec
- `lib/mock-data.ts` — Realistic German mock data (cities, users, listings)
- `hooks/use-auth.ts` — Auth hook stub (mock, Supabase later)

### Routing Setup
- React Router routes matching the spec's URL structure
- All pages as placeholder shells initially




## Fix: Single Search Entry Point (Airbnb Logic)

### Problems to fix
1. Navbar still has "Inserate" as a clickable link and possibly a "Suchen" pill — both must go on `/inserate`
2. The whole search pill is currently clickable — only the black circle button should open the panel
3. Need to verify there's only ONE search trigger on the page

### Changes

**1. `src/components/shared/navbar.tsx`**
- When `hideSearch` prop is true (passed from `/inserate`), also hide the "Inserate" nav link
- Render "Inserate" as plain non-clickable text instead (or omit entirely on this page)
- Confirm the "Suchen" navbar pill is fully removed when `hideSearch` is true (already the case, but double-check)

**2. `src/components/shared/airbnb-search.tsx`**
- Remove `onClick={() => setExpanded(true)}` and `role="button"` from the outer pill `<div>`
- Move the expand trigger to ONLY the black circle search button
- The 3 sections ("Wo?", "Kategorie", "Zimmer") become purely visual labels — no click handlers
- Keep the expanded panel, overlay, and "X Inserate anzeigen" apply flow exactly as is

**3. `src/pages/InserateListing.tsx`**
- No changes needed — grid already always renders below the search pill

### Result
- ONE black circle button = ONE way to open filters
- Pill labels are display-only
- No "Inserate" link, no "Suchen" navbar pill on this page
- Grid always visible, updates when "X Inserate anzeigen" clicked


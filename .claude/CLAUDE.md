# Mirror

AI-powered wardrobe manager and daily outfit suggestion web app.

> **Tagline:** *Get dressed, decided.*

---

## Design System

The canonical design system lives in `mirror_ds/`. Read `mirror_ds/README.md` and import `mirror_ds/colors_and_type.css` before writing any UI code. The UI kits in `mirror_ds/ui_kits/` are the reference implementation — read them before building any screen.

### Typography (three families, strict roles)
- **Newsreader** (serif) — display, headlines, editorial statements, wordmark. The brand's voice.
- **Archivo** (grotesque sans) — body copy, UI labels, and big bold uppercase graphic headlines. Also used for all buttons/CTAs (uppercase, weight 500–600, ~0.22em tracking).
- **IBM Plex Mono** — passive utility text only: nav labels, dates, weather, counts, metadata, kickers. UPPERCASE, 0.14em tracking. Never for buttons.

### Colors (essentially monochrome)
- **Paper** `#F3F2EF` — primary surface, off-white slightly cool
- **Ink** `#0E0E0E` — near-black, primary text and solid blocks
- **Card** `#FAFAF8` — raised card surface
- **Slate scale** — `--slate-900` through `--slate-100` for secondary/tertiary text
- **No brand accent hue** — drama comes from contrast, type, and B&W imagery
- **Semantic only:** Positive `#2F7D5B` (confirmations), Critical `#B23A33` (errors) — tiny doses only
- **Lines:** `--line` = `rgba(14,14,14,0.12)` hairlines — Mirror divides, it does not box

### Shapes & Elevation
- **Default: `--radius-0` (0px)** — crisp corners on buttons, cards, fields, image plates
- **Pill `999px`** — reserved exclusively for filter tags/chips only
- **Inputs** — max 2px softening (`--radius-1`)
- **Shadows** — whisper-soft and cool (`--shadow-1/2/3`). Most UI is flat. Bottom sheets get `--shadow-sheet`.

### Imagery
- Always **black & white**, high contrast, fine film grain
- Full-bleed, gallery-plate treatment
- Placeholder: grayscale gradient + grain tiles

### Icons
- **Lucide** — thin single-weight line icons, 1.5–2px stroke, never filled
- Brand motif: `✕` multiplication sign as typographic separator
- Never emoji

### Copy & Voice
- Fashion editor voice: declarative, spare, dry wit. Never bubbly, never exclamation marks.
- Headlines/statements: sentence case, serif, period-ended (*"Today, the camel coat."*)
- Labels/nav/metadata: UPPERCASE monospace
- Buttons/CTAs: UPPERCASE Archivo grotesque (distinct from mono labels)
- Body: sentence case, Archivo sans
- Never emoji, ever

### Motion
- Calm: `cubic-bezier(0.22,1,0.36,1)`, 240ms default
- No bounce, no spring, no overshoot

### Layout
- Mobile: bottom tab bar fixed, sticky top bar with wordmark, generous gutters
- Web: left rail + content canvas
- Spacing base: 4px unit (`--space-1` through `--space-10`)
- Gallery whitespace is a feature — hero moments get `--space-9/10` breathing room

### Design System Rule
- Always design **mobile-first at 390px**. Desktop after mobile is approved.
- Write Tailwind base classes for mobile, then `md:` and `lg:` overrides.

---

## Stack

- Next.js 14, TypeScript, Tailwind CSS
- Supabase (database + image storage)
- Clerk (auth — email + Google)
- Anthropic API / Claude Sonnet (AI features — vision + reasoning)
- Replicate API (illustrated outfit renders — Phase 2)
- Vercel (deployment)

---

## MVP Screens

1. Landing
2. Onboarding (style quiz — dark immersive, full-bleed)
3. Closet / Wardrobe (grid, filter pills, stats)
4. Add Item (dark capture flow)
5. Home / Today (daily outfit hero) ← currently being built
6. Outfit Detail (full look overlay)
7. Style Profile / You (style identity, stats)
8. Item Checker ("Should I buy this?")
9. Upgrade (freemium gate)
10. Settings

---

## Bottom Navigation (5 tabs — IBM Plex Mono labels)
Today / Closet / Add / Saved / You

---

## AI Features

1. **Outfit of the Day** — Claude Vision analyzes wardrobe, suggests outfit combination
2. **Should I Buy This?** — paste URL or upload image, Claude advises if item fits wardrobe
3. **Style Profile** — auto-generated from wardrobe, updates as items added

---

## Visual Render (tiered)

- **Free:** flat lay composition (CSS, no AI cost)
- **Premium:** illustrated render via Replicate/fal.ai (~$0.03–0.05/render)
- **Phase 2:** virtual try-on with user's own photo

---

## Freemium Model

- 3 free AI generations + 1 free illustrated render
- Paid: ~$7–9/month via Stripe (unlimited generations)
- Usage tracked in Supabase per user

---

## Build Order

1. Auth + Closet (upload, grid, delete)
2. Outfit suggestion + flat lay render
3. Style profile + item checker
4. Illustrated render + freemium gate
5. Polish + landing page + deploy

---

## Phase 2 (NOT in MVP)

- Pinterest / social board sync
- Weather-based suggestions
- Calendar integration
- Virtual try-on with user's own photo
- Daily push / email outfit delivery

---

## Environment Variables

All API keys go in `.env.local`. Never commit this file.

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=        # not set up yet
REPLICATE_API_TOKEN=      # not set up yet
```

---

## Design Agent

This project uses a Senior Product Designer agent. For any UI task, read:
1. `mirror_ds/README.md` — brand context and visual rules
2. `mirror_ds/colors_and_type.css` — all design tokens
3. `mirror_ds/ui_kits/mobile-app/` — reference implementation for mobile screens
4. `mirror_ds/ui_kits/web-app/` — reference implementation for web screens

Spec before building. Never write UI code without stating: what the screen is for, who uses it, what they need to feel, and what the single most important action is.

---

## Setup Status

✅ Homebrew, Node.js, GitHub (imhayzel), Claude Code installed and logged in
✅ mirror-app folder created at ~/mirror-app
✅ Design system (mirror_ds/) placed in project
⚠️ Next.js app scaffold — in progress (Home/Today screen being built)
⚠️ Anthropic Console API key — not set up yet
⚠️ Replicate API key — not set up yet
⚠️ Vercel deployment — not set up yet
⚠️ Supabase, Clerk — accounts created, not yet wired up

---

## Anti-patterns (never do these)

- ❌ Any brand accent hue — no blue, purple, or color accents
- ❌ Rounded corners except pill tags and 2px input softening
- ❌ Heavy box shadows or glassmorphism
- ❌ Emoji anywhere in UI
- ❌ Lowercase nav or metadata labels (always uppercase mono)
- ❌ Newsreader below 24px
- ❌ IBM Plex Mono for buttons (Archivo grotesque only for CTAs)
- ❌ Desktop-first layouts
- ❌ Warm or colored photography filters
- ❌ Decorative gradients on light surfaces
